import React from 'react'
import Point from './Point'


/**
<Movable>
  <WillChange transform>
    {
      ({move, movableRef, style, willChange, willChangeRef}) => (
        <div
          ref={willChangeRef}
          style={{
            width: 200,
            height: 200,
            backgroundColor: '#000',
            transition: 'transform 160ms cubic-bezier(0.4, 0, 0.7, 1.0)',
            ...style
          }}
        >
          <Point>
            {
              ({setX, setY, x, y}) => (
                <div>
                  <button
                    className='btn btn--s m--4'
                    onClick={() => {willChange(); move(x, y)}}
                  >
                    Move me
                  </button>
                  <input type='number' onChange={e => setX(e.target.value)} defaultValue={x}/>
                  <input type='number' onChange={e => setY(e.target.value)} defaultValue={y}/>
                </div>
              )
            }
          </Point>
        </div>
      )
    }
  </WillChange>
</Movable>
*/

export function Movable ({children, style, x, y, z}) {
  let transform = style && style.transform ? style.transform.split(' ') : []
  transform.push(`translate3d(${x}px, ${y}px, ${z || 0})`)
  transform = transform.join(' ')

  style = {
    ...style,
    MozTransform: transform,
    MsTransform: transform,
    WebkitTransform: transform,
    transform
  }

  return children({style, x, y})
}


export default function ({onMove, ...props}) {
  props.onChange = onMove
  return (
    <Point {...props}>
      {function (pointContext) {
        return Movable({...pointContext, ...props})
      }}
    </Point>
  )
}
