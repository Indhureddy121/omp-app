import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfferSimulatorRoutingModule } from './offersimulator-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { OfferSimulatorListComponent } from './offer-simulator-list/offer-simulator-list.component';
import { OfferSimulatorComponent } from './offer-simulator/offer-simulator.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		OfferSimulatorListComponent,
		OfferSimulatorComponent		
	],
	imports: [
	  CommonModule,
	  FormsModule,
	  ReactiveFormsModule,
	  NgSelectModule,
	  SharedModule,
	  OfferSimulatorRoutingModule,
	  NgbModule
	]
  })		
export class OfferSimulatorModule { }