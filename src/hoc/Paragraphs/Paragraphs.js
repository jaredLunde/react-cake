import React from 'react'
import toParagraphs from './toParagraphs'
import {createOptimized} from '../../utils'

export default ({children, text, ...props}) => {
  if (!children) {
    return children
  }

  const paragraphs = toParagraphs(text, props)

  return createOptimized(children, {paragraphs})
}
