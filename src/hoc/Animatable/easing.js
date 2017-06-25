import cubicBezier from 'bezier-easing'


export const swiftMove = cubicBezier(0.4, 0, 0.2, 1)
export const swifterMove = cubicBezier(0.4, 0, 0.0, 1)
export const swiftIn = cubicBezier(0.4, 0, 1, 1)
export const swiftOut = cubicBezier(0, 0, 0.58, 1)
export const heavyMove = cubicBezier(0.7, 0, 0.6, 1)
