import PropTypes from 'prop-types'


export default {
  getAspect: PropTypes.func.isRequired,
  getViewportSize: PropTypes.func.isRequired,
  inView: PropTypes.func.isRequired,
  inViewX: PropTypes.func.isRequired,
  inViewY: PropTypes.func.isRequired,
  inFullView: PropTypes.func.isRequired,
  inFullViewX: PropTypes.func.isRequired,
  inFullViewY: PropTypes.func.isRequired,
  subscribe: PropTypes.func.isRequired,
  unsubscribe: PropTypes.func.isRequired,
}
