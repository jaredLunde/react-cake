import React from 'react'


export default function (Component, props, children) {
  if (Component === null) {
    return null
  }

  const typeOfComponent = typeof Component
  const prototype = Component && Component.prototype
  const isReactComponent = prototype && prototype.isReactComponent

  if (typeOfComponent === 'function' && !isReactComponent) {
    if (children !== void 0) {
      props = Object.isFrozen(props) ? {...props} : props
      props.children = children
    }

    return Component(props)
  }

  const shouldCreateElement = isReactComponent || typeOfComponent === 'string'

  if (children !== void 0) {
    return (
      shouldCreateElement
      ? React.createElement(Component, props, children)
      : React.cloneElement(Component, props, children)
    )
  } else {
    return (
      shouldCreateElement
      ? React.createElement(Component, props)
      : React.cloneElement(Component, props)
    )
  }

}
