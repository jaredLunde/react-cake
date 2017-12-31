import memoize from 'fast-memoize'
import {callIfExists} from '../utils'


export default memoize(
  (cb, propName) => ({addItem, deleteItem, ...state}) => callIfExists(
    cb,
    {
      [propName]: state[propName],
      addChoice: addItem,
      deleteChoice: deleteItem
    }
  )
)