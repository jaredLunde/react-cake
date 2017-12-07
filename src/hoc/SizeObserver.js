import React from 'react'
import PropTypes from 'prop-types'
import {
  createOptimized,
  callIfExists,
  requestInterval,
  clearRequestInterval
} from '../utils'
import {rect} from './Rect'



/**
<SizeObserver>
  ({width, height, sizeRef, recalcSize}) => (
    <div ref={sizeRef}>
      <div>
        My width: {width}
      </div>
      <div>
        My height: {height}
      </div>
    </div>
  )
</SizeObserver>
*/
export default class SizeObserver extends React.PureComponent {
  static propTypes = {
    useBoundingRect: PropTypes.bool,
    wait: PropTypes.number.isRequired,
    onChange: PropTypes.func
  }

  static defaultProps = {
    wait: 1000/60,
  }

  state = {
    width: 0,
    height: 0
  }

  componentDidMount () {
    this.recalcListener = requestInterval(this.recalcSize, this.props.wait)
  }

  componentDidUpdate (prevProps, {width, height}) {
    if (width !== this.state.width ||height !== this.state.height) {
      callIfExists(this.props.onChange, this.state)
    }
  }

  componentWillUnmount () {
    clearRequestInterval(this.recalcListener)
  }

  recalcSize = () => this.setState(
    ({width, height}) => {
      let newWidth, newHeight

      if (this.props.useBoundingRect) {
        let rect = rect(this.element)
        newWidth = rect.width
        newHeight = rect.height
      } else {
        newWidth = this.element.offsetWidth
        newHeight = this.element.offsetHeight
      }

      if (newWidth !== width || newHeight !== height) {
        return {width: newWidth, height: newHeight}
      }

      return null
    }
  )

  element = null
  sizeRef = element =>  this.element = element

  render () {
    const {children, useBoundingRect, wait, ...props} = this.props
    const {sizeRef, recalcSize} = this
    /** width, height, sizeRef, recalcSize */
    return createOptimized(children, {sizeRef, recalcSize, ...this.state, ...props})
  }
}
