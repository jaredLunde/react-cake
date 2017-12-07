export default function (cb, ...args) {
  return cb !== void 0 && cb !== null ? cb(...args) : void 0
}
