import React from 'react'
import toParagraphs from './toParagraphs'
import {cloneIfElement} from '../../utils'

export default ({children, text, ...props}) => {
  if (!children) {
    return children
  }

  const paragraphs = toParagraphs(text, props)

  return cloneIfElement(children, {paragraphs})
}
