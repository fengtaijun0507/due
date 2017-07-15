import { observe } from './../../observer/index.js'
export default function (Due) {
  Due.prototype._initState = function () {
    this._initData()
  }
  Due.prototype._initData = function () {
    var dataFn = this.$options.data
    var data = this._data = dataFn ? dataFn() : {}
    if (data) observe(data)
  }
  // 需要把this.data转化成响应式的数据
}