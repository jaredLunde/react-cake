import invariant from 'invariant'


export default (list, value) => {
  invariant(
    !list.includes(value),
    `List ${JSON.stringify(list)} already contains value: ` +
    `${JSON.stringify(value)}`
  )
}
