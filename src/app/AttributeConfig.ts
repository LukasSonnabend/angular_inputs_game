// export enum EvolutionStage {
//     baby,
//     teen,
//     adult
//   }

// type SpeciesInfo = {
//     name: string;
//     species: string;
//     cycleTime: number;
//     description: string;
//     homePlanet: string;
//     image_url: string;
// }

// export type DnDMonster = {
//   uuid: string;
//   name: string;
//   gender: Gender;
//   image: string;
//   birthTimestamp: Date;
//   species: SpeciesInfo;
//   evolutionStage: EvolutionStage;
//   enclosureCost: number;
//   baseSalePrice: number;
//   strength: AttributeValueWithOptionalValue; // Directly use the interface here
//   remarkability: AttributeValueWithOptionalValue;
//   mutationChance: AttributeValueWithOptionalValue;
//   gestationPeriod: AttributeValueWithOptionalValue;
//   yieldBonus: AttributeValueWithOptionalValue;
//   lastEvolutionTimestamp: Date;
//   progressTowardsNextEvolution: number;
// }

// export type FarmMonster  = DnDMonster & {
//     baseYield: number;
//     count: number;
//   }

export interface Attribute<T> {
  bezeichnung: string;
}

export enum StrengthAttributeWerte {
  Gigantisch = "Gigantisch!",
  Ausgezeichnet = "Ausgezeichnet",
  Stark = "Stark",
  Robust = "Robust",
  Normal = "Normal",
  Schwach = "Schwach",
}

export enum TrageZeitAttributeWerte {
  WurfMaschine = "Wurf Maschine!",
  Zügig = "Zügig",
  Mittel = "Mittel",
  Lang = "Lang",
  SehrLang = "Sehr Lang",
  ExtremLang = "Extrem Lang",
}

export enum Remarkability {
  Bemerkenswert = "Bemerkenswert",
  Beeindruckend = "Beeindruckend",
  Attraktiv = "Attraktiv",
  Durchschnittlich = "Durchschnittlich",
  GehtSo = "Geht So",
  Hässlich = "Hässlich",
}

export enum MutationChance {
  SehrHoch = "Sehr hoch",
  Hoch = "Hoch",
  Erhöht = "Erhöht",
  Durchschnittlich = "Durchschnittlich",
  Gering = "Gering",
  Niedrig = "Niedrig",
}

export enum YieldBonus {
  Unerreicht = "Unerreicht!",
  Üppig = "Üppig",
  Ergiebig = "Ergiebig",
  Akzeptabel = "Akzeptabel",
  Bescheiden = "Bescheiden",
  Spärlich = "Spärlich",
}

interface AttributeValueBase {
  bonus: number;
  chance: number;
  enumValue: string | number | symbol;
}

// Extend the base for cases where 'value' is also present
interface AttributeValueWithOptionalValue extends AttributeValueBase {
  value?: number;
}
// Use a generic mapped type for flexibility
type AttributeDataMapping<T extends string | number | symbol> = {
  [K in T]: AttributeValueWithOptionalValue;
};

// Define concrete values for specific enum values
const StrengthAttributeValues: AttributeDataMapping<StrengthAttributeWerte> = {
  [StrengthAttributeWerte.Gigantisch]: {
    enumValue: StrengthAttributeWerte.Gigantisch,
    bonus: 10,
    chance: 0.01,
  },
  [StrengthAttributeWerte.Ausgezeichnet]: {
    enumValue: StrengthAttributeWerte.Ausgezeichnet,
    bonus: 6,
    chance: 0.05,
  },
  [StrengthAttributeWerte.Stark]: {
    enumValue: StrengthAttributeWerte.Stark,
    bonus: 4,
    chance: 0.14,
  },
  [StrengthAttributeWerte.Robust]: {
    enumValue: StrengthAttributeWerte.Robust,
    bonus: 3,
    chance: 0.4,
  },
  [StrengthAttributeWerte.Normal]: {
    enumValue: StrengthAttributeWerte.Normal,
    bonus: 2,
    chance: 0.3,
  },
  [StrengthAttributeWerte.Schwach]: {
    enumValue: StrengthAttributeWerte.Schwach,
    bonus: 1,
    chance: 0.1,
  },
};

