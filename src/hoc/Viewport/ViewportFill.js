import React from 'react'
import PropTypes from 'prop-types'
import WithViewport from './WithViewport'
import {cloneIfElement} from '../../utils'


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

  setSize = ({viewportWidth, viewportHeight, ...props}) => this.setState({
    width: viewportWidth,
    height: viewportHeight
  })

  render () {
    const {children, style, ...props} = this.props

    return cloneIfElement(
      children,
      {
        style: Object.assign(
          {},
          style || {},
          this.state
        ),
        ...props
      }
    )
  }
}


export default ({children, ...props}) => (
  <WithViewport>
    <ViewportFill {...props}>
      {children}
    </ViewportFill>
  </WithViewport>
)
