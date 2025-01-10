# dc-msg-bot

discord 自动发消息脚本
推特: https://x.com/xwxboring

## 启动项目

node(v16+)

```js
npm install
```

```js
npm run start
```

## 修改 config.js 配置文件

### 频道列表

将想要发自动送消息的频道 id 加入的配置文件的 channels 里面

```js
// id: 频道id
// msg: 该频道才会出现的消息
const channels = [{
  id: "第一个自动发送频道的id",
  msg: ["消息1"， "消息2"],
}， {
  id: "第二个自动发送频道的id",
  msg: ["消息3"， "消息4"],
}];

```

![alt text](image.png)

## 配置 accounts 信息

如何配置 token?
在 discord 想要自动发送消息的频道按照图片复制 Authorization
![alt text](image-1.png)

```js
// token: 帐号的Authorization
// proxy: 代理, 不需要代理填空，如需要请按照该格式填写 "http://username:password@ip:port"
// msg: 只有该帐号才会发的特定消息
const accounts = [
  {
    token: "第一个帐号的Authorization",
    proxy: "http://username:password@ip:port",
    msg: [],
    remark: "帐号 1", // 自定义
  },
  {
    token: "第二个帐号的Authorization",
    proxy: "http://username:password@ip:port",
    msg: [],
    remark: "帐号 2",
  },
];
```

## 编辑全局消息

所有频道、帐号都会可能发出的消息

```js
const messages = ["消息1", "消息2"];
```

## 定时发送

默认设置的 305s - 310s 间隔执行一次整个任务，可自行调整

```js
(async () => {
  let time = 1;
  while (true) {
    try {
      console.log("start:", time++, new Date().toLocaleString());
      await chat();
      // 305-310s 再发送下一次消息
      const sleep = random.int(305000, 310000);
      await sleep(sleep);
    } catch (error) {
      console.error(error);
    }
  }
})();
```

## 多个频道间隔，默认 5 - 10s 发送一个频道的消息

```js
// channel delay 5 - 10s
await sleep(random.int(5000, 10000));
```

## 一个帐号发送完后，默认 5-10s 发送下一个帐号的消息

```js
// account delay 5 - 10s
await sleep(random.int(5000, 10000));
```

## 整体时间线

帐号 1 => 发送完所有 channel list => 帐号 2 => 发送完所有 channel list =>...
