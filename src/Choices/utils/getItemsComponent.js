import {List, OrderedSet} from 'immutable'
import {ItemSetOrdered, ItemSet, ItemList} from '../../Items'


export default function(obj) {
  return List.isList(obj)
    ? ItemList
    : OrderedSet.isOrderedSet(obj)
      ? ItemSetOrdered
      : ItemSet
}
