## 05. Vue 深度
1. **vue2和vue3的区别**
  - 生命周期没有creat,setup等同于create,卸载改成unmount；vue3中v-if高于v-for的优先级；根实例的创建从newapp变成了createApp方法；一些全局注册,比如mixin,注册全局组件,use改成了用app实例调用,而不是vue类调用；新增Teleport、Suspense组件；template模板可以不包在一个根div里
  - 响应式原理改成用proxy, 解决无法监听对象属性新增删除问题
  - 组合是api写法更有利于函数式编程, 设计实现钩子函数, 便于按需引入, 做到高内聚低耦合, 不同类型的功能更加独立, 减少修改的错误概率, 代码结构也更清晰
  - 动态节点标记, 静态节点没有特殊标记
  - vue2 mixin,  vue3建议使用hook
  - v-model用作自定义组件 - modelValue update:modelValue；vue2都一致, 表单修改
  - 更好支持TS, 定义ref<类型> 
  - diff算法区别
    | 优化点       | Vue2 双端 Diff   | Vue3 快速 Diff                                                       |
    | ------------ | ---------------- | -------------------------------------------------------------------- |
    | 比对策略     | 双指针向中间靠拢 | 预处理 + LIS 优化                                                    |
    | 时间复杂度   | O(n)             | O(n)(但实际更高效)                                                   |
    | DOM 移动次数 | 可能较多         | 最少(LIS 确保只移动必要节点)                                         |
    | 静态节点处理 | 无特殊优化       | 编译阶段patchFlags(静态0,  文字1, class:  2)静态提升, 减少 diff 需要 |
2. **核心原理**:

   - Vue 的响应式原理是什么? Vue 2 (Object.defineProperty) 和 Vue 3 (Proxy) 的实现有何不同? 优劣势? 

     ```js
     /*
     定义副作用函数存储桶(WeekMap), key: target, value: Map:(key: key, value: Set(函数组合))
     使用Proxy的get, 将对应的target, key, 分别将副作用(effect)函数推入桶内, track方法
     对应的set(target, key, value)方法, 找到桶内对应的函数组合, 遍历执行,  trigger方法
     vue2中在组件创建之初, 需要将定义的key当场转化为响应式;  但在vue3中,proxy支持可以动态添加新的响应式属性, 比如有某个庞大的数据对象, 但是在某些场景只需要使用前几个属性
     */
     ```

   - 请解释一下 Virtual DOM (虚拟 DOM) 及其 diff 算法。为什么需要 Virtual DOM? 
     - 对比新旧虚拟 DOM, 找出最小修改路径, 操作 DOM
     - 浏览器反复重排重绘开销大
     - Diff 原理
       - vue3 静态节点提升
       - 双端对比
         - 从前到后依次比对, 遇到不同节点停止
         - 从后到前---
       - 旧节点遍历完成, 新节点还有剩余, 新增重中间内容
         - 新节点遍历完成, 旧节点还有剩余, 删除操作
       - 处理未知序列
         - 定义了节点key, 记录映射表
         - 遍历旧节点, 查找旧节点在新节点的位置(有keyMap, 直接从映射表查找, 无则遍历查找)
         - 未找到删除, 找到patch()
         - 移动挂载节点-最长递增子序列算法(LIS)
           - 有节点需要移动时生成最长递增子序列
           - 从后到前遍历新节点, 在“最长递增子序列”的节点不需要动, 其他节点发生移动
   - patch干啥了: 
     - 如果新旧节点完全相同,则不需要更新；
     - 如果新旧节点类型不同,则卸载旧节点,挂载新节点；
     - 根据新节点的类型(文本、注释、Fragment等)调用相应的处理函数；
     - 对于组件类型,会递归更新子组件；
     - 处理props、ref和生命周期钩子
   - Vue 组件的生命周期钩子有哪些? 分别在什么时候触发? 
   - v-if 和 v-show 的区别及适用场景? 
   - computed 和 watch 的区别及适用场景? 
   - v-model 的实现原理是什么? 
     - value input 的语法糖
     - 自定义组件中也可支持 v-model, 绑定 prop 和 emit

