import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunitiesComponent } from './opportunities/opportunities.component';
import { OpportunitiesListComponent } from './opportunities-list/opportunities-list.component';


const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Opportunities' },
    children: [
      {
        path: 'list',
        component: OpportunitiesListComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'view/:id',
        component: OpportunitiesComponent,
        data: { breadcrumb: 'View' }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OpportunitiesRoutingModule {

}