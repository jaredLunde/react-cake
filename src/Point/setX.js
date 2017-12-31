import bound from './bound'


const setX = x => () => ({x})

export const boundSetX = (x) => (state, props) => bound({
  result: setX(x)(),
  ...state,
  ...props
})

export default setX
