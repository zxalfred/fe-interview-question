const PENDING = 'PENDING'
const FULFILLED = 'FULFILLED'
const REJECTED = 'REJECTED'

function resolvePromise(promise, x, resolve, reject) {
  if (promise === x) {
    return reject(new TypeError('Chaining cycle detected for promise'))
  }
  let called
  if ((typeof x === 'object' && x!== null) || typeof x === 'function') {
    const then = x.then
    if (typeof then === 'function') {
      try {
        then.call(x, y => {
          if (called) return
          called = true
          resolvePromise(promise, y, resolve, reject)
        }, r => {
          if (called) return
          called = true
          reject(r)
        })
      } catch (e) {
        if (called) return
        called = true
        reject(e)
      }
    } else {
      resolve(x)
    }
  } else {
    resolve(x)
  }
}

class MyPromise {
  constructor(executor) {
    this.status = PENDING
    this.value = undefined
    this.reason = undefined
    this.onResolvedCallbacks = []
    this.onRejectedCallbacks = []

    const resolve = (value) => {
      if (value instanceof MyPromise) {
        return value.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    const reject = (reason) => {
      if (reason instanceof MyPromise) {
        return reason.then(resolve, reject)
      }
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try {
      executor(resolve, reject)
    } catch (e) {
      reject(e)
    }
  }

  then(onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : v => v
    onRejected = typeof onRejected === 'function' ? onRejected : e => { throw e }

    const promise2 = new MyPromise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            const x = onFulfilled(this.value)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0)
      }
      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            const x = onRejected(this.reason)
            resolvePromise(promise2, x, resolve, reject)
          } catch (e) {
            reject(e)
          }
        }, 0);
      }
      if (this.status === PENDING) {
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onFulfilled(this.value)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0);
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const x = onRejected(this.reason)
              resolvePromise(promise2, x, resolve, reject)
            } catch (e) {
              reject(e)
            }
          }, 0);
        })
      }
    })

    return promise2
  }

  catch(onRejected) {
    this.then(null, onRejected)
  }

  finally(callback) {
    return this.then(data => {
      return MyPromise.resolve(callback()).then(() => data)
    }, reason => {
      return MyPromise.resolve(callback()).then(() => { throw reason })
    })
  }
  // Promise.all([cb(), as[=()]])
  all(values) {
    if (!Array.isArray(values)) {
      const type = typeof values
      return new TypeError(`TypeError: ${type} ${values} is not iterable`)
    }
    return new MyPromise((resolve, reject) => {
      const resultArr = []
      let orderIndex = 0
      const processResultByKey = (value, index) => {
        resultArr[index] = value
        if (++orderIndex === values.length) {
          resolve(resultArr)
        }
      }
      for (let i = 0; i < values.length; i++) {
        const value = values[i]
        if (value && typeof value.then === 'function') {
          value.then(res => {
            processResultByKey(res, i)
          }, reject)
        } else {
          processResultByKey(value, i)
        }
      }
    })
  }

  race(promises) {
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const val = promises[i]
        if (val && typeof val.then === 'function') {
          val.then(resolve, reject)
        } else {
          resolve(val)
        }
      }
    })
  }

  static resolve(data) {
    return new MyPromise(resolve => {
      resolve(data)
    })
  }

  static reject(reason) {

    return new MyPromise((resolve, reject) => {
      reject(reason)
    })
  }
}

MyPromise.resolve().then(() => {throw 'err'}).catch(err => console.log(err))