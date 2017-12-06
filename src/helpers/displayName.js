function displayName (Component) {
  if (!Component || typeof Component === 'string' || typeof Component === 'number') {
    return 'Unknown'
  }

  const nOrD = Component.name || Component.displayName
  if (nOrD) {
    return nOrD
  }

  const tOrC = Component.constructor ? Component.constructor : Component.type ? Component.type : Component

  return tOrC.displayName || 'Unknown'
}

export default displayName

export function wrapDisplayName (wrapperName, Component) {
  return `${wrapperName}(${displayName(Component)})`
}
