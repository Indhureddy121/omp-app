import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprInformationPopupComponent } from './spr-information-popup.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    NgSelectModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [SprInformationPopupComponent],
  exports:[SprInformationPopupComponent]
})
export class SprInformationPopupModule { }
