import React from 'react'


export default function (Component, props) {
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
        ? React.createElement(Component, props)
        : React.cloneElement(Component, props)
}
