# React

* 调用 `setState` 之后发生了什么
1. 在 setState 的时候，React 会为当前节点创建一个 updateQueue 的更新列队。
2. 然后会触发 reconciliation 过程，在这个过程中，会使用名为 Fiber 的调度算法，开始生成新的 Fiber 树， Fiber 算法的最大特点是可以做到异步可中断的执行。
3. 然后 React Scheduler 会根据优先级高低，先执行优先级高的节点，具体是执行 doWork 方法。
4. 在 doWork 方法中，React 会执行一遍 updateQueue 中的方法，以获得新的节点。然后对比新旧节点，为老节点打上 更新、插入、替换等 Tag。
5. 当前节点 doWork 完成后，会执行 performUnitOfWork 方法获得新节点，然后再重复上面的过程。
6. 当所有节点都 doWork 完成后，会触发 commitRoot 方法，React 进入 commit 阶段。
7. 在 commit 阶段中，React 会根据前面为各个节点打的 Tag，一次性更新整个 dom 元素。

* `setState` 是同步的还是异步的
