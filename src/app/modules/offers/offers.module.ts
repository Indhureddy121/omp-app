import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OffersRoutingModule } from './offers-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { OffersListComponent } from './offers-list/offers-list.component';
import { OffersComponent } from './offers/offers.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SprInformationPopupModule } from "@shared/components/spr-information-popup/spr-information-popup.module";
import { ResetFilterModule } from "@shared/components/reset-filter/reset-filter.module";
@NgModule({
	declarations: [
		OffersListComponent,
		OffersComponent
	],
	imports: [
	  CommonModule,
	  FormsModule,
	  ReactiveFormsModule,
	  NgSelectModule,
	  SharedModule,
	  OffersRoutingModule,
	  NgbModule,
	  SprInformationPopupModule,
	  ResetFilterModule
	]
  })		
export class OffersModule { }