const bucket = new WeakMap()
let activeEffect = null
export function effect(fn) {
    if (typeof fn !== 'function') {
        return
    }
    activeEffect = fn
    fn()
    activeEffect = null
}
export function reactive(target) {
    const p = new Proxy(target, {
        get(target, key, receiver) {
            track(target, key)
            return Reflect.get(target, key, receiver)
        },
        set(target, key, value, receiver) {
            const oldValue = target[key]
            const result = Reflect.set(target, key, value, receiver)
            if (oldValue != value) {
                trigger(target, key)
            }
            return result
        }
    })
    return p
}

export function ref(raw) {
    let r = {
        get value() {
            track(r, 'value')
            return raw
        },
        set value(newVal) {
            raw = newVal
            trigger(r, 'value')
        }
    }
    return r
}

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
function trigger(target, key) {
    if (!bucket) {
        return
    }
    const depMap = bucket.get(target)
    if (!depMap) {
        return
    }
    const depSet = depMap.get(key)
    if (!depSet) {
        return
    }
    const effects = new Set(depSet)
    effects.forEach(fn => fn());
}

export function getBucket() {
    return bucket
}