import React from 'react'
import PropTypes from 'prop-types'
import {fromJS} from 'immutable'
import Rect, {rect} from './Rect'
import Toggle from './Toggle'
import {WithViewport} from './Viewport'
import {cloneIfElement, reduceProps} from '../utils'


/**
!!! Requires top-level Viewport component !!!
<Viewport withCoords={false}>
...

  <Sticky atTop distance='500'>
    ({stick, letGo, isStuck, stickyRef}) => (
      <div>
        <div ref={stickyRef}>
          I'm Sticky!
        </div>
      </div>
    )
  </Sticky>

...
</Viewport>
*/
const Placeholder = element => {
  if (!element) return null;

  const placeholder = element.cloneNode(true)
  placeholder.style.opacity = 0

  return placeholder
}


export class Sticky extends React.PureComponent {
  static propTypes = {
    distance: PropTypes.number,
    atTop: PropTypes.bool,
    atBottom: PropTypes.bool,
    placeholder: PropTypes.func.isRequired,
    zIndex: PropTypes.number.isRequired,
  }

  static defaultProps = {
    placeholder: Placeholder,
    zIndex: 2
  }

  subscriptionCallback = null

  constructor (props) {
    super(props)
    this.subscriptionCallback = () => this.shouldComponentStick(this.props)
    props.subscribe(this.subscriptionCallback)
  }

  componentDidMount () {
    this.shouldComponentStick(this.props)
    this.injectPlaceholder(this.props)
  }

  componentDidUpdate () {
    this.injectPlaceholder(this.props)
    this.ejectPlaceholder(this.props)
  }

  componentWillUnmount () {
    this.props.unsubscribe(this.subscriptionCallback)
    this.ejectPlaceholder({isStuck: false})
  }

  parentNode = null
  element = null
  placeholderEl = null

  stickyRef = e => {
    if (e === null || e === this.element) return;

    const {rectRef, isStuck, placeholder} = this.props
    this.element = e
    this.parentNode = e.parentNode

    rectRef(e)

    if (!isStuck) {
      this.placeholderEl = placeholder(e)
    }
  }

  shouldComponentStick = ({
    getRect,
    stick,
    distance,
    isStuck,
    letGo,
    atTop,
    atBottom,
    placeholder
  }) => {
    const r = getRect()
    if (r === null) return;

    const p = atTop ? 'top' : (atBottom ? 'bottom' : 'top')

    if (
      !isStuck &&
      r[p] <= 0 &&
      (!distance || distance && Math.abs(r[p]) < distance)
    ) {
      this.placeholderEl = placeholder(this.element)
      stick()
    } else {
      const placeholderRect = this.placeholderEl && rect(this.placeholderEl)
      if (!placeholderRect) return;
      const dist = placeholderRect[p]

      if (dist > 0 || distance && Math.abs(dist) > distance) {
        letGo()
      }
    }
  }

  injectPlaceholder ({isStuck}) {
    if (!isStuck) return;

    const {placeholderEl, element, parentNode} = this

    if (parentNode.contains(placeholderEl) === false) {
      parentNode.insertBefore(placeholderEl, element)
    }
  }

  ejectPlaceholder = ({isStuck}) => {
    if (!this.placeholderEl || isStuck) return;

    if (this.parentNode.contains(this.placeholderEl)) {
      this.parentNode.removeChild(this.placeholderEl)
    }
  }

  render () {
    let {children, getRect, isStuck, style, zIndex, ...props} = this.props
    props = reduceProps(
      props,
      [
        'getAspect',
        'getViewportScroll',
        'getViewportSize',
        'inFullView',
        'inFullViewX',
        'inFullViewY',
        'inView',
        'inViewX',
        'inViewY',
        'letGo',
        'placeholder',
        'recalcOnWindowChange',
        'recalcRect',
        'rectRef',
        'stick',
        'subscribe',
        'toggle',
        'unsubscribe'
      ]
    )
    const {stickyRef} = this
    const {left, right} = getRect() || {}

    /** style, isStuck, stickyRef */
    return cloneIfElement(
      children,
      {
        isStuck,
        stickyRef,
        style: isStuck && {
          position: 'fixed',
          top: 0,
          left,
          right,
          zIndex,
          ...style
        },
        ...props
      }
    )
  }
}

const RectComponent = ({Component, sticky = false, ...props}) => (
  <Rect {...props}>
    <Toggle
      propName='isStuck'
      initialValue={sticky}
      controls={
        fromJS([{name: 'stick', value: true}, {name: 'letGo', value: false}])
      }
    >
      <Sticky>
        {Component}
      </Sticky>
    </Toggle>
  </Rect>
)

export default ({children, ...props}) => (
  <WithViewport Component={children} {...props}>
    <RectComponent/>
  </WithViewport>
)
