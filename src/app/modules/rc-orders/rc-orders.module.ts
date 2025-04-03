import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RCOrdersRoutingModule } from './rc-orders-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { RcOrdersListComponent } from './rc-orders-list/rc-orders-list.component';
import { RcOrdersComponent } from './rc-orders/rc-orders.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
	declarations: [
		RcOrdersListComponent,
		RcOrdersComponent
	],
	imports: [
	  CommonModule,
	  FormsModule,
	  ReactiveFormsModule,
	  NgSelectModule,
	  SharedModule,
	  RCOrdersRoutingModule,
	  NgbModule
	]
  })		
export class RCOrdersModule { }