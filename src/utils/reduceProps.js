function reduce (reducer, initialProps, ...propObjects) {
  const props = {}
  let newProps = []

  for (let x = 0; x < propObjects.length; x++) {
    const obj = propObjects[x]

    if (Array.isArray(obj)) {
      newProps = newProps.concat(obj)
    } else {
      newProps = newProps.concat(Object.keys(obj))
    }
  }

  const initialKeys = Object.keys(initialProps)

  for (let x = 0; x < initialKeys.length; x++) {
    const propName = initialKeys[x]
    if (
      reducer(newProps.indexOf(propName)) &&
      initialProps[propName] !== void 0
    ) {
      props[propName] = initialProps[propName]
    }
  }

  return props
}


export function selectProps (initialProps, ...propObjects) {
  return reduce(
    (index, propVal) => index > -1,
    initialProps,
    ...propObjects
  )
}


export default function (initialProps, ...propObjects) {
  return reduce(
    (index, propVal) => index === -1,
    initialProps,
    ...propObjects
  )
}
