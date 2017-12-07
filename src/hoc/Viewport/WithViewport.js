import React from 'react'
import Viewport, {Viewport as RawViewport} from './Viewport'
import contextTypes from './contextTypes'
import {withContextFrom, createOptimized, reduceProps, compose} from '../../utils'


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
export const ViewportContext = withContextFrom(RawViewport)


const MaybeIncludeViewport = ({inFullView, children, ...props}) =>
  inFullView === void 0
  ? Viewport({children, ...reduceProps(props, contextTypes)})
  : createOptimized(children, {inFullView, ...props})


export default compose([ViewportContext, MaybeIncludeViewport])
