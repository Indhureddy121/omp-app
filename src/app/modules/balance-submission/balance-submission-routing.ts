import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BalanceSubmissionComponent } from './balance-submission/balance-submission.component';


const routes: Routes = [
    {
      path: '',
      data: { breadcrumb: 'balance-submission' },
      component:BalanceSubmissionComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BalanceSubmissionRoutingModule{}