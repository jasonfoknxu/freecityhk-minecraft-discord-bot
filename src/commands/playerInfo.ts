import { SlashCommandBuilder } from 'discord.js';
import { config } from '../config';
import axios, { AxiosResponse } from 'axios';
import { Player } from '../interface/Player';
import { PlayerProfile } from '../interface/PlayerProfile';

const getPlayerId = async (name: string): Promise<Player | null> => {
  const name2IdApi = config.PLAYER_API.replace('{{NAME}}', name);
  const player: AxiosResponse<Player> | null = await axios.get(name2IdApi).catch(() => {
    return null;
  });
  if (!player?.data) {
    return null;
  }
  return player.data;
};

const getPlayerProfile = async (playerId: string): Promise<PlayerProfile | null> => {
  const profileApi = config.PROFILE_API.replace('{{PLAYER_ID}}', playerId);
  const playerProfile = await axios.get(profileApi).catch(() => {
    return null;
  });
  if (!playerProfile?.data) {
    return null;
  }

  if (playerProfile.data.properties[0]?.value) {
    const playerData: PlayerProfile = JSON.parse(
      Buffer.from(playerProfile.data.properties[0].value, 'base64').toString('binary')
    );
    return playerData;
  }

  return null;
};

const getPlayer = async (name: string) => {
  const playerInfo = await getPlayerId(name);
  if (!playerInfo) {
    return null;
  }
  const profile = await getPlayerProfile(playerInfo.id);
  if (!profile) {
    return { profileId: playerInfo.id, profileName: playerInfo.name };
  }
  return profile;
};

const playerCommand = new SlashCommandBuilder()
  .setName('player')
  .setDescription('查看 Minecraft 玩家資料')
  .addStringOption((option) => option.setName('玩家名').setDescription('Minecraft 玩家的名稱').setRequired(true));

export { playerCommand, getPlayerId, getPlayerProfile, getPlayer };
