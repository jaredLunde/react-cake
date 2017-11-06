import cloneIfElement from './cloneIfElement'


let ID = -1

export default Components => {
  const C = []
  ID += 1
  const childrenName = `@@CAKE_CHILDREN__${ID}@@`

  for (let i = Components.length - 1; i > -1; i--) {
    let CakeComponent
    const Component = Components[i]
    const lastComponent = C[0]

    if (C.length === 0) {
      CakeComponent = props => {
        const children = props[childrenName]
        delete props[childrenName]

        return cloneIfElement(Component, {children, ...props})
      }
    }
    else if (i === 0) {
      CakeComponent = ({children, ...props}) => cloneIfElement(
        Component,
        {
          [childrenName]: children,
          ...props,
          children: lastComponent,
        }
      )
    }
    else {
      CakeComponent = props => cloneIfElement(
        Component, {
          children: lastComponent,
          ...props
        }
      )
    }

    C.unshift(CakeComponent)
  }

  return C[0]
}
