import { EntityManagerInterface } from "./Entity";
import { GameState } from "../GameRunner";

/**
 * The interface for game providers. Game providers provide global control over the game state and state transtitions.
 * 
 * @interface
 * @callback gameStateChangeCallback - Callback which handles changes in the game state.
 * @property {(EntityManagerInterface) => void} startGame - Method which handles starting the game.
 * @property {(EntityManagerInterface) => void} resetGame - Method which handles resetting the game.
 * @property {() => void} pauseGame - Method which handles pausing the game.
 * @property {() => void} resumeGame - Method which resumes the game.
 * @property {() => GameState} getGameState - Method for getting the current game state.
 */
export interface ProviderInterface {
    gameStateChangeCallback: (gameState: GameState) => void;
    startGame: (drawCallback: (entityManager: EntityManagerInterface) => void) => void;
    resetGame: (drawCallback: (entityManager: EntityManagerInterface) => void) => void;
    pauseGame: () => void;
    resumeGame: () => void;
    getGameState: () => GameState;
}