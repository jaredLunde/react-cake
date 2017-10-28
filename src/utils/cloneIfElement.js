import React from 'react'


export default (Component, props) => (
  typeof Component === 'string'
    ? Component
    : React.isValidElement(Component)
      ? React.cloneElement(Component, props)
      : (
           typeof Component === 'function'
        && (!Component.prototype || !Component.prototype.isReactComponent)
      )
        ? Component(props)
        : React.createElement(Component, props)
)
