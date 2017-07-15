import Dep from './dep.js'
import { def, isPlainObject } from './../util/index.js'
export function Observer(value) {
  // 默认暂时不考虑数组的数据类型
  this.value = value
  this.dep = new Dep()
  def(value, '__ob__', this)
  if (value) this.walk(value)
}
Observer.prototype.convert = function (key, val) {
  defineReactive(this.value, key, val)
}
Observer.prototype.walk = function (obj) {
  // defineReactive()
  var keys = Object.keys(obj)
  var len = keys.length
  for (var i = 0; i < len; i++) {
    // observe(obj[keys[i]])
    this.convert(keys[i], obj[keys[i]])
  }
}
export function observe (val) {
  var ob
  if(val.__ob__) {
    ob = val.__ob__
  } else if (isPlainObject(val)){
    ob = new Observer(val)
  }
  return ob
}

export function defineReactive(obj, key, value) {
  var dep = new Dep()
  var property = Object.getOwnPropertyDescriptor(obj, key)
  if (property && property.configurable === false) return

  // var childOb = observe(value)
  var getter = property&&property.get
  var setter = property&&property.set

  Object.defineProperty(obj, key, {
    emunerable: true,
    configurable: true,
    get: function () {
      var val = getter ? getter.call(obj): value
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set: function (newVal) {
      var val = getter ? getter.call(obj): value
      if (val === newVal) {
        return
      }
      if (setter) {
        setter.call(obj, newval)
      } else {
        value = newVal
      }
      dep.notify()
    }
  })
}
