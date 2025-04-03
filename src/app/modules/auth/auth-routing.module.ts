import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './pages';
import { IsLoggedInGuard } from '@core/guards';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
//import { IsLoggedInGuard } from '@core/guards';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
    
  },
  {
    path: '',
    children: [
      {
        path: 'login',
        component: LoginComponent,
        canActivate: [IsLoggedInGuard]
      },
      {
        path: 'forgotPassword',
        component: ForgotPasswordComponent
      },
      {
        path: 'resetPassword',
        component: ResetPasswordComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
