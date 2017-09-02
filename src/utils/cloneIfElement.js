import React from 'react'


export default (Component, props) =>
  typeof Component === 'string'
  ? Component
  : !React.isValidElement(Component)
    ? React.createElement(Component, props)
    : React.cloneElement(Component, props)
