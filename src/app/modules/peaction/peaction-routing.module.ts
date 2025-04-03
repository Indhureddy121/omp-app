import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PeactionListComponent } from './peaction-list/peaction-list.component';
import { PeactionComponent } from './peaction/peaction.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'PE Action' },
    children: [
      {
        path: 'list',
        component: PeactionListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'add',
        component: PeactionComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: PeactionComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: PeactionComponent,
        data: { breadcrumb: 'View' }
      }
    ]
  },

 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PEActionRoutingModule {

}