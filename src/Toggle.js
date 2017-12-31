import React from 'react'
import PropTypes from 'prop-types'
import {fromJS} from 'immutable'
import {callIfExists, createOptimized} from './utils'
import {exactSizeInvariant, includesInvariant} from './invariants'


/**
const TogglerControl = ({value, on, off, toggle}) => (
  <span className='toggler'>
    <span>
      Enabled?
      <strong> {JSON.stringify(value)}</strong>
    </span>

    <button onClick={on}>
      On
    </button>

    <button onClick={off}>
      Off
    </button>

    <button onClick={toggle}>
      Toggle
    </button>
  </span>
)

const Toggler = props => (
  <Toggle initialValue={false}>
    {TogglerControl}
  </Toggle>
)
*/


export const toggle = (state, {controls, propName}) => {
  const controlValue = controls.first().get('value')
  return controlValue !== state[propName] ?
         {[propName]: controlValue}  :
         {[propName]: controls.last().get('value')}
}


export default class Toggle extends React.PureComponent {
  static propTypes = {
    propName: PropTypes.string.isRequired,
    controls: ImmutablePropTypes.listOf(ImmutablePropTypes.mapContains({
      name: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })).isRequired,
    initialValue: PropTypes.any.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    propName: 'value',
    controls: fromJS([
      {
        name: 'on',
        value: true
      },
      {
        name: 'off',
        value: false
      }
    ]),
    initialValue: true
  }

  constructor (props) {
    super(props)
    const {controls, initialValue, propName} = props

    exactSizeInvariant(controls, 2)

    this.controlValues = controls.map(control => control.get('value'))
    this.controlNames = controls.map(control => control.get('name'))

    includesInvariant(this.controlValues, initialValue)

    this.state = {[propName]: initialValue}
    this.controlNames.forEach((name, x) => this[name] = () => {
      const value = this.controlValues.get(x)

      this.setState(
        {[propName]: value},
        () => callIfExists(this.props.onChange, value)
      )
    })
  }

  componentDidUpdate ({initialValue, propName}) {
    if (this.props.initialValue !== initialValue) {
      this.setState({[propName]: this.props.initialValue})
    }
  }

  toggle = () => this.setState(toggle, () => callIfExists(
    this.props.onChange,
    this.state[this.props.propName]
  ))

  render () {
    const {
      children,
      propName,
      controls,
      initialValue,
      onChange,
      ...props
    } = this.props
    const {toggle} = this

    for (let propName of this.controlNames) {
      props[propName] = this[propName]
    }

    /** toggle, on, off, value */
    return createOptimized(
      children,
      {
        toggle,
        ...this.state,
        ...props
      }
    )
  }
}
