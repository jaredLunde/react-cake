import React from 'react'
import {createOptimized} from '../utils'


export default class EventTracker extends React.PureComponent {
  events = []

  addEvent = (el, name, fn) => {
    this.events.push([el, name, fn])
    el.addEventListener(name, fn)
  }

  removeEvent = (el, name, fn) => {
    el.removeEventListener(name, fn)

    for (let x = 0; x < this.events.length; x++) {
      const event = this.events[x]
      const [el_, name_, fn_] = event

      if (el === el_ && name === name_ && fn === fn_) {
        this.events.splice(x, 1)
      }
    }
  }

  removeAllEvents = el => {
    for (let event in this.events) {
      if (el !== void 0 || event[0] === el) {
        this.removeEvent(...event)
      }
    }
  }

  componentWillUnmount () {
    this.removeAllEvents()
  }

  render () {
    const {children, ...props} = this.props
    const {addEvent, removeEvent, removeAllEvents} = this
    return createOptimized(children, {addEvent, removeEvent, removeAllEvents, ...props})
  }
}
