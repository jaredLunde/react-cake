const displayName = Component => {
  const tOrC = Component.type ? Component.type : (
    Component.constructor ? Component.constructor : Component
  )

  return tOrC.displayName || tOrC.name || 'Unknown'
}

export default displayName

export const wrapDisplayName = (wrapperName, Component) => `${wrapperName}(${displayName(Component)})`
