import invariant from 'invariant'


export default (prop, size) => invariant(
  (size === void 0 || size === null ) || prop.size === size,
  `Prop '${JSON.stringify(prop)}' must contain exactly '${size}' elements.`
)
