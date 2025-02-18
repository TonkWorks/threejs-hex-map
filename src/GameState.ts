import selector from "./DefaultTileSelector";
import { getRandomInt } from "./util";

export interface Player {
    name: string;
    nation: string;
    gold: number;
    color: string;
    government: string;
    isDefeated: boolean;
    image: string;
    taxRate: number;
    cityIndex: number;
    units: {  [key: string]: any };
    improvements: {  [key: string]: any};
    diplomatic_actions: { [key: string]: any};
    research: { current: string, researched: { [key: string]: boolean }, progress: number };
}


export interface DiplomaticAction {
    startTurn?: number;
    endTurn?: number;
    amount?: number;
    resource?: string;
}

export interface GameState {
    players: { [key: string]: Player };
    playerOrder: string[];
    playersTurn: string;
    aiDifficulty: string;
    currentPlayer: string
    turn: number;

}

export function nextTurn(gameState: GameState) {
    const currentPlayerIndex = gameState.playerOrder.indexOf(this.gameState.currentPlayer);
    const nextIndex = (currentPlayerIndex + 1) % gameState.playerOrder.length;
    gameState.playersTurn = this.gameState.playerOrder[nextIndex];
    if (nextIndex === 0) {
        this.gameState.turn += 1;
    }
}


function createPlayer(): Player {
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

export function InitGameState(): GameState {
    let playersList: Player[] = [];
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
        playersList.push(player1)

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
    } else {
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

    const players: { [key: string]: Player } = {};
    for (const player of  playersList) {
        players[player.name] = player;

        for (const pp of  playersList) {
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

export function cloneGameState(original: GameState): GameState {
    // Clone the entire game state
    const cloned: GameState = {
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
        cloned.players[key] = {
            ...player,
            units: {}, // Reset or ignore the units
            improvements: {} // Reset or ignore the improvements
        };

        for (const [unitKey, _] of Object.entries(player.units)) {
            cloned.players[key].units[unitKey] = {
                ...player.units[unitKey],
                model: null,
                selector: null,
            }
        }

        for (const [improvementKey, _] of Object.entries(player.improvements)) {
            cloned.players[key].improvements[improvementKey] = {
                ...player.improvements[improvementKey],
                model: null,
            }
        }
    }

    return cloned;
}

export class DiplomaticSummary {
    gold_per_turn: number = 0;
    gold_summary = "";
    resources: { [key: string]: number } = {}
    resources_summary = "";
    diplomatic_actions_summary: "";
}

// Player diplomatic actions
export function GetDiplomaticActionsSummary(gs: GameState, player: Player): DiplomaticSummary {
    //return gs.players[Player.name].diplomatic_actions;
    let ds = new DiplomaticSummary()
    for (const [key, value] of Object.entries(player.diplomatic_actions)) {
        let opponnent = gs.players[key];
        for (const [action, actionValue] of Object.entries(value)) {
            let d: DiplomaticAction = actionValue;

            if (action === "gpt") {
                ds.gold_per_turn += d.amount;
                ds.gold_summary += `${opponnent.name} gold per turn: ${d.amount} (${d.endTurn - d.startTurn} turns)`;
            }
            if (action.startsWith("resource_")){
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

export function DeclareWarBetweenPlayers(gs: GameState, Player1: Player, Player2: Player) {
    // remove all other diplomatic actions
    gs.players[Player1.name].diplomatic_actions[Player2.name] = {}
    gs.players[Player2.name].diplomatic_actions[Player1.name] = {}

    
    // declare war
    console.log(gs.players[Player1.name].diplomatic_actions)
    gs.players[Player1.name].diplomatic_actions[Player2.name]["war"] = {
        startTurn: gs.turn,
    };
    gs.players[Player2.name].diplomatic_actions[Player1.name]["war"] = {
        startTurn: gs.turn,
    };
}

export function DeclarePeaceBetweenPlayers(gs: GameState, Player1: Player, Player2: Player) {
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

export default GameState;
