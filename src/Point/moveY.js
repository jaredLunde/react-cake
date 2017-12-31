import {incrBy} from '../Counter'
import bound from './bound'


const moveY = y => state => incrBy(y)(state, {propName: 'y'})

export const boundMoveY = y => (state, props) => bound({
  result: moveY(y)(state),
  ...state,
  ...props
})

export default moveY
