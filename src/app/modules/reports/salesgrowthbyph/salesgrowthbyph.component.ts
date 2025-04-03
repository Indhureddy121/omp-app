import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Config } from 'src/app/core/configs/config';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-salesgrowthbyph',
  templateUrl: './salesgrowthbyph.component.html',
  styleUrls: ['./salesgrowthbyph.component.css']
})
export class SalesgrowthbyphComponent implements OnInit {

  FilterForm: FormGroup;

  submitted: boolean = false;
  dateformate: string;
  salesgrowthbyphList: any[] = [];
  salesgrowthbyphListforReport: any[] = [];
  createdDate: string;
  selectedfinancialyear: number;
  currentmonth: string;
  rpreviousyear: number = 0;
  rcurrentyear: number = 0;
  gmpreviousyear: number = 0;
  gmcurrentyear: number = 0;
  growthvspy: number = 0;
  CurrentFinancialYear: string = '';
  CurrentFromDate: { year: number; month: number; day: number };
  CurrentToDate: { year: number; month: number; day: number };
  PreviousFromDate: { year: number; month: number; day: number };
  PreviousToDate: { year: number; month: number; day: number };
  CurrentToMindate: any;
  PreviousToMindate: any;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private reportsService: ReportsService,
    private appService: AppService,
    private datePipe: DatePipe,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.onLoad();

