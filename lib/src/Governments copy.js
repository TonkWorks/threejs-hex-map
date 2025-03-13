define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.GovernmentsMap = void 0;
    // Create a map of governments using the Government interface
    exports.GovernmentsMap = {
        autocracy: {
            name: "Autocracy",
            description: "The single-leader government where one ruler makes all the calls.",
            goldMultiplier: 1.0,
        },
        oligarchy: {
            name: "Oligarchy",
            description: "A system run by a few powerful elites—backroom deals and secret handshakes abound.",
            goldMultiplier: 1.1,
        },
        democracy: {
            name: "Democracy",
            description: "Government by the people, where endless debates and passionate elections are the norm.",
            goldMultiplier: 1.2,
        },
        communism: {
            name: "Communism",
            description: "A system aimed at equality, where everyone’s supposed to share everything (in theory).",
            goldMultiplier: 0.9,
        },
        theocracy: {
            name: "Theocracy",
            description: "A government led by religious leaders, where divine guidance is the ultimate policy.",
            goldMultiplier: 1.0,
        },
        despotismDeluxe: {
            name: "Despotism Deluxe",
            description: "Imagine a dictatorship with a twist: mandatory weekly karaoke sessions and lavish, over-the-top parties.",
            goldMultiplier: 1.3,
        },
        bureaucracyBonanza: {
            name: "Bureaucracy Bonanza",
            description: "A government so mired in paperwork and red tape that every decision requires three forms and a committee meeting—if you can get past the filing system!",
            goldMultiplier: 0.8,
        },
        technocracy2: {
            name: "Technocracy 2.0",
            description: "A futuristic government run entirely by computers and AI, where citizens wonder if they're in a simulation.",
            goldMultiplier: 1.4,
        },
        hipsterocracy: {
            name: "Hipsterocracy",
            description: "A quirky regime where local coffee shop owners with vintage beards and ironic mustaches decide the fate of the nation.",
            goldMultiplier: 1.0,
        },
        meritocracy: {
            name: "Meritocracy",
            description: "Only the smartest—and possibly the meme-savvy—citizens earn a seat at the leadership table.",
            goldMultiplier: 1.2,
        },
        imperialPlutocracy: {
            name: "Imperial Plutocracy",
            description: "A system where the super-rich call the shots, enjoying endless luxury while handing out selective tax breaks.",
            goldMultiplier: 1.5,
        }
    };
});
//# sourceMappingURL=Governments%20copy.js.map