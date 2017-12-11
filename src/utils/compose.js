import createOptimized from './createOptimized'
import displayName from '../helpers/displayName'


export default function (Components) {
  let x
  const maxIdx = Components.length - 1

  function Output ({children, ...props}) {
    const accumulator = []

    for (x = maxIdx; x > -1; x--) {
      const Component = Components[x]
      const LastComponent = x === maxIdx ? children : accumulator.pop()

      accumulator.push(
        function (derivedProps) {
          return createOptimized(
            Component,
            {
              ...derivedProps,
              children: LastComponent
            }
          )
        }
      )
    }

    return accumulator[0](props)
  }

  const names = Components.map(Component => displayName(Component))
  Output.displayName = `compose(${names.join(', ')})`

  return Output
}
