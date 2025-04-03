import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferSimulatorListComponent } from './offer-simulator-list/offer-simulator-list.component';
import { OfferSimulatorComponent } from './offer-simulator/offer-simulator.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Offer Simulator' },
    children: [
      {
        path: 'list',
        component: OfferSimulatorListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add',
        component: OfferSimulatorComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: OfferSimulatorComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: OfferSimulatorComponent,
        data: { breadcrumb: 'View' }
      },
      {
        path: 'add/refrenceoffer/:id',
        data: { breadcrumb: 'Add' },
        component: OfferSimulatorComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OfferSimulatorRoutingModule {

}