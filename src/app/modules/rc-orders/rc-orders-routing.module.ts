import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'
import { RcOrdersListComponent } from './rc-orders-list/rc-orders-list.component';
import { RcOrdersComponent } from './rc-orders/rc-orders.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'RC Orders' },
    children: [
      {
        path: 'list',
        component: RcOrdersListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add',
        component: RcOrdersComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: RcOrdersComponent,
        data: { breadcrumb: 'edit' }
      },
      {
        path: 'add/:rcId',
        component: RcOrdersComponent,
        data: { breadcrumb: 'Add' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RCOrdersRoutingModule {

}