import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingListComponent } from './marketing-list/marketing-list.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Marketing' },
    children: [
      {
        path: 'list',
        component: MarketingListComponent,
        data: { breadcrumb: 'Data Sheet' }
      },
    ]

  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MarketingRoutingModule {

  
}


