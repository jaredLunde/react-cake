import React from 'react'
import PropTypes from 'prop-types'
import EventTracker from './EventTracker'
import {requestTimeout, clearRequestTimeout, throttle, callIfExists} from './utils'


/**
const MousePositionButton = props => (
  <MousePosition propName='isOver' enterDelay={500} leaveDelay={200}>
    {
      ({
        mousePositionRef,
        clientX,
        clientY,
        elementX,
        elementY,
        isOver
      }) => (
        <button
          ref={mousePositionRef}
          className={`
            btn
            ${isOver ? 'btn--m' : 'btn--s'}
          `}
        >
          Element position X: {elementX}
          Element position Y: {elementY}
        </button>
      )
    }
  </MousePosition>
)
*/


export const canMove = !("ontouchstart" in window)


export class MousePosition extends React.Component {
  static propTypes = {
    propName: PropTypes.string.isRequired,
    enterDelay: PropTypes.number,
    leaveDelay: PropTypes.number,
    onMove: PropTypes.func,
    onLeave: PropTypes.func
  }

  static defaultProps = {propName: 'isOver'}
  element = null
  timeout = null
  entered = false

  constructor (props) {
    super(props)
    const {propName} = props
    this.state = {
      clientX: null,
      clientY: null,
      elementX: null,
      elementY: null,
      [propName]: false
    }
  }

  mousePositionRef = e => {
    if (this.element !== null) {
      this.props.removeAllEvents(this.element)
    }

    if (e !== null) {
      this.element = e
      this.addListeners(this.element)
    }
  }

  delay = (onOrOff, delay) => {
    return e => {
      if (!canMove) {
        return
      }

      const {propName} = this.props

      if (this.timeout) {
        clearRequestTimeout(this.timeout)
      }

      if (delay) {
        this.timeout = requestTimeout(() => onOrOff(e), delay)
      } else {
        onOrOff(e)
      }
    }
  }

  get events () {
    const {enterDelay, leaveDelay} = this.props

    return {
      mouseenter: this.delay(this.onEnter, enterDelay),
      mousemove: this.onMove,
      mouseleave: this.delay(this.onLeave, leaveDelay)
    }
  }

  addListeners (e) {
    if (e === null) return;
    for (let name in this.events) {
      this.props.addEvent(e, name, this.events[name])
    }
  }

  onMove = throttle(
    e => {
      if (canMove === false || this.entered === false) return;
      const {propName} = this.props
      const {clientX, clientY, screenX, screenY, pageX, pageY} = e
      const elementX = pageX - this.element.offsetLeft
      const elementY = pageY - this.element.offsetTop
      this.setState(
        {
          pageX,
          pageY,
          clientX,
          clientY,
          screenX,
          screenY,
          elementX,
          elementY,
          elementWidth: this.element.offsetWidth,
          elementHeight: this.element.offsetHeight,
          [propName]: true
        },
        () => callIfExists(this.props.onMove, this.state, e)
      )
    }
  )

  onEnter = e => {
    this.entered = true
    this.onMove(e)
  }

  onLeave = e => {
    if (canMove === false) return;
    const {propName} = this.props
    this.entered = false

    this.setState(
      {
        pageX: null,
        pageY: null,
        clientX: null,
        clientY: null,
        screenX: null,
        screenY: null,
        elementX: null,
        elementY: null,
        [propName]: false
      },
      () => callIfExists(this.props.onLeave, this.state, e)
    )
  }

  componentWillUnmount () {
    this.onMove.cancel()
  }

  render () {
    return this.props.children({mousePositionRef: this.mousePositionRef, ...this.state})
  }
}


export default function(props) {
  return (
    <EventTracker>
      {function (eventContext) {
        return <MousePosition {...eventContext} {...props}/>
      }}
    </EventTracker>
  )
}
