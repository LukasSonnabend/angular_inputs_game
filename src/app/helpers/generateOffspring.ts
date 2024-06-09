import { randSuperheroName } from '@ngneat/falso';
import { v4 as uuidv4 } from 'uuid';
import { MutationChance, MutationChanceAttributeValues, StrengthAttributeValues } from "../AttributeConfig";
import { DnDMonster, EvolutionStage, Gender, Tier } from '../../types';
import { AttributeValueWithOptionalValue } from '../../types';


const calcTier = (monster: DnDMonster) => {

  let score = Math.floor((monster?.strength?.bonus + monster?.remarkability?.bonus + monster?.mutationChance?.bonus));

  if (score >= 38) {
    return Tier.S;
  } else if (score >= 34) {
    return Tier.APlus;
  } else if (score >= 31) {
    return 'A';
  } else if (score >= 27) {
    return 'A-';
  } else if (score >= 24) {
    return 'B+';
  } else if (score >= 21) {
    return 'B';
  } else if (score >= 17) {
    return 'B-';
  } else if (score >= 13) {
    return 'C+';
  } else if (score >= 10) {
    return 'C';
  } else if (score >= 4) {
    return 'D';
  } else {
    return 'F';
  }



}





export function genOffspring(animal1: DnDMonster, animal2: DnDMonster ) : DnDMonster{



  // Mutationschance bestimmt mit welcher Wahrscheinlichkeit das Baby ein Attribut um eine Stufe erhöht. Beim Breeding wird dabei eine der beiden Mutationschancen der Eltern verwendet (zufällig von welchem Elternteil). 

  // Bezeichnung	Beschreibung	Gewichtung für Gesamtbewertung	% bei neu spawn des Tieres
  // Sehr hoch	"70%
  // Mutationschance"	10	1%
  // Hoch	50% Mutationschance	6	5%
  // Erhöht	25% Mutationschance	4	14%
  // Durchschnittlich	10% Mutationschance	3	40%
  // Gering	5% Mutationschance	2	30%
  // Niedrig	2% Mutationschance	0	10%

  //for this we need to take the value from the parent and the chance from the parent and then randomly increase the value by one if the chance is high enough also we need to track if this has hit then no other attribute can be increased

  const doTheMutation = (monster: DnDMonster) => {
    // mutate one attribute randomly
    const mutableAttributes = [{key: 'strength', type: StrengthAttributeValues}, {
      key: 'remarkability',
      type: StrengthAttributeValues
    }, {key: 'mutationChance', type: MutationChanceAttributeValues}, 
    {key: 'yieldBonus', type: StrengthAttributeValues}];

    const attributeToMutate = getRandomElement(mutableAttributes);
    // @ts-ignore

    const attribute = monster[attributeToMutate.key];
    const nextValue = getNextAttribute(attributeToMutate.type, attribute);
    ;
    return {...monster, [attributeToMutate.key]: nextValue};

  }
    debugger
    let child = {
        uuid: uuidv4(),
        name: randSuperheroName(),

        birthTimestamp: new Date(),
        growthStages: animal1.species.growthStages,
        species: animal1.species,
        // @ts-ignore
        strength: getRandomElement([animal1, animal2]).strength,
          // @ts-ignore
        remarkability: getRandomElement([animal1, animal2]).remarkability,
          // @ts-ignore
        mutationChance: getRandomElement([animal1, animal2]).mutationChance,
          // @ts-ignore
        gestationPeriod: getRandomElement([animal1, animal2]).gestationPeriod,
          // @ts-ignore
        yieldBonus: getRandomElement([animal1, animal2]).yieldBonus,

        // @ts-ignore
        gender: Gender[Math.floor(Math.random() * 2) as 0 | 1] as Gender,
        progressTowardsNextEvolution: 0,
          // @ts-ignore
        evolutionStage: EvolutionStage[Math.min(...animal1.species.growthStages)] as EvolutionStage,
        enclosureCost: getRandomElement([animal1, animal2]).enclosureCost,
        baseSalePrice: getRandomElement([animal1, animal2]).baseSalePrice,
    } as DnDMonster;
    // TODO: evolution stage musst be min stage of adults

    // @ts-ignore
    child.tier = calcTier(child);
    child.gestationPeriod = (child.gender === animal1.gender ? animal1.gestationPeriod : animal2.gestationPeriod);
    if((Math.random() < child.mutationChance.bonus)){
      child = doTheMutation(child);
    }

    return child;
}

function getRandomElement<T>(items: T[]): T {
    const randomIndex = Math.floor(Math.random() * items.length);
    return items[randomIndex];
}

function getNextAttribute(enumObj: any, currentValue: AttributeValueWithOptionalValue): AttributeValueWithOptionalValue {
  
    const values = Object.keys(enumObj).map(key => enumObj[key]);
    const currentIndex = values.indexOf(currentValue);
    // Return the next value, or the same if it's the last one
    return currentIndex < values.length - 1 ? values[currentIndex + 1] : currentValue;
}




function getRandomProperty<T extends object>(obj: T): [string, any] {
    const keys = Object.keys(obj);
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    
    // Note: Using any here because we don't know the type of values at compile time
    return [randomKey, obj[randomKey as keyof T]];
}