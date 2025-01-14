export interface Player {
    name: string;
    gold: number;
    color: string;
    units: {
        [key: string]: any;
    };
    improvements: {
        [key: string]: any;
    };
}
export interface GameState {
    players: {
        [key: string]: Player;
    };
    playerOrder: string[];
    playersTurn: string;
    currentPlayer: string;
    turn: number;
}
export declare function nextTurn(gameState: GameState): void;
export declare function InitGameState(): GameState;
export default GameState;
