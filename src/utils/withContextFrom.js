import React from 'react'
import {wrapDisplayName} from '../helpers'
import cloneIfElement from './cloneIfElement'





export default Component => class withContextFrom extends React.Component {
  static contextTypes = Component.childContextTypes
  static displayName = wrapDisplayName('withContextFrom', Component)

  render () {
    const {children, ...props} = this.props

    return cloneIfElement(
      children,
      {
        ...props,
        ...this.context
      }
    )
  }
}
