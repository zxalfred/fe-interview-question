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