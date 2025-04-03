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
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-customeroutstanding',
  templateUrl: './customeroutstanding.component.html',
  styleUrls: ['./customeroutstanding.component.css']
})
export class CustomeroutstandingComponent implements OnInit {

  FilterForm: FormGroup;

  submitted: boolean = false;
  dateformate: string;
  createdDate: string;
  usertype: number = 0;
  DealersList: any[] = [];
  customeroutstandingheader: any[] = [];
  customeroutstandingitemdetail: any[] = [];
  customeroutstandingitemdetailreport: any[] = [];
  dealerdata: any;
  Customer: string = '';
  CompanyCode: string = '';
  lastgenerateddate: string = '';
  @ViewChild('ItemDetailModel', { static: false }) ItemDetailModel: any;

  constructor(
    private formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private appService: AppService,
    private datePipe: DatePipe,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter,
    public customerService: CustomerService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.onLoad();

    this.dateformate = this.authService.getDateFormat();
    this.usertype = this.authService.getCurrentUser().usertype;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

    if (this.usertype == 20)
      this.GetDealerDetail();
  }

  onLoad() {
    this.buildForm();

    if (this.storageService.getValue('Reports')) {
      let customeroutstandingreport = JSON.parse(this.storageService.getValue('Reports')).customeroutstanding;
      if (customeroutstandingreport) {
        this.customeroutstandingheader = customeroutstandingreport.customeroutstandingheader;
        this.customeroutstandingitemdetail = customeroutstandingreport.customeroutstandingitemdetail;
        this.lastgenerateddate = customeroutstandingreport.lastgenerateddate;

        // this.Customer = this.customeroutstandingheader[0].Customer + ' - ' + this.customeroutstandingitemdetail[0].Name;
        // this.CompanyCode = this.customeroutstandingitemdetail[0].CompanyCode;

        this.customeroutstandingitemdetailreport = JSON.parse(JSON.stringify(this.customeroutstandingitemdetail));
      }
    }
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      dealer: [null, [Validators.required]],
    });
  }

  GetDealersList() {
    let element = (document.getElementById('ngSelectDealers') as HTMLInputElement);
    if (element.value && element.value.length >= 3) {
      this.GetDealersListAPI(element.value);
    }
  }

  GetDealersListAPI(dealer: string) {
    this.customerService.getcustomersanddealerslist(dealer).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.DealersList = response.responsedata.data;
      }, error => {
        this.DealersList = [];
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetDealerDetail() {
    this.customerService.getCustomerById(this.authService.getUserId()).subscribe(
      response => {
        this.dealerdata = response.responsedata.data[0];
        this.filterForm.dealer.setValue(this.dealerdata.sapid + ' - ' + this.dealerdata.customername);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getData();
  }

  getData() {
    let customer = this.usertype == 20 ? this.dealerdata.sapid : this.filterForm.dealer.value;

    this.reportsService.getcustomeroutstandingheader(customer).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
          this.submitted = false;

          this.customeroutstandingheader = Config.fn_Arr_trim(response.responsedata.data);
          this.customeroutstandingheader.forEach(element => {
            element.CurrentValue = Number(Number(element.CurrentValue).toFixed(2));
            element.Days045 = Number(Number(element.Days045).toFixed(2));
            element.Days4690 = Number(Number(element.Days4690).toFixed(2));
            element.Days91180 = Number(Number(element.Days91180).toFixed(2));
            element.Over180Days = Number(Number(element.Over180Days).toFixed(2));
            element.NotDue = Number(Number(element.NotDue).toFixed(2));
            element.Total = Number(Number(element.Total).toFixed(2));
          });

          this.onCustomerDetailClick(this.customeroutstandingheader[0].Customer);
        } else {
          this.customeroutstandingheader = [];
          this.notificationService.showInfo('There is no data.');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onCustomerDetailClick(customer: string) {
    this.reportsService.getcustomeroutstandingitemdetail(customer).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
          this.submitted = false;

          this.customeroutstandingitemdetail = Config.fn_Arr_trim(response.responsedata.data);

          this.customeroutstandingitemdetail.forEach(element => {
            element.Balance = Number(Number(element.Balance).toFixed(2));

            element.BlineDate = element.BlineDate ? this.datePipe.transform(new Date(Number(element.BlineDate.match(/(\d+)/)[0])), this.dateformate) : null;
            element.DueDate = element.DueDate ? this.datePipe.transform(new Date(Number(element.DueDate.match(/(\d+)/)[0])), this.dateformate) : null;
            element.PostingDate = element.PostingDate ? this.datePipe.transform(new Date(Number(element.PostingDate.match(/(\d+)/)[0])), this.dateformate) : null;
          });

          if (this.authService.getCurrentUser().usertype == 20) {
            let _reportsdata: any = JSON.parse(this.storageService.getValue('Reports'));

            if (_reportsdata)
              delete _reportsdata.customeroutstanding;
            else
              _reportsdata = {};

            _reportsdata.customeroutstanding = {
              customeroutstandingheader: this.customeroutstandingheader,
              customeroutstandingitemdetail: this.customeroutstandingitemdetail,
              lastgenerateddate: this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss')
            }
            this.lastgenerateddate = _reportsdata.customeroutstanding.lastgenerateddate;
            this.storageService.setValue('Reports', JSON.stringify(_reportsdata));
          }

          this.customeroutstandingitemdetailreport = JSON.parse(JSON.stringify(this.customeroutstandingitemdetail));

          // this.Customer = this.customeroutstandingheader[0].Customer + ' - ' + this.customeroutstandingitemdetail[0].Name;
          // this.CompanyCode = this.customeroutstandingitemdetail[0].CompanyCode;
          // this.modalService.open(this.ItemDetailModel, { size: 'xl', scrollable: true });
        } else {
          this.customeroutstandingitemdetail = [];
          this.customeroutstandingitemdetailreport = [];
          this.notificationService.showInfo('There is no data');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.customeroutstandingitemdetailreport && this.customeroutstandingitemdetailreport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Customer Outstanding Item Detail Report - ' + this.createdDate;

    let customeroutstandingitemdetailheader = Config.ReportsHeaders.customeroutstandingitemdetail;
    this.customeroutstandingitemdetailreport = this.customeroutstandingitemdetailreport.map(item => {
      return {
        [customeroutstandingitemdetailheader[0]]: item.Customer,
        [customeroutstandingitemdetailheader[1]]: item.Name,
        [customeroutstandingitemdetailheader[2]]: item.BillDoc,
        [customeroutstandingitemdetailheader[3]]: item.BstkdM,
        [customeroutstandingitemdetailheader[4]]: item.BlineDate,
        [customeroutstandingitemdetailheader[5]]: item.DueDate,
        [customeroutstandingitemdetailheader[6]]: item.Currency,
        [customeroutstandingitemdetailheader[7]]: item.DocumentNo,
        [customeroutstandingitemdetailheader[8]]: item.Gjahr,
        [customeroutstandingitemdetailheader[9]]: item.ReferenceDocNo,
        [customeroutstandingitemdetailheader[10]]: item.Blart + ' - ' + item.DocumentType,
        [customeroutstandingitemdetailheader[11]]: item.PostingDate,
        [customeroutstandingitemdetailheader[12]]: item.Salesorg,
        [customeroutstandingitemdetailheader[13]]: item.Balance
      }
    });

    this.appService.exportAsExcelFile(this.customeroutstandingitemdetailreport, fileName);
  }
}