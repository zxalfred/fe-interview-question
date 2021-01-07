// generator 执行器
function executor(generator, ...args) {
  const iter = generator(args)
  const n = iter.next
  if (n.done) {
    return Promise.resolve(n.value)
  } else {
    return new Promise(resolve => {
      iter.next.then(ret => {
        _r(iter, ret, resolve)
      })
    })
  }
}

function _r(iter, ret, resolve) {
  const n = iter.next(ret)
  if (n.done) {
    resolve(n.value)
  } else {
    iter.next.then(ret => {
      _r(iter, ret, resolve)
    })
  }
}
// Promise.all 实现
Promise.prototype.myAll = function (...args) {
  const result = []
  const finished = 0
  return new Promise((resolve, reject) => {
    args.forEach((promise, index) => {
      promise.then(res => {
        result[index] = res
        finished++
        if (finished === args) {
          resolve(result)
        }
      }).catch(err => {
        reject(err)
      })
    })
  })
}

// Promise 错误重试实现


var imgs = document.querySelectorAll('img');

//用来判断bound.top<=clientHeight的函数，返回一个bool值
function isIn(el) {
  var bound = el.getBoundingClientRect();
  var clientHeight = window.innerHeight;
  return bound.top <= clientHeight;
}
//检查图片是否在可视区内，如果不在，则加载
function check() {
  Array.from(imgs).forEach(function (el) {
    if (isIn(el)) {
      loadImg(el);
    }
  })
}
function loadImg(el) {
  if (!el.src) {
    var source = el.dataset.src;
    el.src = source;
  }
}
window.onload = window.onscroll = function () { //onscroll()在滚动条滚动的时候触发
  check();
}

// bind
Function.prototype.myBind = function(context, ...rest) {
  const fn = this
  return function(...args) {
    const newArgs = rest.concat(args)
    if (new.target === undefined) {
      return fn.apply(context, newArgs)
    } else {
      return new fn(...newArgs)
    }
  }
}

// apply
Function.prototype.myApply = function(context, ...args) {
  const key = Symbol('key')
  context = context || window
  context[key] = this
  const result = context[key](...args)
  delete context[key]
  return result
}

// debounce
function debounce(fn, interval = 50) {
  let timer

  return function(...args) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, interval)
  }
}

// throttle
function throttle(fn, interval = 50) {
  let startTime

  return function(...args) {
    startTime = new Date().valueOf()
    if (!startTime || (nowTime - startTime) > interval) {
      fn.apply(this, args)
      startTime = nowTime
    }
  }
}

// new 
function myNew(fn, ...args) {
  const obj = Object.create(fn.prototype)
  const res = fn.apply(obj, args)
  if (typeof res === 'function' || (typeof res === 'object' && res!== null)) {
    return res
  }
  return obj
}

// structuralClone
function structuralClone(obj) {
  return new Promise(resolve => {
    const { port1, port2 } = new MessageChannel()
    port1.onmessage = el => resolve(el.data)
    port2.postMessage(obj)
  })
}

// curry
function curry(fn) {
  return function(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args)
    }
    return function(...args2) {
      return curry.apply(this, args.concat(args2))
    }
  }
}

// promise
function resolvePromise(promise2, x, resolve, reject) {
  if (promise2 === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called
  if ((typeof x === 'function' && x!== null) || typeof x === 'function') {
    try {
      const then = x.then
      if (typeof then === 'function') {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise2, y, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x)
      }
    } catch (e) {
      if (called) return
      called = true
      reject(e)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = undefined
    this.reason = undefined
    this.onResovedCallbacks = []
    this.onRejectedCallbacks = []
    
    const resolve = (value) => {
      if (this.status === 'pending') {
        this.value = value
        this.status = 'fulfilled'
        this.onRejectedCallbacks.forEach(fn => fn(value))
      }
    }

    const reject = (value) => {
      if (this.status === 'pending') {
        this.reason = value
        this.status = 'rejected'
        this.onRejectedCallbacks.forEach(fn => fn(value))
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : error => { throw error }
    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === 'fulfilled') {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === 'rejected') {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === 'pending') {
        this.onResovedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0)
        })
      }
    })

    return promise2
  }
}

// quick sort
function quickSort(input) {
  const sort = (arr, left = 0, right = arr.length - 1) => {
    if (right >= left) return

    let i = left
    let j = right
    const baseVal = arr[j]
    while (i < j) {
      while (i < j && arr[i] <= baseVal) {
        i++
      }
      arr[j] = arr[i]
      while (i < j && arr[j] >= baseVal) {
        j--
      }
      arr[i] = arr[j]
    }
    arr[i] = baseVal

    sort(arr, left, i - 1)
    sort(arr, i + 1, right)
  }

  let result = [...input]
  sort(result)

  return result
}
