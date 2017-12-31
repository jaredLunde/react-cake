import bound from './bound'


const shiftItem = (state, {propName}) => ({
  [propName]: state[propName].shift()
})

export const boundShiftItem = (state, props) => bound({
  result: shiftItem(state, props),
  ...state,
  ...props
})

export default shiftItem
