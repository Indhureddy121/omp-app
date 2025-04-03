import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Config } from '@core/configs/config';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';
import { SharedService } from '@core/services/common/shared.service';
import { RatecontractsService } from '@core/services/ratecontracts/ratecontracts.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { PagerService } from 'src/app/core/services/common/pager.service';
@Component({
  selector: 'app-ratecontracts-list',
  templateUrl: './ratecontracts-list.component.html',
  styleUrls: ['./ratecontracts-list.component.css']
})
export class RatecontractsListComponent implements OnInit {

  FilterForm: FormGroup;

  searchModel = Object();
  rcTypeList: any[] = [
    { code: -1, description: 'All Types' },
    { code: 10, description: 'Price' },
    { code: 20, description: 'Quantity' }];
  rcStatusList: any[] = [
    { code: -1, description: 'All Status' },
    { code: 0, description: 'Initial' },
    { code: 20, description: 'Sent for approval' },
    { code: 30, description: 'Rejected' },
    { code: 40, description: 'Approved' },
    { code: 50, description: 'Attached Doc' },
    { code: 70, description: 'In Review' },
    { code: 80, description: 'Completed' },
  ];
  statusList: any[] = [];
  validfromDate: { year: number; month: number; day: number };
  validtoDate: { year: number; month: number; day: number };
  dateFormate: string;
  createdDate: string;
  todayDate: string;
  futureDate: string;
  pastDate: string;
  ValidMaxdate: any;
  todayMinDate: any;
  rateContractList: any[] = [];
  searchValue: string = '';
  userrole: string;
  totalRows: number;
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  pager: any = {};
  pendingOnList: any[] = [];
  userid: any;
  showAddButton: boolean = false;
  isShowMargin: boolean = false;
  isShowRGroupMargin: boolean = false;
  ShowRCStatus: boolean = true;
  userdata: any;
  isOMT: boolean = false;

  constructor(
    private formBuilder: FormBuilder
    , public formatter: NgbDateParserFormatter
    , private authService: AuthService
    , private sharedService: SharedService
    , private router: Router
    , private rateContractsService: RatecontractsService
    , private notificationService: NotificationService
    , private pagerService: PagerService
    , private datePipe: DatePipe
  ) { }

  get filterForm() { return this.FilterForm.controls }

  ngOnInit() {
    this.userid = this.authService.getUserId();
    this.statusList = Config.StatusList;
    this.pendingOnList.push({ code: -1, description: 'All' },
      { code: this.userid, description: 'My List' });
    this.userrole = this.authService.getUserRoleCode();
    this.userdata = this.authService.getCurrentUser();

    if (this.userdata.usertype == 0)
      this.showAddButton = true;

    if (this.userrole == 'OM_Admin' || this.userrole == 'OMT')
      this.isOMT = true;

    if (this.userrole == 'ASM' || this.userrole == 'Dealer Admin' || this.userrole == 'RCCustomer') {
      this.isShowMargin = false;
      this.isShowRGroupMargin = false;
    }
    else {
      this.isShowMargin = true;
      this.isShowRGroupMargin = true;
    }

    this.onbuildForm();
    this.onLoad();
  }

  onbuildForm() {
    this.FilterForm = this.formBuilder.group({
      rctype: [-1],
      rcstatus: [-1],
      Validfrom: [''],
      Validto: [''],
      status: [1],
      pendingon: [this.userid]
    });
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.todayDate = moment().format('DD/MM/YYYY');
    this.futureDate = moment().add(365, 'd').format('DD/MM/YYYY');
    this.pastDate = moment().subtract(30, 'd').format('DD/MM/YYYY');
    this.todayMinDate = this.sharedService.convertDate(this.todayDate);
    this.userdata = this.authService.getCurrentUser();

    if (this.userdata.usercode == 20 || this.userdata.usercode == 30) {
      this.filterForm.rcstatus.setValue(80);
      this.filterForm.pendingon.setValue(-1);
      this.filterForm.status.setValue(-1);
      this.ShowRCStatus = false;
    }

    if (this.userdata.usercode == 0) {
      var screenvalues = this.authService.getScreenValues().RateContracts;
      this.searchValue = screenvalues.searchtext;
      this.searchModel.searchtext = this.searchValue;
      this.filterForm.rctype.setValue(screenvalues.rctype);
      this.filterForm.status.setValue(screenvalues.status);
      this.filterForm.rcstatus.setValue(screenvalues.rcstatus);

      if (screenvalues.from) {
        this.validfromDate = this.sharedService.convertDate(screenvalues.from);
        this.filterForm.Validfrom.setValue(screenvalues.from);
      } else {
        this.validfromDate = this.sharedService.convertDate(this.todayDate);
        this.filterForm.Validfrom.setValue(this.todayDate);
      }

      if (screenvalues.to) {
        this.validtoDate = this.sharedService.convertDate(screenvalues.to);
        this.ValidMaxdate = this.validtoDate;
        this.filterForm.Validto.setValue(screenvalues.to);
      } else {
        this.validtoDate = this.sharedService.convertDate(this.futureDate);
        this.ValidMaxdate = this.validtoDate;
        this.filterForm.Validto.setValue(this.futureDate);
      }

      if (screenvalues.pendingon)
        this.filterForm.pendingon.setValue(screenvalues.pendingon);
      else
        this.filterForm.pendingon.setValue(this.userid);
    } else {
      this.validfromDate = this.sharedService.convertDate(this.todayDate);
      this.filterForm.Validfrom.setValue(this.todayDate);

      this.validtoDate = this.sharedService.convertDate(this.futureDate);
      this.ValidMaxdate = this.validtoDate;
      this.filterForm.Validto.setValue(this.futureDate);
    }

    this.getCount();
  }

