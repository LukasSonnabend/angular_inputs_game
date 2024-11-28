import {
  Component,
  forwardRef,
  Optional,
  Injector,
  OnInit,
  Input,
} from "@angular/core";
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  ControlContainer,
  NgForm,
  NgControl,
  NG_VALIDATORS,
  FormControl,
  ReactiveFormsModule,
  FormGroupDirective,
  FormGroup,
} from "@angular/forms";
import { CommonModule, NgIf } from "@angular/common";
import { BehaviorSubject } from "rxjs";
import { v4 as uuidv4 } from "uuid";
import { MonsterCardComponent } from "../monster-card/monster-card.component";
import { MonsterMiniCardComponent } from "../monster-mini-card/monster-card.component";

@Component({
  selector: "app-attribute-input",
  standalone: true,
  templateUrl: "./attribute-input.component.html",
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AttributeInputComponent),
    },
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MonsterCardComponent,
    MonsterMiniCardComponent,
  ],
})
export class AttributeInputComponent implements ControlValueAccessor, OnInit {
  parentForm: ControlContainer | null = null; // Changed type to ControlContainer
  mountTime: BehaviorSubject<Date | undefined> = new BehaviorSubject<
    Date | undefined
  >(undefined); // Change to BehaviorSubject
  @Input() formRef: FormGroup = new FormGroup({} as any);
  @Input() controlKey: string = "";

  constructor(@Optional() private controlContainer: ControlContainer) {
    this.parentForm = controlContainer;
  }

  ngOnInit() {
    const initialValue = this.formRef.controls[this.controlKey].value;

    // Modify the initialValue object as needed
    if (!initialValue.birthTimestamp)
      initialValue.birthTimestamp = new Date().toISOString();

    if (!initialValue.uuid) initialValue.uuid = uuidv4();

    // Set the modified value back on the form control
    this.formRef.controls[this.controlKey].setValue(initialValue);
  }

  onChange = (quantity: number) => {};

  onTouched = () => {};

  touched = false;

  disabled = false;

  writeValue(value: any) {
    this.onChange(value);
  }

  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }

  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
}
