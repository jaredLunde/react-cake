import React from 'react'
import PropTypes from 'prop-types'
import {cloneIfElement, throttle} from '../../utils'
import {getAspect} from './ViewportQueries'
import {win, winScreen, docEl} from './statics'


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
export const getViewportHeight = () => docEl.clientHeight
export const getViewportWidth = () => docEl.clientWidth
export const getViewportSize = () => ({
  width: getViewportWidth(),
  height: getViewportHeight()
})


export default class ViewportSize extends React.PureComponent {
  _listeners = {}

  constructor (props) {
    super(props)
    this.throttledSetStats = throttle(this.setStats)
    this.state = this.getStats()
  }

  componentDidMount () {
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

  getStats = () => ({
    viewportWidth: getViewportWidth(),
    viewportHeight: getViewportHeight(),
  })

  setStats = () => {
    console.log("HEHE SETTING", this.getStats())
    this.setState(this.getStats)
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
