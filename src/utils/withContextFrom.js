import React from 'react'
import {wrapDisplayName} from '../helpers'
import cloneIfElement from './cloneIfElement'


export default Component => class withContextFrom extends React.PureComponent {
  static displayName = wrapDisplayName('withContextFrom', Component)
  static contextTypes = Component.childContextTypes

  render () {
    let {children, ...props} = this.props
    const context = this.context || {}
    props = {...context, ...props}
    
    return cloneIfElement(children, props)
  }
}
