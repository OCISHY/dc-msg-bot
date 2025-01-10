const axios = require("axios");
const random = require("random");
const sleep = require("util").promisify(setTimeout);
const { accounts, channels, messages, userAgentData } = require("./config");
const { HttpsProxyAgent } = require("https-proxy-agent");

const headers = {
  accept: "*/*",
  "cache-control": "no-cache",
  dnt: "1",
  origin: "https://discord.com",
  pragma: "no-cache",
  priority: "u=1, i",
  "content-type": "application/json",
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "sec-ch-ua-mobile": "?0",
};

const createAxiosInstance = (proxyUrl) => {
  if (proxyUrl) {
    const proxyParts = proxyUrl.match(
      /^http:\/\/([^:]+):([^@]+)@([^:]+):(\d+)$/
    );

    if (proxyParts) {
      return axios.create({
        httpAgent: new HttpsProxyAgent(proxyUrl),
        proxy: false,
      });
    } else {
      throw new Error("代理URL格式无效");
    }
  } else {
    return axios.create();
  }
};

async function chat() {
  for (const [index, account] of accounts.entries()) {
    // 随机 ua 信息
    const ua = userAgentData[index % userAgentData.length];
    const {
      token: authorization,
      proxy: proxyUrl,
      msg: accountMsg,
      remark,
    } = account;

    const header = {
      ...headers,
      ...ua,
      Authorization: authorization,
    };

    for (const channel of channels) {
      const { id: channelId, msg: channelMsg } = channel;
      const msgList = [
        ...(accountMsg ?? []),
        ...(channelMsg ?? []),
        ...(messages ?? []),
      ];
      const content = msgList[Math.floor(Math.random() * msgList.length)];
      const msg = {
        content: content,
        nonce: `82329451214${random.int(0, 1000)}33232234`,
        tts: false,
      };

      const url = `https://discord.com/api/v9/channels/${channelId}/messages`;

      try {
        const axiosInstance = createAxiosInstance(proxyUrl);
        const res = await axiosInstance.post(url, msg, {
          headers: header,
        });
        console.log(remark, "发送成功:", content);
      } catch (error) {
        console.error(remark, "发送失败:", error?.response?.status);
      } finally {
        console.log(
          `\x1b[42m%s\x1b[0m`,
          `[${new Date().toLocaleString("zh-CN", {
            timeZone: "Asia/Shanghai",
          })}]`
        );
      }

      // channel delay 5 - 10s
      await sleep(random.int(5000, 10000));
    }

    // account delay 5 - 10s
    await sleep(random.int(5000, 10000));
  }
}

(async () => {
  let time = 1;
  while (true) {
    try {
      console.log("start:", time++, new Date().toLocaleString());
      await chat();
      // 305-310s 再发送下一次消息
      // await sleep(random.int(305000, 310000));
      await sleep(random.int(60000, 65000));
    } catch (error) {
      console.error(error);
    }
  }
})();
