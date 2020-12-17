import Dep, { pushTarget, popTarget } from './dep.js'

export class Watcher {
  constructor(expOrFn) {
    this.getter = expOrFn
    this.value = this.update()
  }
  update() {
    pushTarget(this)
    this.value = this.getter()
    popTarget()
    return this.value
  }
}