const RemarkabilityAttributeValues: AttributeDataMapping<Remarkability> = {
  [Remarkability.Bemerkenswert]: {
    enumValue: Remarkability.Bemerkenswert,
    bonus: 12,
    chance: 0.01,
  },
  [Remarkability.Beeindruckend]: {
    enumValue: Remarkability.Beeindruckend,
    bonus: 6,
    chance: 0.05,
  },
  [Remarkability.Attraktiv]: {
    enumValue: Remarkability.Attraktiv,
    bonus: 4,
    chance: 0.14,
  },
  [Remarkability.Durchschnittlich]: {
    enumValue: Remarkability.Durchschnittlich,
    bonus: 2,
    chance: 0.4,
  },
  [Remarkability.GehtSo]: {
    enumValue: Remarkability.GehtSo,
    bonus: 1,
    chance: 0.25,
  },
  [Remarkability.Hässlich]: {
    enumValue: Remarkability.Hässlich,
    bonus: 0,
    chance: 0.15,
  },
};

const MutationChanceAttributeValues: AttributeDataMapping<MutationChance> = {
  [MutationChance.SehrHoch]: {
    enumValue: MutationChance.SehrHoch,
    bonus: 10,
    chance: 0.01,
  },
  [MutationChance.Hoch]: {
    enumValue: MutationChance.Hoch,
    bonus: 6,
    chance: 0.05,
  },
  [MutationChance.Erhöht]: {
    enumValue: MutationChance.Erhöht,
    bonus: 4,
    chance: 0.14,
  },
  [MutationChance.Durchschnittlich]: {
    enumValue: MutationChance.Durchschnittlich,
    bonus: 3,
    chance: 0.4,
  },
  [MutationChance.Gering]: {
    enumValue: MutationChance.Gering,
    bonus: 2,
    chance: 0.3,
  },
  [MutationChance.Niedrig]: {
    enumValue: MutationChance.Niedrig,
    bonus: 0,
    chance: 0.1,
  },
};

const TrageZeitAttributeValue: AttributeDataMapping<TrageZeitAttributeWerte> = {
  [TrageZeitAttributeWerte.WurfMaschine]: {
    enumValue: TrageZeitAttributeWerte.WurfMaschine,
    bonus: 8,
    chance: 0.01,
    value: 1,
  },
  [TrageZeitAttributeWerte.Zügig]: {
    enumValue: TrageZeitAttributeWerte.Zügig,
    bonus: 5,
    chance: 0.05,
    value: 2,
  },
  [TrageZeitAttributeWerte.Mittel]: {
    enumValue: TrageZeitAttributeWerte.Mittel,
    bonus: 3,
    chance: 0.14,
    value: 3,
  },
  [TrageZeitAttributeWerte.Lang]: {
    enumValue: TrageZeitAttributeWerte.Lang,
    bonus: 2,
    chance: 0.5,
    value: 4,
  },
  [TrageZeitAttributeWerte.SehrLang]: {
    enumValue: TrageZeitAttributeWerte.SehrLang,
    bonus: 1,
    chance: 0.2,
    value: 5,
  },
  [TrageZeitAttributeWerte.ExtremLang]: {
    enumValue: TrageZeitAttributeWerte.ExtremLang,
    bonus: 0,
    chance: 0.1,
    value: 6,
  },
};

const YieldBonusAttributeValues: AttributeDataMapping<YieldBonus> = {
  [YieldBonus.Unerreicht]: {
    enumValue: YieldBonus.Unerreicht,
    bonus: 8,
    chance: 0.01,
  },
  [YieldBonus.Üppig]: { enumValue: YieldBonus.Üppig, bonus: 5, chance: 0.05 },
  [YieldBonus.Ergiebig]: {
    enumValue: YieldBonus.Ergiebig,
    bonus: 3,
    chance: 0.14,
  },
  [YieldBonus.Akzeptabel]: {
    enumValue: YieldBonus.Akzeptabel,
    bonus: 2,
    chance: 0.5,
  },
  [YieldBonus.Bescheiden]: {
    enumValue: YieldBonus.Bescheiden,
    bonus: 1,
    chance: 0.2,
  },
  [YieldBonus.Spärlich]: {
    enumValue: YieldBonus.Spärlich,
    bonus: 0,
    chance: 0.1,
  },
};

export {
  StrengthAttributeValues,
  RemarkabilityAttributeValues,
  MutationChanceAttributeValues,
  TrageZeitAttributeValue,
  YieldBonusAttributeValues,
};
