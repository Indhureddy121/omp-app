import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { ReadyforsoListComponent } from './readyforso-list/readyforso-list.component';
import { ApprovedOffersRoutingModule } from './approvedoffer-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ReadyforsoComponent } from './readyforso/readyforso.component';

@NgModule({
	declarations: [
		ReadyforsoListComponent,
		ReadyforsoComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		ApprovedOffersRoutingModule,
		NgbModule
	]
})
export class ApprovedOffersModule { }