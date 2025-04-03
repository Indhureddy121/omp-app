import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OffersListComponent } from './offers-list/offers-list.component';
import { OffersComponent } from './offers/offers.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Offers' },
    children: [
      {
        path: 'list',
        component: OffersListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add/:id',
        component: OffersComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: OffersComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: OffersComponent,
        data: { breadcrumb: 'View' }
      },
      {
        path: 'add/refrenceoffer/:id',
        data: { breadcrumb: 'Add' },
        component: OffersComponent
      }
      // {
      //   path: 'offerWithHistory/:id',
      //   component: OffersComponent,
      //   data: { breadcrumb: 'Orders' }
      // }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OffersRoutingModule {

}