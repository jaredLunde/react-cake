function _shouldReturnChild (filter, child) {
  return child.nodeName && (!filter || filter && filter(child))
}


function findDomNodes (node, filter) {
  if (!node) return [];
  let children = []

  for (let i = 0; i < node.childNodes.length; i++) {
    const child = node.childNodes[i]

    if (_shouldReturnChild(filter, child)) {
      children.push(child)
    }

    children = children.concat(findDomNodes(child, filter))
  }

  return children
}


export default findDomNodes
