import React from 'react'
import PropTypes from 'prop-types'
import {cloneIfElement, throttle} from '../../utils'
import setOrientation from '../ImageStat/setOrientation'
import {getAspect} from './ViewportQueries'
import {win, docEl} from './statics'


/**
<ViewportSize>
  {
    ({viewportWidth, viewportHeight}) => (
      <Row>
        <Col x={8}>viewport width: {viewportWidth}</Col>
        <Col x={8}>viewport height: {viewportHeight}</Col>
      </Row>
    )
  }
</ViewportSize>
**/
export const getViewportHeight = () => {
  let a = docEl.clientHeight
  let b = win.innerHeight
  return a > b ? a : b
}

export const getViewportWidth = () => {
  let a = docEl.clientWidth
  let b = win.innerWidth
  return a > b ? a : b
}

export const getViewportSize = () => ({
  width: getViewportWidth(),
  height: getViewportHeight()
})


export default class ViewportSize extends React.PureComponent {
  _listeners = {}

  constructor (props) {
    super(props)
    this.throttledSetStats = throttle(this.setStats)
  }

  componentDidMount () {
    this.setStats()

    this._listeners = {
      resize: win.addEventListener('resize', this.throttledSetStats),
      orientationchange: win.addEventListener(
        'orientationchange',
        this.throttledSetStats
      )
    }
  }

  componentWillUnmount () {
    for (let eventName in this._listeners) {
      win.removeEventListener(eventName, this.throttledSetStats)
    }

    this.throttledSetStats.cancel()
  }

  setStats = () => {
    this.setState(
      {
        viewportWidth: getViewportWidth(),
        viewportHeight: getViewportHeight(),
      }
    )
  }

  getViewportSize = () => ({
    width: this.state && this.state.viewportWidth,
    height: this.state && this.state.viewportHeight
  })

  render () {
    const {children, ...props} = this.props
    const {getViewportSize} = this

    return cloneIfElement(
      children,
      {
        getAspect,
        getViewportSize,
        ...this.state,
        ...props
      }
    )
  }
}
