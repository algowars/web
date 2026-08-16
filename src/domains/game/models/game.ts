import { GameModeKey } from "./game-mode";

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
  score: number;
  currentProblem?: {
    problemId: string;
  } | null;
}

export interface GameProblemHistory {
  userId: string;
  solvedProblemIds: string[];
}

export interface Game {
  gameId: string;
  gameModeId: string;
  gameModeKey: GameModeKey;
  status: GameStatus;
  timeLimitInSeconds: number;
  createdAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  participants: GameParticipant[];
}
