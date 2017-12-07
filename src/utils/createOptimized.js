import React from 'react'


export default function (Component, props) {
  const typeOfComponent = typeof Component
  const prototype = Component && Component.prototype

  return (
       typeOfComponent === 'function'
    && (!prototype || !prototype.isReactComponent)
  )
    ? Component(props)
    : typeOfComponent === 'string'
      ? Component
      : prototype && prototype.isReactComponent
        ? React.createElement(Component, props)
        : React.cloneElement(Component, props)
}
