import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FMActionRoutingModule } from './fmaction-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { FmactionListComponent } from './fmaction-list/fmaction-list.component';
import { FmactionComponent } from './fmaction/fmaction.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
@NgModule({
	declarations: [
		FmactionListComponent,
		FmactionComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		FMActionRoutingModule,
		NgbModule
	]
})
export class FMActionModule { }