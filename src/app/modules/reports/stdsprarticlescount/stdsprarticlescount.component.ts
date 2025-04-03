import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as moment from 'moment';
import { AuthService } from '@core/services/auth/auth.service';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { ReportsService } from '@core/services/reports/reports.service';
import { NotificationService } from '@core/services/common/notification.service';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-stdsprarticlescount',
  templateUrl: './stdsprarticlescount.component.html',
  styleUrls: ['./stdsprarticlescount.component.css']
})
export class StdsprarticlescountComponent implements OnInit {

  FilterForm: FormGroup;
  FromDate: { year: number; month: number; day: number };
  ToMindate: any;
  ToDate: { year: number; month: number; day: number };
  dateformate: string;
  createdDate:string;
  submitted: boolean = false;
  stdsprarticlescountdataList:any[] = [];

  constructor(private formBuilder: FormBuilder,
              private datePipe: DatePipe,
              private authService: AuthService,
              public formatter: NgbDateParserFormatter,
              private reportsService: ReportsService,
              private notificationService: NotificationService,
              private appService:AppService) { }

  get filterForm() { return this.FilterForm.controls; }
  
  ngOnInit() {
    this.onLoad();
    this.dateformate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  onLoad(){
    this.buildForm();

    let _fromdate = '01/10/' + (Number(moment().format('YYYY')) - 1);
    this.filterForm.fromdate.setValue(_fromdate);
    this.FromDate = this.convertDate(_fromdate);
    this.ToMindate = this.FromDate;

    let _todate = moment().format('DD/MM/YYYY');
    this.filterForm.todate.setValue(_todate);
    this.ToDate = this.convertDate(_todate);
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      fromdate: [null, [Validators.required]],
      todate: [null, [Validators.required]]
    });
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate: { year: number; month: number; day: number; } = { year: year, month: month, day: day };
    return newdate;
  }

  OnFromDateSelection(date) {
    let fromdate = new Date(date.year, date.month - 1, date.day).toString();
    fromdate = this.datePipe.transform(fromdate, this.dateformate);

    this.filterForm.fromdate.setValue(fromdate);
    this.FromDate = this.convertDate(this.filterForm.fromdate.value);
    this.ToMindate = this.FromDate;

    if (this.filterForm.toDate.value && new Date(this.filterForm.todate.value.split('/').reverse().join('-')) > new Date(this.filterForm.todate.value.split('/').reverse().join('-'))) {
      this.ToDate = this.convertDate(fromdate);
      this.filterForm.todate.setValue(fromdate);
    }
  }

  OnToDateSelection(date) {
    let todate = new Date(date.year, date.month - 1, date.day).toString();
    todate = this.datePipe.transform(todate, this.dateformate);
    this.filterForm.todate.setValue(todate);
    this.ToDate = this.convertDate(this.filterForm.todate.value);
  }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getData();
    // this.getYearDescription();
  }

  getData() {
    let filter = {
      fromdate: this.filterForm.fromdate.value.split('/').reverse().join('-'),
      todate: this.filterForm.todate.value.split('/').reverse().join('-'),
      }

    this.reportsService.getstdsprarticlescountdata(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.stdsprarticlescountdataList = response.responsedata.data;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      }); 
  }

  onExport() {
    if (this.stdsprarticlescountdataList && this.stdsprarticlescountdataList.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'STD SPR Articles Count Report - ' + this.createdDate;

    this.appService.exportAsExcelFile(this.stdsprarticlescountdataList, fileName);
  }
}

