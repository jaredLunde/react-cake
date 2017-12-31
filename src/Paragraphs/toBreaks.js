import React from 'react'
import limitLines from './limitLines'


const _breakRe = /(\n)/g

export default function (rawText) {
  if (!rawText) {
    return rawText
  }

  rawText = limitLines(rawText)

  return rawText.split(_breakRe).map(
    (line, key) => {
      return line.match(_breakRe) ? React.createElement('br', {key}) : line
    }
  ).filter(line => line)
}
