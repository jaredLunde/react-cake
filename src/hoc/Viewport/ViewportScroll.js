import React from 'react'
import PropTypes from 'prop-types'
import {cloneIfElement, throttle} from '../../utils'
import {win} from './statics'
import {
  inViewportX,
  inViewportY,
  inViewport,
  inFullViewViewportX,
  inFullViewViewportY,
  inFullViewViewport
} from './ViewportQueries'


/**
<ViewportScroll withCoords={true}>
  {
    ({scrollX, scrollY, scrollTo}) => (
      <Row>
        <Col x={4}>scrollX: {scrollX}</Col>
        <Col x={4}>scrollY: {scrollY}</Col>
        <Col x={8}>
          scrollTo
          <input
            type='number'
            min={0}
            value={scrollY}
            onChange={e => scrollTo(0, e.target.value)}
          />
        </Col>
      </Row>
    )
  }
</ViewportScroll>
**/
export const getScrollX = () => win.scrollX !== void 0 ? win.scrollX : win.pageXOffset
export const getScrollY = () => win.scrollY !== void 0 ? win.scrollY : win.pageYOffset


export default class ViewportScroll extends React.PureComponent {
  static propTypes = {
    withCoords: PropTypes.bool
  }

  state = {
    scrollX: getScrollX(),
    scrollY: getScrollY()
  }

  listener = null

  constructor (props) {
    super(props)
    this.throttledSetStats = throttle(this.setStats)
  }

  componentDidMount () {
    this.listener = win.addEventListener('scroll', this.throttledSetStats)
  }

  componentWillUnmount () {
    if (this.listener !== null) {
      win.removeEventListener('scroll', this.throttledSetStats)
    }

    this.throttledSetStats.cancel()
  }

  setStats = () => {
    this.setState({scrollX: getScrollX(), scrollY: getScrollY()})
  }

  getViewportScroll = () => this.state

  render () {
    const {children, withCoords, ...props} = this.props
    const {getViewportScroll} = this
    const {scrollTo} = win

    return cloneIfElement(
      children,
      {
        scrollTo,
        inView: inViewport,
        inViewX: inViewportX,
        inViewY: inViewportY,
        inFullViewX: inFullViewViewportX,
        inFullViewY: inFullViewViewportY,
        inFullView: inFullViewViewport,
        getViewportScroll,
        ...(withCoords === true ? this.state : {}),
        ...props
      }
    )
  }
}
