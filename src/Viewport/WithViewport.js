import React from 'react'
import Viewport, {Viewport as RawViewport} from './Viewport'
import contextTypes from './contextTypes'
import {withContextFrom, reduceProps} from '../utils'


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


function MaybeIncludeViewport (props) {
  if (props.inFullView === void 0) {
    return Viewport(reduceProps(props, contextTypes))
  }
  else {
    const renderProps = {...props}
    delete renderProps.children
    return props.children(renderProps)
  }
}


export default function (props) {
  return (
    <ViewportContext>
      {function (cProps) {
        return MaybeIncludeViewport({...cProps, ...props})
      }}
    </ViewportContext>
  )
}


export function withViewport (Component) {
  class withViewport extends React.PureComponent {
    constructor (props) {
      super(props)
      props.subscribe(this.update)
      this.state = this._getVw()
    }

    componentWillUnmount () {
      this.props.unsubscribe(this.update)
    }

    _getVw = () => {
      const {width, height} = this.props.getViewportSize()
      return {viewportWidth: width, viewportHeight: height}
    }

    update = () => this.setState(this._getVw())

    render () {
      return Component({...this.state, ...this.props})
    }
  }

  return function (props) {
    return (
      <WithViewport>
        {function (vpProps) {
          return React.createElement(withViewport, {...props, ...vpProps})
        }}
      </WithViewport>
    )
  }
}
