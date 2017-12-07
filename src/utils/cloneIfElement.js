import createOptimized from './createOptimized'

export default function (...args) {
  console.warn('"cloneIfElement" is a deprecated function. Call "createOptimized" instead.')
  return createOptimized(...args)
}
