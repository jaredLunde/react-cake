import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from '../EventTracker'
import {compose, throttle, reduceProps} from '../utils'
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


const baseScrollProps = {
  scrollTo: win.scrollTo,
  inView: inViewport,
  inViewX: inViewportX,
  inViewY: inViewportY,
  inFullViewX: inFullViewViewportX,
  inFullViewY: inFullViewViewportY,
  inFullView: inFullViewViewport,
  getViewportScroll: getScroll,
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

  render () {
    const props = reduceProps(
      this.props,
      [
        'children',
        'withCoords',
        'addEvent',
        'removeEvent',
        'removeAllEvents'
      ]
    )

    if (this.props.withCoords) {
      props.scrollX = this.state.scrollX
      props.scrollY = this.state.scrollY
    }

    props.scrollTo = win.scrollTo
    props.inView = inViewport
    props.inViewX = inViewportX
    props.inViewY = inViewportY
    props.inFullViewX = inFullViewViewportX
    props.inFullViewY = inFullViewViewportY
    props.inFullView = inFullViewViewport
    props.getViewportScroll = getScroll

    return this.props.children(props)
  }
}


export default function (props) {
  return (
    <EventTracker>
      {function (tProps) {
        return <ViewportScroll {...tProps} {...props}/>
      }}
    </EventTracker>
  )
}
