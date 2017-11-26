export Counter, {
  incr,
  decr,
  incrBy,
  decrBy,
  boundIncr,
  boundDecr
} from './Counter'

export Items, {
  addItem,
  deleteItem,
  boundAddItem,
  boundDeleteItem,
  ItemList,
  ItemSet,
  ItemSetOrdered,
  ItemStack
} from './Items'

export Choices, {
  Choice,
  WithChoices
} from './Choices'

export Point, {
  setX,
  setY,
  setXY,
  boundSetX,
  boundSetY,
  boundSetXY,
  moveX,
  moveY,
  moveXY,
  boundMoveX,
  boundMoveY,
  boundMoveXY
} from './Point'

export Viewport, {
  ViewportFill,
  ViewportOrientation,
  ViewportSize,
  ViewportScroll,
  ViewportQueries,
  WithViewport,
  ViewportContext,
} from './Viewport'

export ImageStat, {setOrientation} from './ImageStat'
export Inject, {WithInject} from './Inject'
export Paragraphs, {toBreaks, toParagraphs} from './Paragraphs'
export Subscriptions from './Subscriptions'
export Toggle, {toggle} from './Toggle'
export Hoverable, {canHover} from './Hoverable'
export Clickable from './Clickable'
export Movable from './Movable'
export Scrollable from './Scrollable'
export Animatable from './Animatable'
export WillChange from './WillChange'
export Value from './Value'
export Rect from './Rect'
export Sticky from './Sticky'
export RequestAnimationFrame from './RequestAnimationFrame'
export Throttle from './Throttle'
export SizeObserver from './SizeObserver'
export MousePosition from './MousePosition'

// TODO: Point3D, Resizable, Rotatable, Scalable
// TODO: Make the initialX values consistently update with componentWillUpdate (similar to Choices, Toggle)
// Single value state objects should use Value HOC
// TODO: compartmentalize _listeners, _ticking, requestAnimationFrame
