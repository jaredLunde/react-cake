import React from 'react'
import toParagraphs from './toParagraphs'


export default function (props) {
  return props.children({paragraphs: toParagraphs(props.text, props)})
}
