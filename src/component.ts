import {
    Component,
    Input,
    OnInit,
    Optional,
    Host,
    SkipSelf,
    Output,
    EventEmitter,
    Inject,
    ChangeDetectionStrategy, inject, ChangeDetectorRef, forwardRef
  } from '@angular/core';
  import {
    ControlContainer, ControlValueAccessor,
    FormControl,
    FormGroup,
    FormGroupDirective, NG_VALUE_ACCESSOR,
    ReactiveFormsModule,
    Validators
  } from '@angular/forms';
  import { MatFormField, MatInput, MatLabel, MatPrefix } from '@angular/material/input';
  import { CommonModule } from '@angular/common';
  import { Subscription } from 'rxjs';
  import { MAT_DATE_LOCALE } from '@angular/material/core';
  import { InputConfiguration } from '@fba3/inputs-api';
  import { debug } from 'ng-packagr/lib/utils/log';
  import { Events } from 'ag-grid-community';

  @Component({
    standalone: true,
    selector: 'app-euro-input',
    template: `
      <mat-form-field>
        <mat-label>{{cfg?.name}}</mat-label>
        <span matTextPrefix>€&nbsp;</span>
        <input [formControl]="internalFormControl" (input)="handleInput($event)" (blur)="onBlur()" placeholder="{{ cfg.prefill }}" matInput type="text">
        <input [formControl]="formControl">
      </mat-form-field>


      `,
    changeDetection: ChangeDetectionStrategy.OnPush,
    viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],

    imports: [
      MatInput,
      CommonModule,
      ReactiveFormsModule,
      MatFormField,
      MatLabel,
      MatPrefix
    ]
  })
  export class EuroInputComponent {
    @Input() cfg: InputConfiguration = {} as InputConfiguration;
    @Input() label!: string;
    @Input() placeholder!: string;
    formControl!: FormControl;
    internalFormControl =  new FormControl();

    handleInput(event: any) {
      console.log(event)
      this.formControl.setValue(event?.target.value.replace(".", "").replace(",", "."))
    }


    constructor(private parentF: ControlContainer) { }

    private euroFormatter = new Intl.NumberFormat('de-DE', {
      useGrouping: true,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });

    @Input()
    set controlName(value: any) {
      // @ts-ignore
      if (this.parentF && this.parentF.control) {
        this.formControl = this.parentF.control.get(value) as FormControl;
        if (parseFloat(this.formControl.value)) {
          this.internalFormControl.setValue(this.euroFormatter.format(this.formControl.value))
        }
      }
    }

    onBlur(): void {
      const rawValue = this.formControl.value;
      const numericValue = parseFloat(
        rawValue.replace('.', '').replace(',', '.')
      ); // Handle comma as decimal separator

      if (!isNaN(numericValue)) {
        const formattedValue = this.euroFormatter.format(numericValue);
        if (formattedValue !== this.formControl.value) {
          this.internalFormControl.setValue(formattedValue);
        }
      }
      this.formControl.setValue(rawValue)
    }
  }

there is a cycle in this component the inputs are not working as intended i want to show the fomratted currency value while emptting and taking a float as input?