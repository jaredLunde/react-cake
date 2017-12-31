import invariant from 'invariant'


export default (prop, length) => invariant(
  (length === void 0 || length === null ) || prop.length === length,
  `Prop '${JSON.stringify(prop)}' must contain exactly '${length}' elements.`
)
