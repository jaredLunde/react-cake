import createOptimized from './createOptimized'
import displayName from '../helpers/displayName'

/**
export default function (Components) {
  let x
  const maxIdx = Components.length - 1

  function Output ({children, ...props}) {
    const accumulator = [children]

    for (x = maxIdx; x > -1; x--) {
      const Component = Components[x]
      const Children = accumulator.pop()

      accumulator[0] = function (derivedProps) {
        return createOptimized(Component, derivedProps, Children)
      }
    }

    return accumulator[0](props)
  }

  const names = Components.map(Component => displayName(Component))
  Output.displayName = `compose(${names.join(', ')})`

  return Output
}
*/

export default function (Components) {
  let x
  const maxIdx = Components.length - 1

  function Output ({children, ...props}) {
    let NextComponent = children

    for (x = maxIdx; x > -1; x--) {
      const Component = Components[x]
      const PrevComponent = NextComponent

      NextComponent = function (derivedProps) {
        return createOptimized(Component, derivedProps, PrevComponent)
      }
    }

    return NextComponent(props)
  }

  const names = Components.map(Component => displayName(Component))
  Output.displayName = `compose(${names.join(', ')})`

  return Output
}
