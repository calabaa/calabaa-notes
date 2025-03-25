/**
 * Error handling utility functions
 * Provides centralized error handling functionality
 * Allows registering custom error handlers
 */
// util.js
let hanlerError = null
export default {
  foo(fn) {
    callWithErrorHandling(fn)
  },
  bar(fn) {
    callWithErrorHandling(fn)
  },
  registerErrorHandler(fn) {
    hanlerError = fn
  }
}
function callWithErrorHandling(fn) {
  try {
    fn & fn()
  } catch (e) {
    hanlerError(e)
  }
}

// index.js
import { util } from "util";
util.registerErrorHandler((e) => {
  // console.error(e)
})

/*
export default {
  foo(fn) {
    try {
      fn & fn()
    } catch (e) {}
  },
  bar(fn) {
    try {
      fn & fn()
    } catch (e) {}
  },
}
*/