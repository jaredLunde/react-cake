import React from 'react'


export default (Component, props) => {
  const typeOfComponent = typeof Component
  const prototype = Component.prototype

  return typeOfComponent === 'string'
    ? Component
    : (
         typeOfComponent === 'function'
      && (!prototype || !prototype.isReactComponent)
    )
      ? Component(props)
      : React.isValidElement(Component)
        ? React.cloneElement(Component, props)
        : React.createElement(Component, props)
}
