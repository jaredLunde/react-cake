import React from 'react'


export default class Subscriptions extends React.Component {
  subscriptions = []

  subscribe = cb => {
    this.subscriptions.push(cb)
  }

  unsubscribe = cb => {
    this.subscriptions.splice(this.subscriptions.indexOf(cb), 1)
  }

  notify = (...args) => {
    for (let x = 0; x < this.subscriptions.length; x++) {
      this.subscriptions[x](...args)
    }
  }

  render () {
    const props = Object.assign({}, this.props)
    delete props.children
    props.subscribe = this.subscribe
    props.unsubscribe = this.unsubscribe
    props.notify = this.notify

    return this.props.children(props)
  }
}
