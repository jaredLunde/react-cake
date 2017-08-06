import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import {cloneIfElement, callIfExists, getUniqueID} from '../utils'


/**
<WithInject>
  {
    ({injectRef}) => (
      <Inject entry={() => document.getElementById('root')} ref={injectRef}>
        <div>Inject me</div>
      </Inject>
    )
  }
</WithInject>
*/
export default class Inject extends React.PureComponent {
  static propTypes = {
    entry: PropTypes.func.isRequired
  }

  static defaultProps = {
    entry: () => document.getElementById('injections')
  }

  setRef = e => this.element = e
  element = null

  injectElement (id) {
    if (this.element !== null) {
      return
    }

    this.element = document.createElement('div')
    this.element.setAttribute('id', `inject__${id}`)

    this.props.entry().appendChild(this.element)
  }

  inject (id) {
    const {children, entry, subscribe} = this.props
    this.injectElement(id)
    ReactDOM.render(
      cloneIfElement(children, this.state),
      this.element
    )
  }

  eject = () => {
    if (this.element) {
      ReactDOM.unmountComponentAtNode(this.element)
      this.props.entry().removeChild(this.element)
      this.element = null
    }
  }

  id = null

  componentDidMount () {
    this.id = getUniqueID()
    this.inject(this.id)
  }

  componentDidUpdate () {
    this.inject(this.id)
  }

  componentWillUnmount () {
    this.eject()
  }

  render () {
    return null
  }
}


export class WithInject extends React.PureComponent {
  setInjectRef = e => {
    this.injection = e
  }

  componentWillUnmount () {
    if (this.injection) {
      this.injection.eject()
      this.injection = null
    }
  }

  render () {
    const {children, ...props} = this.props

    return cloneIfElement(
      children,
      {
        injectRef: this.setInjectRef,
        ...props
      }
    )
  }
}
