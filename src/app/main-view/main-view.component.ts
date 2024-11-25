import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, computed, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import "zone.js";
import { AnimalFormComponent } from "../../app/animal-form/animal-form.component";
import { AnimalService } from "../../app/animal-service.service";
import { AttributeInputComponent } from "../../app/attribute-input/attribute-input.component";
import { BreedingPodListComponent } from "../../app/breeding-pod-list/breeding-pod-list.component";
import { MonsterCardComponent } from "../../app/monster-card/monster-card.component";
import MonsterData from "../resources/monsters.json";
import { SupabaseService } from "../supabase.service";
import {
  DnDMonster,
  EvolutionStage,
  MutationChance,
  Remarkability,
  StrengthAttributeWerte,
  TrageZeitAttributeWerte,
  YieldBonus,
} from "../../types";
import { AgGridAngular } from "ag-grid-angular";
import { MonsterSelectionService } from "../service/monster-selection-service/monster-selection-service.service";
import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { BreedingServiceService } from "../breeding-service.service";
import {
  calcMonsterTier,
  evolutionStageNerfed,
} from "../helpers/generateNewMonster";
import { SpeciesFilter } from "../filters/species.filter";
import { StageFilter } from "../filters/stage.filter";
import { StrengthAttributeWerteFilter } from "../filters/strength.filter";
import { RemarkabilityFilter } from "../filters/remarkability.filter";
import { RankingFilter } from "../filters/ranking.filter";
import { MutationChanceFilter } from "../filters/mutationchance.filter";
import { GestationPeriodFilter } from "../filters/gestation-period.filter";

@Component({
  standalone: true,
  template: `<button
    class="mini-button button-primary"
    (click)="buttonClicked()"
  >
    {{ label }}
  </button>`,
})
export class CustomButtonComponent implements ICellRendererAngularComp {
  clickFunction: (monster: DnDMonster) => void = () => {};
  monster: DnDMonster | undefined = undefined;
  label: string = "Launch!";

