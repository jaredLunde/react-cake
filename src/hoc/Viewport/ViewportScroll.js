import React from 'react'
import PropTypes from 'prop-types'
import {
  cloneIfElement,
  requestAnimationFrame,
  cancelAnimationFrame
} from '../../utils'
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
<ViewportScroll>
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
  state = {
    scrollX: getScrollX(),
    scrollY: getScrollY()
  }

  _listener = null

  componentDidMount () {
    this._listener = win.addEventListener('scroll', this.setStats)
  }

  componentWillUnmount () {
    if (this._listener !== null) {
      win.removeEventListener('scroll', this.setStats)
    }

    if (this._ticking !== null) {
      cancelAnimationFrame(this._ticking)
    }
  }

  _ticking = null

  setStats = () => {
    if (this._ticking) return;

    this._ticking = requestAnimationFrame(() => {
      this.setState(
        {
          scrollX: getScrollX(),
          scrollY: getScrollY(),
        },
        () => this._ticking = null
      )
    })
  }

  render () {
    const {children, ...props} = this.props
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
        ...this.state,
        ...props
      }
    )
  }
}
