### 一些常见的手写代码
* 防抖
  ```javascript
  function debounce(fn, interval) {
    let timer

    return function(...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, interval)
    }
  }
  ```

* 节流
  ```javascript
  function throttle1(fn, interval) {
    let startTime

    return function(...args) {
      const nowTime = new Date().valueOf()
      if (!startTime || (nowTime - startTime) > interval) {
        fn.apply(this, args)
        startTime = nowTime
      }
    }
  }

  ```

* new
  ```javascript
    function myNew(func, ...args) {
      const obj = Object.create(func.prototype)
      const res = func.apply(obj, args)
      if (typeof res === 'function' || (typeof res === 'object' && res !== null)) {
        return res
      }
      return obj
    }
  ```

* 继承
  ```javascript
  function Super() {}
  function Sub() {
    Super.call(this)
  }

  Sub.prototype = Object.create(Super.prototype)
  ```

* call
  ```javascript
  Function.prototype.myCall = function(context, ...args) {
    const key = Symbol('key')
    const context = context || window
    context[key] = this
    const result = context[key](...args)
    delete context[key]
    return result
  }
  ```

* apply
  ```javascript
  Function.prototype.myApply = function(context, args) {
    const key = Symbol('key')
    const context = context || window
    context[key] = this
    const result = context[key](args)
    delete context[key]
    return result
  }
  ```


* 实现 bind

  ```javascript
  Function.prototype.myBind = function(context, ...rest) {
    const fn = this

    const newFunc = function(...args) {
      const newArgs = rest.concat(args)
      if (this instanceof newFunc) {
        return new fn(...newArgs)
      } else {
        return fn.apply(context, newArgs)
      }
    }
    return newFunc
  }
  ```

* 深复制
  ```javascript
  function structuralClone(obj) {
    new Promise((resolve) => {
      const { port1, port2 } = new MessageChannel()
      port2.onmessage = e => resolve(e.data)
      port1.postMessage(obj)
    })
  }
  ```
* 柯里化
  ```javascript
  function curry(func) {
    return function curried(...args) {
      if (args.length >= func.length) {
        return func.apply(this, args)
      }
      return function(...args2) {
        return curried.apply(this, args.concat(args2))
      }
    }
  }
  ```
* instanceof
  ```javascript
  function isInstanceOf(instance, fn) {
    let proto = Object.getPrototypeOf(instance)
    const { prototype } = fn
    while (proto !== null) {
      if (proto === prototype) return true
      proto = Object.getPrototypeOf(proto)
    }
    return false
  }
  ```

* 异步并发数量限制
  ```javascript
  /**
   * 关键点
  * 1. new promise 一经创建，立即执行
  * 2. 使用 Promise.resolve() 可以把任务加到微任务队列，防止立即执行迭代方法
  * 3. 微任务处理过程中，产生的新的微任务，会在同一事件循环内，追加到微任务队列里
  * 4. 使用 race 在某个任务完成时，继续添加任务，保持任务按照最大并发数进行执行
  * 5. 任务完成后，需要从 doingTasks 中移出
  */
  function limit(count, array, iterateFunc) {
    const tasks = []
    const doingTasks = []
    let i = 0
    const enqueue = () => {
      if (i === array.length) {
        return Promise.resolve()
      }
      const task = Promise.resolve().then(() => iterateFunc(array[i++]))
      tasks.push(task)
      const doing = task.then(() => doingTasks.splice(doingTasks.indexOf(doing), 1))
      doingTasks.push(doing)
      const res = doingTasks.length >= count ? Promise.race(doingTasks) : Promise.resolve()
      return res.then(enqueue)
    };
    return enqueue().then(() => Promise.all(tasks))
  }
  // test
  const timeout = i => new Promise(resolve => setTimeout(() => resolve(i), i))
  limit(2, [1000, 1000, 1000, 1000], timeout).then((res) => {
    console.log(res)
  })
  ```

* 异步串行｜异步并行执行
  ```javascript
    // 字节面试题，实现一个异步加法
    function asyncAdd(a, b, callback) {
      setTimeout(() => {
        callback(null, a + b)
      }, 500)
    }

    // 1. promisify
    const promiseAdd = (a, b) => new Promise((resolve, reject) => {
      asyncAdd(a, b, (err, res) => {
        if (err) {
          reject(err)
        } else {
          resove(res)
        }
      })
    })

    // 2. 串行
    async function serialSum(...args) {
      return args.reduce((task, now) => task.then(res => promiseAdd(res, now)), Promise.resolve(0))
    }

    // 3. 并行
    async function parallelSum(...args) {
      if (args.length === 1) return args[0]
      const tasks = []
      for (let i = 0; i < args.length; i += 2) {
        tasks.push(promiseAdd(args[i], args[i + 1] || 0))
      }
      const results = await Promise.all(tasks)
      return parallelSum(...results)
    }
  ```

* 给数字加上千位分隔符
  ```javascript
  function commafy(num) {
    return num && num
      .toString()
      .replace(/(?<!\.\d*)\B(?=(\d{3})+(.\d*)?$)/g, ',')
  }
  ```

* 邮箱校验
  ```javascript
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  ```

* 在 web worker 中实现轮询

  ```javascript
  function createWorker(f) {
    const blob = new Blob(['(' + f.toString() +')()']);
    const url = window.URL.createObjectURL(blob);
    const worker = new Worker(url);
    return worker;
  }
  
  var pollingWorker = createWorker((e) => {
    let cache;
  
    function compare(newData, oldData) {  };
  
    setInterval(function () {
      fetch('/my-api-endpoint').then(function (res) {
        var data = res.json();
  
        if (!compare(data, cache)) {
          cache = data;
          self.postMessage(data);
        }
      })
    }, 1000)
  })
  
  pollingWorker.onmessage = function () {
    // render data
  }
  
  pollingWorker.postMessage('init');
  ```