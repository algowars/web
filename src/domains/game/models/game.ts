export enum GameStatus {
  Pending = 0,
  Running = 1,
  Completed = 2,
  Cancelled = 3,
}

export interface GameParticipant {
  userId: string;
  username: string;
  imageUrl?: string;
  seatNumber: number;
  joinedAt: Date;
}

export interface Game {
  gameId: string;
  gameModeId: string;
  status: GameStatus;
  timeLimitInSeconds: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  participants: GameParticipant[];
}
