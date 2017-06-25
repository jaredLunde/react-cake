import {findDomNodes} from '../utils'


const _inputNodes = ['input', 'textarea', 'select']
const _nodeFilter = c => _inputNodes.indexOf(c.nodeName.toLowerCase()) > -1

export const formToObject = node => {
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

export default formToObject

export const formToJson = node => JSON.stringify(formToObject(node))

const _checkboxBools = ['on', 'off', 'true', 'false']
const _checkboxFalse = ['off', 'false']

export const castPayload = node => {
  if (node.type && (node.type === 'checkbox' || node.type === 'radio')) {
    if (node.checked) {
      if (_checkboxBools.indexOf(node.value) > -1) {
        return _checkboxFalse.indexOf(node.value) > -1 === false;
      } else {
        return node.value
      }
    }

    return null
  }

  return typeof node.value === 'string' && node.value.length === 0 ?
         null :
         node.value
}

export const recomposePayload = (payload, child, parts) => {
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
