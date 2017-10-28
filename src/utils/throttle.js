import requestAnimationFrame, {cancelAnimationFrame} from './requestAnimationFrame'


export default cb => {
  let frame

  const later = (thisArg, args) => () => {
    frame = void 0
    cb.apply(thisArg, args)
  }

  const throttled = function(...args) {
    if (frame === void 0) {
      frame = requestAnimationFrame(later(this, args))
    }
  }

  throttled.cancel = () => {
    if (frame !== void 0) {
      cancelAnimationFrame(frame)
    }
  }

  return throttled
}
