import { baseApi } from "@/shared/lib/base-api";
import { GameMode, GameModeKey } from "../models/game-mode";
import type { Game, GameProblemHistory } from "../models/game";

export type CreateGameRequest = {
  gameModeKey: GameModeKey;
  timeLimitInSeconds: number;
};

export type CompleteProblemRequest = {
  submissionId: string;
};

export type CompleteProblemResult = {
  newScore: number;
  nextProblemId: string | null;
};

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGame: builder.query<Game, string>({
      query: (gameId) => ({
        url: `/api/v1/game/${gameId}`,
        method: "GET",
      }),
    }),
    createGame: builder.mutation<string, CreateGameRequest>({
      query: (body) => ({
        url: "/api/v1/game",
        method: "POST",
        body,
      }),
    }),
    gameModes: builder.query<GameMode[], void>({
      query: () => ({
        url: "/api/v1/game/modes",
        method: "GET",
      }),
    }),
    startGame: builder.mutation<void, string>({
      query: (gameId) => ({
        url: `/api/v1/game/${gameId}/start`,
        method: "POST",
      }),
    }),
    getGameProblemHistory: builder.query<GameProblemHistory[], string>({
      query: (gameId) => ({
        url: `/api/v1/game/${gameId}/problems`,
        method: "GET",
      }),
    }),
    forfeitGame: builder.mutation<void, string>({
      query: (gameId) => ({
        url: `/api/v1/game/${gameId}/forfeit`,
        method: "POST",
      }),
    }),
    completeProblem: builder.mutation<
      CompleteProblemResult,
      { gameId: string; problemId: string; body: CompleteProblemRequest }
    >({
      query: ({ gameId, problemId, body }) => ({
        url: `/api/v1/game/${gameId}/problems/${problemId}/complete`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useCreateGameMutation,
  useGameModesQuery,
  useGetGameQuery,
  useStartGameMutation,
  useForfeitGameMutation,
} = gameApi;
