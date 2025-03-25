export function track(target, key) {
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