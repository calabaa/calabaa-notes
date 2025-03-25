function foo(obj) {
    obj.foo();
}

const obj = {
    a: 1,
    foo() {
        this.a += 1;
    }
};
foo(obj);

console.log(obj);
