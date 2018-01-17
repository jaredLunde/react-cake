import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from '../EventTracker'
import Throttle from '../Throttle'
import compose from '../utils/compose'
import {rect} from './utils'

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

  recalcRect = () => this.props.throttleState(this.getRect())
  getRect = () => rect(this.element)

  render () {
    const {
      children,
      withPosition,
      addEvent,
      removeEvent,
      removeAllEvents,
      recalcOnWindowChange,
      throttleState,
      ...props
    } = this.props
    const {recalcRect, rectRef, getRect, state} = this

    /** rectRef, recalcRect, getRect, top, right, bottom, left, width, height */
    return children({
      rectRef,
      recalcRect,
      getRect,
      ...props,
      ...(withPosition ? state : {})
    })
  }
}


export default compose([EventTracker, Throttle, Rect])
