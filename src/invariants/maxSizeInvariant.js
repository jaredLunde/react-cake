import invariant from 'invariant'


export default (prop, maxSize) => invariant(
  (maxSize === void 0 || maxSize === null ) || prop.size >= maxSize,
  `Prop '${JSON.stringify(prop)}' exceeded maximum size: ${size}`
)
