import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import invariant from 'invariant'
import {createOptimized, callIfExists, getUniqueID} from './utils'


/**
<Inject entry={() => document.getElementById('root')}>
  <div>Inject me</div>
</Inject>
*/
export default class Inject extends React.PureComponent {
  static propTypes = {
    entry: PropTypes.func.isRequired
  }

  static defaultProps = {
    entry: function () {
      return document.getElementById('injections')
    }
  }

  componentDidMount () {
    if (this.props.entry() === null) {
      this.forceUpdate()
    }
  }

  render () {
    const {children, entry} = this.props

    if (entry() === null) {
      return null
    }

    return ReactDOM.createPortal(children, entry())
  }
}
