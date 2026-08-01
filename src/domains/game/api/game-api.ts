import { baseApi } from "@/shared/lib/base-api";

export type LobbyDto = {
  id: string;
  gameModeId: string;
  hostUserId: string;
  capacity: number;
  status: string;
  createdAt: string;
  members: { userId: string; isReady: boolean; joinedAt: string }[];
};

export type GamePlayerDto = {
  userId: string;
  score: number;
  currentRuleStepOrder?: number | null;
  status: string;
};

export type GameProblemDto = {
  problemId: string;
  order: number;
  difficultyTier: string;
  assignedAt: string;
  slug?: string | null;
  title?: string | null;
  question?: string | null;
  availableLanguages: {
    id: string;
    name: string;
    versions: { id: string; version: string }[];
  }[];
  publicTestCases: {
    name: string;
    description?: string | null;
    inputs: { value: string; valueType: string }[];
    expectedOutputs: { value: string; valueType: string }[];
  }[];
};

export type GameDto = {
  id: string;
  lobbyId: string;
  gameModeId: string;
  status: string;
  startedAt: string;
  completedAt?: string | null;
  timeLimitSeconds: number;
  players: GamePlayerDto[];
  problems: GameProblemDto[];
};

export type CreateLobbyRequest = { gameModeId: string };
export type StartGameRequest = { lobbyId: string };
export type SetLobbyReadyRequest = { isReady: boolean };

export const gameApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAvailableGames: builder.query({
      query: () => ({
        url: "/api/v1/game/modes",
      }),
      providesTags: ["GameAvailable"],
    }),
    createLobby: builder.mutation<LobbyDto, CreateLobbyRequest>({
      query: (body) => ({
        url: "/api/v1/game/lobbies",
        method: "POST",
        body,
      }),
      invalidatesTags: ["GameAvailable"],
    }),
    setLobbyReady: builder.mutation<LobbyDto, { lobbyId: string; body: SetLobbyReadyRequest }>({
      query: ({ lobbyId, body }) => ({
        url: `/api/v1/game/lobbies/${encodeURIComponent(lobbyId)}/ready`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Game", "GameAvailable"],
    }),
    startGame: builder.mutation<GameDto, StartGameRequest>({
      query: ({ lobbyId }) => ({
        url: `/api/v1/game/lobbies/${encodeURIComponent(lobbyId)}/start`,
        method: "POST",
      }),
      invalidatesTags: ["Game"],
    }),
    getGameById: builder.query<GameDto, string>({
      query: (gameId) => ({
        url: `/api/v1/game/${encodeURIComponent(gameId)}`,
        method: "GET",
      }),
      providesTags: (_result, _error, gameId) => [{ type: "Game", id: gameId }],
    }),
  }),
});

export const {
  useGetAvailableGamesQuery,
  useCreateLobbyMutation,
  useSetLobbyReadyMutation,
  useStartGameMutation,
  useGetGameByIdQuery,
} = gameApi;
