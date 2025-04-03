import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { MarketingListComponent } from './marketing-list/marketing-list.component';
import { MarketingRoutingModule } from './marketing-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { FileSizePipe } from './pipes/file-size.pipe';

@NgModule({
	declarations: [
		MarketingListComponent,
		FileSizePipe
		
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		MarketingRoutingModule,
		NgbModule
	]
})
export class MarketingModule { }