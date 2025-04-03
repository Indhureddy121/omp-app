import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { Config } from 'src/app/core/configs/config';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-timemeasurement-rfocpoto-so',
  templateUrl: './timemeasurement-rfocpoto-so.component.html',
  styleUrls: ['./timemeasurement-rfocpoto-so.component.css']
})
export class TimemeasurementRFOCPOtoSOComponent implements OnInit {

  FilterForm: FormGroup;

  OrderTypeList: any[] = [
    { code: 0, description: 'All' },
    { code: 1, description: 'Direct' },
    { code: 2, description: 'Indirect' }];
  submitted: boolean = false;
  timemeasurementRFOCPOtoSOList: any[] = [];
  timemeasurementRFOCPOtoSOListforReport: any[] = [];
  createdDate: string;
  selectedordertype: number;
  currentmonth: string;
  dateformate: string;
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
    // this.currentmonth = Config.monthName[new Date().getMonth()];
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
      currentto: [null]
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

  // onFilterChange(event: any) {
  //   if (event) {
  //     this.selectedordertype = Number(this.filterForm.ordertype.value);
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
      todate: this.filterForm.currentto.value.split('/').reverse().join('-')
    }

    this.reportsService.gettimemeasurementRFOCPOtoSO(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.timemeasurementRFOCPOtoSOList = response.responsedata.data;

          this.timemeasurementRFOCPOtoSOList.forEach(element => {
            element.socreatedon = Config.getDBdatetimeToDateTime(element.socreatedon);
            element.soinitiatedate = Config.getDBdatetimeToDateTime(element.soinitiatedate);
            element.OmTeamSubmittedOn = Config.getDBdatetimeToDateTime(element.OmTeamSubmittedOn);
          });

          this.timemeasurementRFOCPOtoSOListforReport = [];
          this.timemeasurementRFOCPOtoSOListforReport = JSON.parse(JSON.stringify(this.timemeasurementRFOCPOtoSOList));
        } else {
          this.timemeasurementRFOCPOtoSOList = [];
          this.timemeasurementRFOCPOtoSOListforReport = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.timemeasurementRFOCPOtoSOListforReport && this.timemeasurementRFOCPOtoSOListforReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Time measurement (RFO/CPO to Sales Order Creation) - ' + this.createdDate;

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

    let timemeasurementRFOCPOtoSOheader = Config.ReportsHeaders.timemeasurementRFOCPOtoSO;
    this.timemeasurementRFOCPOtoSOListforReport = this.timemeasurementRFOCPOtoSOListforReport.map(item => {
      return {
        [timemeasurementRFOCPOtoSOheader[0]]: item.OfferNo,
        [timemeasurementRFOCPOtoSOheader[1]]: item.OrderType,
        [timemeasurementRFOCPOtoSOheader[2]]: item.ArticleType,
        [timemeasurementRFOCPOtoSOheader[3]]: item.OfferValue,
        [timemeasurementRFOCPOtoSOheader[4]]: item.Segment,
        [timemeasurementRFOCPOtoSOheader[5]]: item.Vertical,
        [timemeasurementRFOCPOtoSOheader[6]]: item.offercreatedon,
        [timemeasurementRFOCPOtoSOheader[7]]: item.soinitiatedate,
        [timemeasurementRFOCPOtoSOheader[8]]: item.OmTeamSubmittedOn,
        [timemeasurementRFOCPOtoSOheader[9]]: item.socreatedon,
        [timemeasurementRFOCPOtoSOheader[10]]: item.PendingMonth,
        [timemeasurementRFOCPOtoSOheader[11]]: item.PendingDays,
        [timemeasurementRFOCPOtoSOheader[12]]: item.PendingTime,
        [timemeasurementRFOCPOtoSOheader[13]]: item.PendingMinute,
        [timemeasurementRFOCPOtoSOheader[14]]: item.Employee,
        [timemeasurementRFOCPOtoSOheader[15]]: item.DistributionChannel,
        [timemeasurementRFOCPOtoSOheader[16]]: item.Meansoftransportation,
        [timemeasurementRFOCPOtoSOheader[17]]: item.orderdoctype,
        [timemeasurementRFOCPOtoSOheader[18]]: item.SONO,
        [timemeasurementRFOCPOtoSOheader[19]]: item.ArticleNo,
        [timemeasurementRFOCPOtoSOheader[20]]: item.Quantity,
        [timemeasurementRFOCPOtoSOheader[21]]: item.FactorLength,
        [timemeasurementRFOCPOtoSOheader[22]]: item.CustomerPONo,
        [timemeasurementRFOCPOtoSOheader[23]]: item.UnderDlvToletance,
        [timemeasurementRFOCPOtoSOheader[24]]: item.OverDlvTolerance,
        [timemeasurementRFOCPOtoSOheader[25]]: item.Laboratorytext,
        [timemeasurementRFOCPOtoSOheader[26]]: item.Industrystdtext
      };
    });

    this.appService.exportAsExcelFile(this.timemeasurementRFOCPOtoSOListforReport, fileName);
  }
}