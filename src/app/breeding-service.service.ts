import { Injectable, Injector } from "@angular/core";
import { BehaviorSubject, interval, startWith, switchMap } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { BreedingPod, DnDMonster } from "../types"; // Assuming BreedingPod is correctly defined in your types
import { AnimalService } from "./animal-service.service";
import { genOffspring } from "./helpers/generateOffspring";
import { MS_TO_DAYS } from "../util";

@Injectable({
  providedIn: "root",
})
export class BreedingServiceService {
  private breedingPodsSubject = new BehaviorSubject<BreedingPod[]>([]);
  public breedingPods$ = this.breedingPodsSubject.asObservable();
  private _animalService: AnimalService | undefined;
  private static intervalSet = false; // Static variable to track interval setup

  constructor(private injector: Injector) {
    this.loadPodsFromLocalStorage();
    this.initiateUpdateCycle();
  }

  public getBreedingPods() {
    return this.breedingPodsSubject.getValue();
  }

  public restoreSavedData(data: BreedingPod[]) {
    let dateParsed = data.map(pod => {
      return {
        ...pod,
        breedingStartDateTime: new Date(pod.breedingStartDateTime)
      }
    })


    this.breedingPodsSubject.next(dateParsed);
  }

  private get animalService(): AnimalService {
    if (!this._animalService) {
      this._animalService = this.injector.get(AnimalService);
    }
    return this._animalService;
  }

  private updatePods() {
    const currentPods = this.breedingPodsSubject.getValue();
    if (currentPods.length === 0) {
      return; // No pods to update
    }
    const now = new Date();
    const updatedPods = currentPods.map((pod) => {
      // Your existing logic for updating pods

      const currentPods = this.breedingPodsSubject.getValue();
      const now = new Date(); // Get the current time
      const updatedPods = currentPods.map((pod) => {
        if (pod?.countDown != undefined && pod?.countDown <= 0) {
          if (pod.offspring.length === 0) {
            return this.createOffspringForPod(pod);
          }

          return pod;
        }
        // Convert breedingStartDateTime from string back to Date object if necessary
        const breedingStart = new Date(pod.breedingStartDateTime);
        // Assuming timeToHatch is initially in days, convert it to milliseconds
        const hatchDate = new Date(
          breedingStart.getTime() + pod.timeToHatch * MS_TO_DAYS
        );
        // Calculate the remaining time in seconds

        let remainingTime = (hatchDate.getTime() - now.getTime()) / 1000;
        remainingTime = Math.max(remainingTime, 0); // Ensure remaining time doesn't go below 0
        return { ...pod, countDown: remainingTime };
      }) as BreedingPod[];
      this.breedingPodsSubject.next(updatedPods);
    });
    // this.breedingPodsSubject.next(updatedPods);
    this.savePodsToLocalStorage();
  }

  private initiateUpdateCycle() {
    interval(100_000) // Update every 100 seconds
      .pipe(
        startWith(0), // Start immediately upon subscription
        switchMap(async () => this.updatePods())
      )
      .subscribe();
  }

  savePodsToLocalStorage() {
    const currentPods = this.breedingPodsSubject.getValue(); // Get the current value of the BehaviorSubject
    localStorage.setItem("breedingPods", JSON.stringify(currentPods)); // Save it to localStorage
  }

  loadPodsFromLocalStorage() {
    const podsString = localStorage.getItem("breedingPods");
    if (podsString) {
      let pods: BreedingPod[] = JSON.parse(podsString);
      // Convert breedingStartDateTime from string to Date object
      pods = pods.map((pod) => ({
        ...pod,
        breedingStartDateTime: new Date(pod.breedingStartDateTime),
      }));
      this.breedingPodsSubject.next(pods); // Update the BehaviorSubject with the loaded pods
    }
  }
  createOffspringForPod(pod: BreedingPod) {
    // Create the offspring object

    const a = genOffspring(pod.parents[0], pod.parents[1]) as DnDMonster; // Assuming combineInputsAndAddNew is a function that combines two monsters into a new one

    // Update the passed pod's offspring array directly
    const updatedPod = { ...pod, offspring: [...pod.offspring, a] };

    // Update the BehaviorSubject with the modified pod
    return updatedPod;
  }

  // updateTimeToHatch() {
  //   if (this.breedingPodsSubject.getValue().length === 0) {
  //     return; // No pods to update
  //   }
  //   setInterval(() => {
  //     BreedingServiceService.intervalSet = true; // Mark that the interval has been set
  //     const currentPods = this.breedingPodsSubject.getValue();
  //     const now = new Date(); // Get the current time
  //     const updatedPods = currentPods.map(pod => {

  //       if (pod?.countDown != undefined && pod?.countDown <= 0) {

  //         if (pod.offspring.length === 0) {
  //           return this.createOffspringForPod(pod);
  //         }

  //         return pod;
  //       }
  //       // Convert breedingStartDateTime from string back to Date object if necessary
  //       const breedingStart = new Date(pod.breedingStartDateTime);
  //       // Assuming timeToHatch is initially in days, convert it to milliseconds
  //       const hatchDate = new Date(breedingStart.getTime() + pod.timeToHatch * MS_TO_DAYS);
  //       // Calculate the remaining time in seconds

  //       let remainingTime = (hatchDate.getTime() - now.getTime()) / 1000;
  //       remainingTime = Math.max(remainingTime, 0); // Ensure remaining time doesn't go below 0
  //       return { ...pod, countDown: remainingTime };
  //     }) as BreedingPod[];
  //     this.breedingPodsSubject.next(updatedPods);
  //     this.savePodsToLocalStorage(); // Optionally save the updated pods to localStorage
  //   }, 100_000); // Update every 1 seconds
  // }

  public breakBreedingPod(podId: string) {
    const currentPods = this.breedingPodsSubject.getValue();
    // Filter out the pod with the matching podId
    const updatedPods = currentPods.filter((pod) => pod.uuid !== podId);
    this.breedingPodsSubject.next(updatedPods);
    this.savePodsToLocalStorage();
  }

  public claimOffspring(podId: string) {
    const currentPods = this.breedingPodsSubject.getValue();
    // Find the pod with the matching podId and grab the Offspring and put it into the AnimalService
    const offspring = currentPods.find((pod) => pod.uuid === podId)?.offspring;
    if (offspring) {
      let newBorn = offspring[0];
      this.animalService.addAnimal(newBorn);
    }
    this.breakBreedingPod(podId);
    this.savePodsToLocalStorage();
  }

  // Method to add a monster to a breeding pod
  submitBreedingPair(monster1: any, monster2: any, podId?: string) {
    const currentPods = this.breedingPodsSubject.getValue();
    if (podId) {
      // If podId is provided, add both monsters to the existing pod
      const updatedPods = currentPods.map((pod) =>
        pod.uuid === podId
          ? { ...pod, monsters: [...pod.parents, monster1, monster2] }
          : pod
      );
      this.breedingPodsSubject.next(updatedPods);
    } else {
      // If no podId is provided, create a new pod with these two monsters
      const newPod: BreedingPod = {
        uuid: uuidv4(), // Generate a unique ID for the new pod
        parents: [monster1, monster2],
        offspring: [] as DnDMonster[],
        errorMessage: "",
        timeToHatch:
          monster1.gestationPeriod.value + monster2.gestationPeriod.value, // this is a value in hours
        breedingStartDateTime: new Date(),
        countDown: Infinity,
      };
      this.breedingPodsSubject.next([...currentPods, newPod]);
      this.savePodsToLocalStorage();
    }
  }
}
