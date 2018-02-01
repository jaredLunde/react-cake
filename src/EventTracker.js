import React from 'react'


export default class EventTracker extends React.Component {
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
    for (let event of this.events) {
      if (!el || event[0] === el) {
        this.removeEvent(...event)
      }
    }
  }

  componentWillUnmount () {
    this.removeAllEvents()
  }

  render () {
    const {children, ...props} = this.props
    return children({
      addEvent: this.addEvent,
      removeEvent: this.removeEvent,
      removeAllEvents: this.removeAllEvents,
      ...props
    })
  }
}
