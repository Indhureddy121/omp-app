import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FmactionComponent } from './fmaction/fmaction.component';
import { FmactionListComponent } from './fmaction-list/fmaction-list.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'FM Action' },
    children: [
      {
        path: 'list',
        component: FmactionListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'edit/:id',
        component: FmactionComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: FmactionComponent,
        data: { breadcrumb: 'View' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FMActionRoutingModule {

}