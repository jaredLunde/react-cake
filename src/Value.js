import React from 'react'
import PropTypes from 'prop-types'
import {createOptimized} from './utils'


const promiseToSetState = (this_, state) => new Promise(
  resolve => this_.setState(state, resolve)
)


export default class Value extends React.PureComponent {
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

  setValue = value => promiseToSetState(this, {[this.props.propName]: value})

  resetValue = () => promiseToSetState(
    this,
    {
      [this.props.propName]: this.props.initialValue
    }
  )

  clearValue = () => promiseToSetState(
    this,
    {
      [this.props.propName]: (
        value &&
        value.clear && typeof
        value.clear === 'function'
        ? value.clear()
        : void 0
      )
    }
  )

  render () {
    const {setValue, resetValue, clearValue} = this
    const {children, propName, ...props} = this.props

    /** value, setValue, resetValue, clearValue */
    return children({
      setValue,
      resetValue,
      clearValue,
      ...props,
      ...this.state
    })
  }
}
