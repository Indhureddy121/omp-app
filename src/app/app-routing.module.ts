import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from '../app/modules/userprofile/pages/home/home.component';
import {
  InnerLayoutComponent,
  AuthLayoutComponent
} from './layouts';
import { AuthGuard } from '@core/guards';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    data: { breadcrumb: 'Home' },
    component: HomeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'masters',
    data: { breadcrumb: 'Masters' },
    component: InnerLayoutComponent,
    loadChildren: './modules/masters/masters.module#MastersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'opportunities',
    component: InnerLayoutComponent,
    loadChildren: './modules/opportunities/opportunities.module#OpportunitiesModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'customers',
    component: InnerLayoutComponent,
    loadChildren: './modules/customers/customers.module#CustomersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'userprofile',
    component: InnerLayoutComponent,
    loadChildren: './modules/userprofile/userprofile.module#UserprofileModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'offers',
    component: InnerLayoutComponent,
    loadChildren: './modules/offers/offers.module#OffersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'ratecontracts',
    component: InnerLayoutComponent,
    loadChildren: './modules/ratecontracts/ratecontracts.module#RatecontractsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'peaction',
    component: InnerLayoutComponent,
    loadChildren: './modules/peaction/peaction.module#PEActionModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'approvedoffers',
    component: InnerLayoutComponent,
    loadChildren: './modules/approvedoffer/approvedoffer.module#ApprovedOffersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'marketing',
    component: InnerLayoutComponent,
    loadChildren: './modules/marketing/marketing.module#MarketingModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'reports',
    data: { breadcrumb: 'Reports' },
    component: InnerLayoutComponent,
    loadChildren: './modules/reports/reports.module#ReportsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'alertsnotifications',
    component: InnerLayoutComponent,
    loadChildren: './modules/alertsnotifications/alertsnotifications.module#AlertsNotificationsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'orderstatus',
    component: InnerLayoutComponent,
    loadChildren: './modules/offerhistory/offerhistory.module#OfferhistoryModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'asmaction',
    component: InnerLayoutComponent,
    loadChildren: './modules/asmaction/asmaction.module#ASMActionModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'fmaction',
    component: InnerLayoutComponent,
    loadChildren: './modules/fmaction/fmaction.module#FMActionModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'orders',
    component: InnerLayoutComponent,
    loadChildren: './modules/orders/orders.module#OrdersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'order',
    component: InnerLayoutComponent,
    loadChildren: './modules/stockoffers/dealerorders.module#DealerOrdersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'broadcasts',
    component: InnerLayoutComponent,
    loadChildren: './modules/broadcast/broadcasts.module#BroadcastsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'offersimulator',
    component: InnerLayoutComponent,
    loadChildren: './modules/offer-simulator/offersimulator.module#OfferSimulatorModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'rcorders',
    component: InnerLayoutComponent,
    loadChildren: './modules/rc-orders/rc-orders.module#RCOrdersModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'petscreen',
    component: InnerLayoutComponent,
    loadChildren: './modules/petscreen/petscreen.module#PETScreenModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'articlecreation',
    component: InnerLayoutComponent,
    loadChildren: './modules/article-creation/article-creation.module#ArticleCreationModule',
    canActivate: [AuthGuard]
  },
  {
    path: '',
    component: AuthLayoutComponent,
    loadChildren: './modules/auth/auth.module#AuthModule'
  },

  {
    path: 'ocactioninterim',
    component: InnerLayoutComponent,
    loadChildren: './modules/ocactioninterim/ocactioninterim.module#OcactioninterimModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'order-cancellation',
    component: InnerLayoutComponent,
    loadChildren: './modules/order-cancellation/order-cancellation.module#OrderCancellationModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'balance-submission',
    component: InnerLayoutComponent,
    loadChildren: './modules/balance-submission/balance-submission.module#BalanceSubmissionModule',
  },
  {
    path: 'balance-confirmation',
    component: InnerLayoutComponent,
    loadChildren: './modules/balance-confirmation/balance-confirmation.module#BalanceConfirmationModule',
  },
  
  //Fallback when no prior routes is matched
  { path: '**', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }