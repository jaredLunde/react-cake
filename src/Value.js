import React from 'react'
import PropTypes from 'prop-types'


export default class Value extends React.Component {
  static propTypes = {
    propName: PropTypes.string.isRequired,
    initialValue: PropTypes.any
  }

  static defaultProps = {
    propName: 'value'
  }

  constructor (props) {
    super(props)
    const {initialValue, propName} = props
    this.state = {[propName]: initialValue}
  }

  setValue = value => this.setState({[this.props.propName]: value})
  resetValue = () => this.setState({[this.props.propName]: this.props.initialValue})
  clearValue = () => this.setState({
    [this.props.propName]: (
      value &&
      value.clear && typeof
      value.clear === 'function'
      ? value.clear()
      : void 0
    )
  })

  render () {
    /** value, setValue, resetValue, clearValue */
    return this.props.children({
      setValue: this.setValue,
      resetValue: this.resetValue,
      clearValue: this.clearValue,
      ...this.state
    })
  }
}
