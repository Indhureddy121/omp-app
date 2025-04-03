import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AsmactionListComponent } from './asmaction-list/asmaction-list.component';
import { AsmactionComponent } from './asmaction/asmaction.component';


const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Sales Action' },
    children: [
      {
        path: 'list',
        component: AsmactionListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'edit/:id',
        component: AsmactionComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: AsmactionComponent,
        data: { breadcrumb: 'View' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ASMActionRoutingModule {

}