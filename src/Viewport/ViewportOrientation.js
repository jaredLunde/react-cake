import React from 'react'
import PropTypes from 'prop-types'
import {setOrientation} from '../ImageStat'
import {win, winScreen} from './statics'
import ViewportSize from './ViewportSize'


/**
<ViewportOrientation>
  {
    ({width, height, aspect, orientation, screenOrientation}) => (
      <Row
        bg='translucentWhite'
        br='1'
        p='3'
        m='t3'
        bc='translucentLight'
      >
        <Col x={4}>viewport width: {width}</Col>
        <Col x={4}>viewport height: {height}</Col>
        <Col x={4}>orientation: {orientation}</Col>
        <Col x={4}>screen orientation: {screenOrientation}</Col>
      </Row>
    )
  }
</ViewportOrientation>
**/
export const supportsScreenOrientation = (
  winScreen &&
  winScreen.orientation &&
  winScreen.orientation.type
)

export default function (props) {
  const renderProps = Object.assign({}, props)
  renderProps.children = function ViewportOrientation (sProps) {
    sProps.orientation = setOrientation(sProps).orientation
    sProps.screenOrientation = (
      supportsScreenOrientation
      ? winScreen.orientation.type
      : null
    )

    return props.children(sProps)
  }

  return ViewportSize(renderProps)
}
