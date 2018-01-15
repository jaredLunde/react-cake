import createOptimized from './createOptimized'
import displayName from './displayName'


export default function (Components) {
  let x
  const maxIdx = Components.length - 1

  function Output (props) {
    let NextComponent = props.children

    for (x = maxIdx; x > -1; x--) {
      const Component = Components[x]
      const PrevComponent = NextComponent

      NextComponent = function (derivedProps) {
        return createOptimized(Component, derivedProps, PrevComponent)
      }
    }

    return NextComponent(props)
  }

  if (typeof process !== void 0 && process.env.NODE_ENV !== 'production') {
    let componentNames = ''
    
    for (x = 0; x <= maxIdx; x++) {
      componentNames += displayName(Components[x])
      if (x !== maxIdx) {
        componentNames += ', '
      }
    }

    Output.displayName = `compose(${componentNames})`
  }

  return Output
}
