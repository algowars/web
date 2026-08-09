import { baseApi } from "@/shared/lib/base-api";
import { GameMode } from "../models/game-mode";

export type CreateGameRequest = {
  gameModeKey: string;
  timeLimitInSeconds: number;
};

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
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
  }),
});

export const { useCreateGameMutation, useGameModesQuery } = gameApi;
