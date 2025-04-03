import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrdersRoutingModule } from './orders-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { OrderListComponent } from './order-list/order-list.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
@NgModule({
	declarations: [
		OrderListComponent
	],
	imports: [
	  CommonModule,
	  FormsModule,
	  ReactiveFormsModule,
	  NgSelectModule,
	  SharedModule,
	  OrdersRoutingModule,
	  NgbModule
	]
  })		
export class OrdersModule { }