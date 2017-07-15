import { extend, on } from './../util/index.js'
import Watcher from './../watcher/index.js'
export default function Directive (descripor, vm) {
  this.descripor = descripor
  this.exp = descripor.exp
  this.el = descripor.el
  this.vm = vm
}

Directive.prototype._bind = function () {
  //
  extend(this, this.descripor.def)
  if (this.bind) {
    this.bind()
  }
  if (this.update) {
    var dir = this
    this._update = function (val, oldVal) {
      // console.log(oldVal)
      dir.update(val, oldVal)
    }
  }
  var watcher = this._watcher = new Watcher(this.vm, this._update, this.exp)
  if (this.update) {
    this.update(watcher.value)
  }
}
Directive.prototype.on = function (event, cb, useCapture) {
  on(this.el, event, cb, useCapture)
}
Directive.prototype.set = function (value) {
  /* istanbul ignore else */
  // if (this.twoWay) {
  this._watcher.set(value)
  // }
}