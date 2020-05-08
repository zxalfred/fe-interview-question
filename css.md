# CSS 🌈

* display 有哪些值？说明他们的作用

  | 值             | 作用                                                     |
  | -------------- | -------------------------------------------------------- |
  | `block`        | 块类型。默认宽度为父元素宽度，可设置宽高，换行显示       |
  | `none`         | 元素不显示，并从文档流中移除                             |
  | `inline`       | 行内元素类型。默认宽度为内容宽度，不可设置宽高，同行显示 |
  | `inline-block` | 默认宽度为内容宽度，可以设置宽高，同行显示               |
  | `list-item`    | 像块类型元素一样显示，并添加样式列表标记                 |
  | `table`        | 此元素会作为块级表格来显示                               |
  | `inherit`      | 规定应该从父元素继承 display 属性的值                    |

* position 有哪些值？说明他们的作用

  | 值         | 作用                                                         |
  | ---------- | ------------------------------------------------------------ |
  | `static`   | 指定元素使用正常的布局行为，即元素在文档常规流中当前的布局位置。此时`top`,`right`,`bottom`, `left`和`z-index`无效 |
  | `relative` | 元素先放置在未添加定位时的位置，再在不改变页面布局的前提下调整元素位置 |
  | `absolute` | 元素会被移出正常文档流，并不为元素预留空间，通过指定元素相对于最近的非 static 定位祖先元素的偏移，来确定元素位置 |
  | `fixed`    | 元素会被移出正常文档流，并不为元素预留空间，而是通过指定元素相对于屏幕视口（viewport）的位置来指定元素位置 |
  | `sticky`   | 元素根据正常文档流进行定位，然后相对它的*最近滚动祖先*和 [containing block](https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_Block) (最近块级祖先 nearest block-level ancestor)，包括table-related元素，基于`top`, `right`, `bottom`, 和 `left`的值进行偏移。偏移值不会影响任何其他元素的位置。 |

* 多列等高如何实现？

  1. 父容器设置 `overflow:hidden`，设置很大的`padding-bottom`、`margin-bottom`正负值相抵
  2. 父容器设置 `display:table`，列设置`display:table-cell`
  3. `flex`弹性盒子

* 下列清楚浮动代码的原理是什么？

  ```css
  .clearfix::after {
  	content: ' ';
  	display: block;
  	clear: both;
  }
  ```

  `clear`属性的作用是该元素本身的left/right/both，不允许出现浮动元素。所以当它的left/right/both元素是浮动元素时候，它会**另起一行**，从而将父元素撑开

* flex 属性是由哪几个属性合成的，他们的作用是什么？

  1. `flex-grow`

     增长系数，它指定了flex容器中剩余空间的多少应该分配给项目

  2. `flex-shrink`

     收缩系数，flex 元素仅在默认宽度之和大于容器的时候才会发生收缩，其收缩的大小是依据 flex-shrink 的值

  3. `flex-basis`

     初始系数，指定了 flex 元素在主轴方向上的初始大小