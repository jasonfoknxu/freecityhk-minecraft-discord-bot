import { config } from '../config';
import * as util from 'minecraft-server-util';
import { SlashCommandBuilder } from 'discord.js';

const add2Whitelist = async (playerName: string) => {
  try {
    const client = new util.RCON();
    await client.connect(config.SERVER, config.RCON_PORT /* , options */);
    await client.login(config.RCON_PW);
    const message = await client.execute(`whitelist add ${playerName}`);
    return message;
  } catch (e) {
    return null;
  }
};

const notiPlayer = async (message: string, color: string = 'light_purple') => {
  try {
    const client = new util.RCON();
    await client.connect(config.SERVER, config.RCON_PORT /* , options */);
    await client.login(config.RCON_PW);
    const result = await client.execute(
      `/title @a title {"text":"${string2Unicode(message)}","bold":true,"color":"${color}"}`
    );
    return result;
  } catch (e) {
    return null;
  }
};

const say = async (message: string) => {
  try {
    const client = new util.RCON();
    await client.connect(config.SERVER, config.RCON_PORT /* , options */);
    await client.login(config.RCON_PW);
    const result = await client.execute(`say ${message}`);
    return result;
  } catch (e) {
    return null;
  }
};

const string2Unicode = (str: string) => {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i).toString(16).toUpperCase();
    result += '\\u' + '0'.repeat(4 - code.length) + code;
  }
  return result;
};

const whitelistCommand = new SlashCommandBuilder()
  .setName('whitelist')
  .setDescription('將玩家加入白名單')
  .addStringOption((option) => option.setName('玩家名').setDescription('Minecraft 玩家的名稱').setRequired(true));

const notiPlayerCommand = new SlashCommandBuilder()
  .setName('noti')
  .setDescription('發放公告通知，將會在玩家畫面中間顯示')
  .addStringOption((option) => option.setName('公告訊息').setDescription('公告内容').setRequired(true));

const sayCommand = new SlashCommandBuilder()
  .setName('say')
  .setDescription('透過聊天向多個玩家發送訊息')
  .addStringOption((option) => option.setName('訊息').setDescription('訊息内容').setRequired(true));

export { add2Whitelist, notiPlayer, say, whitelistCommand, notiPlayerCommand, sayCommand };