  getCount() {
    const validfromdate = this.filterForm.Validfrom.value.split('/').reverse().join('-');
    const validtodate = this.filterForm.Validto.value.split('/').reverse().join('-');

    let filtermodel = { searchValue: this.searchValue }

    this.rateContractsService.getCount(filtermodel, this.filterForm.status.value, this.filterForm.rcstatus.value, validfromdate, validtodate, this.filterForm.rctype.value, this.filterForm.pendingon.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.totalRows = response.responsedata.data[0].count;
          if (this.totalRows > 0)
            this.getData();
          else
            this.rateContractList = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onFilterStatusChange(event: any) {
    if (!event)
      this.filterForm.status.setValue(-1);

    if (this.userdata.usercode == 0)
      this.authService.setScreenValues('RateContracts', 'status', this.filterForm.status.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onFilterTypeChange(event: any) {
    if (!event)
      this.filterForm.rctype.setValue(-1);

    if (this.userdata.usercode == 0)
      this.authService.setScreenValues('RateContracts', 'rctype', this.filterForm.rctype.value);

    this.pageNumber = 1;
    this.getCount();
  }

  headerClick(event) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-ratecontractlist');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  onAddClick() {
    this.router.navigateByUrl('/ratecontracts/add');
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }

    if (this.userdata.usercode == 0)
      this.authService.setScreenValues('RateContracts', 'searchtext', this.searchValue);

    this.pageNumber = 1;
    this.getCount();
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }

    let validfromdate = this.filterForm.Validfrom.value.split('/').reverse().join('-');
    let validtodate = this.filterForm.Validto.value.split('/').reverse().join('-');

    this.rateContractsService.getRateContractsList(filtermodel, this.filterForm.status.value, this.filterForm.rcstatus.value, validfromdate, validtodate, this.filterForm.rctype.value, this.filterForm.pendingon.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.rateContractList = response.responsedata.data;
          this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData();
  }

  onValidFromDateSelection(date) {
    let validFromdate = new Date(date.year, date.month - 1, date.day).toString();
    validFromdate = this.datePipe.transform(validFromdate, this.dateFormate);

    if (this.userdata.usercode == 0)
      this.authService.setScreenValues('RateContracts', 'from', validFromdate);

    this.filterForm.Validfrom.setValue(validFromdate);

    this.pageNumber = 1;
    this.getCount();
  }

  onValidToDateSelection(date) {
    this.ValidMaxdate = date;
    let validTodate = new Date(date.year, date.month - 1, date.day).toString();
    validTodate = this.datePipe.transform(validTodate, this.dateFormate);

    if (this.userdata.usercode == 0)
      this.authService.setScreenValues('RateContracts', 'to', validTodate);

    this.filterForm.Validto.setValue(validTodate);

    if (new Date(this.filterForm.Validfrom.value.split('/').reverse().join('/')) > new Date(this.filterForm.Validto.value.split('/').reverse().join('/'))) {
      this.validfromDate = this.sharedService.convertDate(validTodate);

      if (this.userdata.usercode == 0)
        this.authService.setScreenValues('RateContracts', 'from', validTodate);

      this.filterForm.Validfrom.setValue(validTodate);
    }
    this.pageNumber = 1;
    this.getCount();
  }

  onFilterDetailStatusChange(event: any) {
    if (!event)
      this.filterForm.rcstatus.setValue(-1);

    if (this.userdata.usercode == 0)
      this.authService.setScreenValues('RateContracts', 'rcstatus', this.filterForm.rcstatus.value);

    this.pageNumber = 1;
    this.getCount();
  }

  viewClicked(id) {
    this.router.navigate(['/ratecontracts/view', id]);
  }

  editClicked(id) {
    this.router.navigate(['/ratecontracts/edit', id]);
  }

  onRowDoubleClick(id) {
    this.router.navigate(['/ratecontracts/view', id]);
  }

  onPendingOnChange(event: any) {
    if (!event)
      this.filterForm.pendingon.setValue(this.userid);

    if (this.userdata.usercode == 0)
      this.authService.setScreenValues('RateContracts', 'pendingon', this.filterForm.pendingon.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onCreateOrderClick(rcId: number) {
    this.router.navigate(['/rcorders/add', rcId]);
  }

  onMakeaCloneClick(rcId: number) {
    this.router.navigate(['/ratecontracts/add/refrencecontract', rcId]);
  }
}
