import invariant from 'invariant'


export default children => invariant(
  typeof children === 'function',
  `Child component must be a function or unmounted React.Component`
)
