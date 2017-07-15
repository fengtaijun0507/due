export function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}
export function isPlainObject (obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}
export function toArray (arr) {
  return Array.prototype.slice.call(arr, 0)
}
export function _toString (value) {
  return value == null
    ? ''
    : value.toString()
}
export function extend (to, from) {
  var keys = Object.keys(from)
  var i = keys.length
  while (i--) {
    to[keys[i]] = from[keys[i]]
  }
  return to
}
export function on (el, event, cb, useCapture) {
  el.addEventListener(event, cb, useCapture)
}