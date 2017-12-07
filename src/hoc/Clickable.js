import React from 'react'
import PropTypes from 'prop-types'
import ImmutablePropTypes from 'react-immutable-proptypes'
import EventTracker from './EventTracker'
import {childIsFunctionInvariant} from '../invariants'
import {reduceProps, callIfExists, compose, createOptimized} from '../utils'


/**
const ClickableButton = props => (
  <Clickable double left>
    {
      ({
        clickableRef,
        numClicks,
        screenX,
        screenY,
        clientX,
        clientY,
        elementX,
        elementY
      }) => (
        <button ref={clickableRef} className='btn btn--m btn--grey'>
          Clicked: {numClicks} times at
          <br/>
          {`{clientX: ${clientX}, clientY: ${clientY}}`}
          <br/>
          {`{screenX: ${screenX}, screenY: ${screenY}}`}
          <br/>
          {`{elementX: ${elementX}, elementY: ${elementY}}`}
        </button>
      )
    }
  </Clickable>
)
*/


const isClickOfType = (e, types) => {
  for (let type of types) {
    const ors = type.split('|')

    if (ors.length > 1) {
      let orSatisfied = true

      for (let or of ors) {
        if (isClickOfType(e, [or]) === true) {
          orSatisfied = true
          break
        } else {
          orSatisfied = false
        }
      }

      if (orSatisfied === false) {
        return false
      }
    } else {
      const props = type.split('+')

      for (let prop of props) {
        const [propName, propValue] = prop.split('=')

        if (propValue !== void 0) {
          if (String(e[propName]) !== propValue) {
            return false
          }
        } else if (e[propName] === false) {
          return false
        }
      }
    }
  }

  return true
}


// For a click to fire it must satisfy all provided conditions
export class Clickable extends React.PureComponent {
  static propTypes = {
    clickTypes: ImmutablePropTypes.list,
    // Click Types
    single: PropTypes.bool,
    double: PropTypes.bool,
    triple: PropTypes.bool,
    left: PropTypes.bool,
    middle: PropTypes.bool,
    shift: PropTypes.bool,
    control: PropTypes.bool,
    meta: PropTypes.bool,
    alt: PropTypes.bool,
    altMeta: PropTypes.bool,
    altShift: PropTypes.bool,
    controlAlt: PropTypes.bool,
    controlShift: PropTypes.bool,
    controlMeta: PropTypes.bool,
    metaShift: PropTypes.bool,
    onClick: PropTypes.func,
    preventDefault: PropTypes.bool
  }

  // If no click types are selected, fire on all clicks
  static clickTypes = {
    single: 'detail=1',
    double: 'detail=2',
    triple: 'detail=3',
    left: 'button=0',
    middle: 'button=1',
    shift: 'shiftKey',
    control: 'ctrlKey',
    meta: 'metaKey',
    alt: 'altKey',
    altMeta: 'metaKey+altKey',
    altShift: 'altKey+shiftKey',
    controlAlt: 'ctrlKey+altKey',
    controlShift: 'ctrlKey+shiftKey',
    controlMeta: 'ctrlKey+metaKey',
    metaShift: 'metaKey+shiftKey',
    controlOrMeta: 'metaKey|ctrlKey'
  }

  state = {
    numClicks: null,
    screenX: null,
    screenY: null,
    clientX: null,
    clientY: null,
    elementX: null,
    elementY: null,
    rectX: null,
    rectY: null
  }

  _clickable = null
  _clickTypes = []

  constructor (props) {
    super(props)
    this.setupClickTypes(props)
  }

  setupClickTypes (props) {
    this._clickTypes = []
    const {clickTypes} = props

    if (clickTypes) {
      for (let type of clickTypes) {
        this._clickTypes.push(type)
      }
    }

    for (let prop in props) {
      if (prop in Clickable.clickTypes) {
        this._clickTypes.push(Clickable.clickTypes[prop])
      }
    }
  }

  clickableRef = e => {
    const clickableChanged = this._clickable !== e
    if (this._clickable !== null && clickableChanged) {
      this.props.removeAllEvents(this._clickable)
    }

    if (clickableChanged) {
      this._clickable = e
      this.props.addEvent(e, 'click', this.onClick)
    }
  }

  componentWillUpdate (nextProps) {
    this.setupClickTypes(nextProps)
  }

  onClick = e => {
    if (isClickOfType(e, this._clickTypes) === false) {
      return
    }

    const {detail, screenX, screenY, clientX, clientY} = e
    const {onClick, preventDefault} = this.props
    const {left, top} = this._clickable.getBoundingClientRect()
    const rectX = Math.floor(left)
    const rectY = Math.floor(top)

    if (preventDefault) {
      e.preventDefault()
    }

    this.setState(
      {
        numClicks: detail,
        screenX,
        screenY,
        clientX,
        clientY,
        elementX: clientX - rectX,
        elementY: clientY - rectY,
        rectX,
        rectY
      },
      () => callIfExists(this.props.onClick, this.state, e)
    )
  }

  render () {
    let {
      children,
      clickTypes,
      onClick,
      preventDefault,
      addEvent,
      removeEvent,
      removeAllEvents,
      ...props
    } = this.props
    props = reduceProps(props, Clickable.clickTypes)
    const {clickableRef} = this
    const {rectX, rectY, ...state} = this.state

    return createOptimized(
      children,
      {
        clickableRef,
        ...state,
        ...props
      }
    )
  }
}


export default compose([EventTracker, Clickable])
