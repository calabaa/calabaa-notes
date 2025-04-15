## 01. JavaScript 基础

1. **闭包 (Closure)**:

   - 请解释一下什么是 JavaScript 中的闭包？
   - 闭包有哪些应用场景？（例如：模块化、防抖节流、保存状态）
   - 使用闭包需要注意什么？（例如：内存泄漏）
   - 解释闭包在模块化开发中的应用，内存泄漏如何监控？
     - 未解除事件监听, 闭包持有外部变量引用 可能会发生内存泄漏
     - Performance, 可以看出内容占用波形; Memory 可以检查对象引用关系

   ```js
   // 闭包就是当前函数能够记住其作用域内的所需要记住的内容, 可以保存状态, 数据私有(提供可访问方法), 防抖, 节流
   function debounce(fn: Function, delay) {
     let timer = null;
     return function (...args) {
       if (timer) {
         clearTimeout(timer);
       }
       timer = setTimeout(() => {
         fn.apply(this, args);
       }, delay);
     };
   }
   ```

   ```js
   function throttle(fn, delay) {
     // 上次执行函数的时间
     let lastTime = 0;
     return function (...args) {
       // 当前时间
       const now = Date.now();
       // 如果当前时间与上次执行函数的时间间隔大于等于设定的延迟时间
       if (now - lastTime >= delay) {
         // 更新上次执行函数的时间
         lastTime = now;
         // 执行函数并传入参数
         return fn.apply(this, args);
       }
     };
   }

   // 定义节流函数 throttle2，接收一个函数 fn 和延迟时间 delay
   function throttle2(fn, delay) {
     // 记录上次执行函数的时间
     let lastTime = 0;
     // 定时器变量
     let timer = null;

     // 返回一个新的函数
     return function (...args) {
       // 获取当前时间
       const now = Date.now();
       // 计算剩余时间
       const remaining = delay - (now - lastTime);

       // 如果剩余时间小于等于0
       if (remaining <= 0) {
         // 如果定时器存在，清除定时器
         if (timer) {
           clearTimeout(timer);
           timer = null;
         }
         // 更新上次执行函数的时间
         lastTime = now;
         // 执行函数并传入参数
         return fn.apply(this, args);
         // 如果定时器不存在
       } else if (!timer) {
         // 设置定时器
         timer = setTimeout(() => {
           // 更新上次执行函数的时间
           lastTime = Date.now();
           // 清除定时器
           timer = null;
           // 执行函数并传入参数
           fn.apply(this, args);
         }, remaining);
       }
     };
   }
   ```

2. **原型与原型链 (Prototype & Prototype Chain)**:

   - 解释一下 JavaScript 的原型和原型链机制。
   - `__proto__` 和 `prototype` 的区别是什么？
   - 如何实现继承？（ES5 原型链继承 vs ES6 class extends）

   ```js
   // fn Person 构造函数, Person.prototype是原型, const p = new Person()实例, 在实例上执行某一方法, 查找顺序在实例上->在原型上->Object.prototype上
   // Person.prototype === person.__proto__
   // person.__proto__.__proto__ => Object.prototype
   // person.__proto__.__proto__.__proto__ => null
   function extendsFn(Child, Parent) {
     Child.prototype = Object.create(Parent.prototype);
     Child.prototype.constructor = Child;
   }
   function Parent(name) {
     this.name = name;
   }
   Parent.prototype.sayName = function () {
     console.log(this.name);
   };
   function Child(name, age) {
     // 调用父类构造函数
     Parent.call(this, name);
     this.age = age;
   }
   extendsFn(Child, Parent);
   Child.prototype.sayAge = function () {
     console.log(this.age);
   };
   const child = new Child("calabaa", 20);
   child.sayName();
   child.sayAge();
   ```

3. **this 指向**:

   - this 在不同场景下（全局、函数调用、对象方法、构造函数、箭头函数、call/apply/bind）的指向分别是什么？
     - 全局: window, golbal; 函数调用: 调用函数方; 对象方法: 指向该对象; 构造函数: 新创建的实例对象; 箭头函数: 无 this 概念, 外部作用域;
     - call/apply/bind: 显示指定 this, call: 参数数组传递, apply: 参数直接传递; bind 生成新函数, 参数直接传递, 可在后期调用;

