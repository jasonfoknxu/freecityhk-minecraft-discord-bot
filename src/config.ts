import * as dotenv from 'dotenv';

const loadConfig = dotenv.config();
if (loadConfig.error) {
  console.error('[ERROR] Cannot load config');
  throw loadConfig.error;
}

const parsedConfig = loadConfig.parsed;

if (!parsedConfig) {
  console.error('[ERROR] Cannot parse config');
  throw new Error();
}

interface Config {
  TOKEN: string;
  CHANNEL_ID: string[];
  UPDATE_CHANNEL: string[];
  SERVER: string;
  QUERY_PORT: number;
  RCON_PORT: number;
  RCON_PW: string;
  PLAYER_API: string;
  PROFILE_API: string;
}

const config: Config = {
  TOKEN: parsedConfig.TOKEN,
  CHANNEL_ID: parsedConfig.CHANNEL_ID.split(','),
  UPDATE_CHANNEL: parsedConfig.UPDATE_CHANNEL.split(','),
  SERVER: parsedConfig.SERVER,
  QUERY_PORT: parseInt(parsedConfig.QUERY_PORT ?? '25565'),
  RCON_PORT: parseInt(parsedConfig.RCON_PORT ?? '25575'),
  RCON_PW: parsedConfig.RCON_PW,
  PLAYER_API: parsedConfig.PLAYER_API,
  PROFILE_API: parsedConfig.PROFILE_API,
};

export { config };
