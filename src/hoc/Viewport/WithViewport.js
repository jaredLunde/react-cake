import React from 'react'
import Viewport from './Viewport'
import contextTypes from './contextTypes'
import {withContextFrom, cloneIfElement, reduceProps, compose} from '../../utils'


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
  ? Viewport({children, ...reduceProps(props, contextTypes)})
  : cloneIfElement(children, {inFullView, ...props})


export default compose([ViewportContext, MaybeIncludeViewport])
