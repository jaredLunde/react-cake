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
      : React.isValidElement(Component)
        ? React.cloneElement(Component, props)
        : React.createElement(Component, props)
}
