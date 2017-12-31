import bound from './bound'


const setXY = (x, y) => () => ({x, y})

export const boundSetXY = (x, y) => (state, props) => bound({
  result: setXY(x, y)(),
  ...state,
  ...props
})

export default setXY
