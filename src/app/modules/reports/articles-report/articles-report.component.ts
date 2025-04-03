import { Component, OnInit } from '@angular/core';
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
import { OmpusersService } from '@core/services/masters/ompusers.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-articles-report',
  templateUrl: './articles-report.component.html',
  styleUrls: ['./articles-report.component.css']
})
export class ArticlesReportComponent implements OnInit {

  FilterForm: FormGroup;
  OrderDetailsForm: FormGroup;
  submitted: boolean = false;
  searchModel = Object();
  searchValue: string = '';
  dateformate: string;
  createdDate: string;
  ArticleReport: any[] = [];
  ArticlelistReport: any[] = [];
  OrderTypeList: any[] = [
    { code: -1, description: 'All' },
    { code: 0, description: 'Offer' },
    { code: 20, description: 'Stock Order' }];
  OwnerList: any[] = [];
  SegmentList: any[] = [];
  CurrentFromDate: { year: number; month: number; day: number };
  CurrentToDate: { year: number; month: number; day: number };
  CurrentToMindate: any;
  CurrentToMaxdate: any;
  Total_OfferValue: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private appService: AppService,
    private datePipe: DatePipe,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter,
    public customerService: CustomerService,
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls; }
  get orderDetailsForm() { return this.OrderDetailsForm.controls; }

  ngOnInit() {
    this.onLoad();
    this.searchModel.searchtext = this.searchValue;
    this.dateformate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  onLoad() {
    this.buildForm();
    // let _currentfromdate = '01/09/' + (Number(moment().format('days')) - 30);
    let _currentfromdate = moment().subtract(30, 'days').format('DD/MM/YYYY');

    console.log(_currentfromdate);
    this.filterForm.currentfrom.setValue(_currentfromdate);
    this.CurrentFromDate = this.convertDate(_currentfromdate);
    this.CurrentToMindate = this.CurrentFromDate;

    let _currenttodate = moment().format('DD/MM/YYYY');
    this.filterForm.currentto.setValue(_currenttodate);
    this.CurrentToDate = this.convertDate(_currenttodate);
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      search: [''],
      currentfrom: [],
      currentto: []
    });
  }


  // OnCurrentFromDateSelection(date: any) {

  //   let currentfromdate = new Date(date.year, date.month - 1, date.day).toString();
  //   currentfromdate = this.datePipe.transform(currentfromdate, this.dateformate);


  //   this.filterForm.currentfrom.setValue(currentfromdate);
  //   this.CurrentFromDate = this.convertDate(this.filterForm.currentfrom.value);
  //   this.CurrentToMindate = this.CurrentFromDate;

  //   let maxdate = moment(currentfromdate, "DD/MM/YYYY").add(10, 'years').format('DD/MM/YYYY');
  //   this.CurrentToMaxdate = this.convertDate(maxdate);

  //   if (this.filterForm.currentto.value && new Date(this.filterForm.currentfrom.value.split('/').reverse().join('-')) > new Date(this.filterForm.currentto.value.split('/').reverse().join('-'))) {
  //     this.CurrentToDate = this.convertDate(currentfromdate);
  //     this.filterForm.currentto.setValue(currentfromdate);
  //   }

  // }

  // OnCurrentToDateSelection(date: any) {
  //   let currenttodate = new Date(date.year, date.month - 1, date.day).toString();
  //   currenttodate = this.datePipe.transform(currenttodate, this.dateformate);
  //   this.filterForm.currentto.setValue(currenttodate);
  //   this.CurrentToDate = this.convertDate(this.filterForm.currentto.value);
  // }

  OnCurrentFromDateSelection(date: any) {
    let currentfromdate = new Date(date.year, date.month - 1, date.day).toString();
    currentfromdate = this.datePipe.transform(currentfromdate, this.dateformate);

    this.filterForm.currentfrom.setValue(currentfromdate);
    this.CurrentFromDate = this.convertDate(this.filterForm.currentfrom.value);
    this.CurrentToMindate = this.CurrentFromDate;

    let fromDate: Date = new Date(this.filterForm.currentfrom.value.split('/').reverse().join('-'));
    let toDate: Date = new Date(this.filterForm.currentto.value.split('/').reverse().join('-'));

    // Calculate the difference in milliseconds
    let differenceInMilliseconds = toDate.getTime() - fromDate.getTime();

    if (differenceInMilliseconds > (30 * 24 * 60 * 60 * 1000)) {
      // Check if the difference is greater than 30 days
      // Adjust the to date to be 30 days after the from date
      let adjustedToDate = moment(fromDate).add(30, 'days').format('DD/MM/YYYY');
      this.filterForm.currentto.setValue(adjustedToDate);
      this.CurrentToDate = this.convertDate(adjustedToDate);
    } else {
      this.CurrentToDate = this.convertDate(this.filterForm.currentto.value);
    }
  }

  OnCurrentToDateSelection(date: any) {
    let currenttodate = new Date(date.year, date.month - 1, date.day).toString();
    currenttodate = this.datePipe.transform(currenttodate, this.dateformate);
    this.filterForm.currentto.setValue(currenttodate);
    this.CurrentToDate = this.convertDate(this.filterForm.currentto.value);
  }



  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate: { year: number; month: number; day: number; } = { year: year, month: month, day: day };
    return newdate;
  }


  onSearch(response) {
    this.searchValue = '';

    if (response && response.searchValue)
      this.searchValue = response.searchValue;
  }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getData();
  }

  getData() {

    let filter = {
      search: this.filterForm.search.value ? this.filterForm.search.value : '',
      from: this.filterForm.currentfrom.value ? this.filterForm.currentfrom.value.split('/').reverse().join('-') : '',
      to: this.filterForm.currentto.value ? this.filterForm.currentto.value.split('/').reverse().join('-') : ''
    }

    this.reportsService.articlecostrepost(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
          this.submitted = false;
          this.ArticleReport = response.responsedata.data;

          this.Total_OfferValue = 0;
          this.ArticleReport.forEach(element => {
            // element.Cost = (element.Cost * 100).toFixed(2);
            this.Total_OfferValue += element.Cost;
          });

          this.Total_OfferValue = Number(this.Total_OfferValue.toFixed(2));
          this.ArticleReport = Config.SetDetailStatus(this.ArticleReport, 'status', 'showstatus');
          this.ArticlelistReport = JSON.parse(JSON.stringify(this.ArticleReport));

        } else {
          this.Total_OfferValue = 0;
          this.ArticleReport = [];
          this.ArticlelistReport = [];
          this.notificationService.showInfo('There is no data');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.ArticlelistReport && this.ArticlelistReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Article Cost Report - ' + this.createdDate;

    let orderdashboardheader = Config.ReportsHeaders.ArticleCostReport;
    this.ArticlelistReport = this.ArticlelistReport.map(item => {
      return {
        [orderdashboardheader[0]]: item.lappopportunityid,
        [orderdashboardheader[1]]: item.offerno,
        [orderdashboardheader[2]]: item.ArticleNo,
        [orderdashboardheader[3]]: item.description,
        [orderdashboardheader[4]]: item.industry_std_text,
        [orderdashboardheader[5]]: item.ItemType,
        [orderdashboardheader[6]]: item.Quantity,
        [orderdashboardheader[7]]: item.Cost,
        [orderdashboardheader[8]]: item.rmc_cost,
      };
    });

    this.appService.exportAsExcelFile(this.ArticlelistReport, fileName);
  }






}
