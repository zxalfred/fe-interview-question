class Observer {
  value: any
  dep: Dep

  constructor(value: any) {
    this.value = value
    this.dep = new Dep()
    def(value, '__ob__', this)

    if (Array.isArray(value)) {
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk(obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i], obj[keys[i]])
    }
  }
  observeArray(items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      new Observer(items[i])
    }
  }
}


function observe (value: any): Observer | void {
  if (!value || typeof value !== 'object') return
  let ob: Observer | void
  if (value.hasOwnProperty('__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  }
  ob = new Observer(value)
  return ob
}

const arrayProto = Array.prototype
const arrayMethods = Object.create(arrayProto)

;['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'].forEach(method => {
  const original = arrayProto[method]
  Object.defineProperty(arrayMethods, method, {
    value(...args)  {
      const result = original.apply(this, args)
      const ob = this.__ob__
      let inserted
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args
          break
        case 'splice':
          inserted = args.slice(2)
          break
      }
      if (inserted) ob.observeArray(inserted)
      ob.dep.notify()
      return result
    },
    enumerable: false,
    writable: true,
    configurable: true
  })
})

class Dep {
  static target: Watcher | null
  static stack: Array<Watcher>
  subs: Array<Watcher>

  constructor() {
    this.subs = []
  }
  addSub(sub: Watcher) {
    this.subs.push(sub)
  }
  depend() {
    if (Dep.target) {
      this.addSub(Dep.target)
    }
  }
  notify() {
    this.subs.forEach(w => w.update())
  }
  static pushTarget(w: Watcher) {
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
  private cb: Function
  private value: any
  constructor(cb) {
    this.cb = cb
    this.update()
  }
  update() {
    Dep.pushTarget(this)
    this.value = this.cb()
    Dep.popTarget()
    return this.value
  }
}

function defineReactive(data, key, val) {
  const dep = new Dep()
  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      if (Dep.target) {
        dep.depend()
      }
      return val
    },
    set(newVal) {
      if (val === newVal) {
        return
      }
      dep.notify()
      val = newVal
    }
  })
}

function def(obj: Object, key: string, val: any, enumerable?: boolean) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  })
}

export default {}