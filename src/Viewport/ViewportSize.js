import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from '../EventTracker'
import {compose, throttle, reduceProps} from '../utils'
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
export const getViewportSize = () => ({
  width: getViewportWidth(),
  height: getViewportHeight()
})


function getSize () {
  return {
    width: getViewportWidth(),
    height: getViewportHeight(),
  }
}


export class ViewportSize extends React.PureComponent {
  _listeners = {}
  static propTypes = {
    withCoords: PropTypes.bool
  }

  constructor (props) {
    super(props)
    props.addEvent(win, 'resize', this.setSize)
    props.addEvent(win, 'orientationchange', this.setSize)
    this.state = getSize()
  }

  componentWillUnmount () {
    this.setSize.cancel()
  }
  setSize = throttle(() => this.setState(getSize()))

  render () {
    const props = reduceProps(
      this.props,
      ['children', 'addEvent', 'removeEvent', 'removeAllEvents', 'withCoords']
    )
    props.getAspect = getAspect
    props.getViewportSize = getViewportSize

    if (this.props.withCoords) {
      props.width = this.state.width
      props.height = this.state.height
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
