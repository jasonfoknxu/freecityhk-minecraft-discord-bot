interface PlayerProfile {
  timestamp?: number | string,
  profileId: string,
  profileName: string,
  textures?: PlayerTextures | any,
  [key: string]: any
}

interface PlayerTextures {
  SKIN: PlayerSkin,
  [key: string]: any
}

interface PlayerSkin {
  url: string,
  metadata: any,
  [key: string]: any
}

export {PlayerProfile, PlayerTextures, PlayerSkin}