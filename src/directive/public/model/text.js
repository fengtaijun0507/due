import { _toString} from '../../../util/index'
export default {
  bind () {
    this.on('input', () => {
      this.set(this.el.value)
      this.update(this._watcher.value)
    })
  },
  update (value) {
    value = _toString(value)
    if (value !== this.el.value) this.el.value = value
  }
}