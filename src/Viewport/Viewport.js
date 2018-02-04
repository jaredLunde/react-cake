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

export default function Viewport (props) {
  return (
    <ViewportOrientation withCoords>
      {function (oProps) {
        return (
          <ViewportScroll withCoords>
            {function (scProps) {
              const renderProps = Object.assign({}, oProps, scProps, props)
              delete renderProps.children

              return props.children(renderProps)
            }}
          </ViewportScroll>
        )
      }}
    </ViewportOrientation>
  )
}


Viewport.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  aspect: PropTypes.number.isRequired,
  orientation: PropTypes.number.isRequired,
  screenOrientation: PropTypes.string,
  scrollX: PropTypes.number.isRequired,
  scrollY: PropTypes.number.isRequired,
  scrollTo: PropTypes.func.isRequired,
  inViewX: PropTypes.func.isRequired,
  inViewY: PropTypes.func.isRequired,
  inView: PropTypes.func.isRequired,
  inFullViewX: PropTypes.func.isRequired,
  inFullViewY: PropTypes.func.isRequired,
  inFullView: PropTypes.func.isRequired,
}
