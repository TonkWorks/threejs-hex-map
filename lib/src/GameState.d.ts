export interface Player {
    name: string;
    gold: number;
    color: string;
    isDefeated: boolean;
    image: string;
    taxRate: number;
    units: {
        [key: string]: any;
    };
    improvements: {
        [key: string]: any;
    };
    diplomatic_actions: {
        [key: string]: any;
    };
}
export interface DiplomaticAction {
    startTurn: number;
    endTurn?: number;
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
export declare function DeclareWarBetweenPlayers(gs: GameState, Player1: Player, Player2: Player): void;
export declare function DeclarePeaceBetweenPlayers(gs: GameState, Player1: Player, Player2: Player): void;
export default GameState;
