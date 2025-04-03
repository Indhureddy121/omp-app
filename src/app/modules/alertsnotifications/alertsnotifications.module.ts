import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { AlertsListComponent } from './alerts-list/alerts-list.component';
import { AlertsNotificationsRoutingModule } from './alertsnotifications-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


@NgModule({
	declarations: [
		AlertsListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		AlertsNotificationsRoutingModule,
		NgbModule
	]
})
export class AlertsNotificationsModule { }