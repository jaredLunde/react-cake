import {List, OrderedSet} from 'immutable'
import {ItemSetOrdered, ItemSet, ItemList} from '../hoc'


export default obj => List.isList(obj) ? ItemList : (
  OrderedSet.isOrderedSet(obj) ? ItemSetOrdered : ItemSet
)
