import { track } from "./track.js";
import { trigger } from "./trigger.js";

const bucket = new WeakMap()

let activeEffect
export function effect(fn) {
    if (typeof fn !== 'function') {
        return
    }
    activeEffect = fn
    fn()
    activeEffect = null
}
export function reactive(obj) {
    const p = new Proxy(obj, {
        get(target, key) {
            track(target, key)
            return target[key]
        },
        set(target, key, value) {
            trigger(target, key)
            target[key] = value
            return true
        }
    })
    return p
}