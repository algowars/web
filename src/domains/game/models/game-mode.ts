export interface GameMode {
  id: string;
  name: string;
  description?: string;
  gameModeType: GameModeType;
  minPlayers: number;
  maxPlayers: number;
  isRanked: boolean;
  status: GameModeStatus;
}

export enum GameModeType {
  SoloRush = 1,
  OneVsOne = 2,
  FFA = 3,
}

export enum GameModeStatus {
  Draft = 1,
  Active = 2,
  Retired = 3,
}
