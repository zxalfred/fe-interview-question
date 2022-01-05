# JavaScript 🛠 

* 什么是面向对象

  把一组数据结构和处理它们的方法组成**对象**(object), 把相同行为的对象归纳为**类**(class),通过类的**封装**(encapsulation)隐藏内部细节，通过**继承**(inheritance)实现类的**特化**(specialization)/**泛化**(generalization),通过**多态**(polymorphism)实现基于对象类型的**动态分配**(dynamic dispatch)
<br />
* 严格模式

  * 变量必须声明后再使用
  * 函数的参数不能有同名属性，否则报错
  * 不能使用with语句
  * 不能对只读属性赋值，否则报错
  * 不能使用前缀 0 表示八进制数，否则报错
  * 不能删除不可删除的属性，否则报错
  * 不能删除变量delete prop，会报错，只能删除属性delete global[prop]
  * eval不会在它的外层作用域引入变量
  * eval和arguments不能被重新赋值
  * arguments不会自动反映函数参数的变化
  * 不能使用arguments.callee
  * 不能使用arguments.caller
  * 禁止this指向全局对象
  * 不能使用fn.caller和fn.arguments获取函数调用的堆栈
  * 增加了保留字（比如protected、static和interface）
    [es6入门-严格模式](https://es6.ruanyifeng.com/#docs/module#%E4%B8%A5%E6%A0%BC%E6%A8%A1%E5%BC%8F)
    [掘金-严格模式](https://juejin.cn/post/6844903858272108551)