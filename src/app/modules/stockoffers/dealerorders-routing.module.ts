import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StockoffersListComponent } from './components/stockoffers-list/stockoffers-list.component';
import { StockoffersComponent } from './components/stockoffers/stockoffers.component';
import { StockordersListComponent } from './dealerorders/stockorders-list/stockorders-list.component';
import { StockordersComponent } from './dealerorders/stockorders/stockorders.component';
import { CpoordersListComponent } from './dealerorders/cpoorders-list/cpoorders-list.component';
import { CpoordersComponent } from './dealerorders/cpoorders/cpoorders.component';

const routes: Routes = [
  {
    path: 'stockorder',
    data: { breadcrumb: 'Stock Orders' },
    children: [
      {
        path: 'add/refrenceorder/:id',
        data: { breadcrumb: 'Clone' },
        component: StockordersComponent
      },
      {
        path: 'list',
        component: StockordersListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add/:id/:type',
        component: StockordersComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: StockordersComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: StockordersComponent,
        data: { breadcrumb: 'View' }
      }
    ]
  }, {
    path: 'cpoorder',
    data: { breadcrumb: 'CPO Orders' },
    children: [
      {
        path: 'add/refrenceorder/:id',
        data: { breadcrumb: 'Clone' },
        component: CpoordersComponent
      },
      {
        path: 'list',
        component: CpoordersListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add/:id/:type',
        component: CpoordersComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: CpoordersComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: CpoordersComponent,
        data: { breadcrumb: 'View' }
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DealerOrdersRoutingModule {

}