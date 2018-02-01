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
    const {children, ...props} = this.props

    return children({
      ...props,
      subscribe: this.subscribe,
      unsubscribe: this.unsubscribe,
      notify: this.notify
    })
  }
}
