import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import Toggle from './Toggle'
import {childIsFunctionInvariant} from '../invariants'
import {
  reduceProps,
  callIfExists,
  toKebabCase,
  cloneIfElement,
  compose
} from '../utils'


/**
const WillChangeButton = ({
  iAmHovering,
  hoverableRef,
  willChangeRef,
  willChange,
  style
}) => (
  <button
    ref={e => {hoverableRef(e); willChangeRef(e)}}
    className={`
      btn
      ${iAmHovering ? 'btn--m' : 'btn--s'}
    `}
    style={
      Object.assign(
        style,
        {
          transition: 'padding 0.16s ease-out, font-size 0.16s ease-out'
        }
      )
    }
  >
    Hovering? {JSON.stringify(iAmHovering)}
  </button>
)

const HoverableWillChangeButton = props => (
  <Hoverable propName='iAmHovering' enterDelay={300} leaveDelay={100}>
    <WillChange padding fontSize contents whenHovered>
      <WillChangeButton/>
    </WillChange>
  </Hoverable>
)
*/


const defaultProperties = [
  'scrollPosition',
  'contents',
  'transform',
  'opacity',
  'contents',
  'width',
  'height',
  'top',
  'right',
  'bottom',
  'left',
  'zIndex',
  'background',
  'backgroundColor',
  'backgroundPosition',
  'backgroundSize',
  'boxShadow',
  'margin',
  'padding',
  'fontWeight',
  'fontSize',
  'textShadow',
  'color',
  'visibility',
  'all'
]


const defaultEventTypes = {
  whenTouched: 'touchstart',
  whenTouchEnds: 'touchend',
  whenTouchMoves: 'touchmove',
  whenMouseMoves: 'mousemove',
  whenClicked: 'mousedown',
  whenHovered: 'mouseenter',
  whenMouseEnters: 'mouseenter',
  whenMouseLeaves: 'mouseleave',
  whenScrolled: 'scroll',
  whenResized: 'resize',
  whenFocused: 'focus',
  whenBlurred: 'blur',
  whenDragged: 'dragstart',
  whenDropped: 'drop',
}


// For a click to fire it must satisfy all provided conditions
export class WillChange extends React.PureComponent {
  static propTypes = {
    propName: PropTypes.string.isRequired,
    properties: ImmutablePropTypes.list,
    eventTypes: ImmutablePropTypes.list,
    // Properties
    scrollPosition: PropTypes.bool,
    contents: PropTypes.bool,
    transform: PropTypes.bool,
    opacity: PropTypes.bool,
    contents: PropTypes.bool,
    width: PropTypes.bool,
    height: PropTypes.bool,
    top: PropTypes.bool,
    right: PropTypes.bool,
    bottom: PropTypes.bool,
    left: PropTypes.bool,
    zIndex: PropTypes.bool,
    background: PropTypes.bool,
    backgroundColor: PropTypes.bool,
    backgroundPosition: PropTypes.bool,
    backgroundSize: PropTypes.bool,
    boxShadow: PropTypes.bool,
    margin: PropTypes.bool,
    padding: PropTypes.bool,
    fontWeight: PropTypes.bool,
    fontSize: PropTypes.bool,
    textShadow: PropTypes.bool,
    color: PropTypes.bool,
    visibility: PropTypes.bool,
    all: PropTypes.bool,
    // Event types
    whenTouched: PropTypes.bool,
    whenTouchMoves: PropTypes.bool,
    whenMouseMoves: PropTypes.bool,
    whenClicked: PropTypes.bool,
    whenHovered: PropTypes.bool,
    whenMouseEnters: PropTypes.bool,
    whenMouseLeaves: PropTypes.bool,
    whenScrolled: PropTypes.bool,
    whenResized: PropTypes.bool,
    whenFocused: PropTypes.bool,
    whenBlurred: PropTypes.bool,
    whenDragged: PropTypes.bool,
    whenDropped: PropTypes.bool,
    staleTimeout: PropTypes.number,
    // From Toggle
    on: PropTypes.func,
    off: PropTypes.func,
    toggle: PropTypes.func
  }

  static defaultProps = {
    propName: 'willChangeIsOn',
    staleTimeout: 1000
  }

  _willChange = null
  _changeHints = []
  _changeEvents = []
  _staleTimeout = null
  _started = false

  constructor (props) {
    super(props)
    this.setupHints(props)
  }

  _willChange = []

  willChangeRef = e => {
    if (e !== null && this._willChange.includes(e) === false) {
      this._willChange.push(e)
      this.addChangeListener(e)

      for (let eventType of this._changeEvents) {
        this.addChangeListener(e, eventType)
      }

      e.addEventListener('animationstart', () => this._started = true)
      e.addEventListener('transitionstart', () => this._started = true)
      e.addEventListener('animationend', this.off)
      e.addEventListener('transitionend', this.off)
    }
  }

  addChangeListener (el, type) {
    el.addEventListener(type, this.on)
  }

  removeChangeListener (el, type) {
    if (el !== null) {
      el.removeEventListener(type, this.on)
    }
  }

  removeAllListeners () {
    for (let ref of this._willChange) {
      for (let eventType of this._changeEvents) {
        this.removeChangeListener(ref, eventType)
      }

      ref.removeEventListener('animationend', this.off)
      ref.removeEventListener('transitionend', this.off)
    }
  }

  setupHints (props) {
    this._changeEvents = []
    this._changeHints = []

    for (let prop in props) {
      if (defaultEventTypes.hasOwnProperty(prop)) {
        this._changeEvents.push(defaultEventTypes[prop])
      }

      const propertyIndex = defaultProperties.indexOf(prop)

      if (propertyIndex > -1){
        this._changeHints.push(toKebabCase(defaultProperties[propertyIndex]))
      }
    }

    if (this._changeHints.length === 0) {
      this._changeHints.push('all')
    }
  }

  componentWillUpdate (nextProps) {
    this.setupHints(nextProps)
  }

  componentWillUnmount () {
    this.clearStaleTimeout()
    this.removeAllListeners()
  }

  willChange = () => this.on(true)

  on = forceStart => {
    const {on, staleTimeout, propName} = this.props
    const isOn = this.props[propName]
    if (isOn) return;

    on()

    if (forceStart) {
      this._started = true
    }

    if (staleTimeout) {
      this._staleTimeout = setTimeout(() => this.off(true), staleTimeout)
    }
  }

  off = (stale = false) => {
    if (!stale || stale && this._started) {
      this.props.off()
      this.clearStaleTimeout()
      this._started = false
    }
  }

  clearStaleTimeout () {
    if (this._staleTimeout !== null) {
      clearTimeout(this._staleTimeout)
      this._staleTimeout = null
    }
  }

  render () {
    let {
      children,
      propName,
      style,
      properties,
      eventTypes,
      on,
      off,
      toggle,
      staleTimeout,
      ...props
    } = this.props

    props = reduceProps(props, defaultProperties, defaultEventTypes)
    const {willChangeRef, willChange} = this

    style = Object.assign(
      style || {},
      this.props[propName] === true ?
        ({willChange: this._changeHints.join(',')}) :
        {}
    )

    /** willChangeRef, willChange, style */
    return cloneIfElement(
      children,
      {
        ...props,
        willChangeRef,
        willChange,
        style
      }
    )
  }
}


const composedWillChange = compose([Toggle, WillChange])

export default props => composedWillChange({
  initialValue: false,
  propName: 'willChangeIsOn',
  ...props
})
