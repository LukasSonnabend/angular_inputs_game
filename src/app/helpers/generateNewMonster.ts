import { StrengthAttributeValues, RemarkabilityAttributeValues, MutationChanceAttributeValues, TrageZeitAttributeValue, YieldBonusAttributeValues } from "../AttributeConfig";
import { v4 as uuidv4 } from 'uuid';
import { randSuperheroName } from '@ngneat/falso';
import MonsterData from "../resources/monsters.json";
import { AttributeDataMapping, DnDMonster, EvolutionStage,Gender} from "../../types";
// Corrected helper function to randomly select an attribute value based on chance
function selectAttributeValue<T extends string | number | symbol>(attributeValues: AttributeDataMapping<T>): { bonus: number; chance: number; value?: number } | null {
        // @ts-ignore
    const totalChance = Object.values(attributeValues).reduce((acc, { chance }) => acc + chance, 0);
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

// Function to generate a new monster
function generateNewMonster(): DnDMonster {
    const species = getRandomElement(MonsterData);
    const birthTimestamp = new Date();
    const data =  {
        uuid: uuidv4(),
        name: randSuperheroName(),
        // @ts-ignore
        evolutionStage: EvolutionStage[Math.floor(Math.random() * 3) as 0 | 1 | 2],
        lastEvolutionTimestamp: birthTimestamp, 
        birthTimestamp,
        enclosureCost: species.enclosureCost,
        species:
        species,
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
        gender: Gender[Math.floor(Math.random() * 2) as 0 | 1]
    };
    // @ts-ignore
    return data
}


export function generateNewMonsterW(speciesInc: string, evolutionStageInc: string, gender: string): DnDMonster {
  const species = MonsterData.find(i => i.species === speciesInc)
  if (!species)
    throw new Error('Invalid Species');

  const birthTimestamp = new Date();
  const data =  {
      uuid: uuidv4(),
      name: randSuperheroName(),
      // @ts-ignore
      evolutionStage: evolutionStageInc,//EvolutionStage[Math.floor(Math.random() * 3) as 0 | 1 | 2],
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
      yieldBonus: selectAttributeValue(YieldBonusAttributeValues),
                // @ts-ignore
      gender: gender,
  };
  // @ts-ignore
  return data
}


export default generateNewMonster;