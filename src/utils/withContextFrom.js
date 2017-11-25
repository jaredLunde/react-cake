import React from 'react'
import {wrapDisplayName} from '../helpers'
import cloneIfElement from './cloneIfElement'


export default Component => {
  const withContextFrom = ({children, ...props}, context) => cloneIfElement(
    children,
    {
      ...props,
      ...context
    }
  )
  Object.defineProperty(
    withContextFrom,
    'name',
    {value: wrapDisplayName('withContextFrom', Component)}
  )
  withContextFrom.contextTypes = Component.childContextTypes
  return withContextFrom
}
