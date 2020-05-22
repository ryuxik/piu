import { ProviderInterface } from '../CommonInterfaces/Provider';
import { GameState } from '../GameRunner';
import { EntityManagerInterface } from '../CommonInterfaces/Entity';

// export class RemoteGameProvider implements ProviderInterface {
//     public gameStateChangeCallback: (gameState: GameState) => void;
//     constructor(gameStateChangeCallback: (gameState: GameState) => void) {
//         this.gameStateChangeCallback = gameStateChangeCallback;
//     }

//     public startGame = (drawCallback: (entityManager: EntityManagerInterface) => void) {

//     }

//     public resetGame = (drawCallback: (entityManager: EntityManagerInterface) => void) {
        
//     }

//     public pauseGame = (): void => {

//     }

//     public resumeGame = (): void => {

//     }

//     public getGameState = (): GameState {
        
//     }
//  }