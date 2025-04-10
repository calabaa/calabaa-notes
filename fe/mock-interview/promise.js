class MyPromise {
    // 构造函数接收一个 executor 函数，该函数立即执行，并传入 resolve 和 reject
    constructor(executor) {
        this.state = 'pending';  // 初始状态是 pending
        this.value = undefined;  // 用来存储成功的结果
        this.reason = undefined; // 用来存储失败的原因
        this.onFulfilledCallbacks = []; // 存储所有的 `then` 的成功回调
        this.onRejectedCallbacks = []; // 存储所有的 `then` 的失败回调

        // resolve 方法改变状态并存储结果
        const resolve = (value) => {
            if (this.state === 'pending') {
                this.state = 'fulfilled';
                this.value = value;
                // 执行所有成功的回调
                this.onFulfilledCallbacks.forEach(fn => fn(value));
            }
        };

        // reject 方法改变状态并存储错误信息
        const reject = (reason) => {
            if (this.state === 'pending') {
                this.state = 'rejected';
                this.reason = reason;
                // 执行所有失败的回调
                this.onRejectedCallbacks.forEach(fn => fn(reason));
            }
        };

        // 执行传入的 executor 函数
        try {
            executor(resolve, reject);
        } catch (error) {
            reject(error); // 如果 executor 函数执行出错，直接执行 reject
        }
    }

    // then 方法用于指定 Promise 成功或失败后的处理
    then(onFulfilled, onRejected) {
        // 如果传入的回调不是函数，则使用默认函数
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason };

        // 返回一个新的 Promise
        return new MyPromise((resolve, reject) => {
            if (this.state === 'fulfilled') {
                // 如果当前 Promise 已经 fulfilled，直接执行回调
                setTimeout(() => {
                    try {
                        const result = onFulfilled(this.value);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else if (this.state === 'rejected') {
                // 如果当前 Promise 已经 rejected，直接执行失败回调
                setTimeout(() => {
                    try {
                        const result = onRejected(this.reason);
                        resolve(result);
                    } catch (error) {
                        reject(error);
                    }
                }, 0);
            } else {
                // 如果是 pending 状态，存储回调，等到状态改变时执行
                this.onFulfilledCallbacks.push((value) => {
                    setTimeout(() => {
                        try {
                            const result = onFulfilled(value);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });

                this.onRejectedCallbacks.push((reason) => {
                    setTimeout(() => {
                        try {
                            const result = onRejected(reason);
                            resolve(result);
                        } catch (error) {
                            reject(error);
                        }
                    }, 0);
                });
            }
        });
    }

    // catch 方法用于处理 Promise 被拒绝的情况
    catch(onRejected) {
        return this.then(null, onRejected);
    }

    // static resolve 方法：返回一个已完成的 Promise
    static resolve(value) {
        return new MyPromise((resolve) => resolve(value));
    }

    // static reject 方法：返回一个已拒绝的 Promise
    static reject(reason) {
        return new MyPromise((_, reject) => reject(reason));
    }

    // static all 方法：接受一个数组的 Promise，返回一个新的 Promise，只有所有 Promise 都成功时才会成功
    static all(promises) {
        return new MyPromise((resolve, reject) => {
            let result = [];
            let count = 0;
            for (let i = 0; i < promises.length; i++) {
                promises[i].then((value) => {
                    result[i] = value;
                    count++;
                    if (count === promises.length) {
                        resolve(result);
                    }
                }).catch(reject);
            }
        });
    }

    // static race 方法：返回第一个完成的 Promise 的结果
    static race(promises) {
        return new MyPromise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(resolve).catch(reject);
            }
        });
    }
}
