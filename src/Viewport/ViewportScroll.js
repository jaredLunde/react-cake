import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from '../EventTracker'
import {throttle} from '../utils'
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

function getScroll () {
  return {
    scrollX: win.scrollX !== void 0 ? win.scrollX : win.pageXOffset,
    scrollY: win.scrollY !== void 0 ? win.scrollY : win.pageYOffset
  }
}


export class ViewportScroll extends React.Component {
  static propTypes = {
    withCoords: PropTypes.bool
  }

  static defaultProps = {
    withCoords: false
  }

  componentDidMount () {
    this.props.addEvent(win, 'scroll', this.setScroll)
  }

  componentWillUnmount () {
    this.setScroll.cancel()
  }

  setScroll = throttle(() => this.forceUpdate())

  render () {
    let props

    if (this.props.withCoords) {
      props = getScroll()
    }
    else {
      props = {}
      props.getViewportScroll = getScroll
    }

    props.scrollTo = win.scrollTo
    props.inView = inViewport
    props.inViewX = inViewportX
    props.inViewY = inViewportY
    props.inFullViewX = inFullViewViewportX
    props.inFullViewY = inFullViewViewportY
    props.inFullView = inFullViewViewport

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
