export enum GameModeKey {
  SoloRush = "solo_rush",
}

export interface GameModeTimeOption {
  durationSeconds: number;
  isDefault: boolean;
}

export interface GameMode {
  id: string;
  key: GameModeKey;
  name: string;
  description: string;
  minPlayers: number;
  maxPlayers: number;
  timeOptions: GameModeTimeOption[];
}
