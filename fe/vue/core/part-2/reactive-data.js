const data = { ok: true, text: 'hello' }



/*
bucket(WeekMap key:target, value: Map<key: Set>)
	target1 (WeekMap key)
		└── text1 (Map key)
			└── effectFn1 (Set value1)
	target2
		└── text2
			└── effectFn2 (Set value1)
			└── effectFn3 (Set value2)
*/

// 副作用函数存储桶
// const bucket = new Set()
const bucket = new WeakMap()

// 全局变量存储被注册的副作用函数
let activeEffect
// 用于注册副作用函数
function effect(fn) {
	const effectFn = () => {
		// 每次执行副作用函数时，根据effectFn.deps 获取所有相关联的依赖集合，
		// 调用cleanup函数，将副作用函数从依赖集合中移除
		cleanup(effectFn)
		activeEffect = effectFn
		fn()
	}
	// effectFn.deps 用来存储所有与该副作用函数相关联的依赖集合
	effectFn.deps = []
	effectFn()
}
const obj = new Proxy(data, {
	get(target, key) {
		track(target, key)
		return target[key]
		// if (activeEffect) bucket.add(activeEffect)
	},
	set(target, key, newVal) {
		target[key] = newVal
		trigger(target, key)
		// bucket.forEach(fn => fn())
		// Return true to indicate successful property setting
		// This is required by Proxy handler's set() trap
		// return true
	}
});
// “追踪”函数，将副作用函数添加至存储桶中
function track(target, key) {
	if (!activeEffect) return
	let depsMap = bucket.get(target)
	if (!depsMap) {
		bucket.set(target, (depsMap = new Map()))
	}
	// deps <-> effects
	let deps = depsMap.get(key)
	if (!deps) {
		depsMap.set(key, (deps = new Set()))
	}
	deps.add(activeEffect)
	// deps 是与当前副作用函数存在联系的依赖集合
	activeEffect.deps.push(deps)
}
// “触发”函数：获取对应target，及key的副作用函数；遍历执行
function trigger(target, key) {
	const depsMap = bucket.get(target)
	if (!depsMap) return
	// effects <-> deps
	const effects = depsMap.get(key)
	/*
		在使用forEach遍历set集合 会按照值被插入的顺序遍历集合中的每个值
		也就是如果在遍历过程中添加新值，新值会在后续被遍历到
		使用其他遍历方式，理论上也可以避免无限循环
		for...of effects / for...of effects.value(), 在遍历开始就创建了一个快照，后续的修改不会影响遍历过程
	 */
	// 此处使用new Set的方式原因：代码意图更明确，性能（避免创建中间数组），保持一致性
	const effectsToRun = new Set(effects)
	effectsToRun.forEach(effectFn => effectFn())
	// effects && effects.forEach(fn => fn())

}

function cleanup(effectFn) {
	console.log(effectFn.deps);
	for (let i = 0; i < effectFn.deps.length; i++) {
		const deps = effectFn.deps[i];
		deps.delete(effectFn)
	}
	effectFn.deps.length = 0
}

effect(() => {
	console.log('run eff');
	// document.body.innerText = obj.text
	document.body.innerText = obj.ok ? obj.text : 'not'
})
console.log(bucket);



setTimeout(() => {
	obj.ok = false
	setTimeout(() => {
		obj.ok = true
		obj.text = 'hello2'
	}, 1000);
}, 1000);