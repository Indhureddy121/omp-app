import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MastersRoutingModule } from './masters-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { ApprovalmatrixComponent } from './pages/approvalmatrix/approvalmatrix.component';
import { PriceconfigurationComponent } from './pages/priceconfiguration/priceconfiguration.component';
import { ManagerolesComponent } from './pages/roles/roles/manageroles.component';
import { AdditionalchargesListComponent } from './pages/additionalcharges/additionalcharges-list/additionalcharges-list.component';
import { AdditionalchargesComponent } from './pages/additionalcharges/additionalcharges/additionalcharges.component';
import { NgSelectModule } from "@ng-select/ng-select";
import { RolesListComponent } from './pages/roles/roles-list/roles-list.component';
import { PortComponent } from './pages/port/port/port.component';
import { PortListComponent } from './pages/port/port-list/port-list.component';
import { ImportcopperindexhistoryComponent } from './pages/importcopperindex/importcopperindexhistory/importcopperindexhistory.component';
import { ImportcopperindexComponent } from './pages/importcopperindex/importitemcopperindex/importcopperindex.component';
import { ImportratecontractComponent } from './pages/ratecontract/importratecontract/importratecontract.component';
import { RatecontracthistoryComponent } from './pages/ratecontract/ratecontracthistory/ratecontracthistory.component';
import { ImportrmcostComponent } from './pages/rmcostmaster/importrmcost/importrmcost.component';
import { RmcosthistoryComponent } from './pages/rmcostmaster/rmcosthistory/rmcosthistory.component';
import { ScreenAssignmentComponent } from './pages/screen-assignment/screen-assignment.component';
import { ImportfreightfactorComponent } from './pages/freightfactor/importfreightfactor/importfreightfactor.component';
import { FreightfactorhistoryComponent } from './pages/freightfactor/freightfactorhistory/freightfactorhistory.component';
import { ProductmasterComponent } from './pages/productmaster/productmaster-list/productmaster.component';
import { ProductmasterHistoryComponent } from './pages/productmaster/productmaster-history/productmaster-history.component';
import { HsnmasterListComponent } from './pages/hsnmaster/hsnmaster-list/hsnmaster-list.component';
import { HsnmasterHistoryComponent } from './pages/hsnmaster/hsnmaster-history/hsnmaster-history.component';
import { MarginListComponent } from './pages/margin/margin-list/margin-list.component';
import { MarginHistoryComponent } from './pages/margin/margin-history/margin-history.component';
import { AlpmasterListComponent } from './pages/alpmaster/alpmaster-list/alpmaster-list.component';
import { AlpmasterHistoryComponent } from './pages/alpmaster/alpmaster-history/alpmaster-history.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { CostmasterstdListComponent } from './pages/costmasterstd/costmasterstd-list/costmasterstd-list.component';
import { CostmasterstdHistoryComponent } from './pages/costmasterstd/costmasterstd-history/costmasterstd-history.component';
import { CostmastertrdListComponent } from './pages/costmastertrd/costmastertrd-list/costmastertrd-list.component';
import { CostmastertrdHistoryComponent } from './pages/costmastertrd/costmastertrd-history/costmastertrd-history.component';
import { PriceconfigurationAlpComponent } from './pages/priceconfiguration-alp/priceconfiguration-alp.component';
import { ProductmasterDownloadsComponent } from './pages/productmaster/productmaster-downloads/productmaster-downloads.component';
import { CostmasterstdDownloadsComponent } from './pages/costmasterstd/costmasterstd-downloads/costmasterstd-downloads.component';
import { CostmastertrdDownloadsComponent } from './pages/costmastertrd/costmastertrd-downloads/costmastertrd-downloads.component';
import { HsnmasterDownloadsComponent } from './pages/hsnmaster/hsnmaster-downloads/hsnmaster-downloads.component';
import { MoqComponent } from './pages/moq/moq.component';

@NgModule({
	declarations: [
		ApprovalmatrixComponent,
		PriceconfigurationComponent,
		ManagerolesComponent,
		AdditionalchargesListComponent,
		AdditionalchargesComponent,
		RolesListComponent,
		PortComponent,
		PortListComponent,
		ImportcopperindexComponent,
		ImportcopperindexhistoryComponent,
		ImportratecontractComponent,
		RatecontracthistoryComponent,
		ImportrmcostComponent,
		RmcosthistoryComponent,
		ScreenAssignmentComponent,
		ProductmasterComponent,
		ImportfreightfactorComponent,
		FreightfactorhistoryComponent,
		ProductmasterHistoryComponent,
		HsnmasterListComponent,
		HsnmasterHistoryComponent,
		MarginListComponent,
		MarginHistoryComponent,
		AlpmasterListComponent,
		AlpmasterHistoryComponent,
		CostmasterstdListComponent,
		CostmasterstdHistoryComponent,
		CostmastertrdListComponent,
		CostmastertrdHistoryComponent,
		PriceconfigurationAlpComponent,
		ProductmasterDownloadsComponent,
		CostmasterstdDownloadsComponent,
		CostmastertrdDownloadsComponent,
		HsnmasterDownloadsComponent,
		MoqComponent
	],
	imports: [
		CommonModule,
		MastersRoutingModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		NgbModule
	]
})
export class MastersModule { }