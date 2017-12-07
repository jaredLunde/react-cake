export default function (e) {
  if (!e) return {}

  let computedStyle

  if (e.currentStyle !== void 0) {
    return e.currentStyle
  } else {
    return document.defaultView.getComputedStyle(e, null)
  }
}
