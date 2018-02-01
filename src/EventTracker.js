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
    for (let x = 0; x < this.events.length; x++) {
      const [el_, name, fn] = this.events[x]
      if (!el || el_ === el) {
        el_.removeEventListener(name, fn)
        this.events.splice(x, 1)
      }
    }
  }

  componentWillUnmount () {
    this.removeAllEvents()
  }

  render () {
    const props = Object.assign({}, this.props)
    delete props.children
    props.addEvent = this.addEvent
    props.removeEvent = this.removeEvent
    props.removeAllEvents = this.removeAllEvents
    return this.props.children(props)
  }
}
