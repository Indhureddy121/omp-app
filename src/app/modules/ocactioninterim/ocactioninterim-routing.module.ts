import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OcactionListComponent } from './ocaction-list/ocaction-list.component';
import { OcactioeditComponent } from './ocactioedit/ocactioedit.component';


const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'OC Action' },
    children: [
      {
        path: 'list',
        component: OcactionListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'edit/:id',
        component: OcactioeditComponent,
        data: { breadcrumb: 'Edit' }
      },

    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OcactioninterimRoutingModule { }
