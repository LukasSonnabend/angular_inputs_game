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
      <select
        [(ngModel)]="species"
        (ngModelChange)="updateFilter()"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="All">All</option>
        @for (item of options; track item) {
        <option [value]="item">{{ item }}</option>
        }
      </select>
    </div>
  `,
})
export class SpeciesFilter implements IFilterAngularComp {
  params!: IFilterParams;
  year = "All";
  species = "All";
  options = [] as string[];

  constructor() {
    this.options = monsters.map((i) => i.species);
  }

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.species !== "All";
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    return params.data.species.species === this.species;
  }

  getModel() {}

  setModel(model: any) {}

  updateFilter() {
    console.log("change");
    this.params.filterChangedCallback();
  }
}
