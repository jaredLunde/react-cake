import {Viewport} from './Viewport'
import {withContextFrom} from '../../utils'


/**
const ViewportContext = () => (
  <WithViewport>
    {
      ({inFullView}) => (
        <div>
          header fully in view?
          {JSON.stringify(inFullView(document.getElementById('main-header')))}
        </div>
      )
    }
  </WithViewport>
)
**/
export default withContextFrom(Viewport)
