import invariant from 'invariant'


export default (list, value) => {
  invariant(
    list.includes(value),
    `List ${JSON.stringify(list)} does not contain value: ` +
    `${JSON.stringify(value)}`
  )
}
