export interface Bonus {
    name: string;
    description: string;
  }

  export const BonusMap: { [key: string]: Bonus } = {
    divine_providence: {
      name: "Divine Providence",
      description: "Blessings from the heavens grant the nation resilience and unity.",
    },
    pioneering_spirit: {
      name: "Pioneering Spirit",
      description: "An unyielding drive to explore and innovate, leading to rapid advancements.",
    },
    age_of_enlightenment: {
      name: "Age of Enlightenment",
      description: "A surge of knowledge and reason propels cultural and scientific breakthroughs.",
    },
    industrial_ascendance: {
      name: "Industrial Ascendance",
      description: "The rise of industry transforms the economy and boosts technological progress.",
    },
    cultural_renaissance: {
      name: "Cultural Renaissance",
      description: "A revival of arts and culture that fosters creativity and innovation.",
    },
    scientific_breakthrough: {
      name: "Scientific Breakthrough",
      description: "Groundbreaking discoveries accelerate progress and improve quality of life.",
    },
    imperial_ambition: {
      name: "Imperial Ambition",
      description: "A relentless pursuit of power and expansion shapes the destiny of the nation.",
    },
    unyielding_valor: {
      name: "Unyielding Valor",
      description: "Heroic courage and steadfast determination inspire the nation in times of war.",
    },
    religious_fervor: {
      name: "Religious Fervor",
      description: "Deep spiritual commitment unites the populace and fortifies national resolve.",
    },
    economic_supremacy: {
      name: "Economic Supremacy",
      description: "Dominance in trade and commerce establishes the nation as an economic powerhouse.",
    },
    diplomatic_eminence: {
      name: "Diplomatic Eminence",
      description: "Skilled diplomacy fosters alliances and secures favorable terms in negotiations.",
    },
    martial_legacy: {
      name: "Martial Legacy",
      description: "A storied tradition of military prowess endows the nation with tactical superiority.",
    }
  };