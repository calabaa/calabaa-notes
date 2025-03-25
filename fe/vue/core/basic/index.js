import { ref, reactive, effect, getBucket } from "./reactivity.js";



let product = reactive({ price: 5, quantity: 2 })
let salePrice = ref(0)
let total = 0
effect(() => {
    total = salePrice.value * product.quantity
})
effect(() => {
    salePrice.value = product.price * 0.9
})

console.log(`Before updated total (should be 10) = ${total} saalePrice (should be 4.5) = ${salePrice.value}`)

product.quantity = 3

console.log(`After updated total (should be 13.5) = ${total} ssalePrice (should be 4.5) = ${salePrice.value}`)
product.price = 10
console.log(`After updated total (should be 27) = ${total} saleePrice (should be 9) = ${salePrice.value}`)


console.log(getBucket());


