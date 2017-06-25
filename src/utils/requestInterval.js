import requestAnimationFrame, {cancelAnimationFrame} from './requestAnimationFrame'
/**  Copyright 2011, Joe Lambert.
 **  Free to use under the MIT license.
 **  http://www.opensource.org/licenses/mit-license.php
 **/
export const clearRequestInterval = handle => {
  cancelAnimationFrame
  ? cancelAnimationFrame(handle.value)
  : window.clearInterval(handle)
}


export default (fn, delay) => {
  if (!requestAnimationFrame) {
    return window.setInterval(fn, delay)
  }

  var start = new Date().getTime(),
      handle = new Object()

  function loop() {
    var current = new Date().getTime(),
        delta = current - start

    if(delta >= delay) {
      fn.call()
      start = new Date().getTime()
    }

    handle.value = requestAnimationFrame(loop)
  }

  handle.value = requestAnimationFrame(loop)
  return handle
}
