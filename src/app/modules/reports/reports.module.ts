import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { ReportsRoutingModule } from './reports-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { SalesgrowthbyphComponent } from './salesgrowthbyph/salesgrowthbyph.component';
import { SalesgrowthbysegmentComponent } from './salesgrowthbysegment/salesgrowthbysegment.component';
import { ProductwiseenquirytrendyoyComponent } from './productwiseenquirytrendyoy/productwiseenquirytrendyoy.component';
import { TimemeasurementRFOCPOtoSOComponent } from './timemeasurement-rfocpoto-so/timemeasurement-rfocpoto-so.component';
import { TimemeasurementNewtoApprovedComponent } from './timemeasurement-newto-approved/timemeasurement-newto-approved.component';
import { SprofferstatComponent } from './sprofferstat/sprofferstat.component';
import { SprarticlecreationtatComponent } from './sprarticlecreationtat/sprarticlecreationtat.component';
import { OpenopportunityanalysisComponent } from './openopportunityanalysis/openopportunityanalysis.component';
import { ClosedopportunityanalysisComponent } from './closedopportunityanalysis/closedopportunityanalysis.component';
import { OpenorderComponent } from './openorder/openorder.component';
import { InvoicelistComponent } from './invoicelist/invoicelist.component';
import { CustomeroutstandingComponent } from './customeroutstanding/customeroutstanding.component';
import { BusinessScorecardComponent } from './business-scorecard/business-scorecard.component';
import { StockreportComponent } from './stockreport/stockreport.component';
import { OrderdashboardComponent } from './orderdashboard/orderdashboard.component';
import { TatReportComponent } from "./tat-report/tat-report.component";
import { OfferapprovedrecordsComponent } from './offerapprovedrecords/offerapprovedrecords.component';
import { StdsprarticlescountComponent } from './stdsprarticlescount/stdsprarticlescount.component';
import { ArticlesReportComponent } from './articles-report/articles-report.component';
import { ArticlePriceComponent } from './article-price/article-price/article-price.component';
import { SapOrderDashboardComponent } from './sap-order-dashboard/sap-order-dashboard.component';

@NgModule({
	declarations: [
		SalesgrowthbyphComponent,
		SalesgrowthbysegmentComponent,
		ProductwiseenquirytrendyoyComponent,
		TimemeasurementRFOCPOtoSOComponent,
		TimemeasurementNewtoApprovedComponent,
		SprofferstatComponent,
		SprarticlecreationtatComponent,
		OpenopportunityanalysisComponent,
		ClosedopportunityanalysisComponent,
		OpenorderComponent,
		InvoicelistComponent,
		CustomeroutstandingComponent,
		BusinessScorecardComponent,
		StockreportComponent,
		OrderdashboardComponent,
		TatReportComponent,
		OfferapprovedrecordsComponent,
		StdsprarticlescountComponent,
		ArticlesReportComponent,
		ArticlePriceComponent,
		SapOrderDashboardComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		ReportsRoutingModule,
		NgbModule
	]
})
export class ReportsModule { }