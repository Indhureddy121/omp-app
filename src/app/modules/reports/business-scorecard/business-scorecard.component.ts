import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { Config } from 'src/app/core/configs/config';
import { AuthService } from '@core/services/auth/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-business-scorecard',
  templateUrl: './business-scorecard.component.html',
  styleUrls: ['./business-scorecard.component.css']
})
export class BusinessScorecardComponent implements OnInit {

  FilterForm: FormGroup;

  UserEmail: string = '';
  dateformate: string;
  createdDate: string;
  businessscorecard: any[] = [];
  businessscorecardreport: any[] = [];
  FromDate: { year: number; month: number; day: number };
  ToDate: { year: number; month: number; day: number };
  ToMindate: any;
  ToMaxdate: any;
  submitted: boolean = false;

  constructor(
    private notificationService: NotificationService,
    private reportsService: ReportsService,
    private appService: AppService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.onLoad();

    this.dateformate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.UserEmail = this.authService.getCurrentUser().emailid;
    this.FromDate = this.convertDate(moment(new Date(), "DD/MM/YYYY").startOf('month').format('DD/MM/YYYY'));
    this.ToDate = this.convertDate(moment(new Date(), "DD/MM/YYYY").endOf('month').format('DD/MM/YYYY'));
    this.ToMindate = this.FromDate;
    this.ToMaxdate = this.ToDate;

    this.filterForm.currentfrom.setValue(moment(new Date(), "DD/MM/YYYY").endOf('month').format('DD/MM/YYYY'));
    this.filterForm.currentto.setValue(moment(new Date(), "DD/MM/YYYY").endOf('month').format('DD/MM/YYYY'));
  }

  onLoad() {
    this.buildForm();
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      // dealer: [null, [Validators.required]],
      currentfrom: [null, [Validators.required]],
      currentto: [null, [Validators.required]]
    });
  }

  OnCurrentFromDateSelection(date: any) {
    let currentfromdate = new Date(date.year, date.month - 1, date.day).toString();
    currentfromdate = this.datePipe.transform(currentfromdate, this.dateformate);

    this.filterForm.currentfrom.setValue(currentfromdate);
    this.FromDate = this.convertDate(this.filterForm.currentfrom.value);
    this.ToMindate = this.FromDate;

    let maxdate = moment(currentfromdate, "DD/MM/YYYY").endOf('month').format('DD/MM/YYYY');
    this.ToMaxdate = this.convertDate(maxdate);

    // && new Date(this.filterForm.currentfrom.value.split('/').reverse().join('-')) > new Date(this.filterForm.currentto.value.split('/').reverse().join('-'))
    if (this.filterForm.currentto.value) {
      this.ToDate = null;
      this.filterForm.currentto.setValue(null);
    }
  }

  OnCurrentToDateSelection(date: any) {
    let currenttodate = new Date(date.year, date.month - 1, date.day).toString();
    currenttodate = this.datePipe.transform(currenttodate, this.dateformate);
    this.filterForm.currentto.setValue(currenttodate);
    this.ToDate = this.convertDate(this.filterForm.currentto.value);
  }

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
    let filter = {
      useremail: this.UserEmail,
      fromdate: this.filterForm.currentfrom.value.split('/').reverse().join('-') + 'T00:00:00',
      todate: this.filterForm.currentto.value.split('/').reverse().join('-') + 'T00:00:00'
    }
    this.reportsService.getbusinessscorecard(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {

          this.businessscorecard = Config.fn_Arr_trim(response.responsedata.data);
          this.businessscorecard.forEach(element => {
            element.Oct = Number(element.Oct).toFixed(2);
            element.Nov = Number(element.Nov).toFixed(2);
            element.Dec = Number(element.Dec).toFixed(2);
            element.Jan = Number(element.Jan).toFixed(2);
            element.Feb = Number(element.Feb).toFixed(2);
            element.Mar = Number(element.Mar).toFixed(2);
            element.Apr = Number(element.Apr).toFixed(2);
            element.May = Number(element.May).toFixed(2);
            element.Jun = Number(element.Jun).toFixed(2);
            element.Jul = Number(element.Jul).toFixed(2);
            element.Aug = Number(element.Aug).toFixed(2);
            element.Sep = Number(element.Sep).toFixed(2);
            element.Ordtot = Number(element.Ordtot).toFixed(2);
          });

          this.businessscorecardreport = JSON.parse(JSON.stringify(this.businessscorecard));
        } else {
          this.businessscorecard = [];
          this.businessscorecardreport = [];
          this.notificationService.showInfo('There is no data.');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.businessscorecardreport && this.businessscorecardreport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Business Score card Report - ' + this.createdDate;

    let businessscorecardheader = Config.ReportsHeaders.businessscorecard;
    this.businessscorecardreport = this.businessscorecardreport.map(item => {
      return {
        [businessscorecardheader[0]]: item.Pernr,
        [businessscorecardheader[1]]: item.Ename,
        [businessscorecardheader[2]]: item.Desc,
        [businessscorecardheader[3]]: +item.Oct,
        [businessscorecardheader[4]]: +item.Nov,
        [businessscorecardheader[5]]: +item.Dec,
        [businessscorecardheader[6]]: +item.Jan,
        [businessscorecardheader[7]]: +item.Feb,
        [businessscorecardheader[8]]: +item.Mar,
        [businessscorecardheader[9]]: +item.Apr,
        [businessscorecardheader[10]]: +item.May,
        [businessscorecardheader[11]]: +item.Jun,
        [businessscorecardheader[12]]: +item.Jul,
        [businessscorecardheader[13]]: +item.Aug,
        [businessscorecardheader[14]]: +item.Sep,
        [businessscorecardheader[15]]: +item.Ordtot,
        [businessscorecardheader[16]]: item.Zomplogin
      };
    });

    this.appService.exportAsExcelFile(this.businessscorecardreport, fileName);
  }
}