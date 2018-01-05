import PropTypes from 'prop-types'


export default {
  getAspect: PropTypes.func,
  getViewportSize: PropTypes.func,
  getViewportScroll: PropTypes.func,
  inView: PropTypes.func,
  inViewX: PropTypes.func,
  inViewY: PropTypes.func,
  inFullView: PropTypes.func,
  inFullViewX: PropTypes.func,
  inFullViewY: PropTypes.func,
  subscribe: PropTypes.func,
  unsubscribe: PropTypes.func,
}
