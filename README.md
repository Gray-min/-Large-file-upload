# -Large-file-upload
大文件上传
## 功能
* 大文件切割，分片上传
* 暂停文件上传，断点续传

## 实现思路
* 利用file继承blob对象这一点，使用slice方法对文件按指定大小分片
* 分别上传成功后，向后端发送合并请求
* 后端以流的方式读取分片文件，合并流数据后写文件

## 实现步骤
1. 前端读取文件并通过spark-md5计算出文件的hash值
2. 利用计算的hash值及文件名询问后端是否上传过文件
3. 后端返回已上传完成或已上传的切片编号
4. 文件切片并跳过已上传的分片
5. 全部上传完成后发起分片合并请求
6. 合并成功后将文件存入以hash值命名的文件夹，删除分片
7. 大文件上传成功

## 前端front
* npm install 安装依赖
* npm start 启动

## 后端 node+express
* npm install 安装依赖
* npm start 启动

## 运行端口
* 前端5000
* 后端3000
