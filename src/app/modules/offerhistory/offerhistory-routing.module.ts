import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferHistoryListComponent } from './offer-history-list/offer-history-list.component';


const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Orders' },
    children: [
      {
        path: 'list',
        component: OfferHistoryListComponent,
        data: { breadcrumb: 'List' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferHistoryRoutingModule {

}