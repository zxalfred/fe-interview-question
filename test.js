class Dep {
  static target = null
  static stack = []
  constructor() {
    this.subs = []
  }
  depend() {
    if (Dep.target) {
      this.subs.push(Dep.target)
    }
  }
  notify() {
    this.subs.forEach(sub => {
      sub.update()
    })
  }
  static pushTarget(w) {
    if (this.target) {
      this.stack.push(this.target)
    }
    this.target = w
  }
  static popTarget() {
    this.target = this.stack.pop()
  }
}
class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb
    this.update()
  }
  update() {
    Dep.pushTarget(this)
    this.value = this.cb()
    Dep.popTarget()
    return value
  }
}
const methods = ['pop', 'shift', 'unshift', 'sort', 'reverse', 'splice', 'push']
const arrayProto = Array.prototype
const proto = Object.create(arrayProto)
methods.forEach(method => {
  proto[method] = function() {
    // AOP
    arrayProto[method].call(this, ...arguments)
    render()
  }
})
let data = {
  name: 'alfred',
  location: {x: 100, y: 100}
}
function observe(obj) {
  if (Array.isArray(obj)) {
    Object.setPrototypeOf(obj, proto)
  }
  if (obj && typeof obj === 'object') {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
  return obj
}

function defineReactive(obj, key, value) {
  const dep = new Dep()
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get() {
      dp.depend()
      return value
    },
    set(newVal) {
      if (newVal !== value) {
        value = newVal
        dp.notify()
      }
    }
  })
  observe(value)
}

observe(data)

console.log(data)
