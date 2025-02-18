define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiplomaticSummary = void 0;
    exports.nextTurn = nextTurn;
    exports.InitGameState = InitGameState;
    exports.cloneGameState = cloneGameState;
    exports.GetDiplomaticActionsSummary = GetDiplomaticActionsSummary;
    exports.DeclareWarBetweenPlayers = DeclareWarBetweenPlayers;
    exports.DeclarePeaceBetweenPlayers = DeclarePeaceBetweenPlayers;
    function nextTurn(gameState) {
        const currentPlayerIndex = gameState.playerOrder.indexOf(this.gameState.currentPlayer);
        const nextIndex = (currentPlayerIndex + 1) % gameState.playerOrder.length;
        gameState.playersTurn = this.gameState.playerOrder[nextIndex];
        if (nextIndex === 0) {
            this.gameState.turn += 1;
        }
    }
    function createPlayer() {
        return {
            name: "",
            nation: "",
            color: "",
            gold: 0,
            cityIndex: 0,
            taxRate: 0.1,
            government: "autocracy",
            image: "",
            isDefeated: false,
            units: {},
            improvements: {},
            diplomatic_actions: {},
            research: { current: 'agriculture', researched: {}, progress: 0 },
        };
    }
    function InitGameState() {
        let playersList = [];
        let aiDifficulty = localStorage.getItem("ai_difficulty");
        if (!aiDifficulty) {
            aiDifficulty = "easy";
        }
        let new_game_settings = localStorage.getItem("new_game_settings");
        if (new_game_settings) {
            let settings = JSON.parse(new_game_settings);
            let human = settings.human;
            let player1 = createPlayer();
            player1.name = human.civ;
            player1.nation = "USA";
            player1.color = human.color; //"#FFFF00";
            player1.image = "/assets/rifleman.webp";
            playersList.push(player1);
            for (let ai of settings.aiPlayers) {
                let player = createPlayer();
                player.name = ai.civ;
                player.nation = ai.civ;
                player.color = ai.color; //"#FFFF00";
                player.image = "/assets/rifleman.webp";
                // Check if the name already exists in playersList
                let originalName = player.name;
                let i = 2;
                while (playersList.some(p => p.name === player.name)) {
                    player.name = `${originalName} ${i}`;
                    i++;
                }
                playersList.push(player);
            }
        }
        else {
            // default // maybe error
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
            playersList = [player1, player2, player3];
        }
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
            aiDifficulty: aiDifficulty,
            currentPlayer: playerNames[0],
            playersTurn: playerNames[0],
            playerOrder: playerNames,
            turn: 0,
        };
    }
    function cloneGameState(original) {
        // Clone the entire game state
        const cloned = {
            players: {},
            playerOrder: [...original.playerOrder],
            playersTurn: original.playersTurn,
            aiDifficulty: original.aiDifficulty,
            currentPlayer: original.currentPlayer,
            turn: original.turn
        };
        // Iterate over each player to clone their information excluding units and improvements
        for (const key in original.players) {
            const player = original.players[key];
            cloned.players[key] = Object.assign(Object.assign({}, player), { units: {}, improvements: {} // Reset or ignore the improvements
             });
            for (const [unitKey, _] of Object.entries(player.units)) {
                cloned.players[key].units[unitKey] = Object.assign(Object.assign({}, player.units[unitKey]), { model: null, selector: null });
            }
            for (const [improvementKey, _] of Object.entries(player.improvements)) {
                cloned.players[key].improvements[improvementKey] = Object.assign(Object.assign({}, player.improvements[improvementKey]), { model: null });
            }
        }
        return cloned;
    }
    class DiplomaticSummary {
        constructor() {
            this.gold_per_turn = 0;
            this.gold_summary = "";
            this.resources = {};
            this.resources_summary = "";
        }
    }
    exports.DiplomaticSummary = DiplomaticSummary;
    // Player diplomatic actions
    function GetDiplomaticActionsSummary(gs, player) {
        //return gs.players[Player.name].diplomatic_actions;
        let ds = new DiplomaticSummary();
        for (const [key, value] of Object.entries(player.diplomatic_actions)) {
            let opponnent = gs.players[key];
            for (const [action, actionValue] of Object.entries(value)) {
                let d = actionValue;
                if (action === "gpt") {
                    ds.gold_per_turn += d.amount;
                    ds.gold_summary += `${opponnent.name} gold per turn: ${d.amount} (${d.endTurn - d.startTurn} turns)`;
                }
                if (action.startsWith("resource_")) {
                    if (!ds.resources[d.resource]) {
                        ds.resources[d.resource] = 0;
                    }
                    ds.resources[d.resource] += d.amount;
                    ds.resources_summary += `${opponnent.name} ${d.resource}: ${d.amount} (${d.endTurn - d.startTurn} turns)`;
                }
            }
        }
        return ds;
    }
    function DeclareWarBetweenPlayers(gs, Player1, Player2) {
        // remove all other diplomatic actions
        gs.players[Player1.name].diplomatic_actions[Player2.name] = {};
        gs.players[Player2.name].diplomatic_actions[Player1.name] = {};
        // declare war
        console.log(gs.players[Player1.name].diplomatic_actions);
        gs.players[Player1.name].diplomatic_actions[Player2.name]["war"] = {
            startTurn: gs.turn,
        };
        gs.players[Player2.name].diplomatic_actions[Player1.name]["war"] = {
            startTurn: gs.turn,
        };
    }
    function DeclarePeaceBetweenPlayers(gs, Player1, Player2) {
        delete gs.players[Player1.name].diplomatic_actions[Player2.name]["war"];
        delete gs.players[Player2.name].diplomatic_actions[Player1.name]["war"];
        gs.players[Player1.name].diplomatic_actions[Player2.name]["peace"] = {
            startTurn: gs.turn,
            endTurn: gs.turn + 10,
        };
        gs.players[Player2.name].diplomatic_actions[Player1.name]["peace"] = {
            startTurn: gs.turn,
            endTurn: gs.turn + 10,
        };
    }
});
//# sourceMappingURL=GameState.js.map