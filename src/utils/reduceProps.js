function reduce (reducer, initialProps, ...propObjects) {
  const props = {}
  // let newProps = []
  /**
  for (let x = 0; x < propObjects.length; x++) {
    const obj = propObjects[x]

    if (Array.isArray(obj)) {
      newProps = newProps.concat(obj)
    } else {
      newProps = newProps.concat(Object.keys(obj))
    }
  }
  */
  let motherObject = {}

  if (propObjects.length === 1) {
    motherObject = propObjects[0]
  } else {
    for (let x = 0; x < propObjects.length; x++) {
      const objKeys = Object.keys(propObjects[x])
      for (let y = 0; y < objKeys.length; y++) {
        motherObject[objKeys[y]] = null
      }
    }
  }

  const initialKeys = Object.keys(initialProps)
  for (let x = 0; x < initialKeys.length; x++) {
    const propName = initialKeys[x]
    if (reducer(motherObject[propName] === void 0) === true && initialProps[propName] !== void 0) {
      props[propName] = initialProps[propName]
    }
  }

  return props
}


export function selectProps (initialProps, ...propObjects) {
  return reduce(
    isUndefined => isUndefined === false,
    initialProps,
    ...propObjects
  )
}


export default function (initialProps, ...propObjects) {
  return reduce(
    isUndefined => isUndefined,
    initialProps,
    ...propObjects
  )
}
