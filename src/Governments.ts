export interface Government {
    name: string;
    description: string;
    goldMultiplier?: number;
  }

// Create a map of governments using the Government interface
export const GovernmentsMap: { [key: string]: Government } = {
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
  };