export function trigger(target, key) {
    if (!bucket) {
        return 
    }
    const depMap = bucket.get(target)
    if (!depMap) {
        return 
    }
    const depSet = depMap.get(key)
    if(!depSet){
        return
    }
    depSet.forEach(fn => fn());
}