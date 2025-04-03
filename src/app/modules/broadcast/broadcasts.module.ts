import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { BroadcastsRoutingModule } from './broadcasts-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BroadcastListComponent } from './broadcasts-list/broadcast-list.component';
import { BroadcastComponent } from './broadcasts/broadcast.component';

@NgModule({
	declarations: [
		BroadcastListComponent,
		BroadcastComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		BroadcastsRoutingModule,
		NgbModule
	]
})
export class BroadcastsModule { }