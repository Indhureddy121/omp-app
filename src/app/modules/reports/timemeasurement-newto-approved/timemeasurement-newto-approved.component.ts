import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { Config } from 'src/app/core/configs/config';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@core/services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-timemeasurement-newto-approved',
  templateUrl: './timemeasurement-newto-approved.component.html',
  styleUrls: ['./timemeasurement-newto-approved.component.css']
})
export class TimemeasurementNewtoApprovedComponent implements OnInit {

  FilterForm: FormGroup;

  OrderTypeList: any[] = [
    { code: 0, description: 'All' },
    { code: 1, description: 'Direct' },
    { code: 2, description: 'Indirect' }];
  TimeCalculatedFromList: any[] = [
    { code: 0, description: 'Offer Creation' },
    { code: 1, description: 'Offer Submission' }];
  HasSPRItemsList: any[] = [
    { code: 0, description: 'All' },
    { code: 1, description: 'Yes' },
    { code: 2, description: 'No' }];
  submitted: boolean = false;
  timemeasurementnewtoapprovedList: any[] = [];
  timemeasurementnewtoapprovedListforReport: any[] = [];
  createdDate: string;
  dateformate: string;
  selectedfinancialyear: number;
  currentmonth: string;
  CurrentFromDate: { year: number; month: number; day: number };
  CurrentToDate: { year: number; month: number; day: number };
  CurrentToMindate: any;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private reportsService: ReportsService,
    private appService: AppService,
    public formatter: NgbDateParserFormatter,
    private authService: AuthService,
    private datePipe: DatePipe
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.onLoad();

    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.dateformate = this.authService.getDateFormat();
  }

  onLoad() {
    this.buildForm();

    var dateFrom = moment().subtract(1, 'months').startOf('month').format('DD/MM/YYYY');
    this.filterForm.currentfrom.setValue(dateFrom);
    this.CurrentFromDate = this.convertDate(dateFrom);

    var dateTo = moment().subtract(1, 'months').endOf('month').format('DD/MM/YYYY');
    this.filterForm.currentto.setValue(dateTo);
    this.CurrentToDate = this.convertDate(dateTo);
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      ordertype: [0, [Validators.required]],
      currentfrom: [null],
      currentto: [null],
      timecalculatedfrom: [0, [Validators.required]],
      hasspr: [0, [Validators.required]]
    });
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

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate: { year: number; month: number; day: number; } = { year: year, month: month, day: day };
    return newdate;
  }

  onOfferTypeChange(event: any) {
    if (!event)
      this.filterForm.ordertype.setValue(0);
  }

  onTimeCalculatedFromChange(event: any) {
    if (!event)
      this.filterForm.timecalculatedfrom.setValue(0);
  }

  onHasSPRChange(event: any) {
    if (!event)
      this.filterForm.hasspr.setValue(0);
  }

  // onFilterChange(event: any) {
  //   if (event) {
  //     // this.selectedfinancialyear = Number(this.filterForm.financialyear.value);
  //     this.getData();
  //   }
  // }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getData();
  }

  getData() {
    let filter = {
      ordertype: this.filterForm.ordertype.value,
      fromdate: this.filterForm.currentfrom.value.split('/').reverse().join('-'),
      todate: this.filterForm.currentto.value.split('/').reverse().join('-'),
      timecalculatedfrom: this.filterForm.timecalculatedfrom.value,
      hasspr: this.filterForm.hasspr.value
    }

    this.reportsService.gettimemeasurementnewtoapproved(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.timemeasurementnewtoapprovedList = response.responsedata.data;

          this.timemeasurementnewtoapprovedList.forEach(element => {
            element.createdon = Config.getDBdatetimeToDateTime(element.createdon);
          });

          this.timemeasurementnewtoapprovedListforReport = [];
          this.timemeasurementnewtoapprovedListforReport = JSON.parse(JSON.stringify(this.timemeasurementnewtoapprovedList));
        } else {
          this.timemeasurementnewtoapprovedList = [];
          this.timemeasurementnewtoapprovedListforReport = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.timemeasurementnewtoapprovedListforReport && this.timemeasurementnewtoapprovedListforReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Time Measurement (New - Approved) - ' + this.createdDate;

    // this.salesgrowthbysegmentListforReport.forEach(element => {
    //   element.gmpreviousyear = (element.gmpreviousyear * 100).toFixed(2);
    //   element.gmcurrentyear = (element.gmcurrentyear * 100).toFixed(2);
    //   element.growthvspy = (element.growthvspy).toFixed(2);
    //   element.contribution = (element.contribution * 100).toFixed(2);
    // });

    // this.timemeasurementRFOCPOtoSOListforReport.push({
    //   segment: 'Grand Total',
    //   revenuepreviousyear: this.rpreviousyear,
    //   revenuecurrentyear: this.rcurrentyear,
    //   growthvspy: (this.growthvspy).toFixed(2),
    //   gmpreviousyear: (this.gmpreviousyear * 100).toFixed(2),
    //   gmcurrentyear: (this.gmcurrentyear * 100).toFixed(2),
    //   contribution: (this.contributionper * 100).toFixed(2)
    // });

    let timemeasurementnewtoapprovedheader = Config.ReportsHeaders.timemeasurementnewtoapproved;
    this.timemeasurementnewtoapprovedListforReport = this.timemeasurementnewtoapprovedListforReport.map(item => {
      return {
        [timemeasurementnewtoapprovedheader[0]]: item.OfferNumber,
        [timemeasurementnewtoapprovedheader[1]]: item.Ordertype,
        [timemeasurementnewtoapprovedheader[2]]: item.offervalue,
        [timemeasurementnewtoapprovedheader[3]]: item.segment,
        [timemeasurementnewtoapprovedheader[4]]: item.vertical,
        [timemeasurementnewtoapprovedheader[5]]: item.region_c,
        [timemeasurementnewtoapprovedheader[6]]: item.industrytypec,
        [timemeasurementnewtoapprovedheader[7]]: item.businessmodel,
        [timemeasurementnewtoapprovedheader[8]]: item.createdon,
        [timemeasurementnewtoapprovedheader[9]]: item.PendingMonth,
        [timemeasurementnewtoapprovedheader[10]]: item.PendingDays,
        [timemeasurementnewtoapprovedheader[11]]: item.PendingTime,
        [timemeasurementnewtoapprovedheader[12]]: item.PendingMinute,
        [timemeasurementnewtoapprovedheader[13]]: item.employee
      };
    });

    this.appService.exportAsExcelFile(this.timemeasurementnewtoapprovedListforReport, fileName);
  }
}