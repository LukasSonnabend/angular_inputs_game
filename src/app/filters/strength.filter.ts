import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IFilterAngularComp } from "ag-grid-angular";
import { IDoesFilterPassParams, IFilterParams } from "ag-grid-community";
import { StrengthAttributeWerte } from "../../types";
import { CommonModule } from "@angular/common";
import { StrengthAttributeValues } from "../AttributeConfig";

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="filter-container">
      <div>Strength Attribute</div>
      <select
        [(ngModel)]="filterValue"
        (ngModelChange)="updateFilter()"
        class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      >
        <option value="">All</option>
        <option *ngFor="let option of options" [value]="option">
          {{ option }} ({{ valueMapping[option].bonus }})
        </option>
      </select>
    </div>
  `,
})
export class StrengthAttributeWerteFilter implements IFilterAngularComp {
  params!: IFilterParams;
  filterValue = "";
  options = Object.values(StrengthAttributeWerte);
  valueMapping = StrengthAttributeValues;
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

    return params.data.nerfed.strength.enumValue === this.filterValue;
  }

  getModel() {}

  setModel(model: any) {}

  updateFilter() {
    this.params.filterChangedCallback();
  }
}
