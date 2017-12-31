import React from 'react'
import {createOptimized} from './utils'


export default class Subscriptions extends React.PureComponent {
  subscriptions = new Set()

  subscribe = cb => {
    this.subscriptions.add(cb)
  }

  unsubscribe = cb => {
    this.subscriptions.delete(cb)
  }

  notify = (...args) => {
    for (let cb of this.subscriptions) {
      cb(...args)
    }
  }

  render () {
    const {subscriptions, subscribe, unsubscribe, notify} = this
    const {children, ...props} = this.props

    return createOptimized(
      children,
      {
        ...props,
        subscribe,
        unsubscribe,
        notify
      }
    )
  }
}
