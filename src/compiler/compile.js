import {toArray} from './../util/index.js'
import directives from './../directive/public/index.js'
export function compile (el, options, vm) {
  var el = document.querySelector(el)
  if (el.hasChildNodes()) {
    compileNodeList(el.childNodes, options, vm)
  } else {
    compileNode(el, options, vm)
  }
}

function compileNode (node, options, vm) {
  var type = node.nodeType;
  if (type === 1) {
    compileElement(node, options, vm)
  } else if (type === 3) {
    compileTextNode(node, vm)
  }
}

function compileNodeList (nodeList, options, vm) {
  for(var i = 0; i < nodeList.length; i++) {
    let node = nodeList[i]
    compileNode(node, options, vm)
    node.hasChildNodes()&&compileNodeList(nodeList[i].childNodes, options, vm)
  }
}

function compileElement (el, options, vm) {
  // compileDirective()
  var hasAttrs = el.hasAttributes()
  if(!hasAttrs) return
  var attrs = hasAttrs && toArray(el.attributes)
  var linkerfn = compileDirectives(attrs, options, vm, el)
  linkAndCapture(linkerfn, vm)
}
function compileTextNode (node, vm) {}

function linkAndCapture (linker, vm) {

  var originalDirCount = vm._directives.length
  linker()
  var dirs = vm._directives.slice(originalDirCount)
  for (var i = 0, l = dirs.length; i < l; i++) {
    dirs[i]._bind()
  }
  return dirs
}
export function compileDirectives (attrs, options, vm, el) {
  // pushDir()
  var dirs = [];
  // console.log(options)
  for (var i = 0; i < attrs.length; i++) {
    pushDir(attrs[i])
  }
  function pushDir (attr) {
    var dirDef = getDescriptor(attr)
    dirs.push({name: attr.name, value: attr.value, def: dirDef, exp: attr.value, el})
  }
  function getDescriptor (attr) {
    var re = /^v-.?/
    var dirName = re.test(attr.name) && attr.name.replace('v-', '')
    return dirName&&directives[dirName]
  }
  if (dirs.length) {
    return makeNodeLinkFn(dirs, vm);
  }
}
function makeNodeLinkFn(dirs, vm) {
  return function nodeLinkFn() {
    var i = dirs.length;
    while (i--) {
      vm._bindDir(dirs[i])
    }
  }
}