    this.dateformate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  onLoad() {
    this.buildForm();

    let _currentfromdate = '01/10/' + (Number(moment().format('YYYY')) - 1);
    this.filterForm.currentfrom.setValue(_currentfromdate);
    this.CurrentFromDate = this.convertDate(_currentfromdate);
    this.CurrentToMindate = this.CurrentFromDate;

    let _currenttodate = moment().format('DD/MM/YYYY');
    this.filterForm.currentto.setValue(_currenttodate);
    this.CurrentToDate = this.convertDate(_currenttodate);

    let _previousfromdate = '01/10/' + (Number(moment().format('YYYY')) - 2);
    this.filterForm.previousfrom.setValue(_previousfromdate);
    this.PreviousFromDate = this.convertDate(_previousfromdate);
    this.PreviousToMindate = this.PreviousFromDate;

    let _previoustodate = moment(this.filterForm.currentto.value, 'DD/MM/YYYY').subtract(365, 'days').format('DD/MM/YYYY');
    this.filterForm.previousto.setValue(_previoustodate);
    this.PreviousToDate = this.convertDate(_previoustodate);
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      previousfrom: [null, [Validators.required]],
      previousto: [null, [Validators.required]],
      currentfrom: [null, [Validators.required]],
      currentto: [null, [Validators.required]]
    });
  }

  // onFilterChange(event: any) {
  //   if (event) {
  //     this.getData();
  //     this.getCurrentMonth();
  //   }
  // }

  OnCurrentFromDateSelection(date) {
    let currentfromdate = new Date(date.year, date.month - 1, date.day).toString();
    currentfromdate = this.datePipe.transform(currentfromdate, this.dateformate);

    this.filterForm.currentfrom.setValue(currentfromdate);
    this.CurrentFromDate = this.convertDate(this.filterForm.currentfrom.value);
    this.CurrentToMindate = this.CurrentFromDate;

    if (this.filterForm.currentto.value && new Date(this.filterForm.currentfrom.value.split('/').reverse().join('-')) > new Date(this.filterForm.currentto.value.split('/').reverse().join('-'))) {
      this.CurrentToDate = this.convertDate(currentfromdate);
      this.filterForm.currentto.setValue(currentfromdate);
    }
  }

  OnCurrentToDateSelection(date) {
    let currenttodate = new Date(date.year, date.month - 1, date.day).toString();
    currenttodate = this.datePipe.transform(currenttodate, this.dateformate);
    this.filterForm.currentto.setValue(currenttodate);
    this.CurrentToDate = this.convertDate(this.filterForm.currentto.value);
  }

  OnPreviousFromDateSelection(date) {
    let previousfromdate = new Date(date.year, date.month - 1, date.day).toString();
    previousfromdate = this.datePipe.transform(previousfromdate, this.dateformate);

    this.filterForm.previousfrom.setValue(previousfromdate);
    this.PreviousFromDate = this.convertDate(this.filterForm.previousfrom.value);
    this.PreviousToMindate = this.PreviousFromDate;

    if (this.filterForm.previousto.value && new Date(this.filterForm.previousfrom.value.split('/').reverse().join('-')) > new Date(this.filterForm.previousto.value.split('/').reverse().join('-'))) {
      this.PreviousToDate = this.convertDate(previousfromdate);
      this.filterForm.previousto.setValue(previousfromdate);
    }
  }

  OnPreviousToDateSelection(date) {
    let previoustodate = new Date(date.year, date.month - 1, date.day).toString();
    previoustodate = this.datePipe.transform(previoustodate, this.dateformate);
    this.filterForm.previousto.setValue(previoustodate);
    this.PreviousToDate = this.convertDate(this.filterForm.previousto.value);
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate: { year: number; month: number; day: number; } = { year: year, month: month, day: day };
    return newdate;
  }

  // getCurrentMonth() {
  //   if (Config.getCurrentMonthinCurrentFinancialYearorNot(this.selectedfinancialyear))
  //     this.currentmonth = null;
  //   else
  //     this.currentmonth = Config.monthName[new Date().getMonth()];
  // }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getData();
    // this.getYearDescription();
  }

  getData() {
    let filter = {
      previousfrom: this.filterForm.previousfrom.value.split('/').reverse().join('-'),
      previousto: this.filterForm.previousto.value.split('/').reverse().join('-'),
      currentfrom: this.filterForm.currentfrom.value.split('/').reverse().join('-'),
      currentto: this.filterForm.currentto.value.split('/').reverse().join('-')
    }

    this.reportsService.getsalesgrowthbyphdata(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.salesgrowthbyphList = response.responsedata.data;

          this.rpreviousyear = 0;
          this.rcurrentyear = 0;
          this.gmpreviousyear = 0;
          this.gmcurrentyear = 0;
          this.growthvspy = 0;
          this.salesgrowthbyphList.forEach(element => {
            this.rpreviousyear += element.revenuepreviousyear;
            this.rcurrentyear += element.revenuecurrentyear;
            this.gmpreviousyear += element.gmpreviousyear;
            this.gmcurrentyear += element.gmcurrentyear;
            this.growthvspy += element.growthvspy;
          });

          this.salesgrowthbyphListforReport = [];
          this.salesgrowthbyphListforReport = JSON.parse(JSON.stringify(this.salesgrowthbyphList));

          this.gmpreviousyear = this.gmpreviousyear / this.salesgrowthbyphList.length;
          this.gmcurrentyear = this.gmcurrentyear / this.salesgrowthbyphList.length;
          this.growthvspy = this.growthvspy / this.salesgrowthbyphList.length;
        } else {
          this.salesgrowthbyphList = [];
          this.salesgrowthbyphListforReport = [];
          this.rpreviousyear = 0;
          this.rcurrentyear = 0;
          this.gmpreviousyear = 0;
          this.gmcurrentyear = 0;
          this.growthvspy = 0;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.salesgrowthbyphListforReport && this.salesgrowthbyphListforReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Sales Growth by PH - ' + this.createdDate;

    this.salesgrowthbyphListforReport.forEach(element => {
      element.gmpreviousyear = (element.gmpreviousyear * 100).toFixed(2);
      element.gmcurrentyear = (element.gmcurrentyear * 100).toFixed(2);
      element.growthvspy = (element.growthvspy * 100).toFixed(2);
    });

    this.salesgrowthbyphListforReport.push({
      ph: 'Total',
      revenuepreviousyear: this.rpreviousyear,
      revenuecurrentyear: this.rcurrentyear,
      growthvspy: (this.growthvspy * 100).toFixed(2),
      gmpreviousyear: (this.gmpreviousyear * 100).toFixed(2),
      gmcurrentyear: (this.gmcurrentyear * 100).toFixed(2)
    });

    let salesgrowthbyphheader = Config.ReportsHeaders.salesgrowthbyph;
    this.salesgrowthbyphListforReport = this.salesgrowthbyphListforReport.map(item => {
      return {
        [salesgrowthbyphheader[0]]: item.ph,
        [salesgrowthbyphheader[1]]: item.industrystdtext,
        ["Revenue(" + this.filterForm.previousfrom.value + " - " + this.filterForm.previousto.value + ")"]: item.revenuepreviousyear,
        ["Revenue(" + this.filterForm.currentfrom.value + " - " + this.filterForm.currentto.value + ")"]: item.revenuecurrentyear,
        [salesgrowthbyphheader[4]]: item.growthvspy,
        ["GM(" + this.filterForm.previousfrom.value + " - " + this.filterForm.previousto.value + ")"]: item.gmpreviousyear,
        ["GM(" + this.filterForm.currentfrom.value + " - " + this.filterForm.currentto.value + ")"]: item.gmcurrentyear
      };
    });

    this.appService.exportAsExcelFile(this.salesgrowthbyphListforReport, fileName);
  }
}