import { ColDef, ColGroupDef } from "@ag-grid-community/core";
import { DnDMonster } from "../../types";
import {
  StrengthAttributeWerte,
  TrageZeitAttributeWerte,
  Remarkability,
  MutationChance,
  YieldBonus,
} from "../AttributeConfig";
import { SimpleTextEditor } from "../cells/monster-name.cells";
import { GestationPeriodFilter } from "../filters/gestation-period.filter";
import { MutationChanceFilter } from "../filters/mutationchance.filter";
import { RankingFilter } from "../filters/ranking.filter";
import { RemarkabilityFilter } from "../filters/remarkability.filter";
import { SpeciesFilter } from "../filters/species.filter";
import { StageFilter } from "../filters/stage.filter";
import { StrengthAttributeWerteFilter } from "../filters/strength.filter";
import { CustomButtonComponent } from "../main-view/main-view.component";

function createEnumMapping<T>(enumObj: T): { [key: string]: number } {
  // @ts-ignore
  return Object.keys(enumObj).reduce((acc, key, index) => {
    // @ts-ignore
    acc[enumObj[key as keyof T]] = index;
    return acc;
  }, {} as { [key: string]: number });
}

function enumComparator<T>(enumObj: T) {
  const mapping = createEnumMapping(enumObj);
  return (a: keyof T, b: keyof T): number => {
    // @ts-ignore
    return mapping[a] - mapping[b];
  };
}

// Example arrays of enum values
const strengthValues: StrengthAttributeWerte[] = [
  StrengthAttributeWerte.Gigantisch,
  StrengthAttributeWerte.Ausgezeichnet,
  StrengthAttributeWerte.Stark,
  StrengthAttributeWerte.Robust,
  StrengthAttributeWerte.Normal,
  StrengthAttributeWerte.Schwach,
];

const trageZeitValues: TrageZeitAttributeWerte[] = [
  TrageZeitAttributeWerte.WurfMaschine,
  TrageZeitAttributeWerte.Zügig,
  TrageZeitAttributeWerte.Mittel,
  TrageZeitAttributeWerte.Lang,
  TrageZeitAttributeWerte.SehrLang,
  TrageZeitAttributeWerte.ExtremLang,
];

const remarkabilityValues: Remarkability[] = [
  Remarkability.Bemerkenswert,
  Remarkability.Beeindruckend,
  Remarkability.Attraktiv,
  Remarkability.Durchschnittlich,
  Remarkability.GehtSo,
  Remarkability.Hässlich,
];

const mutationChanceValues: MutationChance[] = [
  MutationChance.SehrHoch,
  MutationChance.Hoch,
  MutationChance.Erhöht,
  MutationChance.Durchschnittlich,
  MutationChance.Gering,
  MutationChance.Niedrig,
];

const yieldBonusValues: YieldBonus[] = [
  YieldBonus.Unerreicht,
  YieldBonus.Üppig,
  YieldBonus.Ergiebig,
  YieldBonus.Akzeptabel,
  YieldBonus.Bescheiden,
  YieldBonus.Spärlich,
];

// StrengthAttributeWerte comparator
const strengthAttributeWerteComparator = enumComparator(StrengthAttributeWerte);

// TrageZeitAttributeWerte comparator
const trageZeitAttributeWerteComparator = enumComparator(
  TrageZeitAttributeWerte
);

// Remarkability comparator
const remarkabilityComparator = enumComparator(Remarkability);

// MutationChance comparator
const mutationChanceComparator = enumComparator(MutationChance);

// YieldBonus comparator
const yieldBonusComparator = enumComparator(YieldBonus);

const rankingsOrder = [
  "S+",
  "S",
  "S-",
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "E+",
  "E",
  "E-",
  "F+",
  "F",
  "F-",
];

function rankingComparator(
  valueA: string,
  valueB: string,
  nodeA: any,
  nodeB: any,
  isDescending: boolean
): number {
  const indexA = rankingsOrder.indexOf(valueA);
  const indexB = rankingsOrder.indexOf(valueB);

  if (indexA === -1 || indexB === -1) {
    console.log(`${valueA} or ${valueB} not found in the predefined order`);
    throw new Error("Ranking not found in the predefined order");
  }

  return indexB - indexA;
}

export const colDefs = [
  {
    headerName: "Name",
    field: "name",
    filter: true,
    editable: true,
  },
  // add button to select animal
];
