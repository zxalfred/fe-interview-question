class Dep {
    static target = null
    subs = []

    addSub(sub) {
        this.subs.push(sub)
    }

    notify() {
        this.subs.forEach(watcher => watcher.update())
    }

    depend() {
        if (Dep.target) {
          this.addSub(Dep.target)
          popTarget()
        }
      }
}

Dep.target = null

export function pushTarget(target) {
  Dep.target = target
}

export function popTarget() {
  Dep.target = null
}

export default Dep