interface ServerInfo {
  motd: motd,
  version: string,
  software?: string,
  plugins?: any,
  map: string,
  players: playerInfo,
  hostIP?: string,
  hostPort?: number,
  [key: string]: any
}

interface motd  {
  raw: string,
  clean: string,
  html: string
}

interface playerInfo {
  online: number,
  max: number,
  list: string[]
}

export {ServerInfo}
