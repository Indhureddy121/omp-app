import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { Config } from 'src/app/core/configs/config';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-productwiseenquirytrendyoy',
  templateUrl: './productwiseenquirytrendyoy.component.html',
  styleUrls: ['./productwiseenquirytrendyoy.component.css']
})
export class ProductwiseenquirytrendyoyComponent implements OnInit {

  FilterForm: FormGroup;

  FinancialYearsList: any[] = [
    { code: '2021', description: 'Sep-20 : Aug-21' },
    { code: '2020', description: 'Sep-19 : Aug-20' },
    { code: '2019', description: 'Sep-18 : Aug-19' }];
  ItemTypeList: any[] = [
    { code: 'All', description: 'All' },
    { code: 'STD', description: 'MFG' },
    { code: 'TRD', description: 'TRD' },
    { code: 'SPR', description: 'SPR' }];
  submitted: boolean = false;
  dateformate: string;
  productwiseenquirytrendyoyList: any[] = [];
  productwiseenquirytrendyoyListforReport: any[] = [];
  createdDate: string;
  selectedfinancialyear: number;
  currentmonth: string;
  previousyeardesc: string = '';
  currentyeardesc: string = '';
  P_noofarticles: number = 0;
  P_qty: number = 0;
  P_offervalue: number = 0;
  C_noofarticles: number = 0;
  C_qty: number = 0;
  C_offervalue: number = 0;
  Growth: number = 0;
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
    public formatter: NgbDateParserFormatter,
    private datePipe: DatePipe,
    private authService: AuthService
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.buildForm();
    // this.getData();
    this.dateformate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    // this.currentmonth = Config.monthName[new Date().getMonth()];

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
    // this.selectedfinancialyear = Number(this.filterForm.financialyear.value);
    // this.getYearDescription();
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      itemtype: ['All', [Validators.required]],
      previousfrom: [null, [Validators.required]],
      previousto: [null, [Validators.required]],
      currentfrom: [null, [Validators.required]],
      currentto: [null, [Validators.required]]
      // financialyear: ['2021'],
    });
  }

  // onFilterChange(event: any) {
  //   if (event) {
  //     // this.selectedfinancialyear = Number(this.filterForm.financialyear.value);
  //     this.getData();
  //     // this.getYearDescription();
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

  // getYearDescription() {
  //   if (this.FinancialYearsList.find(x => x.code == this.selectedfinancialyear - 1))
  //     this.previousyeardesc = this.FinancialYearsList.find(x => x.code == this.selectedfinancialyear - 1).description;
  //   else
  //     this.previousyeardesc = '';
  //   this.currentyeardesc = this.FinancialYearsList.find(x => x.code == this.selectedfinancialyear).description;
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
      articletype: this.filterForm.itemtype.value,
      previousfrom: this.filterForm.previousfrom.value.split('/').reverse().join('-'),
      previousto: this.filterForm.previousto.value.split('/').reverse().join('-'),
      currentfrom: this.filterForm.currentfrom.value.split('/').reverse().join('-'),
      currentto: this.filterForm.currentto.value.split('/').reverse().join('-')
    }

    this.reportsService.getproductwiseenquirytrendyoydata(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.productwiseenquirytrendyoyList = response.responsedata.data;

          this.P_noofarticles = 0;
          this.P_qty = 0;
          this.P_offervalue = 0;
          this.C_noofarticles = 0;
          this.C_qty = 0;
          this.C_offervalue = 0;
          this.Growth = 0;
          this.productwiseenquirytrendyoyList.forEach(element => {
            this.P_noofarticles += element.p_noofarticles;
            this.P_qty += element.p_qty;
            this.P_offervalue += element.p_offervalue;
            this.C_noofarticles += element.c_noofarticles;
            this.C_qty += element.c_qty;
            this.C_offervalue += element.c_offervalue;
          });

          this.C_offervalue = Number(this.C_offervalue.toFixed(2));
          this.Growth = this.P_offervalue == 0 ? 1 : (this.C_offervalue - this.P_offervalue) / this.P_offervalue;

          this.productwiseenquirytrendyoyListforReport = [];
          this.productwiseenquirytrendyoyListforReport = JSON.parse(JSON.stringify(this.productwiseenquirytrendyoyList));
        } else {
          this.productwiseenquirytrendyoyList = [];
          this.productwiseenquirytrendyoyListforReport = [];
          this.P_noofarticles = 0;
          this.P_qty = 0;
          this.P_offervalue = 0;
          this.C_noofarticles = 0;
          this.C_qty = 0;
          this.C_offervalue = 0;
          this.Growth = 0;
        }

        this.submitted = false;
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.productwiseenquirytrendyoyListforReport && this.productwiseenquirytrendyoyListforReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Product Wise Enquiry Trend YOY - ' + this.createdDate;

    this.productwiseenquirytrendyoyListforReport.forEach(element => {
      element.growth = Number((element.growth * 100).toFixed(2));
    });

    this.productwiseenquirytrendyoyListforReport.push({
      industry_std_text: 'Total',
      p_noofarticles: this.P_noofarticles,
      p_qty: this.P_qty,
      p_offervalue: this.P_offervalue,
      c_noofarticles: this.C_noofarticles,
      c_qty: this.C_qty,
      c_offervalue: this.C_offervalue,
      growth: Number((this.Growth * 100).toFixed(2))
    });

    let header = Config.ReportsHeaders.productwiseenquirytrendyoy;
    this.productwiseenquirytrendyoyListforReport = this.productwiseenquirytrendyoyListforReport.map(item => {
      return {
        [header[0]]: item.industry_std_text,
        [header[1]]: item.p_noofarticles,
        [header[2]]: item.p_qty,
        [header[3]]: item.p_offervalue,
        [header[4]]: item.c_noofarticles,
        [header[5]]: item.c_qty,
        [header[6]]: item.c_offervalue,
        [header[7]]: item.growth
      };
    });

    this.appService.exportAsExcelFile(this.productwiseenquirytrendyoyListforReport, fileName);
  }
}
