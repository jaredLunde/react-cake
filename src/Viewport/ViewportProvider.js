import React from 'react'
import Viewport from './Viewport'
import ViewportContext from './ViewportContext'



export default function (props) {
  return (
    <Viewport>
      {function (context) {
        return (
          <ViewportContext.Provider value={context}>
            {props.children}
          </ViewportContext.Provider>
        )
      }}
    </Viewport>
  )
}
