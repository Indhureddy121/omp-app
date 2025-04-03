import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ASMActionRoutingModule } from './asmaction-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { AsmactionListComponent } from './asmaction-list/asmaction-list.component';
import { AsmactionComponent } from './asmaction/asmaction.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
	declarations: [
		AsmactionListComponent,
		AsmactionComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		ASMActionRoutingModule,
		NgbModule
	]
})
export class ASMActionModule { }