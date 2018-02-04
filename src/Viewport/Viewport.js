import React from 'react'
import PropTypes from 'prop-types'
import {selectProps, reduceProps} from '../utils'
import ViewportOrientation from './ViewportOrientation'
import ViewportSize from './ViewportSize'
import ViewportScroll from './ViewportScroll'
import ViewportQueries from './ViewportQueries'
import ViewportProvider from './ViewportProvider'


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
    getAspect: PropTypes.func.isRequired
  }

  constructor (props) {
    super(props)
    this.viewportContext = {
      getOrientation: () => ({
        orientation: props.orientation,
        screenOrientation: props.screenOrientation
      }),
      scrollTo: props.scrollTo,
      getAspect: props.getAspect,
      inView: props.inView,
      inViewX: props.inViewX,
      inViewY: props.inViewY,
      inFullView: props.inFullView,
      inFullViewX: props.inFullViewX,
      inFullViewY: props.inFullViewY,
      getViewportSize: props.getViewportSize,
      getViewportScroll: props.getViewportScroll
    }
  }

  render () {
    const props = {...this.props}
    delete props.children

    return (
      <ViewportProvider value={this.viewportContext}>
        {this.props.children(this.viewportContext)}
      </ViewportProvider>
    )
  }
}


export default function (props) {
  return (
    <ViewportOrientation withCoords={props.withCoords}>
      {function (oProps) {
        return (
          <ViewportScroll withCoords={props.withCoords}>
            {function (scProps) {
              return React.createElement(
                Viewport,
                Object.assign(oProps, scProps, props)
              )
            }}
          </ViewportScroll>
        )
      }}
    </ViewportOrientation>
  )
}
