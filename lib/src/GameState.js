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
    function createPlayer() {
        return {
            name: "",
            nation: "",
            color: "",
            gold: 0,
            cityIndex: 0,
            taxRate: 0.1,
            image: "",
            isDefeated: false,
            units: {},
            improvements: {},
            diplomatic_actions: {},
            research: { current: 'agriculture', researched: {}, progress: 0 },
        };
    }
    function InitGameState() {
        let player1 = createPlayer();
        player1.name = "USA";
        player1.nation = "USA";
        player1.color = "#FFFF00";
        player1.image = "/assets/rifleman.webp";
        let player2 = createPlayer();
        player2.name = "China";
        player2.nation = "China";
        player2.color = "#FF0000";
        player2.image = "/assets/rifleman.webp";
        let player3 = createPlayer();
        player3.name = "Soviet Union";
        player3.nation = "Soviet Union";
        player3.color = "#0000FF";
        player3.image = "/assets/rifleman.webp";
        const playersList = [player1, player2, player3];
        const players = {};
        for (const player of playersList) {
            players[player.name] = player;
            for (const pp of playersList) {
                if (player.name !== pp.name) {
                    player.diplomatic_actions[pp.name] = {};
                }
            }
        }
        console.log(players);
        const playerNames = playersList.map((player) => player.name);
        return {
            players: players,
            currentPlayer: playerNames[0],
            playersTurn: playerNames[0],
            playerOrder: playerNames,
            turn: 0,
        };
    }
    exports.InitGameState = InitGameState;
    // Player diplomatic actions
    function DeclareWarBetweenPlayers(gs, Player1, Player2) {
        gs.players[Player1.name].diplomatic_actions[Player2.name]["war"] = {
            startTurn: gs.turn,
        };
        gs.players[Player2.name].diplomatic_actions[Player1.name]["war"] = {
            startTurn: gs.turn,
        };
    }
    exports.DeclareWarBetweenPlayers = DeclareWarBetweenPlayers;
    function DeclarePeaceBetweenPlayers(gs, Player1, Player2) {
        delete gs.players[Player1.name].diplomatic_actions[Player2.name]["war"];
        delete gs.players[Player2.name].diplomatic_actions[Player1.name]["war"];
    }
    exports.DeclarePeaceBetweenPlayers = DeclarePeaceBetweenPlayers;
});
//# sourceMappingURL=GameState.js.map