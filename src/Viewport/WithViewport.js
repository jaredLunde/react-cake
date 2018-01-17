import React from 'react'
import Viewport, {Viewport as RawViewport} from './Viewport'
import contextTypes from './contextTypes'
import {withContextFrom, reduceProps, compose} from '../utils'


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
  : children({inFullView, ...props})


const WithViewport = compose([ViewportContext, MaybeIncludeViewport])
export default WithViewport


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

    update = () => this.setState(this._getVw)

    render () {
      return Component({...this.state, ...this.props})
    }
  }

  return compose([WithViewport, withViewport])
}
