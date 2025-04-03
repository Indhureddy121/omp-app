import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";

import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { OfferHistoryListComponent } from './offer-history-list/offer-history-list.component';
import { OfferHistoryRoutingModule } from './offerhistory-routing.module';
@NgModule({
	declarations: [
		OfferHistoryListComponent
		
	],
	imports: [
	  CommonModule,
	  FormsModule,
	  ReactiveFormsModule,
	  NgSelectModule,
	  SharedModule,
	  OfferHistoryRoutingModule,
	  NgbModule
	]
  })		
export class OfferhistoryModule { }