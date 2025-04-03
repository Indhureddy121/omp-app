import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BroadcastListComponent } from './broadcasts-list/broadcast-list.component';
import { BroadcastComponent } from './broadcasts/broadcast.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Broadcast' },
    children: [
      {
        path: 'list',
        component: BroadcastListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add',
        component: BroadcastComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: BroadcastComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: BroadcastComponent,
        data: { breadcrumb: 'View' }
      }
    ]
  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BroadcastsRoutingModule {

}