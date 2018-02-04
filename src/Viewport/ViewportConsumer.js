import React from 'react'
import Viewport from './Viewport'
import ViewportContext from './ViewportContext'
import {reduceProps} from '../utils'


/**
const ViewportContext = () => (
  <ViewportConsumer>
    {
      ({inFullView}) => (
        <div>
          header fully in view?
          {JSON.stringify(inFullView(document.getElementById('main-header')))}
        </div>
      )
    }
  </ViewportConsumer>
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


export default function ViewportConsumer (props) {
  return (
    <ViewportContext.Consumer>
      {function (context) {
        return MaybeIncludeViewport(props.children, context)
      }}
    </ViewportContext.Consumer>
  )
}
