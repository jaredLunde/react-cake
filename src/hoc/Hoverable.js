import React from 'react'
import PropTypes from 'prop-types'
import Toggle from './Toggle'
import {cloneIfElement, compose} from '../utils'
import {childIsFunctionInvariant} from '../invariants'


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

  control (onOrOff, delay) {
    if (!canHover) {
      return
    }

    if (this._timeout) {
      window.clearTimeout(this._timeout)
    }

    if (delay) {
      this._timeout = window.setTimeout(onOrOff, delay)
    } else {
      onOrOff()
    }
  }

  hoverableRef = e => {
    if (this._hoverable !== null) {
      this.removeEnterListener(this._hoverable)
      this.removeLeaveListener(this._hoverable)
    }

    if (e !== null) {
      this._hoverable = e
      this.addEnterListener(this._hoverable)
      this.addLeaveListener(this._hoverable)
    }
  }

  addEnterListener (e) {
    e.addEventListener('mouseenter', this.onEnter)
  }

  removeEnterListener (e) {
    if (e !== null) {
      e.removeEventListener('mouseenter', this.onEnter)
    }
  }

  addLeaveListener (e) {
    e.addEventListener('mouseleave', this.onLeave)
  }

  removeLeaveListener (e) {
    if (e !== null) {
      e.removeEventListener('mouseleave', this.onLeave)
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

  componentWillUnmount () {
    this.removeEnterListener(this._hoverable)
    this.removeLeaveListener(this._hoverable)
  }

  render () {
    const {children, propName, on, off, ...props} = this.props
    const {hoverableRef} = this

    return cloneIfElement(
      children,
      {
        hoverableRef,
        ...props
      }
    )
  }
}


const composedHoverable = compose([Toggle, Hoverable])
export default props => composedHoverable({initialValue: false, ...props})
