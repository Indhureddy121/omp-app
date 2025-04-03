import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PetscreenHistoryComponent } from './petscreen-history/petscreen-history.component';
import { PetscreenListComponent } from './petscreen-list/petscreen-list.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'PET Screen' },
    children: [
      {
        path: 'list',
        component: PetscreenListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'logs',
        component: PetscreenHistoryComponent,
        data: { breadcrumb: 'Logs' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PETScreenRoutingModule {

}