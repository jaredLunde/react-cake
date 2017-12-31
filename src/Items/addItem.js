import {List} from 'immutable'
import bound from './bound'


const addItem = (...newItems) => (state, {propName}) => {
  const items = state[propName]
  const hasPush = items.push !== void 0

  return {
    [propName]: items.withMutations(itemsList => {
      for (let item of newItems) {
        if (hasPush) {
          itemsList.push(item)
        } else {
          itemsList.add(item)
        }
      }
    })
  }
}

export const boundAddItem = (...newItems) => (state, props) => bound({
  result: addItem(...newItems)(state, props),
  ...state,
  ...props
})

export default addItem
