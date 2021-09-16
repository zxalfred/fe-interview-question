import Dep from './Dep.js'

class Observe {
    constructor(value) {
        this.dep = new Dep()
        return this.observe(value)
    }
    defineReactive(obj){
        const _this = this
        const dep = new Dep()
        if(!obj || typeof obj !== 'object'){
            return obj;
        } else if(Array.isArray(obj)) {
            let temp = []
            if(obj.length > 0) {
                temp = obj.map(item => {
                    if(item && typeof item === 'object'){
                        return this.observe(item)
                    }else {
                        return item
                    }
                })
            }
            return new Proxy(temp, {
                get(target, name) {
                    if(Dep.target){ 
                        dep.depend()
                    }
                    return target[name]
                },
                set(target, name, newValue) {
                    if(newValue && typeof newValue === 'object') {
                        Reflect.set(target, name, _this.observe(newValue))
                        dep.notify()
                    }else if(target[name] !== newValue) {
                        Reflect.set(...arguments)
                        dep.notify()
                    }
                    return true
                }
            })
        } else {
            let temp = {}
            Object.keys(obj).forEach(key => {
                temp[key] = this.observe(obj[key])
            })
            return new Proxy(temp, {
                get(target, name) {
                    if(Dep.target){ 
                        dep.depend()
                    }
                    return target[name]
                },
                set(target, name, newValue) {
                    if(newValue && typeof newValue === 'object') {
                        Reflect.set(target, name, _this.observe(newValue))
                        dep.notify()
                    }else if(target[name] !== newValue) {
                        Reflect.set(...arguments)
                        dep.notify()
                    }
                    return true
                }
            })
        }
        
    }
    observe(data) {
        return this.defineReactive(data)
    }
}

export default Observe