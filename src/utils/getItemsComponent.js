import {List, OrderedSet} from 'immutable'
import {ItemSetOrdered, ItemSet, ItemList} from '../hoc'


export default function(obj) {
  return List.isList(obj)
    ? ItemList
    : OrderedSet.isOrderedSet(obj)
      ? ItemSetOrdered
      : ItemSet
}
