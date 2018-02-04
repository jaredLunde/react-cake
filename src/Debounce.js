import React from 'react'
import PropTypes from 'prop-types'
import {debounce} from './utils'


/**
<Debounce wait={200} initialState={{scrollY: 0}}>
  {
    ({debounceState, scrollY}) => (
      <Scroller
        onScroll={
          ({scrollY}) => debounceState(
            prevState => scrollY > 30
              ? {gt30: true, scrollY}
              : {gt30: false, scrollY}
          )
        }
      >
        Greater than 30? {String(gt30)}
      </Scroller>
    )
  }
</Debounce>
*/
export default class Debounce extends React.Component {
  static propTypes = {
    initialState: PropTypes.object,
    wait: PropTypes.number.isRequired,
    immediate: PropTypes.bool
  }

  static defaultProps = {
    wait: 100
  }

  constructor (props) {
    super(props)
    this.state = props.initialState || {}
    this.debounceState = debounce(
      this._setState,
      props.wait,
      {
        'leading': props.immediate,
        'trailing': !props.immediate
      }
    )
  }

  _setState = (...args) => this.setState(...args)

  componentWillUnmount () {
    this.debounceState.cancel()
  }

  render () {
    return this.props.children(
      Object.assign({debounceState: this.debounceState}, this.state)
    )
  }
}
