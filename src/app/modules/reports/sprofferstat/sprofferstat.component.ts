import { Component, OnInit } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as FileSaver from 'file-saver';
import { environment } from 'src/environments/environment';
import { Config } from 'src/app/core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-sprofferstat',
  templateUrl: './sprofferstat.component.html',
  styleUrls: ['./sprofferstat.component.css']
})
export class SprofferstatComponent implements OnInit {

  FilterForm: FormGroup;

  FinancialYearsList: any[] = [
    { code: '2020', description: 'Sep-19 : Aug-20' },
    { code: '2019', description: 'Sep-18 : Aug-19' }
  ];
  sprofferstatList: any[] = [];
  createdDate: string;
  selectedfinancialyear: number;
  currentmonth: string;

  constructor(
    private formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private appService: AppService,
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.buildForm();
    this.getData();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.currentmonth = Config.monthName[new Date().getMonth()];
    this.selectedfinancialyear = Number(this.filterForm.financialyear.value);

  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      financialyear: ['2020']
    });
  }

  onFilterChange(event: any) {
    if (event) {
      this.selectedfinancialyear = Number(this.filterForm.financialyear.value);
      this.getData();
    }
  }

  getData() {
    this.reportsService.getsprofferstat(this.filterForm.financialyear.value).subscribe(
      response => {
        if (response && response.data) {
          this.sprofferstatList = response.data;

          //  else {
          //   let _tempfilename = response.data.filename.split('\\').pop();
          //   let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/reports/' + _tempfilename;
          //   FileSaver.saveAs(url, _tempfilename);
          // }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    let fileName = 'Sales Growth by PH - ' + this.createdDate;
    this.appService.exportAsExcelFile(this.sprofferstatList, fileName);
  }
}