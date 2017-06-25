import React from 'react'
import PropTypes from 'prop-types'
import Toggle from './Toggle'
import {childIsFunctionInvariant} from '../invariants'
import {
  callIfExists,
  requestAnimationFrame,
  cancelAnimationFrame,
  cloneIfElement
} from '../utils'


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


export default class Scrollable extends React.PureComponent {
  static propTypes = {
    onScroll: PropTypes.func,
    initialX: PropTypes.number,
    initialY: PropTypes.number
  }

  _scrollable = null
  _scrolling = null
  _scrollToFrame = null

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
      this.removeScrollListener(this._scrollable)
    }

    if (scrollableChanged && e !== null) {
      this._scrollable = e
      this.addScrollListener(e)
    }
  }

  addScrollListener (e) {
    e.addEventListener('scroll', this.onScroll)
  }

  removeScrollListener (e) {
    if (e !== null) {
      e.removeEventListener('scroll', this.onScroll)
    }
  }

  componentDidMount () {
    const {initialX, initialY} = this.props

    if (initialX || initialY) {
      this.scrollTo(initialX, initialY)
    }
  }

  componentWillUnmount () {
    this.removeScrollListener(this._scrollable)
    this.cancelAnimationFrameIf('_scrolling')
    this.cancelAnimationFrameIf('_scrollToFrame')
  }

  cancelAnimationFrameIf = propName => callIfExists(cancelAnimationFrame, this[propName])

  onScroll = e => {
    if (this._scrolling !== null) {
      return
    }

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

    this._scrolling = requestAnimationFrame(() => {
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
        () => {
          this._scrolling = null
          callIfExists(this.props.onScroll, this.state)
        }
      )
    })
  }

  scrollTo = (posX, posY) => {
    if (this._scrollToFrame !== null) {
      return
    }

    this._scrollToFrame = requestAnimationFrame(() => {
      if (posY !== void 0 && posX !== null) {
        this._scrollable.scrollTop = posY
      }

      if (posX !== void 0 && posY !== null) {
        this._scrollable.scrollLeft = posX
      }

      this._scrollToFrame = null
    })
  }

  scrollToX = (posX, opt) => this.scrollTo(posX, null, opt)
  scrollToY = (posY, opt) => this.scrollTo(null, posY, opt)

  render () {
    const {children, onScroll, ...props} = this.props
    const {scrollableRef, scrollToX, scrollToY, scrollTo} = this

    return cloneIfElement(
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
