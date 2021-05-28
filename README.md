# 轨迹管理平台

## _V2.0.0_
**本地调试**
```
npm run dev
```
**本地打包**
```$xslt
npm run build
```
发布到cos 环境
```$xslt
npm run test
```

## 项目安装包部署流程
1. git下载 对应tags下的安装包文件 dist.zip ，或者下载源代码zip文件（其中包含dist文件夹）
2. 解压dist 文件，打开 cd dist文件夹路径下
3. 安装项目服务器环境（express）——需node环境
    ```$xslt
    npm i express -D
    npm i express-static-gzip -D
    ```
4. 安装成功后，node server.js 运行服务器启动文件，弹出`trace-management is started at http://127.0.0.1:8089
`表示项目启动成功，点击 http://127.0.0.1:8089 链接即可访问。


注意：
- 可在server.js 文件中 `const port = 8090;` 修改端口号
    
