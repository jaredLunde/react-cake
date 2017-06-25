import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Set} from 'immutable'
import Items from './Items'


/**
// ItemSet
import {ItemSet} from 'react-cake'

const OrderedSetOfItems = props => (
  <ItemSet minItems={0} maxItems={5}>
    {
      ({items, addItem, deleteItem, setItems, clearItems, includes}) => (
        <div className='navbar navbar--x-center'>
          <span className='type--m type--grey'>
            <strong>
              Number of items:
            </strong>
            <span className='m--l1 m--r2'>
              {items.size}
            </span>
          </span>

          <form onSubmit={e => {
            e.preventDefault()
            const field = document.getElementById('item1')
            addItem(field.value)
            field.value = ''
          }}>
            <input id='item1' type='text' placeholder='Add item'/>
          </form>

          {
            items.map(item => (
              <button
                key={item}
                className={`
                  btn
                  btn--s
                  ${includes(item) ? 'includes' : ''}
                  m--l1
                `}
                onClick={() => deleteItem(item)}
              >
                Delete '{item}'
              </button>
            ))
          }

          <button className='btn btn--s btn--red m--l2' onClick={clearItems}>
            Clear items
          </button>
        </div>
      )
    }
  </ItemSet>
)
*/


export default class ItemSet extends React.PureComponent {
  static propTypes = {
    initialItems: ImmutablePropTypes.set.isRequired
  }

  static defaultProps = {
    initialItems: Set()
  }

  render () {
    return React.createElement(Items, this.props)
  }
}
