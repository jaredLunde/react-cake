import React from 'react'
import PropTypes from 'prop-types'
import * as easing from './easing'
import {
  requestTimeout,
  clearRequestTimeout,
  reduceProps,
  callIfExists,
  createOptimized
} from '../../utils'


const AnimatablePropTypes = {
  propName: PropTypes.string.isRequired,
  duration: PropTypes.number.isRequired,
  easing: PropTypes.func.isRequired,
  fps: PropTypes.number.isRequired,
  loop: PropTypes.bool.isRequired,
  boomerang: PropTypes.bool.isRequired,
  onPlay: PropTypes.func,
  onProgress: PropTypes.func,
  onFinish: PropTypes.func,
  autoPlay: PropTypes.bool.isRequired
}


export default class Animatable extends React.PureComponent {
  static propTypes = AnimatablePropTypes
  static defaultProps = {
    duration: 0, //ms
    easing: easing.heavyMove || (t => t),
    fps: 60,
    loop: false,
    boomerang: false,
    autoPlay: false
  }

  _animationFrame = null

  constructor (props) {
    super(props)
    const {easing, fps, duration, autoPlay, propName} = props

    this.state = {
      progress: 0.0,
      timeRemaining: duration,
      duration,
      easing,
      fps: 1000/fps,
      isAnimating: false
    }
  }

  tick = ({timeRemaining, fps, easing, duration}, {loop, boomerang}) => {
    if (timeRemaining === 0) {
      this.clearAnimationFrame()
      return {progress: 1.0, isAnimating: false}
    }

    const progress = easing(1 - (timeRemaining / duration))
    timeRemaining -= fps
    timeRemaining = timeRemaining < 0 ? 0 : timeRemaining

    return {progress, timeRemaining, isAnimating: true}
  }

  requestTick = () => {
    const {fps} = this.state
    this._animationFrame = requestTimeout(
      () => this.setState(
        this.tick,
        () => {
          if (this.state.progress < 1) {
            this.requestTick()
          }

          callIfExists(this.props.onProgress, {calc: this.calc, ...this.state})
        }
      ),
      fps
    )
  }

  play = () => {
    this.setState(
      ({duration}) => ({progress: 0.0, timeRemaining: duration}),
      this.requestTick
    )
  }

  clearAnimationFrame () {
    if (this._animationFrame !== null) {
      clearRequestTimeout(this._animationFrame)
      this._animationFrame = null
    }
  }

  stop = () => {
    this.clearAnimationFrame()
    this.setState({isAnimating: false})
  }

  calc = (from, to) => {
    const diff = this.state.progress * Math.abs(to - from)
    return from > to ? from - diff : from + diff
  }

  setEasing = fn => {
    this.setState({easing})
    return this
  }

  setFps = fps => {
    this.setState({fps: 1000/fps})
    return this
  }

  setDuration = duration => {
    this.setState({duration})
    return this
  }

  render () {
    let {children, onPlay, onProgress, onFinish, ...props} = this.props
    props = reduceProps(props, AnimatablePropTypes)
    const {
      easing,
      fps,
      duration,
      timeRemaining,
      ...state
    } = this.state
    const {play, stop, calc} = this

    return createOptimized(
      children,
      {
        play,
        stop,
        calc,
        ...state,
        ...props
      }
    )
  }
}
