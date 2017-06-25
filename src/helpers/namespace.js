/**
 * `DOM static functions`
 *  Provides a nice interface for auto-classing and auto-IDing elements.
 */
import memoize from 'fast-memoize'
import displayName from './displayName'
import {toKebabCaseTrimmed} from '../utils'


let _IDS = 0
const _incrId = () => {
  _IDS += 1
  return _IDS
}

export const name = {
  /**
   * @returns {string} -> the user-specified name of the component.
   */
  get: displayName,
  /**
   * @param {Array<string>} arguments -> names to concat to the component
   *  name, separated by a hyphen.
   * @returns {string} -> new name with the component name as a base
   */
  concat: (this_, ...args) => {
    var n = args.join("-")
    return name.get(this_) + '-' + n
  }
}


export const classes = {
  /**
   * @returns {string} -> class name based on the name.get()
   *  method if this.props.componentClass is not specified
   */
  get: this_ => toKebabCaseTrimmed(name.get(this_)),
  /**
   * @param {Array<string>} arguments -> names to concat to the component
   *  class name, separated by a hyphen.
   * @returns {string} -> new class name with the component class name as
   *  a base
   */
  concat: (this_, ...args) => {
    var name = args.join("-")
    return classes.get(this_) + '-' + name
  },
  /**
   * @param {Array<string>} arguments -> name to concat to the component
   *  class name, separated by a double underscore.
   * @returns {string} -> new class name with the component class name as
   *  a base
   */
  el: (this_, element) => {
    return classes.get(this_) + '__' + element
  },
  /**
   * @param {Array<string>} arguments -> name to concat to the component
   *  class name, separated by a double hyphen.
   * @returns {string} -> new class name with the component class name as
   *  a base
   */
  mod: (this_, name) => {
    return classes.get(this_) + '--' + name
  },
  /**
   * @param {Array<string>} arguments -> classes to append to the component
   *  class
   * @returns {string} -> new class name with the component class as
   *  a base
   */
  append: (this_, ...args) => {
    var name = args.join(" ")
    return (classes.get(this_) + ' ' + name).trim()
  },

  enable: (this_, enabled, ...names) => {
    return enabled ? classes.append(this_, ...names) : classes.get(this_)
  }
}


export const id = {
  /**
   * @returns {string} -> numeric ID unique to this component
   */
  unique: memoize(() => String(_incrId())),
  /**
   * @returns {string} -> id name based on the name.get() and id.unique()
   */
  get: this_ => name.concat(this_, id.unique(this_)),
  /**
   * @param {Array<string>} arguments -> names to concat to the component
   *  id name, separated by a hyphen.
   * @returns {string} -> new id name with the component id name as
   *  a base
   */
  concat: (this_, ...args) => {
    args.push(id.unique(this_))
    return name.concat(this_, ...args)
  },
}
