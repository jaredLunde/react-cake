import React from 'react'
import PropTypes from 'prop-types'
import decr, {boundDecr} from './decr'
import incr, {boundIncr} from './incr'
import {callIfExists, createOptimized} from '../../utils'
import {childIsFunctionInvariant} from '../../invariants'


/**
const LikesControl = ({likes, incr, decr, setValue}) => (
  <div className='likes-control'>
    <span>
      Number of likes: {likes}
    </span>
    <a onClick={incr}>
      Like
    </a>
    <a onClick={decr}>
      Dislike
    </a>
  </div>
)

const Likes = props => (
  <div className='likes'>
    <Counter propName='likes' initialValue={10} initialStep={3}>
      {LikesControl}
    </Counter>
  </div>
)
*/


export default class Counter extends React.PureComponent {
  static propTypes = {
    initialValue: PropType.number.isRequired,
    initialStep: PropType.number.isRequired,
    propName: PropTypes.string.isRequired,
    minValue: PropTypes.number,
    maxValue: PropTypes.number,
    onBoundMin: PropTypes.func,
    onBoundMax: PropTypes.func,
    onChange: PropTypes.func,
    onIncr: PropTypes.func,
    onDecr: PropTypes.func,
    cast: PropTypes.func.isRequired
  }

  static defaultProps = {
    initialValue: 0,
    initialStep: 1,
    propName: 'value',
    cast: parseInt
  }

  constructor (props) {
    super(props)
    const {initialValue, initialStep, cast, propName} = this.props

    this.state = {
      [propName]: cast(initialValue),
      step: cast(initialStep)
    }
  }

  _callChange = callback => {
    const value = this.state[this.props.propName]
    callIfExists(this.props.onChange, value)
    callIfExists(callback, value)
  }

  boundWith = (bounder, by, callback) => this.setState(
    ({step, ...state}, props) => bounder(
      {...state, step: !isNaN(parseInt(by)) ? by : step},
      props
    ),
    () => this._callChange(callback)
  )

  incr = by => this.boundWith(boundIncr, by, this.props.onIncr)
  decr = by => this.boundWith(boundDecr, by, this.props.onDecr)

  setValue = value => this.setState(
    ({step}, props) => boundIncr(
      {
        [props.propName]: value,
        step: 0
      },
      props
    ),
    this._callChange
  )

  setStep = step => this.setState({step: parseInt(step)})

  render () {
    const {
      children,
      propName,
      minValue,
      maxValue,
      onBoundMin,
      onBoundMax,
      initialValue,
      initialStep,
      onChange,
      onIncr,
      onDecr,
      cast,
      ...props
    } = this.props

    return createOptimized(
      children,
      {
        incr: this.incr,
        decr: this.decr,
        setValue: this.setValue,
        setStep: this.setStep,
        ...this.state,
        ...props
      }
    )
  }
}