  agInit(params: ICellRendererParams): void {
    this.clickFunction = params.colDef?.cellRendererParams.onClick;
    this.monster = params.data;
    this.label = params.colDef?.headerName || "Launch!";
  }
  refresh(params: ICellRendererParams) {
    return true;
  }
  buttonClicked() {
    this.clickFunction(this.monster as DnDMonster);
  }
}

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <div class="star-wars-theme h-screen flex flex-col">
      <span>Total Value: {{ totalValue }}</span>
      <div class="flex justify-end">
        <div class="flex gap-10">
          <button class="button button-primary" (click)="saveToSupabase()">
            save
          </button>
          <button class="button button-secondary" (click)="loadFromSupabase()">
            load
          </button>
        </div>
      </div>
      <div
        class="grid"
        style="grid-template-columns: 3fr 1fr;grid-template-rows: calc(100vh - 130px)"
      >
        <div class="ag-theme-balham my-2 grow flex flex-col">
          <ag-grid-angular
            style="flex-grow: 1;"
            class="ag-theme-balham-dark"
            [pagination]="true"
            [rowData]="filteredAnimals"
            [columnDefs]="colDefs"
          >
          </ag-grid-angular>
        </div>
        <div class="flex flex-col overflow-y-auto" style="max-height: 100vh;">
          <app-animal-form />
          <app-breeding-pod-list />
        </div>
      </div>
    </div>
  `,
  imports: [
    AnimalFormComponent,
    CommonModule,
    BreedingPodListComponent,
    FormsModule,
    ReactiveFormsModule,
    AgGridAngular,
  ],
})
export class MainViewComponent implements OnInit {
  availableMonsters: any[] = MonsterData;
  pageSize = 10;
  pageIndex = 0;

  animals: any[] = [];
  name = "Angular";
  filteredAnimals: any[] = [];
  session = this.supabase.session;
  selectedSpecies: string = "";
  selectedGrowthStage: string = "";
  evolutionStages = Object.keys(EvolutionStage).filter((k) => isNaN(Number(k))); //

  constructor(
    private cdr: ChangeDetectorRef,
    private animalService: AnimalService,
    private supabase: SupabaseService,
    private selectionService: MonsterSelectionService,
    private breedingService: BreedingServiceService
  ) {}

  rankingsOrder = [
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

  rankingComparator(
    valueA: string,
    valueB: string,
    nodeA: any,
    nodeB: any,
    isDescending: boolean
  ): number {
    const indexA = this.rankingsOrder.indexOf(valueA);
    const indexB = this.rankingsOrder.indexOf(valueB);

    if (indexA === -1 || indexB === -1) {
      console.log(`${valueA} or ${valueB} not found in the predefined order`);
      throw new Error("Ranking not found in the predefined order");
    }

    return indexB - indexA;
  }

  createEnumMapping<T>(enumObj: T): { [key: string]: number } {
    // @ts-ignore
    return Object.keys(enumObj).reduce((acc, key, index) => {
      // @ts-ignore
      acc[enumObj[key as keyof T]] = index;
      return acc;
    }, {} as { [key: string]: number });
  }

  enumComparator<T>(enumObj: T) {
    const mapping = this.createEnumMapping(enumObj);
    return (a: keyof T, b: keyof T): number => {
      // @ts-ignore
      return mapping[a] - mapping[b];
    };
  }
  // StrengthAttributeWerte comparator
  strengthAttributeWerteComparator = this.enumComparator(
    StrengthAttributeWerte
  );

  // TrageZeitAttributeWerte comparator
  trageZeitAttributeWerteComparator = this.enumComparator(
    TrageZeitAttributeWerte
  );

  // Remarkability comparator
  remarkabilityComparator = this.enumComparator(Remarkability);

  // MutationChance comparator
  mutationChanceComparator = this.enumComparator(MutationChance);

  // YieldBonus comparator
  yieldBonusComparator = this.enumComparator(YieldBonus);

  // Example arrays of enum values
  strengthValues: StrengthAttributeWerte[] = [
    StrengthAttributeWerte.Gigantisch,
    StrengthAttributeWerte.Ausgezeichnet,
    StrengthAttributeWerte.Stark,
    StrengthAttributeWerte.Robust,
    StrengthAttributeWerte.Normal,
    StrengthAttributeWerte.Schwach,
  ];

  trageZeitValues: TrageZeitAttributeWerte[] = [
    TrageZeitAttributeWerte.WurfMaschine,
    TrageZeitAttributeWerte.Zügig,
    TrageZeitAttributeWerte.Mittel,
    TrageZeitAttributeWerte.Lang,
    TrageZeitAttributeWerte.SehrLang,
    TrageZeitAttributeWerte.ExtremLang,
  ];

  remarkabilityValues: Remarkability[] = [
    Remarkability.Bemerkenswert,
    Remarkability.Beeindruckend,
    Remarkability.Attraktiv,
    Remarkability.Durchschnittlich,
    Remarkability.GehtSo,
    Remarkability.Hässlich,
  ];

  mutationChanceValues: MutationChance[] = [
    MutationChance.SehrHoch,
    MutationChance.Hoch,
    MutationChance.Erhöht,
    MutationChance.Durchschnittlich,
    MutationChance.Gering,
    MutationChance.Niedrig,
  ];

  yieldBonusValues: YieldBonus[] = [
    YieldBonus.Unerreicht,
    YieldBonus.Üppig,
    YieldBonus.Ergiebig,
    YieldBonus.Akzeptabel,
    YieldBonus.Bescheiden,
    YieldBonus.Spärlich,
  ];

  colDefs = [
    {
      headerName: "Select",
      maxWidth: 75,
      cellRenderer: CustomButtonComponent,
      cellRendererParams: {
        onClick: (e: DnDMonster) => this.onSelectAnimal(e),
      },
    },
    {
      headerName: "Delete",
      maxWidth: 75,
      cellRenderer: CustomButtonComponent,
      cellRendererParams: {
        onClick: (e: DnDMonster) => this.deleteAnimal(e.uuid),
      },
    },
    { headerName: "Name", field: "name", filter: true, editable: true },
    { headerName: "Gender", field: "gender", maxWidth: 100, filter: true },
    {
      headerName: "Rating",
      field: "tier",
      maxWidth: 75,
      filter: RankingFilter,
      comparator: this.rankingComparator.bind(this),
    },
    {
      headerName: "Species",
      filter: SpeciesFilter,
      field: "species.name",
      maxWidth: 150,
    },
    {
      headerName: "Stage",
      field: "evolutionStage",
      maxWidth: 75,
      filter: StageFilter,
    },
    {
      headerName: "Gestation Period",
      field: "nerfed.gestationPeriod.enumValue",
      filter: GestationPeriodFilter,
      comparator: this.trageZeitAttributeWerteComparator.bind(this),
    },
    {
      headerName: "Stärke",
      field: "nerfed.strength.enumValue",
      maxWidth: 125,
      filter: StrengthAttributeWerteFilter,
    },
    {
      headerName: "Remarkability",
      field: "nerfed.remarkability.enumValue",
      maxWidth: 125,
      filter: RemarkabilityFilter,
      comparator: this.remarkabilityComparator.bind(this),
    },
    {
      headerName: "Mutation Chance",
      field: "nerfed.mutationChance.enumValue",
      maxWidth: 130,
      filter: MutationChanceFilter,
      comparator: this.mutationChanceComparator.bind(this),
    },
    {
      headerName: "Cycle Length",
      field: "species.cycleTime",
      maxWidth: 100,
      filter: true,
    },
    // add button to select animal
  ];

  onSelectAnimal(event: any) {
    console.log("Monster clicked:", event);
    this.selectionService.toggleSelection(event);

    // Additional logic can be added here if needed
  }

  deleteAnimal(uuid: string): void {
    this.animalService.deleteAnimal(uuid);
  }
  gradeMap: Record<string, any> = {
    S: { pointsRange1: [38, 40], pointsRange2: [46, 48], multiplier: 9 },
    "A+": { pointsRange1: [34, 37], pointsRange2: [41, 45], multiplier: 3.5 },
    A: { pointsRange1: [31, 33], pointsRange2: [37, 40], multiplier: 2.5 },
    "A-": { pointsRange1: [27, 30], pointsRange2: [32, 36], multiplier: 2 },
    "B+": { pointsRange1: [24, 26], pointsRange2: [29, 31], multiplier: 1.8 },
    B: { pointsRange1: [21, 23], pointsRange2: [25, 28], multiplier: 1.2 },
    "B-": { pointsRange1: [17, 20], pointsRange2: [20, 24], multiplier: 1 },
    "C+": { pointsRange1: [13, 16], pointsRange2: [16, 19], multiplier: 0.8 },
    C: { pointsRange1: [10, 12], pointsRange2: [12, 15], multiplier: 0.4 },
    D: { pointsRange1: [4, 9], pointsRange2: [5, 11], multiplier: 0.2 },
    F: { pointsRange1: [0, 3], pointsRange2: [0, 4], multiplier: 0 },
  };
  totalValue = "";

  setTotalValue() {
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

    this.totalValue = formatter
      .format(
        this.animals.reduce((acc, animal) => {
          // @ts-ignore
          return (
            acc + animal.baseSalePrice * this.gradeMap[animal.tier].multiplier
          );
        }, 0)
      )
      .replace("$", "₡"); // Replace $ with ₡ for Star Wars credits
  }

  saveToSupabase() {
    if (confirm("Are you sure you want to save the current state?")) {
      // save the data from the animal service to supabase
      const jsonB = JSON.stringify(this.animals);
      this.supabase.insertIntoSaves([jsonB]);
      const breedingPodsData = JSON.stringify(
        this.breedingService.getBreedingPods()
      );
      this.supabase.insertIntoPods(breedingPodsData);
    }
  }

  async loadFromSupabase() {
    if (confirm("Are you sure you want to load the last save?")) {
      const data = await this.supabase.loadLastSave();
      const animalData = data?.animalData.map((animal: any) => {
        animal.species.image_url = MonsterData.find((monster) => {
          return monster.species === animal.species.species;
        })?.image_url;

        animal.tier = calcMonsterTier(animal as DnDMonster);
        animal.nerfed = evolutionStageNerfed(animal as DnDMonster);
        return {
          ...animal,
        };
      });

      const podsData = data?.podsData.map((pod: any) => {
        return {
          ...pod,
          parents: pod.parents.map((parent: any) => {
            return {
              ...parent,
              species: MonsterData.find((monster) => {
                return monster.species === parent.species.species;
              }),
            };
          }),
          offspring: pod.offspring.map((offspring: any) => {
            return {
              ...offspring,
              species: MonsterData.find((monster) => {
                return monster.species === offspring.species.species;
              }),
            };
          }),
        };
      });

      console.debug("Data:", data);
      // @ts-ignore
      this.animalService.animalsSubject.next(animalData);
      this.animalService.reinitIndexDB(animalData);
      // @ts-ignore
      this.breedingService.restoreSavedData(podsData);

      this.cdr.detectChanges(); // Manually trigger change detection
    }
  }
  totalWorth = 0;
  ngOnInit(): void {
    // @ts-ignore
    this.supabase.authChanges((_, session) => (this.session = session));

    this.animalService.animals$.subscribe(
      (animals) => {
        this.animals = animals;
        this.setTotalValue();
      },
      (error) => {
        console.error("Failed to load animals:", error);
      }
    );

    this.animalService.filteredAnimals$.subscribe(
      (filteredAnimals) => {
        this.filteredAnimals = filteredAnimals;
        // console.log('Filtered animals:', filteredAnimals);
      },
      (error) => {
        console.error("Failed to load filtered animals:", error);
      }
    );

    this.welcomeUser();
  }

  welcomeUser(): void {
    const lastVisitDate = localStorage.getItem("lastVisitDate");
    const currentDate = new Date().toDateString(); // Get current date as a string

    if (lastVisitDate !== currentDate) {
      const msg = new SpeechSynthesisUtterance("Welcome to Ruks Animal Hoe");
      window.speechSynthesis.speak(msg);
      localStorage.setItem("lastVisitDate", currentDate); // Update the last visit date
    }
  }
}
