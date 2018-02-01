import React from 'react'
import {wrapDisplayName} from './displayName'
// import createOptimized from './createOptimized'


export default function (Component) {
  return class withContextFrom extends React.Component {
    static contextTypes = Component.childContextTypes
    static displayName = wrapDisplayName('withContextFrom', Component)

    render () {
      /**
      const {children, ...props} = this.props

      return createOptimized(
        children,
        {
          ...props,
          ...this.context
        }
      )
      */
      return this.props.children(this.context)
    }
  }
}
