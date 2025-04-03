import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';
import { ConfirmedValidator, NewPasswordValidator } from 'src/app/confirmed.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {

  resetPasswordFrm :FormGroup;
  submitted:boolean = false;

  get f() { return this.resetPasswordFrm.controls; } //edit
  
  constructor(
    private fb:FormBuilder,
    private authservice: AuthService,
    private notificationService:NotificationService,
    private router: Router) { }
    
  ngOnInit() {
    this.onLoad();
  }
  onLoad(){
    this.resetPasswordFrm = this.fb.group({
      password:[null,[Validators.required]],
      confirm_password:[null,[Validators.required]],
    }, {
      validators: [NewPasswordValidator('password'), ConfirmedValidator('password', 'confirm_password')]
    })
  }
  onResetPassword(){
    this.submitted = true;
    if(this.resetPasswordFrm.invalid){
      console.log(this.f.password.errors.minLengthPasswordValidator);
      return;
    }
    
    let data = {
      password : this.f.password.value
    }
    this.authservice.resetPassword(data).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess('Password has been reset successfully. Login with new password');
          this.authservice.logout();
          this.router.navigate(['/login'])
        }
      }, error => {
        this.notificationService.showError(error);
      });
  }

  onCancelClick(){
    this.router.navigate(['/login']);
  }

}
