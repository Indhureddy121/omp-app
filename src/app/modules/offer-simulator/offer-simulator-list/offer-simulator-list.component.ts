import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { OffersService } from 'src/app/core/services/offers/offers.service';
import { OffersimulatorService } from 'src/app/core/services/offersimulator/offersimulator.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { OfferStatusEnum } from 'src/app/core/enums/offerstatus.enum';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Config } from '@core/configs/config';
import * as moment from 'moment';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-offer-simulator-list',
  templateUrl: './offer-simulator-list.component.html',
  styleUrls: ['./offer-simulator-list.component.css']
})
export class OfferSimulatorListComponent implements OnInit {

  FilterForm: FormGroup;
  AssigneeForm: FormGroup;

  offerslist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateFormate: string;
  userid: number;
  userrole: string;
  isShowMargin: boolean = false;
  isShowRGroupMargin: boolean = false;
  createdDate: any;
  searchModel = Object();
  dateformate: string;
  ValidMindate: any;
  ValidMaxdate: any;
  todayDate: any;
  futureDate: any;
  pastDate: any;
  todayMinDate: { year: number; month: number; day: number };
  validfromDate: { year: number; month: number; day: number };
  validtoDate: { year: number; month: number; day: number };
  // offerStatusList: any[] = [
  //   { code: 2, description: 'All' },
  //   { code: 1, description: 'Active' },
  //   { code: 0, description: 'Inactive' }];
  offerDetailStatusList: any[] = [];
  pendingOnList: any[] = [];
  OMTpendingOnList: any[] = [];
  AssignToList: any[] = [];
  offerid: number;
  @ViewChild('AssigneeModel', { static: false }) AssigneeModel: any;

  constructor(
    private router: Router,
    private pagerService: PagerService,
    private authService: AuthService,
    private offersimulatorService: OffersimulatorService,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls }
  get assigneeForm() { return this.AssigneeForm.controls }

  ngOnInit() {
    this.userid = this.authService.getUserId();
    this.userrole = this.authService.getUserRoleCode();
    this.pendingOnList.push({ code: -1, description: 'All' },
      { code: this.userid, description: 'My List' });

    if (this.userrole == 'TL' || this.userrole == 'RSM' || this.userrole == 'BL' || this.userrole == 'BH' || this.userrole == 'HoS' || this.userrole == 'MD' || this.userrole == 'FM' || this.userrole == 'Admin')
      this.isShowMargin = true;
    else
      this.isShowMargin = false;

    if (this.userrole == 'BH' || this.userrole == 'HoS' || this.userrole == 'MD' || this.userrole == 'FM' || this.userrole == 'Admin')
      this.isShowRGroupMargin = true;
    else
      this.isShowRGroupMargin = false;

    this.onbuildForm();
    this.onLoad();
  }

  onbuildForm() {
    this.FilterForm = this.formBuilder.group({
      // offerstatus: [1],
      offerdetailstatus: [0],
      Validfrom: [''],
      Validto: [''],
      pendingon: [[]],
      assignto: [[]]
    });

    this.AssigneeForm = this.formBuilder.group({
      assignto: [[]]
    });
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.todayDate = moment().format('DD/MM/YYYY');
    this.futureDate = moment().add(30, 'd').format('DD/MM/YYYY');
    this.pastDate = moment().subtract(30, 'd').format('DD/MM/YYYY');
    this.todayMinDate = this.convertDate(this.todayDate);
    this.offerDetailStatusList = [
      { code: 0, description: OfferStatusEnum.zero },
      { code: 10, description: OfferStatusEnum.ten },
      { code: 20, description: OfferStatusEnum.twenty },
      { code: 30, description: OfferStatusEnum.thirty },
      { code: 40, description: OfferStatusEnum.fourty },
      { code: 50, description: OfferStatusEnum.fifty }];

    if (this.userrole == 'OM_Admin') {
      this.filterForm.assignto.setValue(-2);
      this.filterForm.pendingon.setValue(0);
    } else if (this.userrole == 'OMT') {
      this.filterForm.assignto.setValue(this.userid);
      this.filterForm.pendingon.setValue(0);
    } else {
      this.filterForm.assignto.setValue(0);
      this.filterForm.pendingon.setValue(this.userid);
    }

    this.validfromDate = this.convertDate(this.todayDate);
    this.filterForm.Validfrom.setValue(this.todayDate);

    this.validtoDate = this.convertDate(this.futureDate);
    this.ValidMaxdate = this.validtoDate;
    this.filterForm.Validto.setValue(this.futureDate);

    this.getCount();
  }

  onValidFromDateSelection(date) {
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateFormate);

    if (this.userrole == 'Admin')
      this.authService.setScreenValues('OfferSimulator', 'from', offerValidFromdate);

