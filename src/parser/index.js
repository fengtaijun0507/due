export function parseExpression (path) {
  // 目前只针对简单路径
  // var body = 'scope._data.' + path
  var res = {}
  res.getter = compileGetter(path)
  res.setter = compileSetter(path)
  return res
}
function compileGetter (path) {
  var body = 'scope._data.' + path
  return new Function('scope', 'return ' + body + ';')
}
function compileSetter (path) {
  // return function (scope, val) {
  //   if (path) {
  //     scope._data[path] = val
  //   }
  // }
  return new Function('scope', 'val', 'scope._data.' + path + '=val')
}