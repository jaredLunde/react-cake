import React from 'react'
import PropTypes from 'prop-types'
import Toggle from './Toggle'
import EventTracker from './EventTracker'
import {callIfExists, throttle, createOptimized, compose} from '../utils'


/**
const ScrollableBox = props => (
  <Scrollable>
    {
      props => (
        <div
          ref={props.scrollableRef}
          style={{
            width: 300,
            height: 300,
            overflow: 'auto',
            background: '#eee'
          }}
        >
          <div style={{width: 600, height: 1200}}>
            <div style={{
              transform: `translateY(${props.scrollY + 10}px)`
            }}>
              {JSON.stringify(props)}
            </div>
          </div>
        </div>
      )
    }
  </Scrollable>
)
*/


export class Scrollable extends React.PureComponent {
  static propTypes = {
    onScroll: PropTypes.func,
    initialX: PropTypes.number,
    initialY: PropTypes.number
  }

  _scrollable = null

  state = {
    scrollHeight: 0,
    scrollWidth: 0,
    scrollY: 0,
    scrollX: 0,
    clientHeight: 0,
    clientWidth: 0,
    scrollYProgress: 0,
    scrollXProgress: 0,
    scrollYMax: 0,
    scrollXMax: 0,
    directionX: null,
    directionY: null,
    distanceX: 0,
    distanceY: 0
  }

  scrollableRef = e => {
    if (e === null) {
      return
    }

    const scrollableChanged = this._scrollable !== e
    if (this._scrollable !== null && scrollableChanged) {
      this._cancelThrottles()
      this.props.removeAllEvents(this._scrollable)
    }

    if (scrollableChanged) {
      this._scrollable = e
      this.props.addEvent(e, 'scroll', this.onScroll)
    }
  }

  componentDidMount () {
    const {initialX, initialY} = this.props

    if (initialX || initialY) {
      this.scrollTo(initialX, initialY)
    }
  }

  componentWillUnmount () {
    this._cancelThrottles()
  }

  _cancelThrottles () {
    this.onScroll.cancel()
    this.scrollTo.cancel()
  }

  onScroll = throttle(
    e => {
      const {
        scrollHeight,
        scrollWidth,
        scrollTop,
        scrollLeft,
        clientHeight,
        clientWidth
      } = this._scrollable

      const scrollXMax = scrollWidth - clientWidth
      const scrollYMax = scrollHeight - clientHeight
      const scrollXProgress = scrollLeft / scrollXMax
      const scrollYProgress = scrollTop / scrollYMax

      this.setState(
        prevState => ({
          scrollHeight,
          scrollWidth,
          scrollY: scrollTop,
          scrollX: scrollLeft,
          clientHeight,
          clientWidth,
          scrollYProgress,
          scrollXProgress,
          scrollYMax,
          scrollXMax,
          directionY: (prevState.scrollY || 0) > scrollTop ? 'up' : (
            prevState.scrollY === scrollTop ? null : 'down'
          ),
          directionX: (prevState.scrollX || 0) > scrollLeft ? 'left' : (
            prevState.scrollX === scrollLeft ? null : 'right'
          ),
          distanceY: scrollTop - prevState.scrollY,
          distanceX: scrollLeft - prevState.scrollX,
        }),
        () => callIfExists(this.props.onScroll, this.state)
      )
    }
  )

  scrollTo = throttle(
    (posX, posY) => {
      if (posY !== void 0 && posX !== null) {
        this._scrollable.scrollTop = posY
      }

      if (posX !== void 0 && posY !== null) {
        this._scrollable.scrollLeft = posX
      }
    }
  )
  scrollToX = (posX, opt) => this.scrollTo(posX, null, opt)
  scrollToY = (posY, opt) => this.scrollTo(null, posY, opt)

  render () {
    const {
      children,
      onScroll,
      addEvent,
      removeEvent,
      removeAllEvents,
      ...props
    } = this.props
    const {scrollableRef, scrollToX, scrollToY, scrollTo} = this

    return createOptimized(
      children,
      {
        scrollableRef,
        scrollToX,
        scrollToY,
        scrollTo,
        ...this.state,
        ...props
      }
    )
  }
}


export default compose([EventTracker, Scrollable])
