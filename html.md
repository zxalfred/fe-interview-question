# HTML✍️



* DOCTYPE作用？标准模式与兼容模式各有什么区别?

  1. `<!DOCTYPE html>` 声明位于HTML文档中的第一行，处于\<html\>标签之前。告知浏览器的解析器用什么文档标准解析这个文档。当DOCTYPE不存在或格式不正确会导致文档以兼容模式呈现
  2. **标准模式**的排版和JS运作模式都是以支持的最高标准运行；**兼容模式**的页面以宽松的向后兼容方式显示，模拟老浏览器的行为，以防止站点无法工作

* HTML 5 为什么只需要写 `<!DOCTYPE HTML>`

  1. HTML 5 不基于 `SGML`，因此不需要对DTD进行引用，但是需要doctype来规范浏览器行为
  2. 而HTML 4.0.1 基于`SGML`, 所以需要对DTD进行引用，才能告知浏览器文档所使用的文档类型

* 行内元素有哪些？块级元素有哪些？空元素有哪些

  CSS 规范规定，每个元素都有display属性，块级元素为block，行内元素为inline

  1. 行内元素：a b span img input select strong
  2. 块级元素：div ul ol dl dt dd li h1 h2 h3 table th tr td
  3. 常见空元素：br hr img input link meta area base col command embed keygen param source track wbr

* 导入页面样式时，使用link和@import有什么区别

  1. link属于XHTML标签，除了加载CSS外，还能用于定义RSS, 定义rel连接属性等作用；而@import是CSS提供的，只能用于加载CSS；
  2. 页面被加载的时，link会同时被加载，而@import引用的CSS会等到页面被加载完再加载；
  3. import是CSS2.1 提出的，只在IE5以上才能被识别，而link是XHTML标签，无兼容问题；
  4. link支持使用js控制DOM去改变样式，而@import不支持。

* 如何实现浏览器内多个标签页之间的通信?

  ​	`WebSocket`、`SharedWorker`、`localstorge`、`cookies`

  ​		localstorage 在另一个浏览上下文里被增删改时，都会触发一个`storage`事件

* 页面可见性（Page Visibility API） 可以有哪些用途？

  1. 通过`visibilityState`的值和`visibilitychange`事件检测页面当前是否可见，以及打开网页的事件等
  2. 在页面被切换到其他后台进程的时候，自动暂停音乐或视频播放

* 实现不使用 border 画出1px高的线，在不同浏览器的标准模式与怪异模式下都能保持一致的效果

  ```html
  <div style="height:1px;overflow:hidden;background:red"></div>
  ```

* title与h1的区别、b与strong的区别、i与em的区别？

  1. `title`属性没有明确意义只表示是个标题， `h1`则表示层次明确的标题，对页面信息的抓取也有很大的影响
  2. `strong`是表明重点内容，有语气加强的含义，使用阅读设备阅读时，`strong`会重读，而`b`不会
  3. `i` 内容展示为泄题，`em`表示强调的文本

  **Physical Style Elements -- 自然样式标签**

  ​	b, i, u, s, pre

  **Semantic Style Elements -- 语义样式标签**

  ​	strong, em, ins, del, code

  **❗️应该准确使用语义样式标签，但不能滥用，如果不能确定时首选自然样式标签**

