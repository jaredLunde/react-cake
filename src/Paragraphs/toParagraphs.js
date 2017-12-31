import React from 'react'
import {childIsStringInvariant} from '../invariants'
import limitLines from './limitLines'
import toBreaks from './toBreaks'


const _pRe = /(\n{2})/g

export default function (children, props) {
  if (!children) {
    return children
  }

  childIsStringInvariant(children)
  props = props === void(0) || props === null ? {} : props

  return limitLines(children).split(_pRe).map((line, x)=> {
    if (!line.match(_pRe)) {
      props.key = x
      line = toBreaks(line)

      if (line.length) {
        return React.createElement('p', props, line)
      }
    }
  })
}
