import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  forgotPasswordFrm: FormGroup;

  submitted: boolean;
  showLoginMessage: boolean = false;
  isLappEmployee: boolean = true;
  optLappEmployee: boolean = true;
  optDealer: boolean = false;
  title: string;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  constructor(
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  get f() { return this.forgotPasswordFrm.controls; } //edit  

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.onBuildForm();
    this.title = 'Email';
    this.f.username.setValidators(Validators.pattern(this.emailPattern));
    this.f.username.updateValueAndValidity();
  }

  private onBuildForm() {
    this.forgotPasswordFrm = this.formBuilder.group({
      loginoption: [this.optLappEmployee],
      username: [null, [Validators.required]]
    });
  }

  onSubmitClick() {
    this.submitted = true;

    if (this.forgotPasswordFrm.invalid)
      return;

    let data = {
      email: this.f.username.value,
      isLappEmployee: this.isLappEmployee,
    };

    this.authservice.forgotPassword(data).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.showLoginMessage = true;
          this.notificationService.showSuccess('Password has been sent successfully');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onCancelClick() {
    this.router.navigate(['/login']);
  }

  onLoginOptionChange(event: any) {
    if (event.target.value == '0') {
      this.isLappEmployee = true;
      this.optLappEmployee = true;
      this.optDealer = false;
      this.title = 'Email';

      this.f.username.clearValidators();
      this.f.username.setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
    } else if (event.target.value == '1') {
      this.isLappEmployee = false;
      this.optLappEmployee = false;
      this.optDealer = true;
      this.title = 'User';

      this.f.username.clearValidators();
      this.f.username.setValidators(Validators.required);
    }

    this.submitted = false;
    this.f.username.setValue(null);
    this.f.username.updateValueAndValidity();
  }
}
