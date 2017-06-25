import React from 'react'
import PropTypes from 'prop-types'
import {setOrientation} from '../ImageStat'
import {cloneIfElement} from '../../utils'
import {win, winScreen} from './statics'
import ViewportSize, {getViewportWidth, getViewportHeight} from './ViewportSize'


/**
<ViewportOrientation>
  {
    ({viewportWidth, viewportHeight, orientation, screenOrientation}) => (
      <Row
        bg='translucentWhite'
        br='1'
        p='3'
        m='t3'
        bc='translucentLight'
      >
        <Col x={4}>viewport width: {viewportWidth}</Col>
        <Col x={4}>viewport height: {viewportHeight}</Col>
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

export const getScreenOrientation = () => supportsScreenOrientation
  ? winScreen.orientation.type
  : null

export const ViewportOrientation = ({
  children,
  viewportWidth,
  viewportHeight,
  ...props
}) => cloneIfElement(
  children,
  {
    viewportWidth,
    viewportHeight,
    ...setOrientation({width: viewportWidth, height: viewportHeight}),
    screenOrientation: getScreenOrientation(),
    ...props
  }
)


export default ({children, ...props}) => (
  <ViewportSize {...props}>
    <ViewportOrientation>
      {children}
    </ViewportOrientation>
  </ViewportSize>
)
