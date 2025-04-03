import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { ManageusersComponent } from './pages/users/users/manageusers.component';
import { ManageuserslistComponent } from './pages/users/users-list/manageusers.component';
import { UserprofileRoutingModule } from './userprofile-routing.module';
import { MyprofileComponent } from './pages/myprofile/myprofile/myprofile.component';

@NgModule({
	declarations: [
		ManageusersComponent,
		ManageuserslistComponent,
		MyprofileComponent,
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
		UserprofileRoutingModule
	]
})
export class UserprofileModule { }