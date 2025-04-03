import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceConfimationComponent } from './balance-confimation/balance-confimation.component';


const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'balance-confirmation' },
    component:BalanceConfimationComponent
    // children: [
    //   {
    //     path: 'list',
    //     component: CustomerListComponent,
    //     data: { breadcrumb: 'List' }
    //   },
    //   {
    //     path: 'view/:id',
    //     component: CustomerViewComponent,
    //     data: { breadcrumb: 'View' }
    //   },

    // ]

  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BalanceConfirmationRoutingModule{}
