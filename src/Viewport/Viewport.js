import React from 'react'
import PropTypes from 'prop-types'
import ViewportOrientation from './ViewportOrientation'
import ViewportSize from './ViewportSize'
import ViewportScroll from './ViewportScroll'
import ViewportQueries from './ViewportQueries'
import ViewportContext from './ViewportContext'


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


export class Viewport extends React.Component {
  static propTypes = {
    orientation: PropTypes.number.isRequired,
    screenOrientation: PropTypes.string,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scrollX: PropTypes.number.isRequired,
    scrollY: PropTypes.number.isRequired,
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
    this.viewportContext = this.getViewportState()
    this.viewportContext.scrollTo = props.scrollTo
    this.viewportContext.inView = props.inView
    this.viewportContext.inViewX = props.inViewX
    this.viewportContext.inViewY = props.inViewY
    this.viewportContext.inFullView = props.inFullView
    this.viewportContext.inFullViewX = props.inFullViewX
    this.viewportContext.inFullViewY = props.inFullView
  }

  getViewportState () {
    return {
      width: this.props.width,
      height: this.props.height,
      scrollX: this.props.scrollX,
      scrollY: this.props.scrollY,
      orientation: this.props.orientation,
      screenOrientation: this.props.screenOrientation,
      aspect: this.props.getAspect(),
    }
  }

  render () {
    const nextContext = Object.assign({}, this.viewportContext, this.getViewportState())
    return this.props.children(nextContext)
  }
}


export default function (props) {
  return (
    <ViewportOrientation withCoords>
      {function (oProps) {
        return (
          <ViewportScroll withCoords>
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
