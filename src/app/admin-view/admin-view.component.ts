import { Component, OnInit } from '@angular/core';
import { AnimalService } from '../../app/animal-service.service';
import MonsterData from '../resources/monsters.json';
import { CommonModule } from '@angular/common';
import { EvolutionStage } from '../../types';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { generateNewMonsterW } from '../helpers/generateNewMonster';
import { MonsterCardComponent } from "../monster-card/monster-card.component";

@Component({
    selector: 'admin-view',
    standalone: true,
    template: `
    <div class="star-wars-theme">
  <h2>Admin View</h2>
  <div>
    <label for="monsterSelect" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Select a Monster:</label>
    <select id="monsterSelect" (change)="onMonsterSelected($event)" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
      <option disabled selected value> -- select an option -- </option>
      <option *ngFor="let monster of monsters" [value]="monster.name">{{ monster.name }}</option>
    </select>
  </div>
  <form [formGroup]="monsterForm" (ngSubmit)="onSubmit()">
    <div *ngIf="selectedMonster">
      <label for="evolutionStageSelect" class="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">Select Evolution Stage:</label>
      <select id="evolutionStageSelect" formControlName="evolutionStage" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
        <option disabled selected value> -- select an option -- </option>
        <option *ngFor="let stage of evolutionStages" [value]="stage">{{ stage }}</option>
      </select>
    </div>
    <div class="mt-4">
      <label for="quantity" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Quantity:</label>
      <input type="number" id="quantity" formControlName="quantity" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
    </div>
    <button type="submit" [disabled]="!monsterForm.valid" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Create Monster</button>
  </form>
  <div *ngIf="createdMonsters.length > 0" class="mt-4">
    <h3>Newly Created Monsters:</h3>
    <ul>
      <li *ngFor="let monster of createdMonsters">
        <app-monster-card [monster]="monster"/>
      </li>
    </ul>
  </div>
</div>

  `,
    imports: [CommonModule, ReactiveFormsModule, MonsterCardComponent]
})
export class AdminViewComponent implements OnInit {
  monsters: any[] = MonsterData;
  selectedMonster: any;
  evolutionStages = Object.keys(EvolutionStage).filter(k => isNaN(Number(k)));  // Get enum keys as array of strings
  monsterForm: FormGroup;
  createdMonsters: any[] = [];  // Array to store newly created monsters

  constructor(private animalService: AnimalService, private fb: FormBuilder) {
    this.monsterForm = this.fb.group({
      evolutionStage: ['', Validators.required],
      species: ['', Validators.required],
      quantity: [1, Validators.required]
    });
  }

  ngOnInit(): void {}

  onMonsterSelected(e: Event): void {
    const monsterName = (e?.target as HTMLSelectElement).value;
    this.selectedMonster = this.monsters.find(monster => monster.name === monsterName);
    console.log('Selected Monster:', this.selectedMonster);
    if (this.selectedMonster) {
      this.monsterForm.patchValue({ species: this.selectedMonster.species });
    }
  }

  onEvolutionStageSelected(e: Event): void {
    const stage = (e?.target as HTMLSelectElement).value;
    console.log('Selected Evolution Stage:', stage);
  }

  onSubmit(): void {
    if (this.monsterForm.valid) {
      const newMonster = this.monsterForm.value;
      console.log('New Monster Created:', newMonster);
      // Add the new monster to the list
      for (let i = 0; i < this.monsterForm.controls['quantity'].value; i++) {
        this.createdMonsters.push(generateNewMonsterW(this.monsterForm.controls['species'].value, this.monsterForm.controls['evolutionStage'].value));

      }
      alert('Monster Created: ' + JSON.stringify(newMonster));
    } else {
      console.log('Form is invalid');
    }
  }
}
