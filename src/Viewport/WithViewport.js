import React from 'react'
import Viewport, {Viewport as RawViewport} from './Viewport'
import ViewportContext, {contextTypes} from './ViewportContext'
import {reduceProps} from '../utils'


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

function MaybeIncludeViewport (children, context) {
  if (context.inFullView === null) {
    return Viewport({children})
  }
  else {
    return children(context)
  }
}


export default function (props) {
  return (
    <ViewportContext>
      {function (context) {
        return MaybeIncludeViewport(props.children, context)
      }}
    </ViewportContext>
  )
}
