define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function nextTurn(gameState) {
        const currentPlayerIndex = gameState.playerOrder.indexOf(this.gameState.currentPlayer);
        const nextIndex = (currentPlayerIndex + 1) % gameState.playerOrder.length;
        gameState.playersTurn = this.gameState.playerOrder[nextIndex];
        if (nextIndex === 0) {
            this.gameState.turn += 1;
        }
    }
    exports.nextTurn = nextTurn;
    function InitGameState() {
        return {
            players: {
                "player-1": {
                    name: "player-1",
                    color: "#0000FF",
                    gold: 0,
                    units: {},
                    improvements: {},
                },
                "player-2": {
                    name: "player-2",
                    color: "#FF0000",
                    gold: 0,
                    units: {},
                    improvements: {},
                },
                "player-3": {
                    name: "player-3",
                    color: "#FF0000",
                    gold: 0,
                    units: {},
                    improvements: {},
                },
            },
            currentPlayer: "player-1",
            playerOrder: ["player-1", "player-2", "player-3"],
            playersTurn: "player-1",
            turn: 0,
        };
    }
    exports.InitGameState = InitGameState;
});
//# sourceMappingURL=GameState.js.map