import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import "zone.js";
import { AnimalFormComponent } from "../../app/animal-form/animal-form.component";
import { AnimalService } from "../../app/animal-service.service";
import { AttributeInputComponent } from "../../app/attribute-input/attribute-input.component";
import { BreedingPodListComponent } from "../../app/breeding-pod-list/breeding-pod-list.component";
import { MonsterCardComponent } from "../../app/monster-card/monster-card.component";
import MonsterData from "../resources/monsters.json";
import { SupabaseService } from "../supabase.service";
import { DnDMonster, EvolutionStage } from "../../types";
import { AgGridAngular } from "ag-grid-angular";

import { MonsterSelectionService } from "../service/monster-selection-service/monster-selection-service.service";

import { ICellRendererAngularComp } from "ag-grid-angular";
import { ICellRendererParams } from "ag-grid-community";
import { max } from "rxjs";
import { BreedingServiceService } from "../breeding-service.service";

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
    <div class="star-wars-theme">
      <div class="flex justify-end">
        <div class="flex gap-10">
          <button class="button button-primary>" (click)="saveToSupabase()">
            save
          </button>
          <button class="button button-secondary>" (click)="loadFromSupabase()">
            load
          </button>
        </div>
      </div>
      <div>
        <form ngForm>
          <label>
            Species:
            <select
              [(ngModel)]="selectedSpecies"
              (change)="filterAnimals()"
              name="species"
            >
              <option value="">All</option>
              <!-- Add an option for each species -->
              <option
                *ngFor="let species of availableMonstersAsOptions()"
                [value]="species.value"
              >
                {{ species.label }}
              </option>
              <!-- etc. -->
            </select>
          </label>
          <label>
            Growth Stage:
            <select
              [(ngModel)]="selectedGrowthStage"
              (change)="filterAnimals()"
              name="growthStage"
            >
              <option value="">All</option>
              <!-- Add an option for each growth stage -->
              <option *ngFor="let stage of evolutionStages" [value]="stage">
                {{ stage }}
              </option>
              <!-- etc. -->
            </select>
          </label>
        </form>
      </div>
      <button (click)="previousPage()" class="button button-primary">
        Previous page
      </button>
      <button (click)="nextPage()">Next page</button>

      <div class="ag-theme-balham">
        <ag-grid-angular
          style="height: 500px; width: 100%;"
          class="ag-theme-balham-dark"
          [rowData]="filteredAnimals"
          [columnDefs]="colDefs"
        >
        </ag-grid-angular>
      </div>
      <app-animal-form />
      <app-breeding-pod-list />
      <!-- other elements... -->
      <!-- <div *ngIf="filteredAnimals.length > 0" class="flex flex-col gap-5">
    <app-monster-card *ngFor="let beast of filteredAnimals" [monster]="beast"></app-monster-card>
    </div> -->
    </div>
  `,
  imports: [
    AnimalFormComponent,
    AttributeInputComponent,
    CommonModule,
    MonsterCardComponent,
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
    { headerName: "Name", field: "name" },
    { headerName: "Gender", field: "gender", maxWidth: 100 },
    { headerName: "Rating", field: "tier", maxWidth: 75 },
    { headerName: "Species", field: "species.name", maxWidth: 150 },
    { headerName: "Stage", field: "evolutionStage", maxWidth: 75 },
    {
      headerName: "Gestation Period",
      field: "nerfed.gestationPeriod.enumValue",
    },
    { headerName: "Stärke", field: "nerfed.strength.enumValue", maxWidth: 125 },
    {
      headerName: "Remarkability",
      field: "nerfed.remarkability.enumValue",
      maxWidth: 125,
    },
    {
      headerName: "Mutation Chance",
      field: "nerfed.mutationChance.enumValue",
      maxWidth: 130,
    },
    { headerName: "Cycle Length", field: "species.cycleTime", maxWidth: 100 },
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
  availableMonstersAsOptions(): any[] {
    return this.availableMonsters.map((monster) => {
      return { value: monster.species, label: monster.species };
    });
  }

  filterAnimals(): void {
    const allFilteredAnimals = this.animals.filter((animal) => {
      return (
        (this.selectedSpecies === "" ||
          animal.species.name === this.selectedSpecies) &&
        (this.selectedGrowthStage === "" ||
          animal.evolutionStage === this.selectedGrowthStage)
      );
    });

    // Slice the array to get only the animals for the current page
    this.filteredAnimals = allFilteredAnimals.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  nextPage(): void {
    this.pageIndex++;
    this.filterAnimals();
  }

  previousPage(): void {
    if (this.pageIndex > 0) {
      this.pageIndex--;
      this.filterAnimals();
    }
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
      console.log("Data:", data);
      // @ts-ignore
      this.animalService.animalsSubject.next(data?.animalData);
      this.animalService.reinitIndexDB(data?.animalData);
      // @ts-ignore
      this.breedingService.restoreSavedData(data?.podsData);

      this.cdr.detectChanges(); // Manually trigger change detection
    }
  }

  ngOnInit(): void {
    // @ts-ignore
    this.supabase.authChanges((_, session) => (this.session = session));

    this.animalService.animals$.subscribe(
      (animals) => {
        this.animals = animals;
        // console.log('Loaded animals:', animals);
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
