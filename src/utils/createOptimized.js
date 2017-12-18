import React from 'react'


export default function (Component, props, children) {
  const typeOfComponent = typeof Component
  const prototype = Component && Component.prototype
  const isString = typeOfComponent === 'string'

  return (
       typeOfComponent === 'function'
    && (!prototype || !prototype.isReactComponent)
  )
    ? Component(props)
    : typeOfComponent === 'number' || (isString && props === void 0)
      ? Component
      : isString || (prototype && prototype.isReactComponent)
        ? (
            children
            ? React.createElement(Component, props, children)
            : React.createElement(Component, props)
          )
        : (
            children
            ? React.cloneElement(Component, props, children)
            : React.cloneElement(Component, props)
          )
}
