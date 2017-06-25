import callIfExists from './callIfExists'


export default ({
  value,
  lower,
  upper,
  outOfUpper,
  outOfLower,
  inBounds
}) => {
  value = parseInt(value)
  lower = parseInt(lower)
  upper = parseInt(upper)
  inBounds = inBounds || (() => {})

  if (isNaN(value)) {
    return inBounds()
  }

  if (!isNaN(upper) && value > upper) {
    // Out of upper boundary
    return callIfExists(outOfUpper)
  } else if (!isNaN(lower) && value < lower) {
    // Out of lower boundary
    return callIfExists(outOfLower)
  }

  return inBounds()
}
