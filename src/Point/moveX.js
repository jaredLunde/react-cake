import {incrBy} from '../Counter'
import bound from './bound'


const moveX = x => state => incrBy(x)(state, {propName: 'x'})

export const boundMoveX = x => (state, props) => bound({
  result: moveX(x)(state),
  ...state,
  ...props
})

export default moveX
