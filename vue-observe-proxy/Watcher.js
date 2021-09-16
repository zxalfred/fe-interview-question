import {popTarget, pushTarget} from './Dep.js'

class Watcher {
    constructor(expOrFn) {
        this.getter = expOrFn
        this.value = this.init()
    }
    init() {
        pushTarget(this)
        this.value = this.getter()
        popTarget()
        return this.value
    }
    update() {
        this.value = this.getter()
        return this.value
    }
}

export default Watcher