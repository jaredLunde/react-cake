import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from '../EventTracker'
import {throttle} from '../utils'
import {getAspect} from './ViewportQueries'
import {win, winScreen, docEl} from './statics'


/**
<ViewportSize>
  {
    ({width, height}) => (
      <Row>
        <Col x={8}>viewport width: {width}</Col>
        <Col x={8}>viewport height: {height}</Col>
      </Row>
    )
  }
</ViewportSize>
**/
export const getViewportHeight = () => docEl.clientHeight
export const getViewportWidth = () => docEl.clientWidth
export function getViewportSize () {
  return {
    width: getViewportWidth(),
    height: getViewportHeight()
  }
}


export class ViewportSize extends React.Component {
  _listeners = {}
  static propTypes = {
    withCoords: PropTypes.bool
  }

  componentDidMount () {
    this.props.addEvent(win, 'resize', this.setSize)
    this.props.addEvent(win, 'orientationchange', this.setSize)
  }

  componentWillUnmount () {
    this.setSize.cancel()
  }
  setSize = throttle(() => this.forceUpdate())

  render () {
    let props

    if (this.props.withCoords) {
      props = getViewportSize()
      props.aspect = getAspect()
    }
    else {
      props = {getAspect, getViewportSize}
    }

    return this.props.children(props)
  }
}


export default function (props) {
  return (
    <EventTracker>
      {function (tProps) {
        return <ViewportSize {...tProps} {...props}/>
      }}
    </EventTracker>
  )
}
