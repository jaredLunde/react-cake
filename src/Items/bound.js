import {boundAddItem} from './addItem'
import {boundDeleteItem} from './deleteItem'
import {bound, callIfExists} from '../utils'


export default ({
  result,
  minItems,
  maxItems,
  onBoundMin,
  onBoundMax,
  propName,
  ...otherProps
}) => {
  const cbOpt = {
    [propName]: otherProps[propName],
    addItem: (...newItems) => boundAddItem(...newItems),
    deleteItem: (...newItems) => boundDeleteItem(...newItems)
  }

  return bound({
    value: result[propName].size,
    lower: minItems,
    upper: maxItems,
    outOfLower: () => callIfExists(onBoundMin, cbOpt),
    outOfUpper: () => callIfExists(onBoundMax, cbOpt),
    inBounds: () => result
  })
}
