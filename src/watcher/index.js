import Dep from './../observer/dep.js'
import { parseExpression } from './../parser/index.js'
export default function Watcher (vm, cb, exp) {
  // 目前只兼容做指令数据的的wactcher
  this.vm = vm
  // var scope = this.scope || this.vm
  vm._watchers.push(this)
  this.cb = cb
  this.deps = []
  this.newDeps = []
  this.depIds = new Set()
  this.newDepIds = new Set()
  // 获取setter,getter
  this.getter = parseExpression(exp).getter
  this.setter = parseExpression(exp).setter
  this.value = this.get()
}
Watcher.prototype.addDep = function (dep) {
  var id = dep.id
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id)
    this.newDeps.push(dep)
    if (!this.depIds.has(id)) {
      dep.addSub(this)
    }
  }
}
Watcher.prototype.beforeGet = function () {
  Dep.target = this
}
Watcher.prototype.get = function () {
  this.beforeGet()
  var value= this.getter.call(this.vm, this.vm)
  this.afterGet()
  return value
}
Watcher.prototype.afterGet = function () {
  Dep.target = null
}
Watcher.prototype.set = function (value) {
  this.setter.call(this.vm, this.vm, value)
}
Watcher.prototype.update = function () {
  var value = this.get()
  var oldValue = ''
  if (value !== this.value) {
    oldValue = this.value
    this.value = value
  }
  this.cb.call(this.vm, value, oldValue)
}