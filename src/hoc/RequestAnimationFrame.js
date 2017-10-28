import React from 'react'
import PropTypes from 'prop-types'
import {requestAnimationFrame, cancelAnimationFrame, cloneIfElement} from '../utils'


/**
<RequestAnimationFrame initialState={{scrollY: 0}}>
  {
    ({requestAnimationState, scrollY, gt30}) => (
      <Scoller
        onScroll={
          ({scrollY}) => requestAnimationState(
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
</RequestAnimationFrame>
*/
export default class RequestAnimationFrame extends React.PureComponent {
  static propTypes = {
    initialState: PropTypes.object
  }

  constructor (props) {
    super(props)
    this.state = props.initialState
  }

  frame = null

  requestAnimationFrame = fn => {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame)
    }

    this.frame = requestAnimationFrame(
      () => this.setState(
        fn,
        () => this.frame = null
      )
    )
  }

  componentWillUnmount () {
    if (this.frame !== null) {
      cancelAnimationFrame(this.frame)
    }
  }

  render () {
    const {children, setter, initialState, ...props} = this.props

    return cloneIfElement(
      children,
      {
        requestAnimationState: this.requestAnimationFrame,
        ...this.state,
        ...props
      }
    )
  }
}
