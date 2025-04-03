import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OcactioninterimRoutingModule } from './ocactioninterim-routing.module';
import { OcactionListComponent } from './ocaction-list/ocaction-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';
import { OcactioeditComponent } from './ocactioedit/ocactioedit.component';


@NgModule({
  declarations: [OcactionListComponent, OcactioeditComponent],
  imports: [
    CommonModule,
    OcactioninterimRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    SharedModule,
    NgbModule
  ]
})
export class OcactioninterimModule { }
