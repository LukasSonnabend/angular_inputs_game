import { Component, OnInit } from '@angular/core';
import 'zone.js';
import { AnimalFormComponent } from "../../app/animal-form/animal-form.component";
import { AttributeInputComponent } from "../../app/attribute-input/attribute-input.component";
import { AnimalService } from '../../app/animal-service.service';
import { CommonModule } from '@angular/common';
import { MonsterCardComponent } from "../../app/monster-card/monster-card.component";
import { BreedingPodListComponent } from '../../app/breeding-pod-list/breeding-pod-list.component';
import { provideRouter } from '@angular/router';



@Component({
    selector: 'app-root',
    standalone: true,
    template: `
    <div class="star-wars-theme">
    <app-breeding-pod-list/>
    <app-animal-form/>
    <div *ngIf="filteredAnimals.length > 0" class="flex flex-col gap-5">
    <app-monster-card *ngFor="let beast of filteredAnimals" [monster]="beast"></app-monster-card>
    </div>
    </div>
`,
    imports: [AnimalFormComponent, AttributeInputComponent, CommonModule, MonsterCardComponent, BreedingPodListComponent]
})
export class MainViewComponent implements OnInit {
  animals: any[] = [];
  name = 'Angular';
  filteredAnimals: any[] = [];

  constructor(private animalService: AnimalService) {}

  ngOnInit(): void {
    this.animalService.animals$.subscribe(animals => {
      this.animals = animals;
      console.log('Loaded animals:', animals);
    }, error => {
      console.error('Failed to load animals:', error);
    });

    this.animalService.filteredAnimals$.subscribe(filteredAnimals => {
      this.filteredAnimals = filteredAnimals;
      console.log('Filtered animals:', filteredAnimals);
    }, error => {
      console.error('Failed to load filtered animals:', error);
    });

    this.welcomeUser();
  }

  welcomeUser(): void {
    const lastVisitDate = localStorage.getItem('lastVisitDate');
    const currentDate = new Date().toDateString(); // Get current date as a string
  
    if (lastVisitDate !== currentDate) {
      const msg = new SpeechSynthesisUtterance('Welcome to Ruks Animal Hoe');
      window.speechSynthesis.speak(msg);
      localStorage.setItem('lastVisitDate', currentDate); // Update the last visit date
    }
  }
}
