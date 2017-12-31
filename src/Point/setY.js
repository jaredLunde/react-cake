import bound from './bound'


const setY = y => () => ({y})

export const boundSetY = (y) => (state, props) => bound({
  result: setY(y)(),
  ...state,
  ...props
})

export default setY
