import { Component, HostListener, Input } from '@angular/core';
import { MonsterSelectionService } from '../service/monster-selection-service/monster-selection-service.service';
import { IndexedDBService } from '../indexed-db.service';
import { AnimalService } from '../animal-service.service';
import { CommonModule } from '@angular/common';
import { EvolutionStepperComponent } from "../evolution-stepper/evolution-stepper.component";
import { Animal, DnDMonster, Gender } from '../../types';
import { MS_TO_DAYS } from '../../util';

@Component({
    selector: 'app-monster-card',
    standalone: true,
    templateUrl: './monster-card.component.html',
    styleUrls: ['./monster-card.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
    ,
    imports: [CommonModule, EvolutionStepperComponent]
})
export class MonsterCardComponent {
  @Input() monster: Animal | undefined = undefined;
  public showSpeciesInfo: boolean = false;

  showDataView = false;
  MS_TO_DAYS = MS_TO_DAYS
  @HostListener('document:keydown.alt.enter', ['$event'])
  toggleDataView(event: KeyboardEvent) {
      event.preventDefault();
      this.showDataView = !this.showDataView;
  }

  constructor(protected selectionService: MonsterSelectionService, private IDBService: IndexedDBService, protected AnimalService: AnimalService) {}

  calculateTotalTime(timeToHatch: number, breedingStartDateTime?: DnDMonster): string {
    const totalTime = breedingStartDateTime?.lastEvolutionTimestamp ? new Date(breedingStartDateTime?.lastEvolutionTimestamp) : new Date();
    if (totalTime) {
      totalTime.setTime(totalTime.getTime() + timeToHatch);
    }
    return totalTime?.toLocaleString() || "";
  }
  openSpeciesInfo(event: Event): void {
    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();
    this.showSpeciesInfo = true;
  }

  onMonsterClick(): void {
    if (this.monster) {
      this.selectionService.toggleSelection(this.monster);
      console.log('Monster clicked:', this.monster);
      // Additional logic can be added here if needed
    }
  }

  releaseMonster(event: MouseEvent): void {
    event.stopPropagation(); // Prevent click event from bubbling up to the parent div
    if (this.monster && confirm(`Are you sure you want to release ${this.monster.name}?`)) {
      this.selectionService.deselectMonster(this.monster);
      this.AnimalService.deleteAnimal(this.monster.uuid)
    }
}

  get stringifiedMonster(): string {
    return JSON.stringify(this.monster, null, 2);
  }

  getGenderString(gender?: Gender): string {
    if (gender === undefined) return ""
    return Gender[gender]; // This converts the enum value to its string representation
  }
}