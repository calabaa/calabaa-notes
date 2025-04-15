## 04. 浏览器原理 & HTTP 网络

### 浏览器原理

1. **页面加载过程**:

   - 从输入 URL 到页面加载完成，整个过程发生了什么？（DNS 查询、TCP 连接、HTTP 请求、服务器处理、浏览器渲染等）
     - 输入 URL
     - 检查缓存, 命中直接返回资源
     - DNS, 找 IP
     - 建立 TCP 链接
     - HTTP 请求
     - 服务器处理请求
     - 接收 HTTP 响应
     - **关键路径渲染**
       - HTML 解析构建 DOM 树
       - 预加载扫描: 提前并行解析<link> <script> <img> 标签获取资源, 避免阻塞 DOM 构建
       - CSS 解析构建 CSSOM 树, 外部 CSS 文件会阻塞渲染
       - 合并 DOM+CSSOM 渲染树
       - 布局 Layout(回流)
       - 绘制
       - 合成(复杂页面, 多图层渲染, 绘制完成后 合成最终展示内容)
     - 页面展示
     - 之后
       - 后续异步请求
       - 重排：浏览器必须重新计算元素的位置、大小等布局信息。
       - 重绘：浏览器仅仅更新元素的外观，而不需要重新计算布局。

2. **重绘和回流**:

   - 什么是重绘 (Repaint) 和回流 (Reflow/Relayout)？如何减少重绘和回流？
     - 减少 DOM 操作次数

3. **页面渲染详细过程**:

   - 从输入 URL 到页面渲染的详细过程（包括预加载扫描、层合成机制）

4. **Performance API**:

   -渲染树构建渲染树构建渲染树构建

5. **浏览器缓存策略**:

   - 解释浏览器缓存策略，如何设计可版本控制的资源加载方案？

6. **CORS 预检请求**:

   - 跨域解决方案中，CORS 预检请求的具体处理流程？

7. **图片懒加载**:

   - 如何利用 Intersection Observer 实现图片懒加载优化？

   ```js
   const lazyLoad = {
     mounted(el, binding) {
       // Vue 3 用 mounted，Vue 2 用 inserted
       const callback = (entries, observer) => {
         entries.forEach((entry) => {
           if (entry.isIntersecting) {
             el.src = binding.value;
             el.onload = () => el.classList.add("lazy-loaded"); // 可加淡入动画
             observer.unobserve(el);
           }
         });
       };

       const observer = new IntersectionObserver(callback, {
         rootMargin: "0px 0px 100px 0px", // 图片距离视口底部 100px 以内
         threshold: 0.01, // 只要进入视口 1% 触发加载
       });

       observer.observe(el);
     },
   };

   export default lazyLoad;
   ```

### 网络协议

- 应用层（HTTP）发出请求
- 传输层（TCP）将收到的 HTTP 请求报文分割，并在各个报文打上标记序号以及端口号
- 网络层（IP）增加通讯目的地的 MAC 地址后
- 链路层（MAC）使用媒介传输

9. **HTTP 和 HTTPS**:

   - HTTP 和 HTTPS 的区别是什么？HTTPS 的加密过程是怎样的？
     - HTTPS 是在 HTTP 的基础上加上安全套接层进行加密传输(SSL/TLS)
     - 默认端口号分别是 80:443
     - HTTPS
       - 如果通信过程具备了四个特性：**机密性**、**完整性**，**身份认证和不可否认**。通常就可以认为通信是“安全”的
       - 加密过程: 服务端通过非对称加密(RSA)生成公钥私钥,将**公钥**传给客户端; 客户端通过对称加密生成 AES 秘钥, 通过私钥加密发给服务端, 之后使用对称加密进行传输
         - (RSA: Rivest–Shamir–Adleman; AES: Advanced Encryption Standard)
       - 摘要算法 SHA-2(保证数据完整性): 原文附上摘要, 服务端拿到原文和摘要, 将原文生成摘要与客户端摘要比对
       - 数字签名(避免客户端服务伪装): 摘要通过私钥加密, 生成数字签名, 公钥解密, 获取摘要
       - 数字证书和 CA,公钥信任问题

10. **HTTP 状态码**:

    - 常见的 HTTP 状态码有哪些？分别代表什么意思？（200, 301, 304, 403, 404, 500, 502 等）

11. **HTTP 缓存机制**:
    - 解释一下 HTTP 缓存机制（强缓存、协商缓存）。涉及哪些 HTTP Header？
      - 开启强缓存（Cache-Control）；
      - 设置协商缓存作为兜底（ETag / Last-Modified）；
      - 静态资源推荐加上内容哈希（如 main.abcd1234.js），彻底控制更新。

### 浏览器存储

12. **Cookie, localStorage, sessionStorage**:
    - Cookie, localStorage, sessionStorage 的区别和应用场景？

### Web 安全

13. **Web 前端安全问题**:
    - 常见的 Web 前端安全问题有哪些？（, CSRF 等）
      - XSS:恶意脚本攻击
      - CSRF: 跨站请求伪造(利用用户登录状态，在用户不知情下伪造请求操作。)
      - 点击劫持: 攻击者使用 iframe 嵌入你的站点，诱导用户点击隐藏内容。
    - 如何防范这些安全问题？
      - XSS: 用户输入严格 转义/过滤（如 <> 替换为 &lt;&gt; DOMPurify 过滤标签; HTTPOnly 设置 Cookie;
      - CSRF: 关键请求使用 POST; 服务端添加 CSRF Token
      - 点击劫持: 使用 JS 检测是否在 iframe
    - 什么是跨域 (CORS)？有哪些解决跨域问题的方法？
      - 服务端设置资源共享, 配置可访问的源
      - 服务端转发
