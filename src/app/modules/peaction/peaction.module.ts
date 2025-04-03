import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PEActionRoutingModule } from './peaction-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { PeactionListComponent } from './peaction-list/peaction-list.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { PeactionComponent } from './peaction/peaction.component';
import { SprInformationPopupModule } from "@shared/components/spr-information-popup/spr-information-popup.module";
@NgModule({
	declarations: [
		PeactionListComponent,
		PeactionComponent
	],
	imports: [
	  CommonModule,
	  FormsModule,
	  ReactiveFormsModule,
	  NgSelectModule,
	  SharedModule,
	  PEActionRoutingModule,
	  NgbModule,
	  SprInformationPopupModule
	]
  })		
export class PEActionModule { }