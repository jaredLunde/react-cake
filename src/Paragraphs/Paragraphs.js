import React from 'react'
import toParagraphs from './toParagraphs'
import {createOptimized} from '../utils'

export default function ({children, text, ...props}) {
  if (!children) {
    return children
  }

  const paragraphs = toParagraphs(text, props)
  return children({paragraphs})
}
