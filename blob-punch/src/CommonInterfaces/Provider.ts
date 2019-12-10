import { EntityManagerInterface } from "./Entity";
import { GameState } from "../GameRunner";

export interface ProviderInterface {
    gameStateChangeCallback: (gameState: GameState) => void;
    startGame : (drawCallback: (entityManager: EntityManagerInterface) => void) => void;
    resetGame : (drawCallback: (entityManager: EntityManagerInterface) => void) => void;
    pauseGame : () => void;
    resumeGame: () => void;
    getGameState: () => GameState;
}