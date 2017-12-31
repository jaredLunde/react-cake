import React from 'react'
import PropTypes from 'prop-types'
import Toggle from './Toggle'
import EventTracker from './EventTracker'
import {createOptimized, compose, requestTimeout, clearRequestTimeout} from './utils'
import {childIsFunctionInvariant} from './invariants'


/**
const HoverableButton = props => (
  <Hoverable propName='iAmHovering' enterDelay={500} leaveDelay={200}>
    {
      ({iAmHovering, hoverableRef}) => (
        <button
          ref={hoverableRef}
          className={`
            btn
            ${iAmHovering ? 'btn--m' : 'btn--s'}
          `}
        >
          Hovering? {JSON.stringify(iAmHovering)}
        </button>
      )
    }
  </Hoverable>
)
*/


export const canHover = !("ontouchstart" in window)

export class Hoverable extends React.PureComponent {
  static propTypes = {
    propName: PropTypes.string.isRequired,
    enterDelay: PropTypes.number,
    leaveDelay: PropTypes.number,
    on: PropTypes.func.isRequired,
    off: PropTypes.func.isRequired
  }

  _hoverable = null
  _timeout = null

  componentWillUnmount () {
    if (this._timeout) {
      clearRequestTimeout(this._timeout)
    }
  }

  control (onOrOff, delay) {
    if (!canHover) {
      return
    }

    if (this._timeout) {
      clearRequestTimeout(this._timeout)
    }

    if (delay) {
      this._timeout = requestTimeout(onOrOff, delay)
    } else {
      onOrOff()
    }
  }

  hoverableRef = e => {
    if (this._hoverable !== null) {
      this.props.removeAllEvents()
    }

    if (e !== null) {
      this._hoverable = e
      this.props.addEvent(this._hoverable, 'mouseenter', this.onEnter)
      this.props.addEvent(this._hoverable, 'mouseleave', this.onLeave)
    }
  }

  onEnter = () => {
    const {on, enterDelay} = this.props
    this.control(on, enterDelay)
  }

  onLeave = () => {
    const {off, leaveDelay} = this.props
    this.control(off, leaveDelay)
  }


  render () {
    const {
      children,
      propName,
      on,
      off,
      addEvent,
      removeEvent,
      removeAllEvents,
      ...props
    } = this.props
    const {hoverableRef} = this

    return createOptimized(
      children,
      {
        hoverableRef,
        ...props
      }
    )
  }
}


const composedHoverable = compose([EventTracker, Toggle, Hoverable])
export default props => composedHoverable({initialValue: false, ...props})
