(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Due = factory());
}(this, (function () { 'use strict';

var initEvent = function (Due) {
  Due.prototype._initEvent = function () {};
};

var initOptions = function (Due) {
  Due.prototype._init = function (options) {
    this.$options = options;
    this.vm = this;
    this.$el = this.$options.el;
    this._data = {};
    this._watchers = [];
    this._directives = [];

    this._initState(options);
    if (options.el) {
      this.$mount();
    }
  };
};

var uid = 0;
function Dep() {
  this.id = uid++;
  this.subs = [];
}

Dep.target = null;

Dep.prototype.addSub = function (obj) {
  this.subs.push(obj);
};
Dep.prototype.removeSub = function (sub) {
  // this.subs.$remove(sub)
};
Dep.prototype.notify = function () {
  for (var i = 0; i < this.subs.length; i++) {
    this.subs[i].update();
  }
};
Dep.prototype.depend = function () {
  Dep.target.addDep(this);
};

function def(obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}
function isPlainObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
function toArray(arr) {
  return Array.prototype.slice.call(arr, 0);
}
function _toString(value) {
  return value == null ? '' : value.toString();
}
function extend(to, from) {
  var keys = Object.keys(from);
  var i = keys.length;
  while (i--) {
    to[keys[i]] = from[keys[i]];
  }
  return to;
}
function on(el, event, cb, useCapture) {
  el.addEventListener(event, cb, useCapture);
}

function Observer(value) {
  // 默认暂时不考虑数组的数据类型
  this.value = value;
  this.dep = new Dep();
  def(value, '__ob__', this);
  if (value) this.walk(value);
}
Observer.prototype.convert = function (key, val) {
  defineReactive(this.value, key, val);
};
Observer.prototype.walk = function (obj) {
  // defineReactive()
  var keys = Object.keys(obj);
  var len = keys.length;
  for (var i = 0; i < len; i++) {
    // observe(obj[keys[i]])
    this.convert(keys[i], obj[keys[i]]);
  }
};
function observe(val) {
  var ob;
  if (val.__ob__) {
    ob = val.__ob__;
  } else if (isPlainObject(val)) {
    ob = new Observer(val);
  }
  return ob;
}

function defineReactive(obj, key, value) {
  var dep = new Dep();
  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) return;

  // var childOb = observe(value)
  var getter = property && property.get;
  var setter = property && property.set;

  Object.defineProperty(obj, key, {
    emunerable: true,
    configurable: true,
    get: function () {
      var val = getter ? getter.call(obj) : value;
      if (Dep.target) {
        dep.depend();
      }
      return val;
    },
    set: function (newVal) {
      var val = getter ? getter.call(obj) : value;
      if (val === newVal) {
        return;
      }
      if (setter) {
        setter.call(obj, newval);
      } else {
        value = newVal;
      }
      dep.notify();
    }
  });
}

var initState = function (Due) {
  Due.prototype._initState = function () {
    this._initData();
  };
  Due.prototype._initData = function () {
    var dataFn = this.$options.data;
    var data = this._data = dataFn ? dataFn() : {};
    if (data) observe(data);
  };
  // 需要把this.data转化成响应式的数据
};

var text = {
  bind() {
    this.attr = this.el.nodeType === 3 ? 'data' : 'textContent';
  },
  update(value) {
    this.el[this.attr] = _toString(value);
  }
};

var text$1 = {
  bind() {
    this.on('input', () => {
      this.set(this.el.value);
      this.update(this._watcher.value);
    });
  },
  update(value) {
    value = _toString(value);
    if (value !== this.el.value) this.el.value = value;
  }
};

const handlers = {
  text: text$1
  // radio,
  // select,
  // checkbox
};
var model = {
  bind() {
    var el = this.el;
    var tag = el.tagName;
    var handler;
    if (tag === 'INPUT') {
      handler = handlers[el.type] || handlers.text;
    } else {
      // 待补充了
    }
    handler.bind.call(this);
    this.update = handler.update;
  }
};

var directives = {
  text,
  model
};

function compile(el, options, vm) {
  var el = document.querySelector(el);
  if (el.hasChildNodes()) {
    compileNodeList(el.childNodes, options, vm);
  } else {
    compileNode(el, options, vm);
  }
}

function compileNode(node, options, vm) {
  var type = node.nodeType;
  if (type === 1) {
    compileElement(node, options, vm);
  } else if (type === 3) {
    compileTextNode(node, vm);
  }
}

function compileNodeList(nodeList, options, vm) {
  for (var i = 0; i < nodeList.length; i++) {
    let node = nodeList[i];
    compileNode(node, options, vm);
    node.hasChildNodes() && compileNodeList(nodeList[i].childNodes, options, vm);
  }
}

function compileElement(el, options, vm) {
  // compileDirective()
  var hasAttrs = el.hasAttributes();
  if (!hasAttrs) return;
  var attrs = hasAttrs && toArray(el.attributes);
  var linkerfn = compileDirectives(attrs, options, vm, el);
  linkAndCapture(linkerfn, vm);
}
function compileTextNode(node, vm) {}

function linkAndCapture(linker, vm) {

  var originalDirCount = vm._directives.length;
  linker();
  var dirs = vm._directives.slice(originalDirCount);
  for (var i = 0, l = dirs.length; i < l; i++) {
    dirs[i]._bind();
  }
  return dirs;
}
function compileDirectives(attrs, options, vm, el) {
  // pushDir()
  var dirs = [];
  // console.log(options)
  for (var i = 0; i < attrs.length; i++) {
    pushDir(attrs[i]);
  }
  function pushDir(attr) {
    var dirDef = getDescriptor(attr);
    dirs.push({ name: attr.name, value: attr.value, def: dirDef, exp: attr.value, el });
  }
  function getDescriptor(attr) {
    var re = /^v-.?/;
    var dirName = re.test(attr.name) && attr.name.replace('v-', '');
    return dirName && directives[dirName];
  }
  if (dirs.length) {
    return makeNodeLinkFn(dirs, vm);
  }
}
function makeNodeLinkFn(dirs, vm) {
  return function nodeLinkFn() {
    var i = dirs.length;
    while (i--) {
      vm._bindDir(dirs[i]);
    }
  };
}

function parseExpression(path) {
  // 目前只针对简单路径
  // var body = 'scope._data.' + path
  var res = {};
  res.getter = compileGetter(path);
  res.setter = compileSetter(path);
  return res;
}
function compileGetter(path) {
  var body = 'scope._data.' + path;
  return new Function('scope', 'return ' + body + ';');
}
function compileSetter(path) {
  // return function (scope, val) {
  //   if (path) {
  //     scope._data[path] = val
  //   }
  // }
  return new Function('scope', 'val', 'scope._data.' + path + '=val');
}

function Watcher(vm, cb, exp) {
  // 目前只兼容做指令数据的的wactcher
  this.vm = vm;
  // var scope = this.scope || this.vm
  vm._watchers.push(this);
  this.cb = cb;
  this.deps = [];
  this.newDeps = [];
  this.depIds = new Set();
  this.newDepIds = new Set();
  // 获取setter,getter
  this.getter = parseExpression(exp).getter;
  this.setter = parseExpression(exp).setter;
  this.value = this.get();
}
Watcher.prototype.addDep = function (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};
Watcher.prototype.beforeGet = function () {
  Dep.target = this;
};
Watcher.prototype.get = function () {
  this.beforeGet();
  var value = this.getter.call(this.vm, this.vm);
  this.afterGet();
  return value;
};
Watcher.prototype.afterGet = function () {
  Dep.target = null;
};
Watcher.prototype.set = function (value) {
  this.setter.call(this.vm, this.vm, value);
};
Watcher.prototype.update = function () {
  var value = this.get();
  var oldValue = '';
  if (value !== this.value) {
    oldValue = this.value;
    this.value = value;
  }
  this.cb.call(this.vm, value, oldValue);
};

function Directive(descripor, vm) {
  this.descripor = descripor;
  this.exp = descripor.exp;
  this.el = descripor.el;
  this.vm = vm;
}

Directive.prototype._bind = function () {
  //
  extend(this, this.descripor.def);
  if (this.bind) {
    this.bind();
  }
  if (this.update) {
    var dir = this;
    this._update = function (val, oldVal) {
      // console.log(oldVal)
      dir.update(val, oldVal);
    };
  }
  var watcher = this._watcher = new Watcher(this.vm, this._update, this.exp);
  if (this.update) {
    this.update(watcher.value);
  }
};
Directive.prototype.on = function (event, cb, useCapture) {
  on(this.el, event, cb, useCapture);
};
Directive.prototype.set = function (value) {
  /* istanbul ignore else */
  // if (this.twoWay) {
  this._watcher.set(value);
  // }
};

var initLifeCycle = function (Due) {
  Due.prototype.$mount = function (el) {
    //
    this._compile();
    return this;
  };
  Due.prototype._compile = function () {
    compile(this.$el, this.$options, this);
  };
  Due.prototype._bindDir = function (dirs) {
    this._directives.push(new Directive(dirs, this));
  };
};

function Due$1(options) {
  this._init(options);
}
initOptions(Due$1);
initEvent(Due$1);
initState(Due$1);
initLifeCycle(Due$1);

return Due$1;

})));
