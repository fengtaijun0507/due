var uid = 0
export default function Dep() {
  this.id = uid++
  this.subs = []
}

Dep.target = null

Dep.prototype.addSub = function (obj) {
  this.subs.push(obj)
}
Dep.prototype.removeSub = function (sub) {
  // this.subs.$remove(sub)
}
Dep.prototype.notify = function () {
  for (var i = 0; i < this.subs.length; i++) {
    this.subs[i].update()
  }
}
Dep.prototype.depend = function () {
  Dep.target.addDep(this)
}



