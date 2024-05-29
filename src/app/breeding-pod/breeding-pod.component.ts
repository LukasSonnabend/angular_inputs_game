import { ChangeDetectorRef, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BreedingServiceService } from '../breeding-service.service';
import { CommonModule } from '@angular/common';
import { Direction, RoundPipe } from '../round.pipe';
import { BreedingPod, Gender } from '../../types';
import { MS_TO_DAYS } from '../../util';


@Component({
    selector: 'app-breeding-pod',
    standalone: true,
    templateUrl: './breeding-pod.component.html',
    styleUrl: './breeding-pod.component.css',
    imports: [CommonModule, RoundPipe]
})
export class BreedingPodComponent {
  @Input() pod!: BreedingPod;
  protected Direction = Direction;

  constructor(protected breedService: BreedingServiceService) { }

  calculateTotalTime(breedingStartDateTime: Date, timeToHatch: number): string {
    const totalTime = new Date(breedingStartDateTime?.getTime() + timeToHatch * MS_TO_DAYS);
    return totalTime.toLocaleString();
  }

  get stringiedPod(): string {
    return JSON.stringify(this.pod, null, 2);
  }

  getBreedingProgress(): number {
    const now = new Date();
    const startTime = this.pod.breedingStartDateTime.getTime();
    const endTime = startTime + this.pod.timeToHatch * MS_TO_DAYS;
    const totalTime = endTime - startTime;
    const elapsedTime = now.getTime() - startTime;
    const progress = (elapsedTime / totalTime) * 100;
    return Math.min(Math.max(progress, 0), 100);
  }
  getGenderString(gender?: Gender): string {
    if (gender === undefined) return ""
    return Gender[gender]; // This converts the enum value to its string representation
  }
}