3. **组件化**:

   - 父子组件之间如何通信? (props/$emit, $parent/$children, ref, provide/inject)
   - 非父子/兄弟组件之间如何通信? (Event Bus, Vuex/Pinia)
   - keep-alive 组件的作用和原理是什么? 
     - 缓存, vue 会将 keep-alive 包裹的内容加入缓存池, 高级用法 include, exclude, max 最大组件数
   - 如何封装一个可复用的 Vue 组件? (考虑 props 验证、slots、事件等)
     - 样式封装
     - 组件复用, 规划出常用的属性, 常用方法, 尽可能降低耦合

4. **Vue 生态**:

   - Vue Router 的原理是什么? 有几种模式 (hash, history)? 它们的区别是什么? 
     - history: 变浏览器的历史记录来控制路由, 额外配置服务器
     - 初始化过程: Vue Router 通过 new Router() 初始化, 配置路由规则和模式(如 hash 或 history)。
     - 路由切换: 路由切换通过 pushState 或 replaceState 更新浏览器 URL, 然后在 router-view 中渲染对应的组件。
     - 历史记录管理: 根据不同的路由模式(hash 或 history), Vue Router 使用不同的历史记录管理机制, 监听 URL 的变化并更新当前路由。
     - 路由匹配: 通过 match 方法, Vue Router 匹配当前路径与路由表中的规则, 找到对应的组件。
     - 组件渲染: 通过 <router-view> 动态渲染路由匹配到的组件。
   - Vuex/Pinia 的核心概念(State, Getter, Mutation, Action, Module)是什么? 它们解决了什么问题? Pinia 相对于 Vuex 有哪些改进? 

     - State: 存储应用的共享数据。
     - Getter: 用来派生 state 中的数据, 类似计算属性。
     - Mutation: 同步修改 state 的方法。
     - Action: 处理异步操作和复杂逻辑, 通常会触发 mutation 来更新 state。
     - Module: 用于将状态、getter、mutation 和 action 拆分到不同的模块中, 在 Vuex 中实现模块化管理, Pinia 使用多个 store 来替代模块化。

     - Pinia 相对于 Vuex 在多个方面做了改进和优化。首先, 
     - Pinia 提供了更简洁直观的 API, 使用 defineStore 来创建 store, 减少了冗长的配置
     - Pinia 取消了 mutation 的概念, 允许直接在 actions 中修改 state, 使得状态管理更加灵活。
     - Pinia 不强制模块化, 支持多个独立的 store。
     - Pinia 还更好地支持 TypeScript
     - 总的来说, Pinia 相比 Vuex 在简化 API、类型支持、性能优化、插件机制等方面都有显著的提升, 使得状态管理更加高效且易于使用。

5. **Vue 3 新特性**:

   - Composition API 相比 Options API 有哪些优势? 
     - 更好的逻辑复用
     - 可以写自定义钩子函数, 将同一方法聚合, 代码结构更清晰
     - 增强 TS 支持
   - setup 函数的作用是什么? 
     - setup 函数是 Vue 3 中 Composition API 的入口点, 初始化响应式状态等
     - setup 函数是整个组件逻辑的核心
   - 了解 Teleport, Suspense 等新组件吗? 
     - Teleport 使得我们能够将子组件的 DOM 元素渲染到页面的不同位置, 非常适合模态框、通知等全局 UI 组件的实现。
     - Suspense 为异步组件的加载提供了灵活的占位符机制, 增强了异步操作的用户体验, 尤其在大型应用中, 当异步组件加载较慢时尤为重要。

6. **diff 算法优化**:

   - 对比 Vue2/3 的 diff 算法优化, 解释静态节点提升原理

7. **自定义渲染器**:

   - 如何用自定义渲染器实现小程序平台适配? 

8. **SSR 组件设计**:

   - 设计一个支持 SSR 的 Vue 组件需要注意哪些 hydration 问题? 

9.  **Tree-shaking 排查**:
   - 使用 Vite 时遇到 Tree-shaking 失效该如何排查? 
