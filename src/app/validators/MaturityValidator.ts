import { ValidatorFn, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';
import { EvolutionStage,DnDMonster } from '../../types';

export const maturityValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    // Cast the AbstractControl to FormGroup to access its controls
    const formGroup = control as FormGroup;
    const animal1 = formGroup.get('animalInput1')?.value as DnDMonster;
    const animal2 = formGroup.get('animalInput2')?.value as DnDMonster;
    console.log(formGroup)
    if (!animal1 || !animal2) {
        return null;
    }

    // @ts-ignore
    return EvolutionStage[animal1?.evolutionStage] !== EvolutionStage.adult || EvolutionStage[animal2?.evolutionStage]  !== EvolutionStage.adult ? { evolutionStageMismatch: true } : null;
  };
