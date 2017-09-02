import React from 'react'
import Viewport from './Viewport'
import contextTypes from './contextTypes'
import {withContextFrom, cloneIfElement, reduceProps} from '../../utils'


/**
const ViewportContext = () => (
  <WithViewport>
    {
      ({inFullView}) => (
        <div>
          header fully in view?
          {JSON.stringify(inFullView(document.getElementById('main-header')))}
        </div>
      )
    }
  </WithViewport>
)
**/
export const ViewportContext = withContextFrom(Viewport)


const MaybeIncludeViewport = ({inFullView, children, ...props}) =>
  inFullView === void 0
  ? (
      <Viewport {...reduceProps(props, contextTypes)}>
        {children}
      </Viewport>
    )
  : cloneIfElement(children, {inFullView, ...props})


export default ({children, ...props}) => (
  <ViewportContext {...props}>
    <MaybeIncludeViewport>
      {children}
    </MaybeIncludeViewport>
  </ViewportContext>
)
