import bound from './bound'


const incr = ({step, ...state}, {propName}) => incrBy(
  step === void 0 || step === null ? 1 : step
)({
  [propName]: state[propName]
})

export default incr

export const incrBy = by => (state, {cast = parseInt, propName}) => ({
  [propName]: cast(state[propName]) + cast(by)
})

export const boundIncr = (state, props) => bound({
  result: incrBy(state.step)(state, props),
  ...state,
  ...props
})