4. **事件循环 (Event Loop)**:

   - 请解释一下浏览器或 Node.js 中的事件循环机制。
     - 调用栈,执行同步代码, (检查微任务队列执行, 从宏任务队列中取出宏任务执行) 重复
   - 宏任务 (Macrotask) 和微任务 (Microtask) 有什么区别？常见的宏任务和微任务有哪些？
     - 微任务优先级高于宏任务, setTimeout, setInterval, 微任务:promise,await 后面内容
   - async/await 的工作原理是什么？它和 Promise 有什么关系？
     - 等待 then 方法对象执行结束后执行 await, 异步代码同步化
   - 如何用宏任务/微任务优化异步代码？
     - 微任务高于宏任务, 可以使用微任务减少 UI 渲染延迟(状态更新, DOM 操作)
     - 无需立即执行的函数可以放入宏任务, 避免 UI 渲染阻塞(定时任务, 网络请求)

   ```js
   async function async1() {
     console.log("async1 start"); // 2
     await async2();
     console.log("async1 end"); // 6
   }

   async function async2() {
     console.log("async2"); // 3
   }

   console.log("script start"); // 1

   setTimeout(function () {
     console.log("setTimeout"); // 8
   }, 0);

   async1();

   new Promise(function (resolve) {
     console.log("promise1"); // 4
     resolve();
   }).then(function () {
     console.log("promise2"); // 7
   });

   console.log("script end"); // 5
   ```

5. **ES6+ 新特性**:

   - 你常用的 ES6+ 新特性有哪些？（例如：let/const, 箭头函数, Promise, async/await, 解构赋值, 模块化 import/export, Set/Map 等）
   - let, const, var 的区别是什么？
   - Promise 有几种状态？如何处理多个并发的 Promise 请求？(Promise.all, Promise.race)
     - Pending, Fulfilled, Rejected
     - Promise.all 所有方法全部成功才返回 Fulfilled, 否则 Rejected
     - Promise.race 只返回最先返回的 Promise 函数结果
     - Promise.allSettled, 等待所有方法执行结束, 返回每一个结果
   - 手写实现 Promise.allSettled，并处理错误边界

     ```js
     function myAllSettled(promises: Promise[]) {
         return new Promise((resolve, reject) => {
            const result = []
            let completed = 0
            if (promises.length === 0) {
               return resolve([])
            }
            promises.forEach((promise, index) => {
               Promise.resolve(promise).then((value) => {
                  result[index] = { status: 'fulfilled',value }
                  completed++
                  if (completed === promises.length) {
                     resolve(result)
                  }
               }, (reason) => {
                  result[index] = { status: 'rejected',reason }
                  completed++
                  if (completed === promises.length) {
                     resolve(result)
                  }
               }),
            })
         }
      }

     ```

6. **深拷贝函数**:

   - 实现一个深拷贝函数需要考虑哪些边界情况（如循环引用、Date 对象等）？
     - 循环引用: 使用弱引用或者哈希表存储已拷贝过的对象, 遇到已拷贝的对象,直接引用
     - Date/RegExp: 创建新的
     - Array: 递归拷贝数组内容
     - Map/Set: 使用对应的 set,add 方法添加, 递归拷贝
     - Error: 创建新 Error 并保留消息内容

   ```js
   function cloneDeep(target, map = new WeekMap()) {
     if (target === null || typeof target !== "targetect") {
       return target;
     }
     if (map.has(target)) {
       return map.get(target);
     }
     if (target instanceof Date) {
       return new Date(target);
     }
     if (target instanceof RegExp) {
       return new RegExp(target);
     }
     if (Array.isArray(target)) {
       const clone = [];
       target.forEach((item, index) => {
         clone[index] = cloneDeep(item, map);
       });
       return clone;
     }
     if (target instanceof Set) {
       const clone = new Set();
       map.set(target, clone);
       target.forEach((value) => {
         clone.add(cloneDeep(value, map));
       });
       return clone;
     }
     if (target instanceof Map) {
       const clone = new Map();
       map.set(target, clone);
       target.forEach((value, key) => {
         clone.add(cloneDeep(key, map), cloneDeep(value, map));
       });
       return clone;
     }
     const clone = {};
     Object.keys(target).forEach((key) => {
       clone[key] = cloneDeep(target[key], map);
     });
   }
   ```

