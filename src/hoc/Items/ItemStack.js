import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {Stack} from 'immutable'
import {callIfExists, cloneIfElement} from '../../utils'
import {boundShiftItem} from './shiftItem'
import Items from './Items'

/**
// ItemStack
import {ItemStack} from 'react-cake'

const StackOfItems = props => (
  <ItemStack minItems={0} maxItems={5}>
    {
      ({items, addItem, shiftItem, setItems, clearItems, includes}) => (
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
            addItem(document.getElementById('item1').value)
          }}>
            <input id='item1' type='text' placeholder='Add item'/>
          </form>

          {
            items.map((item, x) => (
              <span
                key={`item${x}`}
                className={`
                  btn
                  btn--s
                  ${includes(item) ? 'includes' : ''}
                  m--l1
                `}
              >
                '{item}'
              </span>
            ))
          }

          <button className='btn btn--s btn--green m--l2' onClick={shiftItem}>
            Shift item
          </button>

          <button className='btn btn--s btn--red m--l2' onClick={clearItems}>
            Clear items
          </button>
        </div>
      )
    }
  </ItemStack>
)
*/

export default class ItemStack extends Items {
  static propTypes = {
    ...Items.propTypes,
    // The initial items in the sequence
    initialItems: ImmutablePropTypes.stack.isRequired,
    // Called when an item is deleted from the sequence
    onShift: PropTypes.func
  }

  static defaultProps = {
    propName: 'items',
    initialItems: Stack()
  }

  deleteItem = void 0

  shiftItem = () => {
    const {propName} = this.props
    const items = this.state[propName]
    const first = items.first()

    this.setState(
      boundShiftItem,
      () => {
        this.handleChange()
        callIfExists(this.onShift, first, this.items)
      }
    )

    return first
  }

  render () {
    const {
      children,
      propName,
      onBoundMin,
      onBoundMax,
      onChange,
      onAdd,
      onShift,
      ...props
    } = this.props
    const {
      addItem,
      shiftItem,
      setItems,
      clearItems,
      includes
    } = this
    props[propName] = this.state[propName]

    return cloneIfElement(
      children,
      {
        addItem,
        shiftItem,
        setItems,
        clearItems,
        includes,
        ...props
      }
    )
  }
}
