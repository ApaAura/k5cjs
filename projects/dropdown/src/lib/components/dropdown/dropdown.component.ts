import { coerceBooleanProperty } from '@angular/cdk/coercion';
import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';

import { KcInternalDropdownComponent } from '../internal-dropdown/internal-dropdown.component';

@Component({
  selector: 'kc-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KcDropdownComponent {
  @ViewChild(KcInternalDropdownComponent) internalDropdown!: KcInternalDropdownComponent;

  // prettier-ignore
  @Input()
  get preventClose(): boolean { return this._preventClose; }
  // prettier-ignore
  set preventClose(value: boolean | string) { this._preventClose = coerceBooleanProperty(value); }
  private _preventClose = true;

  open(): void {
    this.internalDropdown.open();
  }

  close(): void {
    this.internalDropdown.close();
  }
}
