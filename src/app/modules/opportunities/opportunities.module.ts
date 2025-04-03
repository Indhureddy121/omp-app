import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OpportunitiesRoutingModule } from './opportunities-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { OpportunitiesListComponent } from './opportunities-list/opportunities-list.component';

@NgModule({
	declarations: [
		OpportunitiesComponent,
		OpportunitiesListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		OpportunitiesRoutingModule
	]
})
export class OpportunitiesModule { }