import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import memoize from 'fast-memoize'
import {includesInvariant} from '../../invariants'
import boundChoices from './boundChoices'
import boundSelections from './boundSelections'
import {getItemsComponent, callIfExists, cloneIfElement} from '../../utils'
import Subscriptions from '../Subscriptions'

/**
const PetsControl = ({
  pets,
  favoritePets,
  addChoice,
  deleteChoice,
  maxSelections,
  setSelections,
  clearSelections,
  ...choicesOpt
}) => (
  <div
    className='pets-control navbar navbar--x-center'
    style={{borderWidth: 1}}
  >
    <span>
      Number of favorites: {favoritePets.size}
    </span>
    {
      pets.map(pet => (
        <Choice key={pet} value={pet}>
          {
            ({select, deselect, toggle, selected}) => (
              <button
                onClick={toggle}
                className={`
                  btn
                  btn--s
                  ${selected ? 'btn--green' : 'btn--grey'}
                `}
              >
                {pet}
              </button>
            )
          }
        </Choice>
      ))
    }
  </div>
)

const FavoritePets = props => (
  <Choices
    choicesPropName='pets'
    selectionsPropName='favoritePets'
    initialChoices={OrderedSet(['cat', 'dog', 'turtle'])}
    initialSelections={OrderedSet(['cat'])}
    minChoices={1}
    maxChoices={1}
    onBoundMinChoices={void 0}
    onBoundMaxChoices={void 0}
    minSelections={1}
    maxSelections={2}
    onBoundMinSelections={void 0}
    onBoundMaxSelections={void 0}
  >
    {PetsControl}
  </Choices>
)

*/


const _getItemsComponent = memoize(initialItems => getItemsComponent(initialItems))


export default ({choicesPropName, selectionsPropName, ...props}) => {
  choicesPropName = choicesPropName || 'choices'
  selectionsPropName = selectionsPropName || 'selections'

  return (
    <Subscriptions>
      <ChoiceItems
        choicesPropName={choicesPropName}
        selectionsPropName={selectionsPropName}
        {...props}
      />
    </Subscriptions>
  )
}


const ChoiceItems = ({
  initialChoices,
  minChoices,
  maxChoices,
  choicesPropName,
  onBoundMinChoices,
  onBoundMaxChoices,
  ...props
}) => {
  const ChoicesComponent = _getItemsComponent(initialChoices)

  return (
    <ChoicesComponent
      propName={choicesPropName}
      initialItems={initialChoices}
      minItems={minChoices}
      maxItems={maxChoices}
      onBoundMin={boundChoices(onBoundMinChoices, choicesPropName)}
      onBoundMax={boundChoices(onBoundMaxChoices, choicesPropName)}
    >
      <SelectionItems choicesPropName={choicesPropName} {...props}/>
    </ChoicesComponent>
  )
}


const SelectionItems = ({
  choicesPropName,
  selectionsPropName,
  initialSelections,
  minSelections,
  maxSelections,
  onSelect,
  onDeselect,
  onChange,
  onBoundMinSelections,
  onBoundMaxSelections,
  notify,
  subscriptions,
  ...initialProps
}) => {
  const SelectionsComponent = _getItemsComponent(initialSelections)

  let {
    addItem,
    clearItems,
    deleteItem,
    includes,
    setItems,
    ...props
  } = initialProps

  const choices = initialProps[choicesPropName]

  props.addChoicesItem = addItem
  props.deleteChoicesItem = deleteItem
  props.clearChoicesItems = clearItems
  props.setChoicesItems = setItems
  props.includesChoices = includes

  return (
    <SelectionsComponent
      propName={selectionsPropName}
      initialItems={initialSelections}
      minItems={minSelections}
      maxItems={maxSelections}
      onAdd={onSelect}
      onDelete={onDeselect}
      onChange={function (...args) {
        notify(...args)
        callIfExists(onChange, ...args)
      }}
      onBoundMin={boundSelections(onBoundMinSelections, selectionsPropName)}
      onBoundMax={boundSelections(onBoundMaxSelections, selectionsPropName)}
    >
      <ChoicesWrapper
        selectionsPropName={selectionsPropName}
        choicesPropName={choicesPropName}
        minSelections={minSelections}
        {...props}
      />
    </SelectionsComponent>
  )
}


