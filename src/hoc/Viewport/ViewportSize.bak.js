import React from 'react'
import PropTypes from 'prop-types'
import Throttle from '../Throttle'
import {cloneIfElement} from '../../utils'
import {getAspect} from './ViewportQueries'
import {win, winScreen, docEl} from './statics'


/**
<ViewportSize>
  {
    ({viewportWidth, viewportHeight}) => (
      <Row>
        <Col x={8}>viewport width: {viewportWidth}</Col>
        <Col x={8}>viewport height: {viewportHeight}</Col>
      </Row>
    )
  }
</ViewportSize>
**/
export const getViewportHeight = () => docEl.clientHeight
export const getViewportWidth = () => docEl.clientWidth
export const getViewportSize = () => ({
  width: getViewportWidth(),
  height: getViewportHeight()
})
const getStats = () => ({
  viewportWidth: getViewportWidth(),
  viewportHeight: getViewportHeight()
})

export class ViewportSize extends React.PureComponent {
  listeners = {}

  constructor (props) {
    super(props)
    this.setStats = () => props.throttleState(getStats)
  }

  componentDidMount () {
    this.listeners = {
      resize: win.addEventListener('resize', this.setStats),
      orientationchange: win.addEventListener('orientationchange', this.setStats)
    }
  }

  componentWillUnmount () {
    for (let eventName in this.listeners)
      win.removeEventListener(eventName, this.setStats);
  }

  getViewportSize = () => ({
    viewportWidth: this.props.viewportWidth,
    viewportHeight: this.props.viewportHeight
  })

  render () {
    const {children, throttleState, ...props} = this.props
    const {getViewportSize} = this

    return cloneIfElement(children, {getAspect, getViewportSize, ...props})
  }
}


export default ({children, ...props}) => (
  <Throttle initialState={getStats()} {...props}>
    <ViewportSize>
      {children}
    </ViewportSize>
  </Throttle>
)
