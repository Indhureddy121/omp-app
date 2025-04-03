import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { SharedModule } from '@shared/shared.module';
import { RateContractsRoutingModule } from './ratecontracts.routing';
import { RatecontractsListComponent } from './ratecontracts-list/ratecontracts-list.component';
import { ManageratecontractsComponent } from './manageratecontracts/manageratecontracts.component';
import { AddRateContractsItemsPopupComponent } from './add-rate-contracts-items-popup/add-rate-contracts-items-popup.component';
import { ProductMasterPopupComponent } from './product-master-popup/product-master-popup.component';


@NgModule({
  imports: [
    CommonModule,
	  FormsModule,
	  ReactiveFormsModule,
	  NgSelectModule,
	  SharedModule,
	  NgbModule,
    RateContractsRoutingModule,
    
  ],
  declarations: [RatecontractsListComponent,ManageratecontractsComponent,AddRateContractsItemsPopupComponent,ProductMasterPopupComponent],
  entryComponents:[AddRateContractsItemsPopupComponent]
})
export class RatecontractsModule { }
