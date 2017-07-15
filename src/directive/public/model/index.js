import text from './text.js'

const handlers = {
  text
  // radio,
  // select,
  // checkbox
}
export default {
  bind () {
    var el = this.el
    var tag = el.tagName
    var handler
    if (tag === 'INPUT') {
      handler = handlers[el.type] || handlers.text
    } else {
      // 待补充了
    }
    handler.bind.call(this)
    this.update = handler.update
  }
}