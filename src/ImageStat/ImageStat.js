import React from 'react'
import setOrientation from './setOrientation'
import {loadImage} from '../utils'


export default class ImageStat extends React.Component {
  _image = null
  state = {
    orientation: 'square',
    width: 0,
    height: 0,
    naturalWidth: 0,
    naturalHeight: 0,
    complete: false
  }

  imageRef = e => {
    if (e !== this._image || (e && this._image && e.src !== this._image.src)) {
      this._image = e
      this.setStats()
    }
  }

  setStats () {
    if (this._image !== null) {
      loadImage(this._image).then(
        ({target}) => {
          const {width, height, naturalWidth, naturalHeight} = target

          this.setState({
            ...setOrientation({width: naturalWidth, height: naturalHeight}),
            width,
            height,
            naturalWidth,
            naturalHeight,
            complete: true
          })
        }
      )
    }
  }

  render () {
    const props = Object.assign({}, this.props)
    delete props.children
    props.imageRef = this.imageRef
    props.orientation = this.state.orientation
    props.width = this.state.width
    props.height = this.state.height
    props.naturalWidth = this.state.naturalWidth
    props.naturalHeight = this.state.naturalHeight
    props.complete = this.state.complete
    return this.props.children(props)
  }
}
