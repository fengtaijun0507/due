# due
a simple mvvm according to vue(1.0.28)
# example
html:
`<body>
  <div id="app">
    <p v-text="msg"></p>
  </div>
</body>`

js:
`  var Due = new Due({
    el: '#app',
    data: function () {
      return {
        msg: '第一个指令编写成功'
      }
    }
  })`
  
  目前实现了v-text指令，v-model（input type类型），example文件夹中有示例

