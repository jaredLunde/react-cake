import {List, Stack} from 'immutable'
import bound from './bound'
import {includesInvariant} from '../invariants'


const deleteItem = (...deletedItems) => (state, {propName}) => {
  let items = state[propName]
  const indexed = List.isList(items) || Stack.isStack(items)

  for (let item of deletedItems) {
    includesInvariant(items, item)
    items = indexed ?
            items.delete(items.indexOf(item)) :
            items.delete(item)
  }

  return {[propName]: items}
}


export const boundDeleteItem = (...newItems) => (state, props) =>
bound({
  result: deleteItem(...newItems)(state, props),
  ...state,
  ...props
})

export default deleteItem
