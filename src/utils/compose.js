import createOptimized from './createOptimized'
import displayName from '../helpers/displayName'


let ID = -1

export default function (Components) {
  ID += 1
  const childrenName = `@@CAKE_CHILDREN__${ID}@@`
  const names = []
  const C = []

  for (let i = Components.length - 1; i > -1; i--) {
    let CakeComponent
    const Component = Components[i]
    const lastComponent = C[0]
    names.unshift(displayName(Component))

    if (C.length === 0) {
      CakeComponent = function ({...props}) {
        const children = props[childrenName]
        delete props[childrenName]

        return createOptimized(Component, {...props, children})
      }
    }
    else if (i === 0) {
      CakeComponent = function ({children, ...props}) {
        return createOptimized(
          Component,
          {
            [childrenName]: children,
            ...props,
            children: lastComponent,
          }
        )
      }
    }
    else {
      CakeComponent = function (props) {
        return createOptimized(
          Component,
          {
            ...props,
            children: lastComponent,
          }
        )
      }
    }

    C.unshift(CakeComponent)
  }

  const name = `compose(${names.join(', ')})`
  Object.defineProperty(C[0], 'name', {value: name})

  return C[0]
}
