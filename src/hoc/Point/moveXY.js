import {incrBy} from '../Counter'
import bound from './bound'


const moveXY = (x, y) => state => Object.assign(
  incrBy(x)(state, {propName: 'x'}),
  incrBy(y)(state, {propName: 'y'})
)

export const boundMoveXY = (x, y) => (state, props) => bound({
  result: moveXY(x, y)(state),
  ...state,
  ...props
})

export default moveXY
