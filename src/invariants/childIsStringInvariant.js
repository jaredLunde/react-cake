import invariant from 'invariant'


export default children => invariant(
  typeof children === 'string',
  `Child component must be a string`
)
