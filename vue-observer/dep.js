import { remove } from './utils.js'

export default class Dep {
  static target = null
  constructor() {
    this.subs = []
  }
  addSub(sub) {
    this.subs.push(sub)
  }
  removeSub(sub) {
    remove(this.subs, sub)
  }
  depend() {
    if (Dep.target) {
      this.addSub(Dep.target)
    }
  }
  notify() {
    this.subs.forEach(sub => sub.update())
  }
}

Dep.target = null
const targetStack = []

export function pushTarget(target) {
  targetStack.push(target)
  Dep.target = target
}

export function popTarget() {
  targetStack.pop()
  Dep.target = targetStack[targetStack.length - 1]
}