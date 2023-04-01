import { SlashCommandBuilder, Client } from 'discord.js';
import * as util from 'minecraft-server-util';
import { config } from '../config';
import { ServerInfo } from '../interface/ServerInfo';

const getServerInfo = async (): Promise<ServerInfo | null> => {
  try {
    const query: ServerInfo = await util.queryFull(config.SERVER, config.QUERY_PORT /* , options */);
    if (!query) {
      return null;
    }
    return query;
  } catch (e) {
    return null;
  }
};

const getOnlinePlayers = async () => {
  const serverInfo = await getServerInfo();
  if (!serverInfo?.players) {
    return null;
  }
  return serverInfo.players;
};

const onlineCommand = new SlashCommandBuilder().setName('online').setDescription('查看 FreeCityHK 在線玩家');

const serverCommand = new SlashCommandBuilder().setName('server').setDescription('FreeCityHK Minecraft 伺服器');

export { getServerInfo, getOnlinePlayers, onlineCommand, serverCommand };
