export type GameModeType = "SoloRush" | "OneVsOne";
export type GameModeStatus = "Draft" | "Active" | "Retired";
export type DifficultyTier = "Easy" | "Medium" | "Hard";
export type LobbyStatus = "Open" | "Closed" | "InProgress";
export type GameStatus = "Active" | "Completed" | "Abandoned";
export type PlayerStatus = "Active" | "Eliminated" | "Finished";
export type SubmissionStatus =
  | "Queued"
  | "Running"
  | "Accepted"
  | "WrongAnswer"
  | "Error";
export type SubmissionResultStatus =
  | "Accepted"
  | "WrongAnswer"
  | "RuntimeError"
  | "CompileError";

export interface RuleStepDto {
  stepOrder: number;
  difficultyTier: DifficultyTier;
  problemCount: number;
  timeLimitSeconds: number;
  scoreWeight: number;
  name: string;
}

export interface GameModeDto {
  id: string;
  name: string;
  gameModeType: GameModeType;
  minPlayers: number;
  maxPlayers: number;
  isRanked: boolean;
  description: string;
  status: GameModeStatus;
  ruleSteps: RuleStepDto[];
}

export interface LobbyMemberDto {
  userId: string;
  username: string;
  isReady: boolean;
  joinedAt: string;
}

export interface LobbyDto {
  id: string;
  gameModeId: string;
  hostUserId: string;
  status: LobbyStatus;
  createdAt: string;
  members: LobbyMemberDto[];
}

export interface GamePlayerDto {
  userId: string;
  username: string;
  score: number;
  currentRuleStepOrder: number | null;
  status: PlayerStatus;
}

export interface GameProblemDto {
  problemId: string;
  order: number;
  difficultyTier: DifficultyTier;
  assignedAt: string;
}

export interface GameDto {
  id: string;
  lobbyId: string;
  gameModeId: string;
  status: GameStatus;
  startedAt: string;
  completedAt: string | null;
  players: GamePlayerDto[];
  problems: GameProblemDto[];
}

export interface SubmissionResultDto {
  testCaseId: string;
  status: SubmissionResultStatus;
  runtime: number;
  memoryUsed: number;
  actualOutput: string;
  expectedOutput?: string | null;
  standardOutput?: string | null;
  standardError?: string | null;
  compileOutput?: string | null;
}

export interface SubmissionDto {
  id: string;
  status: SubmissionStatus;
  createdAt: string;
  executionTime?: number | null;
  memoryUsage?: number | null;
  results?: SubmissionResultDto[];
}

export interface GameModesResponse {
  modes: GameModeDto[];
}
