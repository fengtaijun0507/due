import {compile} from './../../compiler/compile.js'
import Directive from './../../directive/directive.js'
export default function (Due) {
  Due.prototype.$mount = function(el) {
    //
    this._compile()
    return this
  }
  Due.prototype._compile = function() {
    compile(this.$el, this.$options, this)
  }
  Due.prototype._bindDir = function (dirs) {
    this._directives.push(new Directive(dirs, this))
  }
}


