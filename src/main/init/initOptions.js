export default function (Due) {
  Due.prototype._init = function (options) {
    this.$options = options
    this.vm = this
    this.$el = this.$options.el
    this._data = {}
    this._watchers = []
    this._directives = []

    this._initState(options)
    if (options.el) {
      this.$mount()
    }
  }
}
