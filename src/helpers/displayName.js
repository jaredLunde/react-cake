function displayName (Component) {
  return (
       !Component
    || typeof Component === 'string'
    || typeof Component === 'number'
  )
    ? 'Unknown'
    : Component.name
      ? Component.name
      : Component.displayName
        ? Component.displayName
        : Component.constructor
          ? Component.constructor.displayName || 'Unknown'
          : Component.type
            ? Component.type.displayName || 'Unknown'
            : 'Unknown'
}

export default displayName

export function wrapDisplayName (wrapperName, Component) {
  return `${wrapperName}(${displayName(Component)})`
}
