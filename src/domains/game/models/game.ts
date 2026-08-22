import { GameModeKey } from "./game-mode";

export enum GameStatus {
  Pending = "Pending",
  Running = "Running",
  Completed = "Completed",
  Cancelled = "Cancelled",
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
  hasForfeited: boolean;
}

export interface SolvedProblemSubmission {
  problemId: string;
  submissionId: string;
}

export interface GameProblemHistory {
  userId: string;
  solvedProblemIds: string[];
  solvedProblemSubmissions: SolvedProblemSubmission[];
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
