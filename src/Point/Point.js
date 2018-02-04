import React from 'react'
import PropTypes from 'prop-types'
import {callIfExists} from '../utils'
import {boundMoveXY} from './moveXY'
import {boundMoveX} from './moveX'
import {boundMoveY} from './moveY'
import {boundSetXY} from './setXY'
import {boundSetX} from './setX'
import {boundSetY} from './setY'


/**
<Point initialX={20} initialY={40}>
{
  ({x, y, moveXY, moveX, moveY, setXY, setX, setY}) => (
    <div className='navbar navbar--x-center likes-control m--t4'>
      <span className='type--m type--grey'>
        <strong>
          X:
        </strong>
        <span className='m--l1 m--r2'>
          {x}
        </span>
        <strong>
          Y:
        </strong>
        <span className='m--l1 m--r2'>
          {y}
        </span>
      </span>

      <button
        className='btn btn--s m--l2'
        onClick={() => moveXY(10, -10)}
      >
        Move (10, -10)
      </button>

      <button
        className='btn btn--s m--l2'
        onClick={() => setXY(30, 40)}
      >
        Set (30, 40)
      </button>
    </div>
  )
}
</Point>
*/


export default class Point extends React.Component {
  static propTypes = {
    initialX: PropTypes.number.isRequired,
    initialY: PropTypes.number.isRequired,
    minX: PropTypes.number,
    maxX: PropTypes.number,
    minY: PropTypes.number,
    maxY: PropTypes.number,
    onBoundMinX: PropTypes.func,
    onBoundMaxX: PropTypes.func,
    onBoundMinY: PropTypes.func,
    onBoundMaxY: PropTypes.func,
    onChange: PropTypes.func
  }

  static defaultProps = {
    initialX: 0,
    initialY: 0
  }

  constructor (props) {
    super(props)
    const {initialX, initialY} = props
    this.state = {x: initialX, y: initialY}
    this.pointContext = {
      setXY: this.setXY,
      setX: this.setX,
      setY: this.setY,
      moveXY: this.moveXY,
      moveX: this.moveX,
      moveY: this.moveY
    }
  }

  handleChange = () => callIfExists(this.props.onChange, this.state)
  _set (setter) {this.setState(setter, this.handleChange)}

  // Setters
  setXY = (x, y) => this._set(boundSetXY(x, y))
  setX = x => this._set(boundSetX(x))
  setY = y => this._set(boundSetY(y))

  // Distance functions
  moveXY = (x, y) => this._set(boundMoveXY(x, y))
  moveX = x => this._set(boundMoveX(x))
  moveY = y => this._set(boundMoveY(y))

  render () {
    this.pointContext.x = this.state.x
    this.pointContext.y = this.state.y
    return this.pops.children(this.pointContext)
  }
}
