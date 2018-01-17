import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from '../EventTracker'
import {compose, throttle} from '../utils'
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


function getSize () {
  return {
    viewportWidth: getViewportWidth(),
    viewportHeight: getViewportHeight(),
  }
}


export class ViewportSize extends React.PureComponent {
  _listeners = {}

  constructor (props) {
    super(props)
    const {addEvent} = props
    addEvent(win, 'resize', this.setSize)
    addEvent(win, 'orientationchange', this.setSize)
    this.state = getSize()
  }

  componentWillUnmount () {
    this.setSize.cancel()
  }
  setSize = throttle(() => this.setState(getSize()))

  getViewportSize = getViewportSize

  render () {
    const {
      children,
      addEvent,
      removeEvent,
      removeAllEvents,
      ...props
    } = this.props
    const {getViewportSize} = this

    return children({
      getAspect,
      getViewportSize,
      ...this.state,
      ...props
    })
  }
}


export default compose([EventTracker, ViewportSize])
