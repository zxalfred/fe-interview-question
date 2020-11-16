# JavaScript 🛠 

* 什么是面向对象

  把一组数据结构和处理它们的方法组成**对象**(object), 把相同行为的对象归纳为**类**(class),通过类的**封装**(encapsulation)隐藏内部细节，通过**继承**(inheritance)实现类的**特化**(specialization)/**泛化**(generalization),通过**多态**(polymorphism)实现基于对象类型的**动态分配**(dynamic dispatch)

* JS 有哪些内置对象

  `Object` 是所有对象的父对象

  - **数据封装类对象**

    `Object`, `Array`, `Boolean`, `Number`, `String`

  - **其他对象**

    `Function`, `Arguments`, `Math`, `Date`, `RegExp`, `Error` 等等

* 继承的实现方式

  ```javascript
  
  ```

  

* 邮箱校验

  ```javascript
  const reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  ```

* 如何给数字加上千位分隔符

  ```javascript
  function commafy(num) {
    return num && num
    	.toString()
    	.replace(/\B(?=(\d{3})+$)/g, ',')
  }
  ```

* 模拟实现 call 和 apply

  ```javascript
  Function.prototype.myCall = function(context) {
    const context = context || window
    context.fn = this
    const args = [...arguments].slice(1)
    const result = context.fn(...args)
    delete context.fn
    return result
  }
  
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

  



