import { ValidatorFn, FormGroup, ValidationErrors, AbstractControl } from '@angular/forms';


export const genderMismatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    // Cast the AbstractControl to FormGroup to access its controls
    const formGroup = control as FormGroup;
    const animal1 = formGroup.get('animalInput1')?.value;
    const animal2 = formGroup.get('animalInput2')?.value;
    return animal1 && animal2 && animal1.gender === animal2.gender ? { genderMismatch: true } : null;
  };
