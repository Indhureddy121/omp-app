import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PriceconfigurationService } from '@core/services/masters/priceconfiguration.service';
import { PriceconfigurationalpService } from '@core/services/masters/priceconfigurationalp.service';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-priceconfiguration-alp',
  templateUrl: './priceconfiguration-alp.component.html',
  styleUrls: ['./priceconfiguration-alp.component.css']
})
export class PriceconfigurationAlpComponent implements OnInit {

  delpriceconfigurationForm: FormGroup;
  lmepriceconfigurationForm: FormGroup;
  delsubmitted = false;
  lmesubmitted = false;
  isAdd = true;
  del_baseprice: number;
  lme_baseprice: number;
  surcharge: number;
  base_lme_exch: number;
  delpriceList: any = [];
  lmepriceList: any = [];
  dateFormate: string;
  baseConfiguration: any;

  constructor(
    private formBuilder: FormBuilder,
    private priceconfigurationService: PriceconfigurationService,
    private priceconfigurationalpService: PriceconfigurationalpService,
    private router: Router,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  get f() { return this.delpriceconfigurationForm.controls; }
  get f2() { return this.lmepriceconfigurationForm.controls; }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.onbuildForm();
    this.getBasePrice();
    this.getPriceList('del');
    this.getPriceList('lme');
  }

  private onbuildForm() {
    this.delpriceconfigurationForm = this.formBuilder.group({
      pc_delprice: ['', [Validators.required]],
      pc_delExchangerate: ['', [Validators.required]]
    });

    this.lmepriceconfigurationForm = this.formBuilder.group({
      pc_lmeprice: ['', [Validators.required]],
      pc_lmeExchangerate: ['', [Validators.required]]
    });
  }

  private getBasePrice() {
    this.dateFormate = this.authService.getDateFormat();
    //to get base price from configuration
    this.priceconfigurationService.getConfiguration().subscribe(
      response => {
        if (response.configurations) {
          this.baseConfiguration = response.configurations;
          this.del_baseprice = this.baseConfiguration.find(x => x.code === 'del').value;
          this.lme_baseprice = this.baseConfiguration.find(x => x.code === 'lme').value;
          this.surcharge = this.baseConfiguration.find(x => x.code === 'surcharge').value;
          this.base_lme_exch = this.baseConfiguration.find(x => x.code === 'base_lme_exch').value;
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getPriceList(curr_code: any) {
    let filter = curr_code;
    this.priceconfigurationalpService.getPriceList(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (filter === 'del')
            this.delpriceList = response.responsedata.data;
          else if (filter === 'lme')
            this.lmepriceList = response.responsedata.data;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  delsaveclicked() {
    this.delsubmitted = true;
    if (this.delpriceconfigurationForm.invalid)
      return;

    if (this.f.pc_delprice.value !== null || this.f.pc_delprice.value !== undefined || this.f.pc_delprice.value !== '') {
      if (Number(this.f.pc_delprice.value) !== undefined) {
        let savemodel: any = {
          currency_code: 'del',
          price: Number(this.f.pc_delprice.value),
          exchangerate: Number(this.f.pc_delExchangerate.value),
          price_changedate: new Date(),
          created_by: this.authService.getUserId(),
          created_date: new Date(),
        }
        if (isNaN(savemodel.price)) {
          this.notificationService.showError('Please enter valid current price.');
          return;
        } else if (isNaN(savemodel.exchangerate)) {
          this.notificationService.showError('Please enter valid exchange rate.');
          return;
        } else {
          this.saveAPI(savemodel);
        }
      }
    }
  }

  lmesaveclicked() {
    this.lmesubmitted = true;
    if (this.lmepriceconfigurationForm.invalid)
      return false;

    if (this.f2.pc_lmeprice.value !== null || this.f2.pc_lmeprice.value !== undefined || this.f2.pc_lmeprice.value !== '') {
      if (Number(this.f2.pc_lmeprice.value) !== undefined) {
        let savemodel: any = {
          currency_code: 'lme',
          price: Number(this.f2.pc_lmeprice.value),
          exchangerate: Number(this.f2.pc_lmeExchangerate.value),
          price_changedate: new Date(),
          created_by: this.authService.getUserId(),
          created_date: new Date(),
        }
        if (isNaN(savemodel.price)) {
          this.notificationService.showError('Please enter valid current price.');
          return;
        } else if (isNaN(savemodel.exchangerate)) {
          this.notificationService.showError('Please enter valid exchange rate.');
          return;
        } else {
          this.saveAPI(savemodel);
        }
      }
    }
  }

  private saveAPI(savemodel: any) {
    this.priceconfigurationalpService.savedelprice(savemodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.currency_code === 'del') {
            this.f.pc_delprice.setValue('');
            this.f.pc_delprice.clearValidators();
            this.f.pc_delprice.updateValueAndValidity();
            this.f.pc_delExchangerate.setValue('');
            this.f.pc_delExchangerate.clearValidators();
            this.f.pc_delExchangerate.updateValueAndValidity();
            this.getPriceList('del');
          } else if (response.responsedata.data.currency_code === 'lme') {
            this.f2.pc_lmeprice.setValue('');
            this.f2.pc_lmeprice.clearValidators();
            this.f2.pc_lmeprice.updateValueAndValidity();
            this.f2.pc_lmeExchangerate.setValue('');
            this.f2.pc_lmeExchangerate.clearValidators();
            this.f2.pc_lmeExchangerate.updateValueAndValidity();
            this.getPriceList('lme');
          }
          this.notificationService.showSuccess('Price added successfully. It will take 20 minutes to reflect in Cost & ALP.');
          this.notificationService.showInfo('Please add LCP (Euro) and LCP (Dollar) both price and then calculate. Ignore if already added.');

          // if (this.delpriceList.length || this.lmepriceList.length) {
          //   new Date(this.delpriceList[0].price_changedate).getMonth() + 1;
          //   new Date(this.lmepriceList[0].price_changedate).getMonth() + 1;

          // }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}
