/**  Copyright 2011, Joe Lambert.
 **  Free to use under the MIT license.
 **  http://www.opensource.org/licenses/mit-license.php
 **/
import requestAnimationFrame, {
  cancelAnimationFrame
} from './requestAnimationFrame'


export const clearRequestTimeout =  handle => {
  cancelAnimationFrame
  ? cancelAnimationFrame(handle.value)
  : window.clearTimeout(handle)
}


export default (fn, delay) => {
  if(!requestAnimationFrame) {
    return window.setTimeout(fn, delay)
  }

  var start = new Date().getTime(),
      handle = new Object()

  function loop() {
    var current = new Date().getTime(),
        delta = current - start

    delta >= delay
    ? fn.call() :
    handle.value = requestAnimationFrame(loop)
  }

  handle.value = requestAnimationFrame(loop)
  return handle
}