    this.filterForm.Validfrom.setValue(offerValidFromdate);
    this.getCount();
  }

  onValidToDateSelection(date) {
    this.ValidMaxdate = date;
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateFormate);

    if (this.userrole == 'Admin')
      this.authService.setScreenValues('OfferSimulator', 'to', offerValidTodate);

    this.filterForm.Validto.setValue(offerValidTodate);

    if (new Date(this.filterForm.Validfrom.value.split('/').reverse().join('/')) > new Date(this.filterForm.Validto.value.split('/').reverse().join('/'))) {
      this.validfromDate = this.convertDate(offerValidTodate);

      if (this.userrole == 'Admin')
        this.authService.setScreenValues('OfferSimulator', 'from', offerValidTodate);

      this.filterForm.Validfrom.setValue(offerValidTodate);
    }

    this.getCount();
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate = { year: year, month: month, day: day };
    return newdate;
  }

  getCount() {
    let validfromdate;
    let validtodate;

    if (this.userrole == 'Admin') {
      var screenvalues = this.authService.getScreenValues().OfferSimulator;
      this.searchValue = screenvalues.searchtext;
      this.searchModel.searchtext = this.searchValue;
      this.filterForm.offerdetailstatus.setValue(screenvalues.offerdetailstatus);

      if (screenvalues.from) {
        this.validfromDate = this.convertDate(screenvalues.from);
        this.filterForm.Validfrom.setValue(screenvalues.from);
      } else {
        this.validfromDate = this.convertDate(this.todayDate);
        this.filterForm.Validfrom.setValue(this.todayDate);
      }

      if (screenvalues.to) {
        this.validtoDate = this.convertDate(screenvalues.to);
        this.ValidMaxdate = this.validtoDate;
        this.filterForm.Validto.setValue(screenvalues.to);
      } else {
        this.validtoDate = this.convertDate(this.futureDate);
        this.ValidMaxdate = this.validtoDate;
        this.filterForm.Validto.setValue(this.futureDate);
      }

      if (screenvalues.pendingon)
        this.filterForm.pendingon.setValue(screenvalues.pendingon);
      else
        this.filterForm.pendingon.setValue(this.userid);
    }

    validfromdate = this.filterForm.Validfrom.value.split('/').reverse().join('-');
    validtodate = this.filterForm.Validto.value.split('/').reverse().join('-');

    let filtermodel = { searchValue: this.searchValue }

    this.offersimulatorService.getCount(filtermodel, this.filterForm.offerdetailstatus.value, validfromdate, validtodate, this.filterForm.pendingon.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.totalRows = response.responsedata.data[0].count;
          if (this.totalRows > 0)
            this.getData();
          else
            this.offerslist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }

    let validfromdate = this.filterForm.Validfrom.value.split('/').reverse().join('-');
    let validtodate = this.filterForm.Validto.value.split('/').reverse().join('-');

    this.offersimulatorService.getList(filtermodel, this.filterForm.offerdetailstatus.value, validfromdate, validtodate, this.filterForm.pendingon.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.offerslist = response.responsedata.data.offers;
          this.setStatus(this.offerslist);

          this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setStatus(list) {
    list.forEach(element => {
      if (element.status == 10)
        element.showstatus = OfferStatusEnum.ten;
      else if (element.status == 20)
        element.showstatus = OfferStatusEnum.twenty;
      else if (element.status == 30)
        element.showstatus = OfferStatusEnum.thirty;
      else if (element.status == 40)
        element.showstatus = OfferStatusEnum.fourty;
      else if (element.status == 50)
        element.showstatus = OfferStatusEnum.fifty;
    });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData();
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }

    if (this.userrole == 'Admin')
      this.authService.setScreenValues('OfferSimulator', 'searchtext', this.searchValue);

    this.pageNumber = 1;
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-offers');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  onRowDoubleClick(id: number) {
    this.router.navigate(['/offersimulator/edit/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/offersimulator/view/' + id]);
  }

  editClicked(id: number) {
    this.router.navigate(['/offersimulator/edit/' + id]);
  }

  onOpportunityClick(opportunityid: number) {
    this.router.navigate(['/opportunities/view/' + opportunityid]);
  }

  // onFilterStatusChange(event: any) {
  //   if (!event)
  //     this.filterForm.offerstatus.setValue(2);

  //   if (this.userrole == 'Admin')
  //     this.authService.setScreenValues('OfferSimulator', 'offerstatus', this.filterForm.offerstatus.value);

  //   this.getCount();
  // }

  onFilterDetailStatusChange(event: any) {
    if (!event)
      this.filterForm.offerdetailstatus.setValue(0);

    if (this.userrole == 'Admin')
      this.authService.setScreenValues('OfferSimulator', 'offerdetailstatus', this.filterForm.offerdetailstatus.value);

    this.getCount();
  }

  onPendingOnChange(event: any) {
    if (!event)
      this.filterForm.pendingon.setValue(this.userid);

    if (this.userrole == 'Admin')
      this.authService.setScreenValues('OfferSimulator', 'pendingon', this.filterForm.pendingon.value);

    this.getCount();
  }

  onOMTPendingOnChange(event: any) {
    if (!event)
      this.filterForm.assignto.setValue(-1);

    if (this.userrole == 'Admin')
      this.authService.setScreenValues('OfferSimulator', 'assignto', this.filterForm.assignto.value);

    this.getCount();
  }

  onAdd() {
    this.router.navigate(['offersimulator/add']);
  }
}