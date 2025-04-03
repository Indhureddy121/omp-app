import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ReadyforsoListComponent } from './readyforso-list/readyforso-list.component';
import { ReadyforsoComponent } from './readyforso/readyforso.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Approved Offers' },
    children: [
      {
        path: 'list',
        component: ReadyforsoListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add/:id',
        component: ReadyforsoComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: ReadyforsoComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: ReadyforsoComponent,
        data: { breadcrumb: 'View' }
      }
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ApprovedOffersRoutingModule {
 
}