# FreeCityHK Minecraft Discord Bot

專門為 FreeCityHK Minecraft 制作的 Discord Bot


```
✨ FreeCityHK 係一個以 RP [RPG]  的 生存 Minecraft 伺服器 ✨

💫 仲記唔記得你曾經喺 Minecraft 起過嘅偉大建築，面對宏大嘅城堡有冇諗過真真正正成為一方霸主!?💫 

🪙 面對霸權，你有冇一種革命情意結 ?! 或者，相比建築，更加響往冷兵器、傭兵、國戰、荒島生活!? 🪙

🏵️ 玩慣咗 GTA RP 又有冇諗過換個方式，以 Minecraft 嚟過一個另類人生RP !? 🏵️

🌅  FreeCityHK 可能就係你可以嘗試嘅選擇，你可以建立你嘅國家、城邦。🌅

🍻  你可以喺依度招兵買馬造就你嘅軍團，廣交結社成立你嘅暗部。 🍻

☀️ 每個人都有你嘅過往，而唔知喺依個世界你嘅選擇，又會造就點嘅全新篇章呢!?☀️ 

🥠 你嘅 RP 故事正在由你編寫中，我地期待著... 🥠 
```

[FreeCityHK Minecraft 3.0介紹影片](https://www.youtube.com/watch?v=gmT4nW-8rFk)

## 功能 & 指令
- 頻道名顯示在線人數，每10分鐘更新一次
- 查看玩家ID和skin `/player {玩家名}`
- 查看在線玩家 `/online`
- 查看伺服器狀態 `/server`
- 加白名單 `/whitelist {玩家名} `
- 遊戲畫面公告 `/noti {公告内容}`
- 聊天訊息 `/say {訊息内容}`

## 設定 （.env）
- `TOKEN` —— Discord Bot 的 Token
- `CHANNEL_ID` —— 可以使用 Bot 指令的頻道ID（如多個頻道可用`,`分隔）
- `UPDATE_CHANNEL` —— 顯示在線人數的頻道ID（如多個頻道可用`,`分隔）
- `SERVER` —— Minecraft Server 地址
- `QUERY_PORT` —— Minecraft Server Query Port
- `RCON_PORT` —— Minecraft Server Rcon Port
- `RCON_PW` —— Minecraft Server Rcon 密碼
- `PLAYER_API` —— 以玩家名取得玩家ID的API，使用`{{NAME}}`取代玩家名
- `PROFILE_API` —— 以玩家ID取得玩家資料的API，使用`{{PLAYER_ID}}`取代玩家ID

## 使用方法

> 有關建立和設定 Discord Bot 的方法，請自行了解。

1. `yarn install` 或 `npm install` 安裝所需的 dependencies
2. 把 `sample.env` 重新命名為 `.env`
3. 填寫設定
4. `yarn run build` 或 `npm run build` 進行編譯
5. `yarn start` 或 `npm start` 使用 PM2 運行
6. 如果沒有/不想用PM2，可以 `yarn run test` 或 `npm run test` 使用 Node.js 直接運行


## 歡迎加入 FreeCityHK Minecraft Discord
[![FreeCityHK Minecraft Discord](.readme/discord_400.png 'Discord')](https://discord.freecityhk.city)


## Credits
- [axios](https://github.com/axios/axios)
- [Crafatar](https://github.com/crafatar/crafatar/) （Minecraft Skin render 方法）
- [node-canvas](https://github.com/Automattic/node-canvas)
- [discord.js](https://github.com/discordjs/discord.js)
- [dotenv](https://github.com/motdotla/dotenv)
- [minecraft-server-util](https://github.com/PassTheMayo/minecraft-server-util)
- [node-schedule](https://github.com/node-schedule/node-schedule)
