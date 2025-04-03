import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { StorageService, StorageKey } from '@core/services/common/storage.service';
import * as moment from 'moment';
import { ConfigurationEnum } from '@core/enums/configuration.enum';
import { NotificationService } from '@core/services/common/notification.service';
import { PwaService } from '@core/services/pwa/pwa.service';
import { Platform } from '@angular/cdk/platform';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFrm: FormGroup;
  loginData: any;
  submitted: boolean = false;
  returnUrl: any;
  resetPasswordUrl: string = '/resetPassword';
  fromdate: any;
  todate: any;
  todatetoYear: any;
  isLappEmployee: boolean = true;
  optLappEmployee: boolean = true;
  optDealer: boolean = false;
  title: string;
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  @ViewChild('iosPwaPromptModal', { static: false }) iosPwaPromptModal: ElementRef;
  showLoader: boolean= false;
  
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authservice: AuthService,
    private storageService: StorageService,
    private route: ActivatedRoute,
    private notificationService: NotificationService,
    public pwaService : PwaService,
    private platform: Platform,
    private modalService :NgbModal,
  ) { }

  get f() { return this.loginFrm.controls; } //edit

  ngOnInit() {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
    this.onLoad();
  }

  private onLoad() {
    this.onBuildForm();
    this.setValidator('0');
    this.fromdate = moment().format('DD/MM/YYYY');
    this.todate = moment().add(30, 'd').format('DD/MM/YYYY');
    this.todatetoYear = moment().add(365, 'd').format('DD/MM/YYYY');
  }

  private onBuildForm() {
    this.loginFrm = this.formBuilder.group({
      loginoption: [this.optLappEmployee],
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: ['']
    });
  }

  public onLogin() {
    this.submitted = true;

    if (this.loginFrm.invalid)
      return;

    if (this.f.password.value.trim() == "") {
      this.notificationService.showError('Please Enter Password');
      return;
    }
    this.showLoader=true;
    this.loginData = {
      userid: this.f.username.value,
      password: this.f.password.value,
      isLappEmployee: this.isLappEmployee,
      isweb: true,
      fcmtoken: null
    }

    this.login(this.loginData);
  }

  private login(data: any) {
    this.authservice.CheckUserCreditial(data).subscribe(
      response => {
        if (response.responsedata.statusCode == 200) {
          let currentUser = response.responsedata.data.currentUser;
          this.storageService.setValue(StorageKey.authToken, response.responsedata.data.token);
          if(currentUser.isexpired){
            this.router.navigate([this.resetPasswordUrl]);
            return;
          }
          this.storageService.setValue(StorageKey.currentUser, JSON.stringify(response.responsedata.data.currentUser));
          this.storageService.setValue(StorageKey.dateformat, 'dd/MM/yyyy');

          let defaultscreenvalues = {
            User: {
              searchtext: ""
            },
            Customer: {
              searchtext: ""
            },
            Opportunity: {
              searchtext: ""
            },
            Offers: {
              searchtext: "",
              offerstatus: 1,
              offerdetailstatus: 0,
              from: this.fromdate,
              to: this.todate,
              pendingon: "",
              assignto: "",
            },
            StockOrders: {
              searchtext: "",
              offerstatus: 1,
              offerdetailstatus: 0,
              pendingon: "",
            },
            OfferSimulator: {
              searchtext: "",
              offerstatus: 1,
              offerdetailstatus: 0,
              from: this.fromdate,
              to: this.todate,
              assignto: "",
            },
            PE_Action: {
              searchtext: "",
              itemtatus: 1,
              itemSPRStatus: 10,
              assignto: "",
              vertical: "All",
              pagenumber: 1
            },
            ASM_Action: {
              searchtext: ""
            },
            FM_Action: {
              searchtext: "",
              itemSPRStatus: 0
            },
            RateContracts: {
              searchtext: "",
              rctype: -1,
              rcstatus: -1,
              status: 1,
              from: this.fromdate,
              to: this.todatetoYear,
              pendingon: "",
            },
            ArticleCreation: {
              searchtext: "",
              pagenumber: 1
            }
          }

          this.storageService.setValue(StorageKey.defaultscreenvalues, JSON.stringify(defaultscreenvalues));
          
          this.authservice.getScreenDetails().subscribe(
            responseinner => {
              if (responseinner.responsedata && responseinner.responsedata.statusCode == 200) {
                this.storageService.setValue(StorageKey.menuData, JSON.stringify(responseinner.responsedata.data));

                this.authservice.ConfigurationbyCode(ConfigurationEnum.OfferValidfromCreation).subscribe(
                  res => {
                    if (res.responsedata && res.responsedata.statusCode == 200 && res.responsedata.data.length > 0) {
                      this.storageService.setValue(StorageKey.offervalidfromcreation, res.responsedata.data[0].value);
                    }
                  }, err => {
                    this.notificationService.showError(err.error.error.message);
                  }
                );
                
                
                this.router.navigate([this.returnUrl]);
              }
            }, errorinner => {
              this.authservice.logout();
              this.notificationService.showError(errorinner.error.error.message);
            });
        } else {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.showLoader=false;
        this.notificationService.showError(error.error.error.message);
      });
  }

  onLoginOptionChange(event: any) {
    this.setValidator(event.target.value);
  }

  setValidator(loginas) {
    if (loginas == '0') {
      this.isLappEmployee = true;
      this.optLappEmployee = true;
      this.optDealer = false;
      this.title = 'Email';

      this.f.username.clearValidators();
      this.f.username.setValidators([Validators.required, Validators.pattern(this.emailPattern)]);
    } else if (loginas == '1') {
      this.isLappEmployee = false;
      this.optLappEmployee = false;
      this.optDealer = true;
      this.title = 'User';

      this.f.username.clearValidators();
      this.f.username.setValidators(Validators.required);
    }

    this.submitted = false;
    this.f.username.setValue(null);
    this.f.password.setValue(null);
    this.f.username.updateValueAndValidity();
  }

  installPwa(){
    if(this.platform.isBrowser)  {
      this.pwaService.pwaInstallPrompt.prompt();
      this.pwaService.pwaInstallPrompt = null ;
    }
    else if(this.platform.IOS){
      this.modalService.open(this.iosPwaPromptModal);
      this.pwaService.pwaInstallPrompt = null ;
    }
  }
}
