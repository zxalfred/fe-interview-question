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
    const result = context[key](...args)
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
    newFunc.prototype = undefined // bind 返回函数的 prototype 为 undefined
    return newFunc
  }
  ```

* 深复制
  见 deepClone 文件

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
    const result = []
    const doingTasks = []
    let i = 0
    const enqueue = () => {
      if (i === array.length) {
        return Promise.resolve()
      }
      const task = Promise.resolve().then(() => iterateFunc(array[i++]))
      result.push(task)
      const doing = task.then(() => doingTasks.splice(doingTasks.indexOf(doing), 1))
      doingTasks.push(doing)
      const res = doingTasks.length >= count ? Promise.race(doingTasks) : Promise.resolve()
      return res.then(enqueue)
    };
    return enqueue().then(() => Promise.all(result))
  }
  // test
  const timeout = i => new Promise(resolve => setTimeout(() => {
    console.log(i)
    resolve(i)
  }, i))
  limit(2, [1000, 1000, 1000, 1000], timeout).then((res) => {
    console.log(res)
  })
  ```

* 数组 reduce
  ```javascript
    Array.prototype.myReduce = function (cb, initialValue) {
      const array = this//获取数组
      let acc = initialValue || array[0]//acc相当于pre
      const startIndex = initialValue ? 0 : 1
      for (let i = startIndex; i < array.length; i++) {
        const cur = array[i]
        acc = cb(acc, cur, i, array)
      }
      return acc
    }
  ```

* 串行执行 promise
  ```javascript
    const promise1 = () => Promise.resolve(1)
    const promise2 = () => new Promise(resolve => {
      setTimeout(() => {resolve(2)}, 2000)
    })
    const promise3 = () => new Promise(resolve => {
      setTimeout(() => {resolve(3)}, 3000)
    })

    function promiseChain(promiseList) {
      function iterate(promiseList, resolve) {
        const promise = promiseList.shift()
        promise().then((v) => {
          console.log(v)
          if (promiseList.length) {
            iterate(promiseList, resolve)
          } else {
            resolve()
          }
        })
      }

      return new Promise((resolve) => {
        iterate(promiseList, resolve)
      })
    }

    const promiseList = [promise1, promise2, promise3]
    promiseChain(promiseList).then(() => {console.log('all promise settled')})
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

  ```javascript
  /*
    解题思路：将数字每四个拆分一次，每次后面加万，亿，万亿，亿亿作为节权位
    然后单独将每四个数按情况转化为汉字，其他情况按下标即可转化，主要考虑为0的情况，
    当零为后面出现时，直接去除，当在两个大于零的数字中间出现时，将多个零合并为一个零
  */
  const numChar = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const numUnit = ['', '十', '百', '千']; //权位
  const numSection = ['', '万', '亿', '万亿', '亿亿']; //节权位
  formatSection = (num) => {
    const arr = String(num).split('').reverse();
    let str = '';
    for (let i = 0; i < arr.length; i++) {
      //将0-9转化为零到九
      let char = arr[i] === '0' ? numChar[0] : numChar[arr[i]] + numUnit[i]; //当数字为0时不加权位，非零加权位
      str = char + str;
    }
    let s = str.replace(/零+/g, '零').replace(/零+$/, ''); //将多个零合并为一个零，并剔除尾端的零
    return s;
  };
  formatNum = (num, str) => {
    //将字符串按个数拆分
    const len = Math.ceil(str.length / num);
    let arr = [];
    for (let i = 0; i < len; i++) {
      const reverseStr = str.split('').reverse().join('');
      const s = reverseStr
        .slice(i * num, i * num + num)
        .split('')
        .reverse()
        .join('');
      arr.unshift(s);
    }
    return arr;
  };
  numberTranToCN = (num) => {
    let arr = formatNum(4, num + ''); //将数字每四个拆分一次
    let list = [];
    for (let i = 0; i < arr.length; i++) {
      let str = formatSection(arr[i]);
      list.push(str);
    }
    let reverseList = list.reverse();
    for (let j = 0; j < reverseList.length; j++) {
      reverseList[j] += numSection[j];
    }
    return reverseList.reverse().join('');
  };

  ```

  动态 import
  ```javascript
    function importModule(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      const tempGlobal = "__tempModuleLoadingVariable" + Math.random().toString(32).substring(2);
      script.type = "module";
      script.textContent = `import * as m from "${url}"; window.${tempGlobal} = m;`;

      script.onload = () => {
        resolve(window[tempGlobal]);
        delete window[tempGlobal];
        script.remove();
      };

      script.onerror = () => {
        reject(new Error("Failed to load module script with URL " + url));
        delete window[tempGlobal];
        script.remove();
      };

      document.documentElement.appendChild(script);
    });
  }
```
