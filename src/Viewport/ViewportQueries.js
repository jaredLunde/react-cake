import React from 'react'
import {win} from './statics'
import rect from '../Rect/utils/rect'
import {getViewportSize} from './ViewportSize'


export const getViewportRect = () => {
  const {width, height} = getViewportSize()
  return {
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    width,
    height
  }
}

export const aspect = el => {
  el = el === win ? getViewportRect() : rect(el)
  if (el === void 0) return;
  return el.width / el.height
}

const _rects = (el, container, leeway) => ([
  rect(el, leeway),
  container === win ? getViewportRect() : rect(container)
])

export const inViewX = (el, container, leeway) => {
  const [r, c] = _rects(el, container, leeway)
  return r !== void 0 && r.right > 0 && r.left < c.width
}

export const inViewY = (el, container, leeway) => {
  const [r, c] = _rects(el, container, leeway)
  return r !== void 0 && r.bottom > 0 && r.top < c.height
}

export const inView = (el, container, leeway) => {
  const [r, c] = _rects(el, container, leeway)
  return r !== void 0 &&
         r.bottom > 0 &&
         r.top < c.height &&
         r.right > 0 &&
         r.left < c.width
}

export const inFullViewX = (el, container, leeway) => {
  const [r, c] = _rects(el, container, leeway)
  if (r === void 0 || c === void 0) return false;

  return c.width - r.width >= 0 &&
         r.left >= c.left &&
         r.right <= c.right
}

export const inFullViewY = (el, container, leeway) => {
  const [r, c] = _rects(el, container, leeway)
  if (r === void 0 || c === void 0) return false;

  return c.height - r.height >= 0 &&
         r.top >= c.top &&
         r.bottom <= c.bottom
}

export const inFullView = (el, container, leeway) => {
  const [r, c] = _rects(el, container, leeway)
  if (r === void 0 || c === void 0) return false;

  return c.width - r.width >= 0 &&
         c.height - r.height >= 0 &&
         r.left >= c.left &&
         r.right <= c.right &&
         r.top >= c.top &&
         r.bottom <= c.bottom
}


export const inViewportX = (el, leeway) => inViewX(el, win, leeway)
export const inViewportY = (el, leeway) => inViewY(el, win, leeway)
export const inViewport = (el, leeway) => inView(el, win, leeway)
export const inFullViewViewportX = (el, leeway) => inFullViewX(el, win, leeway)
export const inFullViewViewportY = (el, leeway) => inFullViewY(el, win, leeway)
export const inFullViewViewport = (el, leeway) => inFullView(el, win, leeway)
export const getAspect = () => aspect(win)


export default function (originalProps) {
  const props = Object.assign({}, originalProps)
  delete props.children
  props.getAspect = getAspect
  props.inViewportX = inViewportX
  props.inViewportY = inViewportY
  props.inViewport = inViewport
  props.inFullViewX = inFullViewViewportX
  props.inFullViewY = inFullViewViewportY
  props.inFullView = inFullViewViewport
  return originalProps.children(props)
}
