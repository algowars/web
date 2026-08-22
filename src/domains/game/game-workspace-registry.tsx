import { ComponentType } from "react";
import { GameModeKey } from "./models/game-mode";
import { GameWorkspaceProps } from "./models/game-workspace";
import SoloRushWorkspace from "./solo-rush/components/solo-rush-workspace";
import SoloRushWorkspaceHeader from "./solo-rush/components/solo-rush-workspace-header";
import SoloRushGameOverSummary from "./solo-rush/components/solo-rush-game-over-summary";

/**
 * A mode's full strategy: the required workspace, plus an
 * optional header. Not every mode needs a header — omit it
 * and PlayGameContent just won't render one.
 */
type GameWorkspaceStrategy = {
  Workspace: ComponentType<GameWorkspaceProps>;
  Header?: ComponentType<GameWorkspaceProps>;
  GameOverSummary?: ComponentType<GameWorkspaceProps>;
};

/**
 * Strategy registry: one entry per game mode. Partial<>
 * because not every mode has a workspace built yet (Duel,
 * FFA) — PlayGameContent falls back gracefully when a key
 * isn't registered.
 *
 * To add a new mode: build its workspace (and, if it needs
 * one, its header) against GameWorkspaceProps, then add one
 * entry here. PlayGameContent never needs to change.
 */
export const gameWorkspaceRegistry: Partial<
  Record<GameModeKey, GameWorkspaceStrategy>
> = {
  [GameModeKey.SoloRush]: {
    Workspace: SoloRushWorkspace,
    Header: SoloRushWorkspaceHeader,
    GameOverSummary: SoloRushGameOverSummary,
  },
};
