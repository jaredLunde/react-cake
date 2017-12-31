import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from '../EventTracker'
import {createOptimized, compose, throttle} from '../utils'
import {win} from './statics'
import {
  inViewportX,
  inViewportY,
  inViewport,
  inFullViewViewportX,
  inFullViewViewportY,
  inFullViewViewport
} from './ViewportQueries'


/**
<ViewportScroll withCoords={true}>
  {
    ({scrollX, scrollY, scrollTo}) => (
      <Row>
        <Col x={4}>scrollX: {scrollX}</Col>
        <Col x={4}>scrollY: {scrollY}</Col>
        <Col x={8}>
          scrollTo
          <input
            type='number'
            min={0}
            value={scrollY}
            onChange={e => scrollTo(0, e.target.value)}
          />
        </Col>
      </Row>
    )
  }
</ViewportScroll>
**/
export function getScrollX () {
  return win.scrollX !== void 0 ? win.scrollX : win.pageXOffset
}

export function getScrollY () {
  return win.scrollY !== void 0 ? win.scrollY : win.pageYOffset
}

export function getScroll () {
  return {scrollX: getScrollX(), scrollY: getScrollY()}
}

export class ViewportScroll extends React.PureComponent {
  static propTypes = {
    withCoords: PropTypes.bool
  }

  static defaultProps = {
    withCoords: true
  }

  state = {scrollX: 0, scrollY: 0}

  constructor (props) {
    super(props)
    props.addEvent(win, 'scroll', this.setScroll)
  }

  componentWillUnmount () {
    this.setScroll.cancel()
  }

  setScroll = throttle(() => this.setState(getScroll()))
  getViewportScroll = getScroll

  render () {
    const {
      children,
      withCoords,
      addEvent,
      removeEvent,
      removeAllEvents,
      ...props
    } = this.props
    const {getViewportScroll} = this
    const {scrollTo} = win

    return createOptimized(
      children,
      {
        scrollTo,
        inView: inViewport,
        inViewX: inViewportX,
        inViewY: inViewportY,
        inFullViewX: inFullViewViewportX,
        inFullViewY: inFullViewViewportY,
        inFullView: inFullViewViewport,
        getViewportScroll,
        ...(withCoords === true ? this.state : {}),
        ...props
      }
    )
  }
}


export default compose([EventTracker, ViewportScroll])