const ChoicesWrapper = ({
  addChoicesItem,
  deleteChoicesItem,
  clearChoicesItems,
  setChoicesItems,
  includesChoices,
  addItem,
  deleteItem,
  setItems,
  clearItems,
  includes,
  ...props
}) => (
  <Choices
    select={addItem}
    deselect={deleteItem}
    setSelections={setItems}
    isSelected={includes}
    clearSelections={clearItems}

    addChoice={addChoicesItem}
    deleteChoice={deleteChoicesItem}
    setChoices={setChoicesItems}
    clearChoices={clearChoicesItems}
    isChoice={includesChoices}

    {...props}
  />
)


export class Choices extends React.PureComponent {
  static propTypes = {
    // The name of the property passed to the child component representing
    // the current choices
    choicesPropName: PropTypes.string.isRequired,
    // The name of the property passed to the child component representing
    // the current selections
    selectionsPropName: PropTypes.string.isRequired,

    addChoice: PropTypes.func.isRequired,
    deleteChoice: PropTypes.func.isRequired,
    setChoices: PropTypes.func.isRequired,
    clearChoices: PropTypes.func.isRequired,
    isChoice: PropTypes.func.isRequired,

    select: PropTypes.func.isRequired,
    deselect: PropTypes.func.isRequired,
    isSelected: PropTypes.func.isRequired,
    setSelections: PropTypes.func.isRequired,
    clearSelections: PropTypes.func.isRequired,
    minSelections: PropTypes.number.isRequired,

    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
  }

  static childContextTypes = {
    isSelected: PropTypes.func.isRequired,
    select: PropTypes.func.isRequired,
    deselect: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
    toggle: PropTypes.func.isRequired,
  }

  getChildContext () {
    const {
      isSelected,
      subscribe,
      unsubscribe
    } = this.props

    const {
      select,
      deselect,
      toggle,
    } = this

    return {
      isSelected,
      select,
      deselect,
      toggle,
      subscribe,
      unsubscribe
    }
  }

  ifChoicesInclude (items) {
    const {choicesPropName} = this.props

    for (let item of items) {
      includesInvariant(this.props[choicesPropName], item)
    }
  }

  select = (...items) => {
    this.ifChoicesInclude(items)
    return this.props.select(...items)
  }

  deselect = (...items) => {
    this.ifChoicesInclude(items)
    return this.props.deselect(...items)
  }

  toggle = item => this.props.isSelected(item) ?
                   this.deselect(item) :
                   this.select(item)

  setSelections = items => {
    this.ifChoicesInclude(items)
    return this.props.setSelections(items)
  }

  deleteChoice = (...items) => {
    const {
      isSelected,
      minSelections,
      deleteChoice,
      selectionsPropName
    } = this.props

    for (let item of items) {
      if (isSelected(item)) {
        this.deselect(item)

        if (minSelections > (this.props[selectionsPropName].size - 1)) {
          return
        }
      }
    }

    return deleteChoice(...items)
  }

  setChoices = items => {
    const {deleteChoice, setChoices, isChoice} = this.props
    const diff = items.toArray().filter(item => isChoice(item))

    if (diff.length) {
      deleteChoice(...diff)
    }

    return setChoices(items)
  }

  clearChoices = () => {
    this.clearSelections()
    return this.props.clearChoices()
  }

  render () {
    const {
      children,
      selectionsPropName,
      choicesPropName,
      subscribe,
      unsubscribe,
      select,
      deselect,
      toggle,
      setSelections,
      setChoices,
      clearChoices,
      deleteChoice,
      minSelections,
      ...props
    } = this.props

    return cloneIfElement(
      children,
      {
        select: this.select,
        deselect: this.deselect,
        toggle: this.toggle,
        setSelections: this.setSelections,
        setChoices: this.setChoices,
        clearChoices: this.clearChoices,
        deleteChoice: this.deleteChoice,
        ...props
      }
    )
  }
}
