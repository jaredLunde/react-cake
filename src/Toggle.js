import React from 'react'
import PropTypes from 'prop-types'
import callIfExists from './utils/callIfExists'
// import createOptimized from './utils/createOptimized'
import {exactLengthInvariant, includesInvariant} from './invariants'


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


const defaultControls = [
  {
    name: 'on',
    value: true
  },
  {
    name: 'off',
    value: false
  }
]


export const toggle = (state, {controls, propName}) => {
  const controlValue = controls[0].value
  return (
    controlValue !== state[propName]
    ? {[propName]: controlValue}
    : {[propName]: controls[controls.length - 1].value}
  )
}


export default class Toggle extends React.Component {
  static propTypes = {
    propName: PropTypes.string.isRequired,
    controls: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.any.isRequired,
    })).isRequired,
    initialValue: PropTypes.any.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    propName: 'value',
    controls: defaultControls,
    initialValue: true
  }

  constructor (props) {
    super(props)
    const {controls, initialValue, propName} = props

    exactLengthInvariant(controls, 2)

    this.controlValues = controls.map(control => control.value)
    this.controlNames = controls.map(control => control.name)

    includesInvariant(this.controlValues, initialValue)

    this.state = {[propName]: initialValue}
    this.controlNames.forEach((name, x) => this[name] = () => {
      const value = this.controlValues[x]

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

  toggle = () => this.setState(
    toggle,
    () => callIfExists(
      this.props.onChange,
      this.state[this.props.propName]
    )
  )

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
    return children({
      toggle,
      ...this.state,
      ...props
    })
  }
}
