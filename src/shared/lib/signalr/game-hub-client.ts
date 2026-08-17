import * as signalR from "@microsoft/signalr";
import { getAccessToken } from "@auth0/nextjs-auth0";
import { env } from "@/env";

/**
 * Payload the server pushes on the "GameCompleted" hub method. Deliberately treated as just a
 * "go re-fetch" signal — the game's actual status/timestamps are read back from the REST API
 * (the source of truth), not trusted directly off the socket. This keeps the client's game-status
 * parsing logic in one place (game-api.ts) instead of duplicated here.
 */
export type GameCompletedPush = {
  gameId: string;
};

const HUB_PATH = "/hubs/game";
const GAME_COMPLETED_EVENT = "GameCompleted";

let connection: signalR.HubConnection | null = null;
let connectPromise: Promise<void> | null = null;
const joinedGameIds = new Set<string>();

const getConnection = (): signalR.HubConnection => {
  if (connection) {
    return connection;
  }

  connection = new signalR.HubConnectionBuilder()
    .withUrl(`${env.NEXT_PUBLIC_API_SERVER_URL}${HUB_PATH}`, {
      accessTokenFactory: async () => (await getAccessToken()) ?? "",
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Warning)
    .build();

  // Group membership lives on the connection ID server-side, so a reconnect (new connection ID)
  // drops it silently. Rejoin whatever games we were watching once the new connection is live.
  connection.onreconnected(() => {
    joinedGameIds.forEach((gameId) => {
      connection?.invoke("JoinGame", gameId).catch(() => {
        // Best-effort — the game loop's fallback poll covers a missed rejoin.
      });
    });
  });

  connection.onclose(() => {
    connectPromise = null;
  });

  return connection;
};

const ensureConnected = async (): Promise<signalR.HubConnection> => {
  const conn = getConnection();

  if (conn.state === signalR.HubConnectionState.Connected) {
    return conn;
  }

  if (!connectPromise) {
    connectPromise = conn.start().catch((error) => {
      connectPromise = null;
      throw error;
    });
  }

  await connectPromise;
  return conn;
};

/**
 * Joins the per-game update group for `gameId`. Throws if the connection or the server-side
 * authorization check (participant/permission) fails — callers should treat that as "push
 * notifications aren't available for this game" and fall back to polling, not as fatal.
 */
export const joinGameUpdates = async (gameId: string): Promise<void> => {
  const conn = await ensureConnected();
  await conn.invoke("JoinGame", gameId);
  joinedGameIds.add(gameId);
};

/** Best-effort leave — never throws, since staying in a group briefly longer is harmless. */
export const leaveGameUpdates = async (gameId: string): Promise<void> => {
  joinedGameIds.delete(gameId);

  try {
    if (connection?.state === signalR.HubConnectionState.Connected) {
      await connection.invoke("LeaveGame", gameId);
    }
  } catch {
    // Fine to ignore — the connection may already be closed/closing.
  }
};

/**
 * Subscribes to game-completed pushes. Returns an unsubscribe function. Safe to call even before
 * the connection exists — the underlying HubConnection instance is created lazily and handlers
 * persist across reconnects.
 */
export const onGameCompletedPush = (
  handler: (payload: GameCompletedPush) => void
): (() => void) => {
  const conn = getConnection();
  conn.on(GAME_COMPLETED_EVENT, handler);
  return () => conn.off(GAME_COMPLETED_EVENT, handler);
};
