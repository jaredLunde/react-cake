import React from 'react'
import PropTypes from 'prop-types'
import {throttle, cloneIfElement} from '../utils'


/**
<Throttle initialState={{scrollY: 0}}>
  {
    ({throttleState, scrollY}) => (
      <Scroller
        onScroll={
          ({scrollY}) => throttleState(
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
</Throttle>
*/
export default class Throttle extends React.PureComponent {
  static propTypes = {
    initialState: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = props.initialState || {}
    this.throttleState = throttle(this.setState.bind(this))
  }

  componentWillUnmount () {
    this.throttleState.cancel()
  }

  render () {
    const {children, initialState, ...props} = this.props
    const {throttleState} = this

    return cloneIfElement(children, {throttleState, ...this.state, ...props})
  }
}