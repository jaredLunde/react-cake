import React from 'react'
import PropTypes from 'prop-types'
import WithViewport from './WithViewport'
import {createOptimized, compose} from '../utils'


/**
!!! Requires top-level Viewport component !!!

<Viewport>
  <ViewportFill>
    {
      ({style}) => (
        <Box
          style={style}
          bg='red'
          flex
          align='center'
          justify='center'
        >
          <Type white xxl>Hello!</Type>
        </Box>
      )
    }
  </ViewportFill>
</Viewport>
**/
export class ViewportFill extends React.PureComponent {
  constructor (props) {
    super(props)
    const {getViewportSize, subscribe} = props

    this.state = getViewportSize()
    subscribe(this.setSize)
  }

  componentWillUnmount () {
    this.props.unsubscribe(this.setSize)
  }

  setSize = ({viewportWidth, viewportHeight}) => this.setState({
    width: viewportWidth,
    height: viewportHeight
  })

  render () {
    const props = Object.assign({}, this.props)
    delete props.children
    props.style = Object.assign({}, style || {}, this.state)
    return this.props.children(props)
  }
}


export default compose([WithViewport, ViewportFill])
