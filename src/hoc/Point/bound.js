import {boundSetXY} from './setXY'
import {boundSetX} from './setX'
import {boundSetY} from './setY'
import {boundMoveXY} from './moveXY'
import {boundMoveX} from './moveX'
import {boundMoveY} from './moveY'
import {bound, callIfExists} from '../../utils'


export default ({
  result,
  x,
  y,
  minX,
  maxX,
  minY,
  maxY,
  ...props
}) => {
  const axes = []

  if ('x' in result) {
    axes.push('x')
  }

  if ('y' in result) {
    axes.push('y')
  }

  const output = {}

  for (let axis of axes) {
    const propOpt = {
      minX,
      maxX,
      minY,
      maxY,
      onBoundMinX: props.onBoundMinX,
      onBoundMaxX: props.onBoundMaxX,
      onBoundMinY: props.onBoundMinY,
      onBoundMaxY: props.onBoundMaxY
    }

    const cbOpt = {
      [axis]: result[axis],
      minX,
      maxX,
      minY,
      maxY,
      set: (X, Y) => boundSetXY(X, Y)({x, y}, propOpt),
      setX: X => boundSetX(X)({x}, propOpt),
      setY: Y => boundSetY(Y)({y}, propOpt),
      move: (X, Y) => boundMoveXY(X, Y)({x, y}, propOpt),
      moveX: X => boundMoveX(X)({x, y}, propOpt),
      moveY: Y => boundMoveY(Y)({x, y}, propOpt),
    }

    const upperAxis = axis.toUpperCase()

    output[axis] = bound({
      value: result[axis],
      lower: propOpt[`min${upperAxis}`],
      upper: propOpt[`max${upperAxis}`],
      outOfUpper: () => callIfExists(props[`onBoundMax${upperAxis}`], cbOpt),
      outOfLower: () => callIfExists(props[`onBoundMin${upperAxis}`], cbOpt),
      inBounds: () => result[axis]
    })

    if (output[axis] === void 0 || output[axis] === null) {
      delete output[axis]
    }
  }

  return output
}
