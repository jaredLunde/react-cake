import React from 'react'
import PropTypes from 'prop-types'
import {cloneIfElement, selectProps} from '../../utils'
import viewportContextTypes from './contextTypes'
import Subscriptions from '../Subscriptions'
import ViewportOrientation from './ViewportOrientation'
import ViewportSize from './ViewportSize'
import ViewportScroll from './ViewportScroll'
import ViewportQueries from './ViewportQueries'


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

const _propsWithNotification = [
  'orientation',
  'screenOrientation',
  'viewportWidth',
  'viewportHeight',
  'scrollX',
  'scrollY',
  'scroll',
]

export class Viewport extends React.PureComponent {
  static propTypes = {
    orientation: PropTypes.number.isRequired,
    screenOrientation: PropTypes.string,
    viewportWidth: PropTypes.number.isRequired,
    viewportHeight: PropTypes.number.isRequired,
    getViewportSize: PropTypes.func.isRequired,
    getViewportScroll: PropTypes.func.isRequired,
    scrollTo: PropTypes.func.isRequired,
    inViewX: PropTypes.func.isRequired,
    inViewY: PropTypes.func.isRequired,
    inView: PropTypes.func.isRequired,
    inFullViewX: PropTypes.func.isRequired,
    inFullViewY: PropTypes.func.isRequired,
    inFullView: PropTypes.func.isRequired,
    getAspect: PropTypes.func.isRequired,
    subscribe: PropTypes.func.isRequired,
    unsubscribe: PropTypes.func.isRequired,
    notify: PropTypes.func.isRequired,
    subscriptions: PropTypes.instanceOf(Set).isRequired,
  }

  static childContextTypes = viewportContextTypes

  getChildContext () {
    const selectedProps = selectProps(
      this.props,
      [
        'getAspect',
        'inView',
        'inViewX',
        'inViewY',
        'inFullView',
        'inFullViewX',
        'inFullViewY',
        'getViewportSize',
        'subscribe',
        'unsubscribe',
      ]
    )
    const {getViewportScroll} = this

    return {
      getViewportScroll,
      ...selectedProps
    }
  }

  componentDidUpdate (prevProps) {
    const {notify} = this.props

    for (let propName in prevProps) {
      if (
        _propsWithNotification.includes(propName) &&
        prevProps[propName] !== this.props[propName]
      ) {
        notify(selectProps(this.props, _propsWithNotification))
        break
      }
    }
  }

  getViewportScroll = () => ({x: this.props.scrollX, y: this.props.scrollY})

  render () {
    const {
      children,
      subscribe,
      unsubscribe,
      subscriptions,
      notify,
      scrollX,
      scrollY,
      ...props
    } = this.props

    return cloneIfElement(children, props)
  }
}


export default ({children, ...props}) => (
  <Subscriptions {...props}>
    <ViewportOrientation>
      <ViewportScroll withCoords={true}>
        <Viewport>
          {children}
        </Viewport>
      </ViewportScroll>
    </ViewportOrientation>
  </Subscriptions>
)
