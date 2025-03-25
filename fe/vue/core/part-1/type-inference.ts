// 类型推断
function fn<T extends any>(val: T): T {
  return val;
}

const res = fn("str");
