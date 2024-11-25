import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IFilterAngularComp } from "ag-grid-angular";
import monsters from "../resources/monsters.json";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="year-filter">
      <div>Species</div>
      <input
        type="text"
        [(ngModel)]="species"
        (ngModelChange)="updateFilter()"
        placeholder="Search species"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
      <ul
        *ngIf="filteredOptions.length > 0"
        class="bg-white border border-gray-300 rounded-lg mt-2"
      >
        <li
          *ngFor="let option of filteredOptions"
          (click)="selectOption(option)"
          class="p-2 cursor-pointer hover:bg-gray-200"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  `,
})
export class SpeciesFilter implements IFilterAngularComp {
  params!: IFilterParams;
  species = "";
  options = [] as string[];
  filteredOptions = [] as string[];

  constructor() {
    this.options = monsters.map((i) => i.species);
    this.filteredOptions = this.options;
  }

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.species !== "";
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return params.data.nerfed.species.species
      .toLowerCase()
      .includes(this.species.toLowerCase());
  }

  getModel() {}

  setModel(model: any) {}

  updateFilter() {
    this.filteredOptions = this.options.filter((option) =>
      option.toLowerCase().includes(this.species.toLowerCase())
    );
    this.params.filterChangedCallback();
  }

  selectOption(option: string) {
    this.species = option;
    this.updateFilter();
  }
}
