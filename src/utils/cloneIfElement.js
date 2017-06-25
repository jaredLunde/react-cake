import React from 'react'


export default (Component, props) =>
  typeof Component === 'function' ?
  React.createElement(Component, props) :
  React.cloneElement(Component, props)
