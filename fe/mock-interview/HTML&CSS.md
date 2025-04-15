## 03. HTML & CSS

### HTML

1. **HTML 语义化**:

   - 谈谈你对 HTML 语义化的理解。
     - 可读性, 有助于 SEO 理解, 帮助特殊群体理解页面

2. **HTML5 新标签**:
   - HTML5 新增了哪些语义化标签？
     - header footer nav article section

### CSS

3. **CSS 选择器优先级**:

   - CSS 选择器的优先级是如何计算的？
     - 内联 id class 类/伪类(:hover)/属性([type="text"]) 元素/伪元素(::after)

4. **CSS 盒模型**:

   - 解释一下 CSS 的盒模型（标准盒模型 vs IE 盒模型）。如何切换盒模型？ (box-sizing)
     - 标准盒模型 `box-sizing: content-box;` 仅仅元素内容
     - IE 盒模型 `box-sizing: border-box;` 包括内容,内边距,边框

5. **垂直水平居中**:

   - 实现垂直水平居中有哪些方法？
     - Flexbox: `display: flex; justify-content: center; align-items: center;`
     - Grid: `display: grid; place-items: center; height: 100vh;`
     - `position: absolute;  top: 50%; left: 50%; transform: translate(-50%, -50%);`
     - line-height for text

6. **BEM 命名规范**:

   - 谈谈你对 BEM 命名规范的理解。
     - block
     - block\_\_element
     - block--modifier
     - block\_\_element--modifier

7. **布局**:

   - Flexbox 布局和 Grid 布局的区别及各自的应用场景是什么？
     - Flexbox 一维布局, 适合于简单的线性布局
     - Grid 二维布局, 适合复杂的网格和多行多列布局

8. **响应式设计**:

   - 如何实现响应式设计？（媒体查询 @media, rem/em/vw/vh 单位等）

9. **CSS 动画**:

   - CSS 动画 (animation, transition) 如何实现？有何区别？

   ```css
   .button {
     transition: background-color 0.3s ease;
   }
   .button:hover {
     background-color: #0080ff;
   }

   .loading-spinner {
     animation: spin 1s linear infinite;
   }
   @keyframes spin {
     to {
       transform: rotate(360deg);
     }
   }
   ```
