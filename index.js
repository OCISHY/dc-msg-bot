const axios = require("axios");
const random = require("random");
const sleep = require("util").promisify(setTimeout);

// 自己编辑要发送的消息内容
const contextList = [
  "aiming to enhance the Web3 ecosystem.",
  "how to get faucet?",
  "how to get faucet???",
  "Im in",
  "good project",
  "have a good day",
  "GM",
  "of course bro",
  "how's going",
  "so do i",
  "yeah",
  "same to me",
  "soon soon",
  "cool",
  "so far",
  "too hard to get level 3",
  "Just keep chasing here",
  "really??",
  "Keep chatting, and we’ll make it.",
  "Maybe not",
  "what this?",
  "why?",
  "not bad",
  "Just keep talking here",
  "keep talking guys",
  "Just keep chatting here",
  "100k is boring, right?",
  "keep moving, and keep chat",
  "yes",
  "Almost there; I can feel the rewards!",
  "Which task I have to do, to get level 3 role?",
  "Which task I have to do, to get level 3 role? Plz help me",
  "How to get level 3 role? ",
  "How to get level 3 role? Plz help me",
  "no not yet",
];

// 频道id
const chanelList = [""];

// token list
const authorizationList = [""];

const headers = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
  "cache-control": "no-cache",
  authorization: "",
  "content-type": "application/json",
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
};

function genContext() {
  const text = contextList[Math.floor(Math.random() * contextList.length)];
  return text;
}

async function getContext() {
  const chanelId = chanelList[Math.floor(Math.random() * chanelList.length)];
  const url = `https://discord.com/api/v9/channels/${chanelId}/messages`;

  try {
    const res = await axios.get(url, { headers });
    const result = res.data;
    const resultList = result
      .filter((context) => {
        return (
          !context.content.includes("<") &&
          !context.content.includes("@") &&
          !context.content.includes("http") &&
          !context.content.includes("?")
        );
      })
      .map((context) => context.content);

    return resultList[Math.floor(Math.random() * resultList.length)];
  } catch (error) {
    console.error(error);
    return genContext();
  }
}

async function chat() {
  // 账号列表
  for (const authorization of authorizationList) {
    const header = {
      ...headers,
      Authorization: authorization,
    };
    // 频道列表
    for (const chanelId of chanelList) {
      const msg = {
        content: await getContext(),
        nonce: `872123${random.int(0, 1000)}24123133422`,
        tts: false,
      };

      const url = `https://discord.com/api/v9/channels/${chanelId}/messages`;

      try {
        const res = await axios.post(url, msg, { headers: header });
        console.log("发送成功:", msg);
      } catch (error) {
        console.error(error?.response?.status, "失败");
      }

      // delay 30 - 50s
      await sleep(random.int(30000, 50000));
    }
  }
}

(async () => {
  let time = 1;
  while (true) {
    try {
      console.log("start:", time++, new Date().toLocaleString());
      await chat();
      // 305-310s 再发送下一次消息
      const sleeptime = random.int(305000, 310000);
      await sleep(sleeptime);
    } catch (error) {
      console.error(error);
    }
  }
})();
