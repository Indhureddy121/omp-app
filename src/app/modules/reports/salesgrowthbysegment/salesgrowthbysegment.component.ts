import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { Config } from '@core/configs/config';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { PeactionService } from '@core/services/peaction/peaction.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-salesgrowthbysegment',
  templateUrl: './salesgrowthbysegment.component.html',
  styleUrls: ['./salesgrowthbysegment.component.css']
})
export class SalesgrowthbysegmentComponent implements OnInit {

  FilterForm: FormGroup;

  FinancialYearsList: any[] = [
    { code: '2021', description: 'Sep-20 : Aug-21' },
    { code: '2020', description: 'Sep-19 : Aug-20' },
    { code: '2019', description: 'Sep-18 : Aug-19' }];
  submitted: boolean = false;
  dateformate: string;
  phList: any[] = [];
  salesgrowthbysegmentList: any[] = [];
  salesgrowthbysegmentListforReport: any[] = [];
  createdDate: string;
  currentmonth: string;
  selectedfinancialyear: number;
  rpreviousyear: number = 0;
  rcurrentyear: number = 0;
  gmpreviousyear: number = 0;
  gmcurrentyear: number = 0;
  growthvspy: number = 0;
  contributionper: number = 0;
  phs: any[] = [];
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
    private peactionService: PeactionService,
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
    this.getPHList();

    let _currentfromdate = '01/10/' + (Number(moment().format('YYYY')) - 1);
    this.filterForm.currentfrom.setValue(_currentfromdate);
    this.CurrentFromDate = this.convertDate(_currentfromdate);
    this.CurrentToMindate = this.CurrentFromDate;

    let _currenttodate = moment().format('DD/MM/YYYY');
    this.filterForm.currentto.setValue(_currenttodate);
    this.CurrentToDate = this.convertDate(_currenttodate);

    let _previousfromdate = moment(this.filterForm.currentfrom.value, 'DD/MM/YYYY').subtract(365, 'days').format('DD/MM/YYYY');
    this.filterForm.previousfrom.setValue(_previousfromdate);
    this.PreviousFromDate = this.convertDate(_previousfromdate);
    this.PreviousToMindate = this.PreviousFromDate;

