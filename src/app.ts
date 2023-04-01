import { Client, GatewayIntentBits, VoiceChannel } from 'discord.js';
import { config } from './config';
import { getServerInfo, getOnlinePlayers, onlineCommand, serverCommand } from './commands/ServerInfo';
import { playerCommand, getPlayer } from './commands/playerInfo';
import { add2Whitelist, notiPlayer, notiPlayerCommand, say, sayCommand, whitelistCommand } from './commands/minecraft';
import { render } from './render';
import * as schedule from "node-schedule";

const client = new Client({ intents: [GatewayIntentBits.Guilds ] });

client.on('ready', async () => {
  if (client.user) {
    console.log(`已登入 Discord： ${client.user.tag}`);
    const allCommands = [playerCommand, onlineCommand, serverCommand, whitelistCommand, notiPlayerCommand, sayCommand];
    allCommands.forEach(async (command) => {
      await client.application?.commands.create(command.toJSON());
    });
  }
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (config.CHANNEL_ID.includes(interaction.channelId)) {
    await interaction.deferReply();
    switch (interaction.commandName) {
      case 'player':
        const playerName = interaction.options.getString('玩家名');
        if (!playerName) {
          await interaction.editReply('請輸入玩家名稱。');
        } else {
          const getPlayerInfo = await getPlayer(playerName);
          if (!getPlayerInfo) {
            await interaction.editReply('\:warning: 出錯了，請稍後再試一次。');
          } else {
            let model;
            if (getPlayerInfo.textures.SKIN.url) {
              model = await render(getPlayerInfo.textures.SKIN.url);
            }
            let replyMessage: { files?: any; content: string } = {
              content: `玩家名：\`${getPlayerInfo.profileName}\`\n玩家ID：\`${getPlayerInfo.profileId}\`\n`,
            };
            if (model) {
              replyMessage = { ...replyMessage, files: [{ attachment: model }] };
            }
            await interaction.editReply(replyMessage);
          }
        }
        break;
      case 'online':
        const onlinePlayers = await getOnlinePlayers();
        if (!onlinePlayers?.list) {
          await interaction.editReply('伺服器目前為離線狀態，或無法取得在線玩家數，請稍後再試一次。');
        } else {
          let reply = '目前有 `' + onlinePlayers.online + '` 名玩家在線';
          if (onlinePlayers.online > 0) {
            reply += '：\n';
          }
          onlinePlayers.list.forEach((player) => {
            reply += '\n\:bust_in_silhouette: ' + player;
          });
          await interaction.editReply(reply);
        }
        break;
        case 'server':
          const serverInfo = await getServerInfo();
          if (!serverInfo) {
            await interaction.editReply('伺服器目前為離線狀態。');
          } else {
            let result = `【FreeCityHK Minecraft】\n${serverInfo.motd.clean}\n版本：\`${serverInfo.version}\`\n玩家人數：\`${serverInfo.players.online}/${serverInfo.players.max}\``;
            await interaction.editReply(result);
          }
        break;
        case 'whitelist':
          const newPlayerName = interaction.options.getString('玩家名');
        if (!newPlayerName) {
          await interaction.editReply('請輸入玩家名稱。');
        } else {
          const updateWhitelist = await add2Whitelist(newPlayerName);
          if (!updateWhitelist) {
            await interaction.editReply('\:warning: 出錯了，請稍後再試一次。');
          } else {
            await interaction.editReply(updateWhitelist);
          }
        }
        break;
        case 'noti':
          const notiMessage = interaction.options.getString('公告訊息');
        if (!notiMessage) {
          await interaction.editReply('請輸入要發放的公告通知。');
        } else {
          const notiResult = await notiPlayer(notiMessage);
          if (!notiResult) {
            await interaction.editReply('\:warning: 出錯了，請稍後再試一次。');
          } else {
            await interaction.editReply(notiResult);
          }
        }
        break;
        case 'say':
          const sayMessage = interaction.options.getString('訊息');
        if (!sayMessage) {
          await interaction.editReply('請輸入要發送的訊息。');
        } else {
          await say(sayMessage);
          await interaction.editReply(`已發送訊息：${sayMessage}`);
        }
        break;
    }
  }
});


const updateChannelName = async () => {
  if (config.UPDATE_CHANNEL) {
      const serverInfo = await getServerInfo();
      const onlinePlayers = serverInfo?.players.online ?? '🔴';
        let title = `🎲｜在線人數：${onlinePlayers}`; // 𝐅𝐫𝐞𝐞𝐂𝐢𝐭𝐲𝐇𝐊
      
        config.UPDATE_CHANNEL.forEach(async (channelId) => {
          const channel = await client.channels.fetch(channelId) as VoiceChannel;
          
          if (channel.name !== title) {
            channel.setName(title);
          }
        });
    }
}

const start = () => {
  try {
    client.login(config.TOKEN);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();


const job = schedule.scheduleJob('*/10 * * * *', async () => {
  await updateChannelName();
});