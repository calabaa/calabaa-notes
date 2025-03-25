function isObject(data) {
    return typeof data === 'object' && typeof data !== 'null'
}
let activeEffect
const bucket = new WeakMap()
// 收集依赖
function track(target, key) {
    if (activeEffect) {
        let depMap = bucket.get(target)
        if (!depMap) {
            depMap = new Map()
            bucket.set(target, depMap)
        }
        let depSet = depMap.get(key)
        if (!depSet) {
            depSet = new Set()
            depMap.set(key, depSet)
        }
        depSet.add(activeEffect)
    }
}
// 出发
function trigger(target, key) {
    let depMap = bucket.get(target)
    let depSet = depMap.get(key)
    if (depSet) {
        depSet.forEach(fn => fn())
    }
}
function reactive(data) {
    if (!isObject(data)) return
    const proxy = new Proxy(data, {
        get(target, key) {
            track(target, key)
            return target[key]
        },
        set(target, key, value) {
            target[key] = value
            trigger(target, key)
            return true
        }
    })
    return proxy
}
function effect(fn) {
    if (typeof fn !== 'function') return
    activeEffect = fn
    fn()
    activeEffect = null
}

