import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Config } from 'src/app/core/configs/config';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '@core/services/masters/customer.service';
import { StorageService } from '@core/services/common/storage.service';
import { StockorderService } from '@core/services/stockorder/stockorder.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-stockreport',
  templateUrl: './stockreport.component.html',
  styleUrls: ['./stockreport.component.css']
})
export class StockreportComponent implements OnInit {

  FilterForm: FormGroup;
  OrderDetailsForm: FormGroup;

  submitted: boolean = false;
  dateformate: string;
  createdDate: string;
  usertype: number = 0;
  DealersList: any[] = [];
  invoicelist: any[] = [];
  invoicelistreport: any[] = [];
  // selectedfinancialyear: number;
  // currentmonth: string;
  // rpreviousyear: number = 0;
  // rcurrentyear: number = 0;
  // gmpreviousyear: number = 0;
  // gmcurrentyear: number = 0;
  // growthvspy: number = 0;
  // CurrentFinancialYear: string = '';
  CurrentFromDate: { year: number; month: number; day: number };
  CurrentToDate: { year: number; month: number; day: number };
  // PreviousFromDate: { year: number; month: number; day: number };
  // PreviousToDate: { year: number; month: number; day: number };
  CurrentToMindate: any;
  CurrentToMaxdate: any;
  // PreviousToMindate: any;
  dealerdata: any;
  OrderNo: string;
  ItemNo: string;
  StockData: any[] = [];
  lastgenerateddate: string = '';
  
  Total_Amount: number = 0;
  Total_Net_Value_Amount: number = 0;
  itemstockdata: any[] = [];
  Total_Quantity: number = 0;
  @ViewChild('OrderDetailModel', { static: false }) OrderDetailModel: any;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private reportsService: ReportsService,
    private appService: AppService,
    private datePipe: DatePipe,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter,
    public customerService: CustomerService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private stockorderService: StockorderService,
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.buildForm();
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      articleno: [null, [Validators.required]]
    });
  }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getStockData();
  }

  async getStockData() {
    await this.stockorderService.StockAvailability(this.filterForm.articleno.value, false, false).then(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.itemstockdata = response.responsedata.data.results;
          this.Total_Quantity = response.responsedata.data.totalstock;
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

}