import React from 'react'

/**
export default function (Component, props, children) {
  const typeOfComponent = typeof Component
  const prototype = Component && Component.prototype
  const isString = typeOfComponent === 'string'

  if (children !== void 0) {
    props.children = children
  }

  return (
    (typeOfComponent === 'function' && (!prototype || !prototype.isReactComponent))
      ? Component(props)
      : isString || typeOfComponent === 'number' || (prototype && prototype.isReactComponent)
        ? React.createElement(Component, props)
        : React.cloneElement(Component, props)
  )
}
*/

export default function (Component, props, children) {
  const typeOfComponent = typeof Component
  const prototype = Component && Component.prototype
  const isReactComponent = prototype && prototype.isReactComponent

  if (typeOfComponent === 'function' && !isReactComponent) {
    if (children !== void 0) {
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
