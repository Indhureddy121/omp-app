import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DealerOrdersRoutingModule } from './dealerorders-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { StockoffersListComponent } from './components/stockoffers-list/stockoffers-list.component';
import { StockoffersComponent } from './components/stockoffers/stockoffers.component';
// import { DealerordersComponent } from './dealerorders/dealerorders.component';
import { StockordersComponent } from './dealerorders/stockorders/stockorders.component';
import { CpoordersComponent } from './dealerorders/cpoorders/cpoorders.component';
import { CpoordersListComponent } from './dealerorders/cpoorders-list/cpoorders-list.component';
import { StockordersListComponent } from './dealerorders/stockorders-list/stockorders-list.component';

@NgModule({
	declarations: [
		StockoffersListComponent,
		StockoffersComponent,
		StockordersComponent,
		CpoordersComponent,
		CpoordersListComponent,
		StockordersListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		DealerOrdersRoutingModule,
		NgbModule
	]
})
export class DealerOrdersModule { }