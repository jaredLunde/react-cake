import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from './EventTracker'
import Throttle from './Throttle'
import {createOptimized, compose} from '../utils'


export const rect = (el, leeway) => {
  el = el && !el.nodeType ? el[0] : el
  if (!el || 1 !== el.nodeType) return;

  const {
    top,
    right,
    bottom,
    left,
    width,
    height
  } = el.getBoundingClientRect()

  leeway = typeof leeway === 'object'
    ? leeway
    : (
      !leeway
      ? {top: 0, right: 0, bottom: 0,  left: 0}
      : {top: leeway, right: leeway, bottom: leeway, left: leeway}
    )

  leeway.top = leeway.top || 0
  leeway.right = leeway.right || 0
  leeway.bottom = leeway.bottom || 0
  leeway.left = leeway.left || 0

  return {
    top: leeway.top + top,
    right: leeway.right + right,
    bottom: leeway.bottom + bottom,
    left: leeway.left + left,
    width: leeway.left + leeway.right + width,
    height: leeway.top + leeway.bottom + height,
  }
}

/**
<Rect>
  ({rectRef, recalcRect, top, right, bottom, left, width, height}) => (
    <div ref={rectRef}>
      <div>
        My width: {width}
      </div>
      <div>
        My height: {height}
      </div>
      <div>
        My pos: {JSON.stringify({top, right, bottom, left})}
      </div>
    </div>
  )
</Rect>
*/
export class Rect extends React.PureComponent {
  static propTypes = {
    recalcOnWindowChange: PropTypes.bool,
    withPosition: PropTypes.bool
  }

  static defaultProps = {
    recalcOnWindowChange: true
  }

  element = null
  state = {
    top: null,
    right: null,
    bottom: null,
    left: null,
    width: null,
    height: null
  }

  _listeners = []

  componentDidMount () {
    if (this.props.recalcOnWindowChange) {
      this.props.addEvent(window, 'resize', this.recalcRect)
      this.props.addEvent(window, 'scroll', this.recalcRect)
      this.props.addEvent(window, 'orientationchange', this.recalcRect)
    }
  }

  rectRef = e => {
    if (e !== null && e !== this.element) {
      this.element = e
      this.recalcRect()
    }
  }

  recalcRect = () => this.throttleState(this.getRect())
  getRect = () => rect(this.element)

  render () {
    const {
      children,
      withPosition,
      addEvent,
      removeEvent,
      removeAllEvents,
      ...props
    } = this.props
    const {recalcRect, rectRef, getRect, state} = this

    /** rectRef, recalcRect, getRect, top, right, bottom, left, width, height */
    return createOptimized(
      children,
      {
        rectRef,
        recalcRect,
        getRect,
        ...props,
        ...(withPosition ? state : {})
      }
    )
  }
}


export default compose([EventTracker, Throttle, Rect])
