import { baseApi } from "@/shared/lib/base-api";
import { GameMode } from "../models/game-mode";
import { Game } from "../models/game";

export type CreateGameRequest = {
  gameModeKey: string;
  timeLimitInSeconds: number;
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
    startGame: builder.mutation<Game, string>({
      query: (gameId) => ({
        url: `/api/v1/game/${gameId}/start`,
        method: "POST",
      }),
    }),
  }),
});

export const {
  useCreateGameMutation,
  useGameModesQuery,
  useGetGameQuery,
  useStartGameMutation,
} = gameApi;
