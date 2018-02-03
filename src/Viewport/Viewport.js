import React from 'react'
import PropTypes from 'prop-types'
import {selectProps, reduceProps} from '../utils'
import viewportContextTypes from './contextTypes'
import Subscriptions from '../Subscriptions'
import ViewportOrientation from './ViewportOrientation'
import ViewportSize from './ViewportSize'
import ViewportScroll from './ViewportScroll'
import ViewportQueries from './ViewportQueries'


/**
<Viewport>
  {
    ({
      getAspect,
      inView,
      inViewX,
      inViewY,
      inFullView,
      inFullViewX,
      inFullViewY,
      getViewportSize,
      getViewportScroll,
      subscribe,
      unsubscribe
    }) => (
      <div>
        inViewX?
        {
          JSON.stringify(
            inViewX(document.getElementById('main-header'))
          )
        }

        inViewY?
        {
          JSON.stringify(
            inViewY(document.getElementById('main-header'))
          )
        }

        inView?
        {
          JSON.stringify(
            inView(document.getElementById('main-header'))
          )
        }

        inFullView?
        {
          JSON.stringify(
            inFullView(document.getElementById('main-header'))
          )
        }

        aspect?
        {getAspect()}
      </div>
    )
  }
</Viewport>
**/

const _propsWithNotification = [
  // 'orientation',
  // 'screenOrientation',
  'viewportWidth',
  'viewportHeight',
  'scrollX',
  'scrollY',
  'scroll',
]

export class Viewport extends React.Component {
  static propTypes = {
    orientation: PropTypes.number.isRequired,
    screenOrientation: PropTypes.string,
    getViewportSize: PropTypes.func.isRequired,
    getViewportScroll: PropTypes.func.isRequired,
    scrollTo: PropTypes.func.isRequired,
    inViewX: PropTypes.func.isRequired,
    inViewY: PropTypes.func.isRequired,
    inView: PropTypes.func.isRequired,
    inFullViewX: PropTypes.func.isRequired,
    inFullViewY: PropTypes.func.isRequired,
    inFullView: PropTypes.func.isRequired,
    getAspect: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    subscriptions: PropTypes.instanceOf(Set).isRequired,
  }

  static childContextTypes = viewportContextTypes

  getChildContext () {
    return {
      getAspect: this.props.getAspect,
      inView: this.props.inView,
      inViewX: this.props.inViewX,
      inViewY: this.props.inViewY,
      inFullView: this.props.inFullView,
      inFullViewX: this.props.inFullViewX,
      inFullViewY: this.props.inFullViewY,
      getViewportSize: this.props.getViewportSize,
      getViewportScroll: this.props.getViewportScroll,
      subscribe: this.props.subscribe,
      unsubscribe: this.props.unsubscribe
    }
  }

  componentDidUpdate (prevProps) {
    const {notify} = this.props
    notify(selectProps(this.props, _propsWithNotification))
  }

  render () {
    const props = reduceProps(
      this.props,
      [
        'children',
        'subscriptions',
        'notify',
        'scrollX',
        'scrollY'
      ]
    )

    return this.props.children(props)
  }
}


export default function (props) {
  return (
    <Subscriptions>
      {function (sProps) {
        return (
          <ViewportOrientation withCoords={props.withCoords}>
            {function (oProps) {
              return (
                <ViewportScroll withCoords={props.withCoords}>
                  {function (scProps) {
                    return React.createElement(
                      Viewport,
                      Object.assign(sProps, oProps, scProps, props)
                    )
                  }}
                </ViewportScroll>
              )
            }}
          </ViewportOrientation>
        )
      }}
    </Subscriptions>
  )
}
