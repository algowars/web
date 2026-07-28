import { baseApi } from "@/shared/lib/base-api";
import type {
  GameDto,
  GameModesResponse,
  LobbyDto,
  SubmissionDto,
} from "../models/gameplay";

export interface CreateLobbyRequest {
  gameModeId: string;
}

export interface JoinLobbyRequest {}

export interface SetReadyRequest {
  isReady: boolean;
}

export interface StartGameRequest {
  lobbyId: string;
}

export interface CreateSubmissionRequest {
  problemSetupId: string;
  type: string;
  code: string;
  customTestCases?: unknown[];
}

export const gameplayApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGameModes: builder.query<GameModesResponse, void>({
      query: () => ({
        url: "/api/v1/games/modes",
        method: "GET",
      }),
      providesTags: ["GameMode"],
    }),
    createLobby: builder.mutation<LobbyDto, CreateLobbyRequest>({
      query: (body) => ({
        url: "/api/v1/games/lobbies",
        method: "POST",
        body,
      }),
    }),
    joinLobby: builder.mutation<LobbyDto, { lobbyId: string }>({
      query: ({ lobbyId }) => ({
        url: `/api/v1/games/lobbies/${lobbyId}/join`,
        method: "POST",
      }),
    }),
    setLobbyReady: builder.mutation<
      LobbyDto,
      { lobbyId: string; body: SetReadyRequest }
    >({
      query: ({ lobbyId, body }) => ({
        url: `/api/v1/games/lobbies/${lobbyId}/ready`,
        method: "PUT",
        body,
      }),
    }),
    startGame: builder.mutation<GameDto, StartGameRequest>({
      query: (body) => ({
        url: "/api/v1/games/start",
        method: "POST",
        body,
      }),
    }),
    getGameState: builder.query<GameDto, string>({
      query: (gameId) => ({
        url: `/api/v1/games/${gameId}`,
        method: "GET",
      }),
    }),
    createGameSubmission: builder.mutation<
      SubmissionDto,
      CreateSubmissionRequest
    >({
      query: (body) => ({
        url: "/api/submissions",
        method: "POST",
        body,
      }),
    }),
    getGameSubmissionStatus: builder.query<SubmissionDto, string>({
      query: (submissionId) => ({
        url: `/api/submissions/${submissionId}`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetGameModesQuery,
  useCreateLobbyMutation,
  useJoinLobbyMutation,
  useSetLobbyReadyMutation,
  useStartGameMutation,
  useGetGameStateQuery,
  useCreateGameSubmissionMutation,
  useGetGameSubmissionStatusQuery,
} = gameplayApi;
