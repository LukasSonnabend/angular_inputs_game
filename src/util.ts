import { DnDMonster, EvolutionStage } from "./types";

export const MS_TO_DAYS = 1000 * 60 * 60 * 24;

export function evolutionStageNerfed(monster: DnDMonster): DnDMonster {
  const nerf = [0.4, 0.8, 1, 0];
  return {
    ...monster,
    strength: {
      ...monster.strength,
      // @ts-ignore
      value: Math.round(
        //@ts-ignore
        monster?.strength?.bonus * nerf[EvolutionStage[monster.evolutionStage]]
      ),
    },
    remarkability: {
      ...monster.remarkability,
      // @ts-ignore
      value: Math.round(
        monster.remarkability?.bonus *
          //@ts-ignore
          nerf[EvolutionStage[monster.evolutionStage]]
      ),
    },
    mutationChance: {
      ...monster.mutationChance,
      // @ts-ignore
      value: Math.round(
        monster.mutationChance?.bonus *
          //@ts-ignore
          nerf[EvolutionStage[monster.evolutionStage]]
      ),
    },
    yieldBonus: {
      ...monster.yieldBonus,
      // @ts-ignore
      value: Math.round(
        //@ts-ignore
        monster.yieldBonus?.bonus * nerf[EvolutionStage[monster.evolutionStage]]
      ),
    },
  };
}
