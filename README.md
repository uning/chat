## node-chat -  游戏聊天服务器
    目前使用单服务器实现，支持群聊，一对一，一对多方式聊天
    使用socket.io实现,暂时没有实现多服务器通信功能
    提供js，flash客户端

## 系统设计
### *聊天功能*
    socket.io作为协议底层，支持websocket，socket，jsonpolling
	json 数据传输格式
	socket flash policy 文件在10843端口提供

    建立连接分两个阶段，handshake
- handeshake: 使用http，提供用户名密码或login token (php后台生成的cid),用户昵称等信息
- 建立长连接
    正常handshake之后，客户端可以发起长连接
    进入msg处理循环
	服务器维护 在线用户列表，在线好友列表,群在线用户数据



### *消息定义*
```
    {
	 t: 1,     //消息类型 1 -世界聊天，2- 公会聊天，3 系统，4 系统通知，默认0 玩家一对一或1对多聊天
	 to: [],   //接收者id列表
	 c:''      // 消息内容        
    }
```


### *管理功能*
    /useronline 在线用户列表
	/ban/user?uid=xxx  封禁用户
	/ban/ip?ip=xxx  封禁ip
	/sys/notice   设置通知
	/sys/broadcast 广播
	/sys/touser   发送给用户

	.....

## 客户端示例

