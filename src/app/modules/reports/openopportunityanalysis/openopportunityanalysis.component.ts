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
  selector: 'app-openopportunityanalysis',
  templateUrl: './openopportunityanalysis.component.html',
  styleUrls: ['./openopportunityanalysis.component.css']
})
export class OpenopportunityanalysisComponent implements OnInit {

  FilterForm: FormGroup;

  itemTypeList: any[] = [
    { code: 'All', description: 'All' },
    { code: 'STD', description: 'MFG' },
    { code: 'TRD', description: 'TRD' },
    { code: 'SPR', description: 'SPR' }];
  submitted: boolean = false;
  openopportunityList: any[] = [];
  openopportunityListforReport: any[] = [];
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
      itemType: ['All', [Validators.required]],
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
      itemtype: this.filterForm.itemType.value,
      fromdate: this.filterForm.currentfrom.value.split('/').reverse().join('-'),
      todate: this.filterForm.currentto.value.split('/').reverse().join('-')
    }

    this.reportsService.getopenopportunityanalysis(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.openopportunityList = response.responsedata.data;

          this.openopportunityListforReport = [];
          this.openopportunityListforReport = JSON.parse(JSON.stringify(this.openopportunityList));
        } else {
          this.openopportunityList = [];
          this.openopportunityListforReport = [];
        }

        this.submitted = false;
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.openopportunityListforReport && this.openopportunityListforReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Open Opportunity Analysis - ' + this.createdDate;

    this.openopportunityListforReport.forEach(element => {
      element.TotalGrossMargin = Number((element.TotalGrossMargin * 100).toFixed(2));
      element.TotalTargetGrossMargin = Number((element.TotalTargetGrossMargin * 100).toFixed(2));
    });

    let openopportunityheader = Config.ReportsHeaders.openopportunity;
    this.openopportunityListforReport = this.openopportunityListforReport.map(item => {
      return {
        [openopportunityheader[0]]: item.vertical,
        [openopportunityheader[1]]: item.segment,
        [openopportunityheader[2]]: item.opportunityowner,
        [openopportunityheader[3]]: item.lappopportunityid,
        [openopportunityheader[4]]: item.opportunity_name,
        [openopportunityheader[5]]: item.nacecode,
        [openopportunityheader[6]]: item.businessmodel,
        [openopportunityheader[7]]: item.customername,
        [openopportunityheader[6]]: item.winningprobabilityper,
        [openopportunityheader[7]]: item.businessnature,
        [openopportunityheader[8]]: item.stage,
        [openopportunityheader[9]]: item.expirydate,
        [openopportunityheader[10]]: item.nooflines,
        [openopportunityheader[11]]: item.daystomakeoffer,
        [openopportunityheader[12]]: item.ageofoppfromoffereddate,
        [openopportunityheader[13]]: item.age,
        [openopportunityheader[14]]: item.opportunity_id,
        [openopportunityheader[15]]: item.opportunity_value,
        [openopportunityheader[16]]: item.offervalue,
        [openopportunityheader[17]]: item.TotalGrossMargin,
        [openopportunityheader[18]]: item.TotalTargetGrossMargin
      };
    });

    this.appService.exportAsExcelFile(this.openopportunityListforReport, fileName);
  }
}