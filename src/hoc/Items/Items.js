import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import {childIsFunctionInvariant, minSizeInvariant} from '../../invariants'
import {callIfExists, createOptimized} from '../../utils'
import {boundAddItem} from './addItem'
import {boundDeleteItem} from './deleteItem'


export default class Items extends React.PureComponent {
  static propTypes = {
    // The name of the property passed to the child component representing
    // the current sequence of items
    propName: PropTypes.string.isRequired,
    // The initial items in the sequence
    initialItems: PropTypes.oneOfType([
      ImmutablePropTypes.list,
      ImmutablePropTypes.set,
      ImmutablePropTypes.orderedSet
    ]).isRequired,
    // Minimum number of items to allow
    minItems: PropTypes.number,
    // Maximum number of items to allow
    maxItems: PropTypes.number,
    // Called when the number of items offered is outside the bounds of
    // minItems
    onBoundMin: PropTypes.func,
    // Called when the number of items offered is outside the bounds of
    // maxItems
    onBoundMax: PropTypes.func,
    // Called when a choice is selected or deselected
    onChange: PropTypes.func,
    // Called when an item is added to the sequence
    onAdd: PropTypes.func,
    // Called when an item is deleted from the sequence
    onDelete: PropTypes.func
  }

  static defaultProps = {
    propName: 'items'
  }

  constructor (props) {
    super(props)
    const {
      initialItems,
      propName,
      ...otherProps
    } = props

    this.state = {
      ...boundAddItem(...initialItems.toArray())(
        {
          [propName]: initialItems.clear()
        },
        {
          propName,
          ...otherProps
        }
      )
    }
  }

  get items () {
    return this.state[this.props.propName]
  }

  handleChange = () => callIfExists(this.props.onChange, this.items)

  addItem = (...items) => this.setState(
    boundAddItem(...items),
    () => {
      this.handleChange()
      callIfExists(this.props.onAdd, this.items)
    }
  )

  deleteItem = (...items) => this.setState(
    boundDeleteItem(...items),
    () => {
      this.handleChange()
      callIfExists(this.props.onDelete, this.items)
    }
  )

  clearItems = () => this.setState(
    (state, {minItems, propName}) => {
      const newState = {[propName]: state[propName].clear()}
      minSizeInvariant(newState[propName], minItems)
      return newState
    },
    this.handleChange
  )

  setItems = newItems => {
    this.setState(
      (state, {propName}) => ({
        [propName]: state[propName].clear()
      })
    )
    
    newItems = Array.isArray(newItems) ? newItems : newItems.toArray()
    this.setState(boundAddItem(...newItems), this.handleChange)
  }

  includes = value => this.state[this.props.propName].includes(value)

  render () {
    const {
      children,
      propName,
      minItems,
      maxItems,
      onBoundMin,
      onBoundMax,
      onChange,
      onAdd,
      onDelete,
      initialItems,
      ...props
    } = this.props
    const {
      addItem,
      deleteItem,
      setItems,
      clearItems,
      includes
    } = this
    props[propName] = this.state[propName]

    return createOptimized(
      children,
      {
        addItem,
        deleteItem,
        setItems,
        clearItems,
        includes,
        ...props
      }
    )
  }
}
