import React from 'react'
import PropTypes from 'prop-types'
import {Choices} from './Choices'
import WithChoices from './WithChoices'
import {createOptimized, reduceProps} from '../../utils'


class Choice extends React.PureComponent {
  static propTypes = {
    value: PropTypes.any.isRequired,
    ...Choices.childContextTypes
  }

  constructor (props) {
    super(props)
    const {subscribe, value, isSelected} = props
    subscribe(this.setSelected)
    this.state = {isSelected: isSelected(value)}
  }

  componentWillUnmount () {
    this.props.unsubscribe(this.setSelected)
  }

  setSelected = () => this.setState({
    isSelected: this.props.isSelected(this.props.value)
  })

  select = () => this.props.select(this.props.value)
  deselect = () => this.props.deselect(this.props.value)
  toggle = () => this.props.toggle(this.props.value)

  render () {
    let {children, value, ...props} = this.props
    props = reduceProps(props, Choices.childContextTypes)
    const {select, deselect, toggle} = this
    const {isSelected} = this.state
    
    return createOptimized(
      children,
      {
        value,
        select,
        deselect,
        toggle,
        isSelected,
        ...props
      }
    )
  }
}


export default ({children, ...props}) => (
  <WithChoices>
    <Choice {...props}>
      {children}
    </Choice>
  </WithChoices>
)
