import { ValidatorFn, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';


export function speciesMismatchValidator(formGroup: FormGroup): ValidationErrors | null {
  const animalInput1 = formGroup.get('animalInput1')?.value;
  const animalInput2 = formGroup.get('animalInput2')?.value;
  if (animalInput1 && animalInput2 && animalInput1.species.species !== animalInput2.species.species) {
    return { speciesMismatch: true };
  }
  return null;
}