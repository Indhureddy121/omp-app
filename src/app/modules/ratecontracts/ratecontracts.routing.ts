import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageratecontractsComponent } from './manageratecontracts/manageratecontracts.component';
import { RatecontractsListComponent } from './ratecontracts-list/ratecontracts-list.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Rate Contracts' },
    children: [
      {
        path: 'list',
        component: RatecontractsListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add',
        component: ManageratecontractsComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: ManageratecontractsComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: ManageratecontractsComponent,
        data: { breadcrumb: 'View' }
      },
      {
        path: 'add/refrencecontract/:id',
        data: { breadcrumb: 'Add' },
        component: ManageratecontractsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RateContractsRoutingModule {

}
