import React from 'react'
import PropTypes from 'prop-types'
import callIfExists from './utils/callIfExists'
import reduceProps from './utils/reduceProps'
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


const propTypes = {
  children: PropTypes.func.isRequired,
  propName: PropTypes.string.isRequired,
  controls: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.any.isRequired,
  })).isRequired,
  initialValue: PropTypes.any.isRequired,
  onChange: PropTypes.func
}


export default class Toggle extends React.Component {
  static propTypes = propTypes

  static defaultProps = {
    propName: 'value',
    controls: defaultControls,
    initialValue: true
  }

  constructor (props) {
    super(props)
    const {controls, initialValue, propName} = props

    if (typeof process !== void 0 && process.env.NODE_ENV !== 'production') {
      exactLengthInvariant(controls, 2)
    }

    this.controlValues = controls.map(control => control.value)
    this.controlNames = controls.map(control => control.name)

    if (typeof process !== void 0 && process.env.NODE_ENV !== 'production') {
      includesInvariant(this.controlValues, initialValue)
    }

    this.state = {[propName]: initialValue}
    this.controlNames.forEach(
      (name, x) => this[name] = () => {
        this.setState({[propName]: this.controlValues[x]})
      }
    )
  }

  componentDidUpdate ({initialValue, propName}, prevState) {
    if (this.props.initialValue !== initialValue) {
      this.setState({[propName]: this.props.initialValue})
    }

    if (this.state[propName] !== prevState[propName]) {
      callIfExists(this.props.onChange, this.state[propName])
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
    const props = reduceProps(this.props, propTypes)

    props[this.controlNames[0]] = this[this.controlNames[0]]
    props[this.controlNames[1]] = this[this.controlNames[1]]
    props[this.props.propName] = this.state[this.props.propName]
    props.toggle = this.toggle

    /** toggle, on, off, value */
    return this.props.children(props)
  }
}
