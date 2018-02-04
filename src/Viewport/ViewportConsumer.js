import React from 'react'
import Viewport from './Viewport'
import ViewportContext from './ViewportContext'


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

export default function ViewportConsumer (props) {
  return (
    <ViewportContext.Consumer>
      {function (context) {
        if (context.inFullView === null) {
          return Viewport(props)
        }
        else {
          return props.children(context)
        }
      }}
    </ViewportContext.Consumer>
  )
}