    let _previoustodate = moment(this.filterForm.currentto.value, 'DD/MM/YYYY').subtract(365, 'days').format('DD/MM/YYYY');
    this.filterForm.previousto.setValue(_previoustodate);
    this.PreviousToDate = this.convertDate(_previoustodate);
    // this.getCurrentMonth();
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      ph: [null],
      previousfrom: [null, [Validators.required]],
      previousto: [null, [Validators.required]],
      currentfrom: [null, [Validators.required]],
      currentto: [null, [Validators.required]]
    });
  }

  getPHList() {
    this.peactionService.getPHList('', '').then(
      response => {
        if (response) {
          this.phList = response.phlist;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onFilterChange(event: any) {
    if (event) {
      // this.selectedfinancialyear = Number(this.filterForm.financialyear.value);
      this.getData();
      this.getCurrentMonth();
    }
  }

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

  getCurrentMonth() {
    if (Config.getCurrentMonthinCurrentFinancialYearorNot(this.selectedfinancialyear))
      this.currentmonth = null;
    else
      this.currentmonth = Config.monthName[new Date().getMonth()];
  }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid || this.phs.length <= 0)
      return;

    this.getData();
    // this.getYearDescription();
  }

  onPHAdd(event: any) {
    if (!this.phs.includes(event.ph))
      this.phs.push(event.ph);
    this.filterForm.ph.setValue(null);
  }

  onPHRemove(index: number) {
    this.phs.splice(index, 1);
  }

  getData() {
    let filter = {
      ph: this.phs.join(),
      previousfrom: this.filterForm.previousfrom.value.split('/').reverse().join('-'),
      previousto: this.filterForm.previousto.value.split('/').reverse().join('-'),
      currentfrom: this.filterForm.currentfrom.value.split('/').reverse().join('-'),
      currentto: this.filterForm.currentto.value.split('/').reverse().join('-')
    }

    this.reportsService.getsalesgrowthbysegmentdata(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.salesgrowthbysegmentList = response.responsedata.data;

          this.rpreviousyear = 0;
          this.rcurrentyear = 0;
          this.gmpreviousyear = 0;
          this.gmcurrentyear = 0;
          this.growthvspy = 0;
          this.contributionper = 0;

          this.salesgrowthbysegmentList.forEach(element => {
            this.rpreviousyear += element.revenuepreviousyear;
            this.rcurrentyear += element.revenuecurrentyear;
            this.gmpreviousyear += element.gmpreviousyear;
            this.gmcurrentyear += element.gmcurrentyear;
            this.growthvspy += element.growthvspy;
          });

          this.salesgrowthbysegmentList.forEach(element => {
            element.contribution = (element.revenuecurrentyear / this.rcurrentyear).toFixed(2);
            this.contributionper += Number(element.contribution);
          });

          this.salesgrowthbysegmentListforReport = [];
          this.salesgrowthbysegmentListforReport = JSON.parse(JSON.stringify(this.salesgrowthbysegmentList));

          this.gmpreviousyear = this.gmpreviousyear / this.salesgrowthbysegmentList.length;
          this.gmcurrentyear = this.gmcurrentyear / this.salesgrowthbysegmentList.length;
          this.growthvspy = this.growthvspy / this.salesgrowthbysegmentList.length;
        } else {
          this.salesgrowthbysegmentList = [];
          this.salesgrowthbysegmentListforReport = [];
          this.rpreviousyear = 0;
          this.rcurrentyear = 0;
          this.gmpreviousyear = 0;
          this.gmcurrentyear = 0;
          this.growthvspy = 0;
          this.contributionper = 0;
        }

        this.submitted = false;
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.salesgrowthbysegmentListforReport && this.salesgrowthbysegmentListforReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Sales Growth by Segment - ' + this.createdDate;

    this.salesgrowthbysegmentListforReport.forEach(element => {
      element.gmpreviousyear = (element.gmpreviousyear * 100).toFixed(2);
      element.gmcurrentyear = (element.gmcurrentyear * 100).toFixed(2);
      element.growthvspy = (element.growthvspy * 100).toFixed(2);
      element.contribution = (element.contribution * 100).toFixed(2);
    });

    this.salesgrowthbysegmentListforReport.push({
      segment: 'Grand Total',
      revenuepreviousyear: this.rpreviousyear,
      revenuecurrentyear: this.rcurrentyear,
      growthvspy: (this.growthvspy * 100).toFixed(2),
      gmpreviousyear: (this.gmpreviousyear * 100).toFixed(2),
      gmcurrentyear: (this.gmcurrentyear * 100).toFixed(2),
      contribution: (this.contributionper * 100).toFixed(2)
    });

    let salesgrowthbysegmentheader = Config.ReportsHeaders.salesgrowthbysegment;
    this.salesgrowthbysegmentListforReport = this.salesgrowthbysegmentListforReport.map(item => {
      return {
        [salesgrowthbysegmentheader[0]]: item.segment,
        ["Revenue" + this.filterForm.previousfrom.value + " - " + this.filterForm.previousto.value]: item.revenuepreviousyear,
        ["Revenue" + this.filterForm.currentfrom.value + " - " + this.filterForm.currentto.value]: item.revenuecurrentyear,
        [salesgrowthbysegmentheader[3]]: item.growthvspy,
        ["GM " + this.filterForm.previousfrom.value + " - " + this.filterForm.previousto.value]: item.gmpreviousyear,
        ["GM " + this.filterForm.currentfrom.value + " - " + this.filterForm.currentto.value]: item.gmcurrentyear,
        [salesgrowthbysegmentheader[6]]: item.contribution,
        [salesgrowthbysegmentheader[7]]: item.vertical
      };
    });

    this.appService.exportAsExcelFile(this.salesgrowthbysegmentListforReport, fileName);
  }
}
