import { Component, OnInit } from "@angular/core";
import { bootstrapApplication } from "@angular/platform-browser";
import "zone.js";
import { AnimalFormComponent } from "./app/animal-form/animal-form.component";
import { AttributeInputComponent } from "./app/attribute-input/attribute-input.component";
import { AnimalService } from "./app/animal-service.service";
import { CommonModule } from "@angular/common";
import { MonsterCardComponent } from "./app/monster-card/monster-card.component";
import { BreedingPodListComponent } from "./app/breeding-pod-list/breeding-pod-list.component";
import {
  PreloadAllModules,
  RouterModule,
  provideRouter,
  withDebugTracing,
  withPreloading,
} from "@angular/router";
import { APP_ROUTES } from "./app/app.routes";
import { provideAnimations } from "@angular/platform-browser/animations";

@Component({
  selector: "app-root",
  standalone: true,
  template: `
    <div
      class="star-wars-theme"
      style="display: grid;
grid-template-columns: auto;
grid-template-rows: 30px 0px calc(100vh - 30px);"
    >
      <h1>Ruk´s Animal Hoe</h1>
      <router-outlet></router-outlet>
      <!-- This is where the routed components will be displayed -->
    </div>
  `,
  imports: [
    RouterModule,
    AnimalFormComponent,
    AttributeInputComponent,
    CommonModule,
    MonsterCardComponent,
    BreedingPodListComponent,
  ],
})
export class App {
  filteredAnimals: any[] = [];
}

bootstrapApplication(App, {
  providers: [
    provideAnimations(),
    provideRouter(
      APP_ROUTES,
      withPreloading(PreloadAllModules),
      withDebugTracing()
    ),
  ],
});
