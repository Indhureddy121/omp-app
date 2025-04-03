import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from '@core/services/common/notification.service';
import { ReportsService } from '@core/services/reports/reports.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { AppService } from 'src/app/app.service';
import { Config } from "src/app/core/configs/config";

@Component({
  selector: 'app-tat-report',
  templateUrl: './tat-report.component.html',
  styleUrls: ['./tat-report.component.scss']
})
export class TatReportComponent implements OnInit {

  FilterForm: FormGroup;

  // UserEmail: string = '';
  dateformate: string;
  createdDate: string;
  tatReportList: any[] = [];
  tatcorereport: any[] = [];
  FromDate: { year: number; month: number; day: number };
  ToDate: { year: number; month: number; day: number };
  ToMindate: any;
  ToMaxdate: any;
  submitted: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private reportsService: ReportsService,
    private appService: AppService,
    public formatter: NgbDateParserFormatter,
    private datePipe: DatePipe
  ) { }

  // get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.onLoad();

    // this.dateformate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    // // this.UserEmail = this.authService.getCurrentUser().emailid;
    // this.FromDate = this.convertDate(moment(new Date(), "DD/MM/YYYY").startOf('month').format('DD/MM/YYYY'));
    // this.ToDate = this.convertDate(moment(new Date(), "DD/MM/YYYY").endOf('month').format('DD/MM/YYYY'));
    // this.ToMindate = this.FromDate;
    // this.ToMaxdate = this.ToDate;

    // this.filterForm.currentfrom.setValue(moment(new Date(), "DD/MM/YYYY").endOf('month').format('DD/MM/YYYY'));
    // this.filterForm.currentto.setValue(moment(new Date(), "DD/MM/YYYY").endOf('month').format('DD/MM/YYYY'));
  }

  onLoad() {
    // this.buildForm();
    this.getData();
  }

  // buildForm() {
  //   this.FilterForm = this.formBuilder.group({
  //     searchtext: [null, [Validators.required]],
  //     currentfrom: [null, [Validators.required]],
  //     currentto: [null, [Validators.required]]
  //   });
  // }

  // OnCurrentFromDateSelection(date: any) {
  //   let currentfromdate = new Date(date.year, date.month - 1, date.day).toString();
  //   currentfromdate = this.datePipe.transform(currentfromdate, this.dateformate);

  //   this.filterForm.currentfrom.setValue(currentfromdate);
  //   this.FromDate = this.convertDate(this.filterForm.currentfrom.value);
  //   this.ToMindate = this.FromDate;

  //   let maxdate = moment(currentfromdate, "DD/MM/YYYY").endOf('month').format('DD/MM/YYYY');
  //   this.ToMaxdate = this.convertDate(maxdate);

  //   // && new Date(this.filterForm.currentfrom.value.split('/').reverse().join('-')) > new Date(this.filterForm.currentto.value.split('/').reverse().join('-'))
  //   if (this.filterForm.currentto.value) {
  //     this.ToDate = null;
  //     this.filterForm.currentto.setValue(null);
  //   }
  // }

  // OnCurrentToDateSelection(date: any) {
  //   let currenttodate = new Date(date.year, date.month - 1, date.day).toString();
  //   currenttodate = this.datePipe.transform(currenttodate, this.dateformate);
  //   this.filterForm.currentto.setValue(currenttodate);
  //   this.ToDate = this.convertDate(this.filterForm.currentto.value);
  // }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate: { year: number; month: number; day: number; } = { year: year, month: month, day: day };
    return newdate;
  }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getData();
  }

  getData() {
    // let filter = {
    //   filtertext: this.filterForm.searchtext.value,
    //   fromdate: this.filterForm.currentfrom.value.split('/').reverse().join('-') + 'T00:00:00',
    //   todate: this.filterForm.currentto.value.split('/').reverse().join('-') + 'T00:00:00'
    // }
    let filter = {};
    this.reportsService.gettatreportdata(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {

          // this.tatReportList = Config.fn_Arr_trim(response.responsedata.data);
          this.tatReportList = response.responsedata.data;


          this.tatcorereport = JSON.parse(JSON.stringify(this.tatReportList));
        } else {
          this.tatReportList = [];
          this.tatcorereport = [];
          this.notificationService.showInfo('There is no data.');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.tatcorereport && this.tatcorereport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'TAT Report - ' + this.createdDate;

    let tatreportcorecardheader = Config.ReportsHeaders.tatReportList;
    this.tatcorereport = this.tatcorereport.map(item => {
      return {
        [tatreportcorecardheader[0]]: item.SFDcOppID,
        [tatreportcorecardheader[1]]: this.datePipe.transform(item.Oppscreateddate, 'dd-MM-yyyy'),
        [tatreportcorecardheader[2]]: this.datePipe.transform(item.Offercreateddate, 'dd-MM-yyyy'),
        [tatreportcorecardheader[3]]: item.OfferNumer,
        [tatreportcorecardheader[4]]: item.OMPtype,
        [tatreportcorecardheader[5]]: this.datePipe.transform(item.SubmittedtoPEforoffer, 'dd-MM-yyyy'),
        [tatreportcorecardheader[6]]: this.datePipe.transform(item.PEactioncompletetiondate, 'dd-MM-yyyy'),
        [tatreportcorecardheader[7]]: this.datePipe.transform(item.Quotationcreateddate, 'dd-MM-yyyy'),
        [tatreportcorecardheader[8]]: this.datePipe.transform(item.Purchaseorderdate, 'dd-MM-yyyy'),
        [tatreportcorecardheader[9]]: this.datePipe.transform(item.SOcreationdate, 'dd-MM-yyyy'),
        [tatreportcorecardheader[10]]: item.Partnumber,
        [tatreportcorecardheader[11]]: item.SOnumer,
        [tatreportcorecardheader[12]]: item.TGM,
        [tatreportcorecardheader[13]]: item.RGM,
        [tatreportcorecardheader[14]]: item.GM,
        [tatreportcorecardheader[15]]: item.SOValue,
        [tatreportcorecardheader[16]]: item.salesemployeename,
        [tatreportcorecardheader[17]]: item.PEName,
        [tatreportcorecardheader[18]]: item.SCMname
      };
    });

    this.appService.exportAsExcelFile(this.tatcorereport, fileName);
  }
}
