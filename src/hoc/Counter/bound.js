import {boundIncr} from './incr'
import {boundDecr} from './decr'
import {bound, callIfExists} from '../../utils'


export default ({
  result,
  step,
  maxValue,
  minValue,
  onBoundMax,
  onBoundMin,
  propName,
  cast
}) => {
  const stateOpt = {
    [propName]: result[propName],
    step: 0
  }

  const propOpt = {
    maxValue,
    minValue,
    onBoundMax,
    onBoundMin,
    propName
  }

  const _whichStep = amt => ({
    ...stateOpt,
    step: amt === null || amt === void 0 ? step : amt
  })

  const cbOpt = {
    [propName]: result[propName],
    step,
    minValue,
    maxValue,
    setValue: value => boundIncr({...stateOpt, [propName]: value}, propOpt),
    incr: step => boundIncr(_whichStep(step), propOpt),
    decr: step => boundDecr(_whichStep(step), propOpt)
  }

  return bound({
    value: result[propName],
    lower: minValue,
    upper: maxValue,
    outOfUpper: () => callIfExists(onBoundMax, cbOpt),
    outOfLower: () => callIfExists(onBoundMin, cbOpt),
    inBounds: () => result,
    cast
  })
}
