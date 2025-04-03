import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportsService } from '@core/services/reports/reports.service';
import * as moment from 'moment';
import { AppService } from 'src/app/app.service';
import { AuthService } from '@core/services/auth/auth.service';
import { Config } from '@core/configs/config';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-closedopportunityanalysis',
  templateUrl: './closedopportunityanalysis.component.html',
  styleUrls: ['./closedopportunityanalysis.component.css']
})
export class ClosedopportunityanalysisComponent implements OnInit {

  FilterForm: FormGroup;

  submitted: boolean = false;
  closedopportunityList: any[] = [];
  closedopportunityListforReport: any[] = [];
  createdDate: string;
  // selectedfinancialyear: number;
  dateformate: string;
  // selectedItemType: string;
  CurrentFromDate: { year: number; month: number; day: number };
  CurrentToDate: { year: number; month: number; day: number };
  CurrentToMindate: any;

  constructor(
    private formBuilder: FormBuilder,
    private notificationService: NotificationService,
    private reportsService: ReportsService,
    private appService: AppService,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter,
    private datePipe: DatePipe
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.onLoad();
    // this.selectedItemType = 'All';
    // this.buildForm();
    // this.getData();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.dateformate = this.authService.getDateFormat();
    // this.selectedfinancialyear = Number(this.filterForm.itemType.value);

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
      // financialyear: ['2020']
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
  //   if (event)
  //     this.selectedItemType = event.code;
  //   else
  //     this.selectedItemType = 'All';

  //   // this.filterForm.itemType.setValue(this.selectedItemType);
  //   this.getData();
  // }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getData();
  }

  getData() {
    let filter = {
      fromdate: this.filterForm.currentfrom.value.split('/').reverse().join('-'),
      todate: this.filterForm.currentto.value.split('/').reverse().join('-')
    }

    this.reportsService.getclosedopportunityanalysis(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.closedopportunityList = response.responsedata.data;

          this.closedopportunityListforReport = [];
          this.closedopportunityListforReport = JSON.parse(JSON.stringify(this.closedopportunityList));
        } else {
          this.closedopportunityList = [];
          this.closedopportunityListforReport = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.closedopportunityListforReport && this.closedopportunityListforReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Closed Opportunity Analysis - ' + this.createdDate;

    let closedopportunityheader = Config.ReportsHeaders.closedopportunity;
    this.closedopportunityListforReport = this.closedopportunityListforReport.map(item => {
      return {
        [closedopportunityheader[0]]: item.vertical,
        [closedopportunityheader[1]]: item.segment,
        [closedopportunityheader[2]]: item.opportunityowner,
        [closedopportunityheader[3]]: item.lappopportunityid,
        [closedopportunityheader[4]]: item.opportunity_name,
        [closedopportunityheader[5]]: item.customername,
        [closedopportunityheader[6]]: item.offervalue
      };
    });

    this.appService.exportAsExcelFile(this.closedopportunityListforReport, fileName);
  }
}