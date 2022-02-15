// 使用 MessageChannel 和 requestAnimationFrame 模拟

// 计算出当前帧 结束时间点
var deadlineTime
 
// 保存任务
var callback
 
// 建立通信
var channel = new MessageChannel()
 
var port1 = channel.port1;
 
var port2 = channel.port2;
 
 
 
// 接收并执行宏任务
 
port2.onmessage = () => {
 
    // 判断当前帧是否还有空闲，即返回的是剩下的时间
 
    const timeRemaining = () => deadlineTime - performance.now();
 
    const _timeRemain = timeRemaining();
 
    // 有空闲时间 且 有回调任务
 
    if (_timeRemain > 0 && callback) {
 
        const deadline = {
 
            timeRemaining, // 计算剩余时间
 
            didTimeout: _timeRemain < 0 // 当前帧是否完成
 
        }
 
        // 执行回调
 
        callback(deadline)
 
    }
 
}
 
window.requestIdleCallback = function (cb) {
 
    requestAnimationFrame(rafTime => {
 
        // 结束时间点 = 开始时间点 + 一帧用时16.667ms
 
        deadlineTime = rafTime + 16.667
 
        // 保存任务
 
        callback = cb
 
        // 发送个宏任务
 
        port1.postMessage(null);
 
    })
 
}