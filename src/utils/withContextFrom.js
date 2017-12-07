import React from 'react'
import {wrapDisplayName} from '../helpers'
import createOptimized from './createOptimized'





export default Component => class withContextFrom extends React.Component {
  static contextTypes = Component.childContextTypes
  static displayName = wrapDisplayName('withContextFrom', Component)

  render () {
    const {children, ...props} = this.props

    return createOptimized(
      children,
      {
        ...props,
        ...this.context
      }
    )
  }
}