7. **判断对象类型是否为{}**

   ```js
   // 仅适用于可枚举属性
   Object.keys(obj).length === 0
   Object.entries()
   JSON.stringify
   fn isEmpty(){
      // 适用于所有对象，包括包含 Symbol 的对象。
      for(let key in obj){
         if(obj.hasOwnProperty(key)){
            return false
         }
      }
      return true
   }
   Reflect.ownKeys(obj) // 能检查所有自身属性（包括 Symbol）。不适用于无法访问 Symbol 的情况。

   ```

8. **设计模式**
   - 观察者模式: 事件总线, 监听 触发 EventBus
   - 策略模式: 设计 key:value, 针对同一方法是指不同解决方案
   - 单例模式: 全局状态管理工具, 业务场景方法 Hook,

## 02. TypeScript 进阶

1. **TS vs JS**:

   - 相比 JavaScript，TypeScript 提供了哪些优势？它解决了什么问题？
   - 在大型项目中，使用 TypeScript 有哪些好处？
     - 预防错误类型
     - 提高代码可维护性和可读性
     - 团队协作效率
     - 代码提示
     - 文档即代码，类型定义本身就是文档

2. **核心概念**:

   - 解释一下 TypeScript 中的类型注解 (Type Annotation) 和类型推断 (Type Inference)。
   - interface 和 type 有什么区别和联系？什么场景下使用哪个？
     - interface 更专注于定义对象结构, 扩展和继承
     - type 更灵活
   - 解释一下泛型 (Generics) 的概念及其应用场景。
     ```ts
     function fn<T>(val: T): T[] {
       return [val];
     }
     type MyReadonly<T> = {
       readonly [P in keyof T]: T[P];
     };
     type Person = { name: string; age: number };
     const person: MyReadonly<Person> = { name: "calabaa", age: 31 };
     ```
   - TypeScript 中的枚举 (Enum) 是什么？有什么用？
     - 有名字的常量, 未定义从 0 开始, 定义后之后内容递增, 避免魔法数字
   - 常用的 TS 工具类型有哪些？（例如：Partial, Required, Readonly, Pick, Omit）
     - Partial<T> 所有属性可选
     - Required<T> 所有属性必填
     - Readonly<T> 所有属性只读
     - Pick<T,K> 选取属性
     - Omit<T,K> 排除属性
     - Record<K,T> 构造对象类型
     - ReturnType<T> 获取返回值类型
     - Parameters<T> 参数类型元组

3. **类型推断中的协变和逆变**:

   - 类型推断中的协变和逆变是什么？举例说明
     - 协变：返回值类型是协变的，子类型可以赋值给父类型，常见于返回类型处理，比如 API 响应。
     - 逆变：参数类型是逆变的，父类型可以赋值给子类型，常见于事件处理和回调函数。

4. **条件类型**:

   - 如何用条件类型实现类型守卫？实现一个 Exclude 工具类型
     - 条件类型（T extends U ? X : Y）允许根据类型的条件来返回不同的类型，适用于实现类型守卫和工具类型。
     - 类型守卫（value is T）是通过运行时检查来细化类型，配合条件类型可以帮助我们更精确地推断类型。
     - Exclude 是通过条件类型实现的，它可以从类型中排除某些子类型，帮助我们精细化类型的使用。

5. **声明合并**:

   - 声明合并如何处理第三方库的类型扩展？

     - 声明合并只适用于 interface、namespace、function 的声明。

     ```ts
     import "axios";

     declare module "axios" {
       export interface AxiosRequestConfig {
         authToken?: string;
       }
     }
     ```

6. **装饰器**:

   - 装饰器在类方法中的应用及编译后的代码结构, 仅用于类相关结构
     - 写在方法前,在方法定义阶段执行`@LogAPI()`

7. **泛型约束**:
   - 如何用泛型约束实现类型安全的 API 响应处理？
     - `function fetchApiData<T>(url: string): Promise<ApiResponse<T>> {}`
     - `interface ApiResponse<T> { ... data: T }`
