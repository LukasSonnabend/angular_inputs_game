import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IFilterAngularComp } from "ag-grid-angular";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";
import { CommonModule } from "@angular/common";

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="filter-container">
      <div>Ranking</div>
      <select
        [(ngModel)]="filterValue"
        (ngModelChange)="updateFilter()"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="">All</option>
        <option *ngFor="let option of rankingsOrder" [value]="option">
          {{ option }}
        </option>
      </select>
    </div>
  `,
})
export class RankingFilter implements IFilterAngularComp {
  params!: IFilterParams;
  filterValue = "";
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

  agInit(params: IFilterParams): void {
    this.params = params;
  }

  isFilterActive(): boolean {
    return this.filterValue !== "";
  }

  doesFilterPass(params: IDoesFilterPassParams): boolean {
    if (!this.filterValue) {
      return true;
    }
    debugger;
    return params.data.nerfed.tier === this.filterValue;
  }

  getModel() {}

  setModel(model: any) {}

  updateFilter() {
    this.params.filterChangedCallback();
  }
}
