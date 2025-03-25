import { foo } from './utils.js'
const obj = {
    a: 1,
    foo() {
        this.a += 1
    }
}

// Call foo() function with pure annotation to mark it as side-effect free
/*#__PURE__*/ foo(obj)

foo(obj)

console.log(obj);
