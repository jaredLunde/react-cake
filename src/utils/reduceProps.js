function reduceObject (props, obj, initialKeys, initialProps, singular) {
  for (let x = 0; x < initialKeys.length; x++) {
    const propName = initialKeys[x]

    if (singular === void 0 && props[propName] !== void 0) {
      delete props[propName]
    }

    if (obj[propName] === void 0) {
      props[propName] = initialProps[propName]
    }
  }

  return props
}

function reduceArray (props, keys, initialKeys, initialProps, singular) {
  for (let x = 0; x < initialKeys.length; x++) {
    const propName = initialKeys[x]

    if (singular === void 0 && props[propName] !== void 0) {
      delete props[propName]
    }

    if (keys.indexOf(propName) === -1) {
      props[propName] = initialProps[propName]
    }
  }

  return props
}

function nullObject (props, keys) {
  for (let x = 0; x < keys.length; x++) {
    props[keys[x]] = null
  }

  return props
}


export function selectProps (initialProps, ...propObjects) {
  const props = {}
  let motherObject = {}

  if (propObjects.length === 1) {
    motherObject = (
      Array.isArray(propObjects[0])
      ? nullObject(motherObject, propObjects[0])
      : propObjects[0]
    )
  }
  else {
    for (let x = 0; x < propObjects.length; x++) {
      nullObject(
        motherObject,
        Array.isArray(propObjects[x])
          ? propObjects[x]
          : Object.keys(propObjects[x])
      )
    }
  }

  const initialKeys = Object.keys(initialProps)
  for (let x = 0; x < initialKeys.length; x++) {
    const propName = initialKeys[x]

    if (motherObject[propName] !== void 0 && initialProps[propName] !== void 0) {
      props[propName] = initialProps[propName]
    }
  }

  return props
}


export default function (initialProps, ...propObjects) {
  const props = {}
  const initialKeys = Object.keys(initialProps)

  if (propObjects.length === 1) {
    (Array.isArray(propObjects[0]) ? reduceArray : reduceObject)(
      props,
      propObjects[0],
      initialKeys,
      initialProps,
      true
    )
  }
  else {
    for (let x = 0; x < propObjects.length; x++) {
      (Array.isArray(propObjects[x]) ? reduceArray : reduceObject)(
        props,
        propObjects[x],
        initialKeys,
        initialProps
      )
    }
  }

  return props
}
