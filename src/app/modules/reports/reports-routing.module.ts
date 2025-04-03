import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
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
import { TatReportComponent } from './tat-report/tat-report.component';
import { OfferapprovedrecordsComponent } from './offerapprovedrecords/offerapprovedrecords.component';
import { StdsprarticlescountComponent } from './stdsprarticlescount/stdsprarticlescount.component';
import { ArticlesReportComponent } from './articles-report/articles-report.component';
import { ArticlePriceComponent } from './article-price/article-price/article-price.component';
import { SapOrderDashboardComponent } from './sap-order-dashboard/sap-order-dashboard.component';

const routes: Routes = [
  {
    path: 'salesgrowthbyph',
    data: { breadcrumb: 'Sales Growth by PH' },
    component: SalesgrowthbyphComponent
  },
  {
    path: 'salesgrowthbysegment',
    data: { breadcrumb: 'Sales Growth by Segment' },
    component: SalesgrowthbysegmentComponent
  },
  {
    path: 'productwiseenquirytrendyoy',
    data: { breadcrumb: 'Product Wise enquiry trend YOY' },
    component: ProductwiseenquirytrendyoyComponent
  },
  {
    path: 'timemeasurementRFOCPOtoSO',
    data: { breadcrumb: 'Time measurement (RFO/CPO to Sales Order Creation)' },
    component: TimemeasurementRFOCPOtoSOComponent
  },
  {
    path: 'timemeasurementNewtoApproved',
    data: { breadcrumb: 'Time Measurement (New - Approved) Status' },
    component: TimemeasurementNewtoApprovedComponent
  },
  {
    path: 'sprofferstat',
    data: { breadcrumb: 'SPR Offers TAT' },
    component: SprofferstatComponent
  },
  {
    path: 'sprarticlecreationtat',
    data: { breadcrumb: 'SPR Article creation TAT' },
    component: SprarticlecreationtatComponent
  },
  {
    path: 'openopportunityanalysis',
    data: { breadcrumb: 'Open Opportunity Analysis' },
    component: OpenopportunityanalysisComponent
  },
  {
    path: 'closedopportunityanalysis',
    data: { breadcrumb: 'Closed Opportunity Analysis' },
    component: ClosedopportunityanalysisComponent
  },
  {
    path: 'openorder',
    data: { breadcrumb: 'Open Order' },
    component: OpenorderComponent
  },
  {
    path: 'invoicelist',
    data: { breadcrumb: 'Invoice List' },
    component: InvoicelistComponent
  },
  {
    path: 'customeroutstanding',
    data: { breadcrumb: 'Customer Outstanding' },
    component: CustomeroutstandingComponent
  },
  {
    path: 'businessscorecard',
    data: { breadcrumb: 'Business Score Card' },
    component: BusinessScorecardComponent
  },
  {
    path: 'stockreport',
    data: { breadcrumb: 'Stock Report(SPR)' },
    component: StockreportComponent
  },
  {
    path: 'saporderdashboard',
    data: { breadcrumb: 'Order Dashboard' },
    component: SapOrderDashboardComponent
  },
  {
    path: 'orderdashboard',
    data: { breadcrumb: 'Order Dashboard' },
    component: OrderdashboardComponent
  },
  {
    path: 'tatreport',
    data: { breadcrumb: 'TAT Report(SPR)' },
    component: TatReportComponent
  },
  {
    path: 'offerapprovedrecords',
    data: { breadcrumb: 'Offer Approved Records' },
    component: OfferapprovedrecordsComponent
  },
  {
    path: 'stdsprarticlescount',
    data: { breadcrumb: 'STD SPR Articles Count' },
    component: StdsprarticlescountComponent
  },
  {
    path: 'articlecostreport',
    data: { breadcrumb: 'Articles Cost Report' },
    component: ArticlesReportComponent
  },

  {
    path: 'articleprice',
    data: { breadcrumb: 'List Price' },
    component: ArticlePriceComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {

}
