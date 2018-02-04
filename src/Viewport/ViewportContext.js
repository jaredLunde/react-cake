import React from 'react'


export const contextTypes = {
  getAspect: null,
  inView: null,
  inViewX: null,
  inViewY: null,
  inFullView: null,
  inFullViewX: null,
  inFullViewY: null,
  getViewportSize: null,
  getViewportScroll: null
}

export default React.createContext(contextTypes)
