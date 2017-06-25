import invariant from 'invariant'


export default (prop, minSize) => invariant(
  (minSize === void 0 || minSize === null ) || prop.size >= minSize,
  `Prop '${JSON.stringify(prop)}' failed to meet minimum size: ${minSize}`
)
