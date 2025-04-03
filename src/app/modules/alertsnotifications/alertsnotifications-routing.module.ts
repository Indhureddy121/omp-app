import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AlertsListComponent } from './alerts-list/alerts-list.component';

const routes: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Alerts' },
    children: [
      {
        path: 'list',
        component: AlertsListComponent,
        data: { breadcrumb: 'List' }
      },
    ]

  }
]
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AlertsNotificationsRoutingModule {

  
}


