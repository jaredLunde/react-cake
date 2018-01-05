export default function (el, leeway) {
  el = el && !el.nodeType ? el[0] : el
  if (!el || 1 !== el.nodeType) return;

  const {
    top,
    right,
    bottom,
    left,
    width,
    height
  } = el.getBoundingClientRect()

  leeway = typeof leeway === 'object'
    ? leeway
    : (
      !leeway
      ? {top: 0, right: 0, bottom: 0,  left: 0}
      : {top: leeway, right: leeway, bottom: leeway, left: leeway}
    )

  leeway.top = leeway.top || 0
  leeway.right = leeway.right || 0
  leeway.bottom = leeway.bottom || 0
  leeway.left = leeway.left || 0

  return {
    top: leeway.top + top,
    right: leeway.right + right,
    bottom: leeway.bottom + bottom,
    left: leeway.left + left,
    width: leeway.left + leeway.right + width,
    height: leeway.top + leeway.bottom + height,
  }
}
