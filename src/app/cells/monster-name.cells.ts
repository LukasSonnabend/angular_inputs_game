import { ICellEditorParams } from "@ag-grid-community/core";
import {
  AfterViewInit,
  Component,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ICellEditorAngularComp } from "ag-grid-angular";

@Component({
  standalone: true,
  imports: [FormsModule],
  template: `<input #input [(ngModel)]="value" class="my-simple-editor" />`,
  styles: [
    `
      :host {
        display: flex;
      }
      input {
        flex-grow: 1;
        text-align: center;
      }
    `,
  ],
})
export class SimpleTextEditor implements ICellEditorAngularComp, AfterViewInit {
  private params!: ICellEditorParams;
  public value: any;
  renameFunction!: (uuid: string, newName: string) => void;
  @ViewChild("input", { read: ViewContainerRef })
  public input!: ViewContainerRef;
  uuid!: string;

  //@ts-ignore
  agInit(params: ICellEditorParams): void {
    this.uuid = params.data.uuid;
    // @ts-ignore
    this.renameFunction = params.renameFunction;
    this.params = params;
    this.value = this.getInitialValue(params);
  }

  getValue(): any {
    this.renameFunction(this.uuid, this.value);
    return this.value;
  }

  getInitialValue(params: ICellEditorParams): any {
    let startValue = params.value;

    const eventKey = params.eventKey;
    const isBackspace = eventKey === "Backspace";

    if (isBackspace) {
      startValue = "";
    } else if (eventKey && eventKey.length === 1) {
      startValue = eventKey;
    }

    if (startValue !== null && startValue !== undefined) {
      return startValue;
    }

    return "";
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input.element.nativeElement.focus();
    });
  }
}
