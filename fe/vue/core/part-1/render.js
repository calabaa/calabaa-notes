/**
 * Renders a virtual DOM node into a real DOM element
 * @param {Object} vnode - Virtual DOM node to render
 * @param {HTMLElement} container - Container element to render into
 * 
 * This function handles two types of vnodes:
 * 1. Element nodes (when vnode.tag is a string):
 *    - Creates and mounts actual DOM elements using mountElement()
 * 2. Component nodes (when vnode.tag is a function):
 *    - Renders components by calling mountComponent()
 */
function renderer(vnode, container) {
  if (typeof vnode.tag === 'string') {
    mountElement(vnode, container)
  } else if (typeof vnode.tag === 'object') {
    mountComponent(vnode, container)
  }
}
/**
 * Mounts a virtual DOM element node to the actual DOM
 * @param {Object} vnode - Virtual DOM node to mount
 * @param {HTMLElement} container - Container element to mount to
 * 
 * This function:
 * 1. Creates a real DOM element based on vnode.tag
 * 2. Handles event listeners (props starting with 'on')
 * 3. Processes children:
 *    - If string: creates and appends text node
 *    - If array: recursively renders each child
 * 4. Appends the created element to the container
 */
function mountElement(vnode, container) {
  const el = document.createElement(vnode.tag)

  for (const key in vnode.props) {
    // Check if property key starts with 'on' to identify event handlers
    if (/^on/.test(key)) {
      el.addEventListener(
        key.substring(2).toLowerCase(),
        vnode.props[key]
      )
    }
  }

  if (typeof vnode.children === "string") {
    const text = document.createTextNode(vnode.children);
    el.appendChild(text);
  } else if (vnode.children) {
    vnode.children.forEach((child) => {
      // 递归渲染子节点
      renderer(child, el)
    })
  }
  container.appendChild(el)
}
/**
 * Mounts a component virtual node to the DOM
 * @param {Object} vnode - Virtual component node to mount
 * @param {HTMLElement} container - Container element to mount to
 * 
 * This function:
 * 1. Calls the component function (vnode.tag) to get the rendered subtree
 * 2. Recursively renders the subtree into the container
 */
function mountComponent(vnode, container) {
  const subtree = vnode.tag.render()
  renderer(subtree, container)
}
// 虚拟DOM对象
// const vnode = {
//   tag: "div",
//   props: {
//     onClick: () => alert('hello')
//   },
//   children: [
//     { tag: "p", children: "Hello" },
//     { tag: "p", children: "World" },
//   ],
// };
// const myComponent = function () {
const myComponent = {
  render() {
    return {
      tag: 'div',
      props: {
        onClick: () => alert('hello myComp2')
      },
      children: 'click here'
    }
  }
}
const vnode = {
  tag: myComponent
}


renderer(vnode, document.body);
