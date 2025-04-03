import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ManageusersComponent } from './pages/users/users/manageusers.component';
import { ManageuserslistComponent } from './pages/users/users-list/manageusers.component';
import { MyprofileComponent } from './pages/myprofile/myprofile/myprofile.component';

const routes: Routes = [
  {
    path: 'users',
    data: { breadcrumb: 'Users' },
    children: [
      {
        path: 'add',
        component: ManageusersComponent,
        data: { breadcrumb: 'Add' }
      },
      {
        path: 'edit/:id',
        component: ManageusersComponent,
        data: { breadcrumb: 'Edit' }
      },
      {
        path: 'view/:id',
        component: ManageusersComponent,
        data: { breadcrumb: 'View' }
      },
      {
        path: 'list',
        component: ManageuserslistComponent,
        data: { breadcrumb: 'List' }
      },
      {
        path: 'myprofile',
        component: MyprofileComponent,
        data: { breadcrumb: 'MyProfile' }
      }
    ]
  }
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
  })
  export class UserprofileRoutingModule {
    
  }