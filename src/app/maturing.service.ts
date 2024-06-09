import { Injectable, Injector } from '@angular/core';
import { Subscription } from 'rxjs';
import { AnimalService } from './animal-service.service';

@Injectable({
  providedIn: 'root'
})
export class MaturingService {
  private static intervalSet = false; // Static variable to track interval setup
  private _animalService: AnimalService | undefined;
  private animalSubscription: Subscription | undefined;

  private get animalService(): AnimalService {
    if (!this._animalService) {
      this._animalService = this.injector.get(AnimalService);
    }
    return this._animalService;
  }

  constructor(private injector: Injector) {
    if (!MaturingService.intervalSet) {

      MaturingService.intervalSet = true;
    }
  }


  ngOnDestroy() {
    // Clean up the subscription when the service is destroyed
    if (this.animalSubscription) {
      this.animalSubscription.unsubscribe();
    }
  }
}