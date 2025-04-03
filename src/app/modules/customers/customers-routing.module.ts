import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { CustomerListComponent } from './customer-list/customer-list.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Customers' },
    children: [
      {
        path: 'list',
        component: CustomerListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'view/:id',
        component: CustomerViewComponent,
        data: { breadcrumb: 'View' }
      },

    ]

  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomersRoutingModule {

  
}


