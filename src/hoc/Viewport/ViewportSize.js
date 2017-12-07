import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from '../EventTracker'
import Throttle from '../Throttle'
import {createOptimized, compose} from '../../utils'
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


function getStats () {
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
    addEvent(win, 'resize', this.setStats)
    addEvent(win, 'orientationchange', this.setStats)
  }

  setStats = () => this.props.throttleState(getStats)

  getViewportSize = () => ({
    width: this.props.viewportWidth,
    height: this.props.viewportHeight
  })

  render () {
    const {
      children,
      addEvent,
      removeEvent,
      removeAllEvents,
      throttleState,
      ...props
    } = this.props
    const {getViewportSize} = this

    return createOptimized(
      children,
      {
        getAspect,
        getViewportSize,
        ...props
      }
    )
  }
}


const ComposedViewportSize = compose([EventTracker, Throttle, ViewportSize])


export default function (props) {
  return ComposedViewportSize({
    initialState: getStats(),
    ...props
  })
}
