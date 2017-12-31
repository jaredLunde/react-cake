function _shouldReturnChild (filter, child) {
  return child.nodeName && (!filter || filter && filter(child))
}


export function findDomNodes (node, filter) {
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


const _inputNodes = ['input', 'textarea', 'select']
const _nodeFilter = c => _inputNodes.indexOf(c.nodeName.toLowerCase()) > -1

export function formToObject (node) {
  if (node === null ||  node === void 0) {
    return {}
  }

  const childNodes = findDomNodes(node, _nodeFilter)
  const payload = {}

  for (let x = 0; x < childNodes.length; x++) {
    const child = childNodes[x]
    const parts = child.name.length ? child.name.split('.') : []
    const key = parts.length ? parts.splice(0, 1) : String(x)
    payload[key] = recomposePayload(payload[key], child, parts)
  }

  return payload
}

export const formToJson = node => JSON.stringify(formToObject(node))

const _checkboxBools = ['on', 'off', 'true', 'false']
const _checkboxFalse = ['off', 'false']

export function castPayload (node) {
  if (node === void 0 || node === null) {
    return null
  }

  if (node.type && (node.type === 'checkbox' || node.type === 'radio')) {
    if (node.checked === true) {
      if (_checkboxBools.indexOf(node.value) > -1) {
        return _checkboxFalse.indexOf(node.value) > -1 === false;
      } else {
        return node.value
      }
    } else if (node.checked === false) {
      return false
    }

    return null
  }

  return typeof node.value === 'string' && node.value.length === 0 ?
         null :
         node.value
}

export function recomposePayload (payload, child, parts) {
  if (parts.length === 0) {
    if (payload !== void 0 && payload !== null) {
      (payload.push === void 0 ? [payload] : payload).push(castPayload(child))
    } else {
      payload = castPayload(child)
    }
  } else {
    const name = parts.splice(0, 1)
    payload = payload || {}
    payload[name] = recomposePayload(payload[name], child, parts)
  }

  return payload
}


export default formToObject
