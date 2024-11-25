import {
  StrengthAttributeValues,
  RemarkabilityAttributeValues,
  MutationChanceAttributeValues,
  TrageZeitAttributeValue,
  YieldBonusAttributeValues,
  YieldBonus,
} from "../AttributeConfig";
import { v4 as uuidv4 } from "uuid";
import { randFullName, randSuperheroName } from "@ngneat/falso";
import MonsterData from "../resources/monsters.json";
import {
  AttributeDataMapping,
  DnDMonster,
  EvolutionStage,
  Gender,
  Tier,
} from "../../types";
// Corrected helper function to randomly select an attribute value based on chance
function selectAttributeValue<T extends string | number | symbol>(
  attributeValues: AttributeDataMapping<T>
): { bonus: number; chance: number; value?: number } | null {
  // @ts-ignore
  const totalChance = Object.values(attributeValues).reduce(
    // @ts-ignore
    (acc, { chance }) => acc + chance,
    0
  );
  // @ts-ignore
  let randomChance = Math.random() * totalChance;
  for (const key of Object.keys(attributeValues)) {
    // @ts-ignore
    const attribute = attributeValues[key];
    if (randomChance < attribute.chance) return attribute;
    randomChance -= attribute.chance;
  }
  return null;
}

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// calculate score
// Gesamtbewertung	Punkte normale Tiere 	Punkte Farmtiere	Multiplier für Verkaufswert
// S	38-40 Punkte	46-48 Punkte	9x
// A+	34-37 Punkte	41-45 Punkte	3,5x
// A	31-33 Punkte	37-40 Punkte	2,5x
// A-	27-30 Punkte	32-36 Punkte	2x
// B+	24-26 Punkte	29-31 Punkte	1,8x
// B	21-23 Punkte	25-28 Punkte	1,2x
// B- 	17-20 Punkte	20-24 Punkte	1x
// C+	13-16 Punkte	16-19 Punkte	0,8x
// C	10-12 Punkte	12-15 Punkte	0,4x
// D	4-9 Punkte	5-11 Punkte	0,2x
// F	0-3 Punkte	0-4 Punkte	0x

export function calcMonsterTier(monster: DnDMonster): Tier {
  const score =
    monster.strength.bonus! +
    monster.remarkability.bonus! +
    monster.mutationChance.bonus! +
    monster.yieldBonus.bonus!;

  if (score >= 32) {
    return Tier.S;
  } else if (score >= 29) {
    // -4
    return Tier.APlus;
  } else if (score >= 25) {
    // -3
    return Tier.A;
  } else if (score >= 22) {
    // -4
    return Tier.AMinus;
  } else if (score >= 18) {
    // -3
    return Tier.BPlus;
  } else if (score >= 15) {
    // -3
    return Tier.B;
  } else if (score >= 12) {
    // -4
    return Tier.BMinus;
  } else if (score >= 8) {
    // -4
    return Tier.CPlus;
  } else if (score >= 4) {
    // -3
    return Tier.C;
  } else if (score >= 1) {
    // -6
    return Tier.D;
  } else {
    return Tier.F;
  }
}

// Tierstufe	Multiplier für Attribute und Verkaufspreis, NICHT Gewichtungen)
// Eier (Falls Eierlegend)	0x
// Klein	0,4x
// Mittel	0,8x
// Groß	1x
// Nerf the attributes based on the size of the monster

export function evolutionStageNerfed(monster: DnDMonster): DnDMonster {
  const nerf = [0.4, 0.8, 1, 0];
  return {
    ...monster,
    strength: {
      ...monster.strength,
      value: Math.round(
        // @ts-ignore
        monster?.strength?.bonus * nerf[EvolutionStage[monster.evolutionStage]]
      ),
    },
    remarkability: {
      ...monster.remarkability,
      value: Math.round(
        monster.remarkability?.bonus *
          // @ts-ignore
          nerf[EvolutionStage[monster.evolutionStage]]
      ),
    },
    mutationChance: {
      ...monster.mutationChance,
      value: Math.round(
        monster.mutationChance?.bonus *
          // @ts-ignore
          nerf[EvolutionStage[monster.evolutionStage]]
      ),
    },
    yieldBonus: {
      ...monster.yieldBonus,
      value: Math.round(
        // @ts-ignore
        monster.yieldBonus?.bonus * nerf[EvolutionStage[monster.evolutionStage]]
      ),
    },
  };
}

// Function to generate a new monster
function generateNewMonster(): DnDMonster {
  const species = getRandomElement(MonsterData);
  const birthTimestamp = new Date();
  const gender = Gender[Math.floor(Math.random() * 2) as 0 | 1];
  const data = {
    uuid: uuidv4(),
    name: randFullName({
      gender: gender === Gender[0] ? "male" : "female",
    }),
    // @ts-ignore
    evolutionStage: EvolutionStage[Math.floor(Math.random() * 3) as 0 | 1 | 2],
    lastEvolutionTimestamp: birthTimestamp,
    birthTimestamp,
    enclosureCost: species.enclosureCost,
    species: species,
    baseSalePrice: species.baseSalePrice,
    // @ts-ignore
    strength: selectAttributeValue(StrengthAttributeValues),
    progressTowardsNextEvolution: 0,
    // @ts-ignore
    remarkability: selectAttributeValue(RemarkabilityAttributeValues),
    // @ts-ignore
    mutationChance: selectAttributeValue(MutationChanceAttributeValues),
    // @ts-ignore
    gestationPeriod: selectAttributeValue(TrageZeitAttributeValue),
    cycleTime: species.cycleTime,
    // @ts-ignore
    yieldBonus: YieldBonus.Spärlich,
    // @ts-ignore
    gender: gender,
  };
  // @ts-ignore
  return data;
}

export function generateNewMonsterW(
  speciesInc: string,
  evolutionStageInc: string,
  gender: string
): DnDMonster {
  const species = MonsterData.find((i) => i.species === speciesInc);
  if (!species) throw new Error("Invalid Species");

  const birthTimestamp = new Date();
  // @ts-ignore
  const data = {
    uuid: uuidv4(),
    name: randFullName({
      gender: gender === Gender[0] ? "male" : "female",
    }),
    // @ts-ignore
    evolutionStage: evolutionStageInc, //EvolutionStage[Math.floor(Math.random() * 3) as 0 | 1 | 2],
    lastEvolutionTimestamp: birthTimestamp,
    birthTimestamp,
    growthStages: species.growthStages,
    enclosureCost: species.enclosureCost,
    species: species,
    baseSalePrice: species.baseSalePrice,
    // @ts-ignore
    strength: selectAttributeValue(StrengthAttributeValues),
    progressTowardsNextEvolution: 0,
    // @ts-ignore
    remarkability: selectAttributeValue(RemarkabilityAttributeValues),
    // @ts-ignore
    mutationChance: selectAttributeValue(MutationChanceAttributeValues),
    // @ts-ignore
    gestationPeriod: selectAttributeValue(TrageZeitAttributeValue),
    cycleTime: species.cycleTime,
    // @ts-ignore
    yieldBonus: selectAttributeValue(YieldBonusAttributeValues),
    // @ts-ignore
    gender: gender,
  } as DnDMonster;

  data.tier = calcMonsterTier(data as DnDMonster);
  data.nerfed = evolutionStageNerfed(data as DnDMonster);

  // @ts-ignore
  return data;
}

export default generateNewMonster;
