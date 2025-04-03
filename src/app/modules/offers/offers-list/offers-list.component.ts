import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { OffersService } from 'src/app/core/services/offers/offers.service';
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
  selector: 'app-offers-list',
  templateUrl: './offers-list.component.html',
  styleUrls: ['./offers-list.component.css']
})
export class OffersListComponent implements OnInit {

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
  isReceivedtoOMT: boolean = false;
  exportdatalist: any[] = [];
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
  offerStatusList: any[] = [];
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
    private offersService: OffersService,
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

    this.offerStatusList = Config.StatusList;
    this.pendingOnList.push({ code: -1, description: 'All' },
      { code: this.userid, description: 'My List' });

    if (this.userrole == 'TL' || this.userrole == 'RSM' || this.userrole == 'BL' || this.userrole == 'BH' || this.userrole == 'PM_Admin' || this.userrole == 'HoS' || this.userrole == 'MD' || this.userrole == 'FM' || this.userrole == 'PE_Admin' || this.userrole == 'PM_PE_Admin' || this.userrole == 'Admin')
      this.isShowMargin = true;
    else
      this.isShowMargin = false;

    if (this.userrole == 'BH' || this.userrole == 'PM_Admin' || this.userrole == 'HoS' || this.userrole == 'MD' || this.userrole == 'FM' || this.userrole == 'PE_Admin' || this.userrole == 'PM_PE_Admin' || this.userrole == 'Admin')
      this.isShowRGroupMargin = true;
    else
      this.isShowRGroupMargin = false;

    if (this.userrole == 'OM_Admin' || this.userrole == 'OMT')
      this.isReceivedtoOMT = true;
    else
      this.isReceivedtoOMT = false;

    this.onbuildForm();
    this.onLoad();
  }

  onbuildForm() {
    this.FilterForm = this.formBuilder.group({
      offerstatus: [1],
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
      { code: 50, description: OfferStatusEnum.fifty },
      { code: 54, description: OfferStatusEnum.fiftyfour },
      { code: 55, description: OfferStatusEnum.fiftyfive },
      { code: 56, description: OfferStatusEnum.fiftysix },
      { code: 57, description: OfferStatusEnum.fiftyseven },
      { code: 60, description: OfferStatusEnum.sixty },
      { code: 70, description: OfferStatusEnum.seventy },
      { code: 71, description: OfferStatusEnum.seventyone },
      { code: 73, description: OfferStatusEnum.seventythree },
      { code: 74, description: OfferStatusEnum.seventyfour },
      { code: 75, description: OfferStatusEnum.seventyfive },
      { code: 80, description: OfferStatusEnum.eighty }];

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

    if (this.isReceivedtoOMT)
      this.getAssigntoList();
  }

  onValidFromDateSelection(date) {
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateFormate);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('Offers', 'from', offerValidFromdate);

    this.filterForm.Validfrom.setValue(offerValidFromdate);

    this.pageNumber = 1;
    this.getCount();
  }

  onValidToDateSelection(date) {
    this.ValidMaxdate = date;
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateFormate);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('Offers', 'to', offerValidTodate);

    this.filterForm.Validto.setValue(offerValidTodate);

    if (new Date(this.filterForm.Validfrom.value.split('/').reverse().join('/')) > new Date(this.filterForm.Validto.value.split('/').reverse().join('/'))) {
      this.validfromDate = this.convertDate(offerValidTodate);

      // if (this.userrole == 'Admin')
      this.authService.setScreenValues('Offers', 'from', offerValidTodate);

      this.filterForm.Validfrom.setValue(offerValidTodate);
    }

    this.pageNumber = 1;
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

    // if (this.userrole == 'Admin') {
    var screenvalues = this.authService.getScreenValues().Offers;
    this.searchValue = screenvalues.searchtext;
    this.searchModel.searchtext = this.searchValue;
    this.filterForm.offerstatus.setValue(screenvalues.offerstatus);
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

    if (screenvalues.assignto)
      this.filterForm.assignto.setValue(screenvalues.assignto);
    // } 

    // else {
    if (this.isReceivedtoOMT)
      this.filterForm.pendingon.setValue(0);

    if (this.userrole == 'OM_Admin' && !this.filterForm.assignto.value)
      this.filterForm.assignto.setValue(2);
    else if (this.userrole == 'OMT' && !this.filterForm.assignto.value)
      this.filterForm.assignto.setValue(this.userid);
    else if (!this.filterForm.assignto.value)
      this.filterForm.assignto.setValue(0);

    //   // this.validfromDate = this.convertDate(this.todayDate);
    //   // this.filterForm.Validfrom.setValue(this.todayDate);

    //   // this.validtoDate = this.convertDate(this.futureDate);
    //   // this.ValidMaxdate = this.validtoDate;
    //   // this.filterForm.Validto.setValue(this.futureDate);

    // }
    // var screenvalues = this.authService.getScreenValues().Offers;
    // this.searchValue = screenvalues.searchtext;
    // this.searchModel.searchtext = this.searchValue;
    // this.filterForm.offerstatus.setValue(screenvalues.offerstatus);
    // this.filterForm.offerdetailstatus.setValue(screenvalues.offerdetailstatus);

    // if (screenvalues.from) {
    //   this.validfromDate = this.convertDate(screenvalues.from);
    //   this.filterForm.Validfrom.setValue(screenvalues.from);
    // } else {
    //   this.validfromDate = this.convertDate(this.todayDate);
    //   this.filterForm.Validfrom.setValue(this.todayDate);
    // }

    // if (screenvalues.to) {
    //   this.validtoDate = this.convertDate(screenvalues.to);
    //   this.ValidMaxdate = this.validtoDate;
    //   this.filterForm.Validto.setValue(screenvalues.to);
    // } else {
    //   this.validtoDate = this.convertDate(this.futureDate);
    //   this.ValidMaxdate = this.validtoDate;
    //   this.filterForm.Validto.setValue(this.futureDate);
    // }

    // if (screenvalues.pendingon)
    //   this.filterForm.pendingon.setValue(screenvalues.pendingon);
    // else
    //   this.filterForm.pendingon.setValue(this.userid);

    // if (screenvalues.assignto)
    //   this.filterForm.assignto.setValue(screenvalues.assignto);

    // if (this.isReceivedtoOMT)
    //   this.filterForm.pendingon.setValue(0);

    // if (this.userrole == 'OM_Admin' && !this.filterForm.assignto.value)
    //   this.filterForm.assignto.setValue(-2);
    // else if (this.userrole == 'OMT' && !this.filterForm.assignto.value)
    //   this.filterForm.assignto.setValue(this.userid);
    // else if (!this.filterForm.assignto.value)
    //   this.filterForm.assignto.setValue(0);

    // this.validfromDate = this.convertDate(this.todayDate);
    // this.filterForm.Validfrom.setValue(this.todayDate);

    // this.validtoDate = this.convertDate(this.futureDate);
    // this.ValidMaxdate = this.validtoDate;
    // this.filterForm.Validto.setValue(this.futureDate);


    validfromdate = this.filterForm.Validfrom.value.split('/').reverse().join('-');
    validtodate = this.filterForm.Validto.value.split('/').reverse().join('-');

    let filtermodel = { searchValue: this.searchValue }

    this.offersService.getCount(filtermodel, this.filterForm.offerstatus.value, this.filterForm.offerdetailstatus.value, validfromdate, validtodate, this.filterForm.pendingon.value, this.filterForm.assignto.value).subscribe(
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

    this.offersService.getOffersList(filtermodel, this.filterForm.offerstatus.value, this.filterForm.offerdetailstatus.value, validfromdate, validtodate, this.filterForm.pendingon.value, this.filterForm.assignto.value).subscribe(
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

  getAssigntoList() {
    this.offersService.getAssignToList().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.OMTpendingOnList = response.responsedata.data;
        // this.OMTpendingOnList.splice(0, 0, { userid: -1, description: 'All' }, { userid: -2, description: 'Not Assigned' });
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setStatus(list) {
    list.forEach(element => {
      if (element.status == 5 || element.status == 10)
        element.showstatus = OfferStatusEnum.ten;
      else if (element.status == 11)
        element.showstatus = OfferStatusEnum.eleven;
      else if (element.status == 13)
        element.showstatus = OfferStatusEnum.threen;
      else if (element.status == 15)
        element.showstatus = OfferStatusEnum.fifteen;
      else if (element.status == 17)
        element.showstatus = OfferStatusEnum.seventeen;
      else if (element.status == 20)
        element.showstatus = OfferStatusEnum.twenty;
      else if (element.status == 30)
        element.showstatus = OfferStatusEnum.thirty;
      else if (element.status == 40)
        element.showstatus = OfferStatusEnum.fourty;
      else if (element.status == 50)
        element.showstatus = OfferStatusEnum.fifty;
      else if (element.status == 54)
        element.showstatus = OfferStatusEnum.fiftyfour;
      else if (element.status == 55)
        element.showstatus = OfferStatusEnum.fiftyfive;
      else if (element.status == 56)
        element.showstatus = OfferStatusEnum.fiftysix;
      else if (element.status == 57)
        element.showstatus = OfferStatusEnum.fiftyseven;
      else if (element.status == 59)
        element.showstatus = OfferStatusEnum.fiftynine;
      else if (element.status == 60)
        element.showstatus = OfferStatusEnum.sixty;
      else if (element.status == 70)
        element.showstatus = OfferStatusEnum.seventy;
      else if (element.status == 71)
        element.showstatus = OfferStatusEnum.seventyone;
      else if (element.status == 73)
        element.showstatus = OfferStatusEnum.seventythree;
      else if (element.status == 74)
        element.showstatus = OfferStatusEnum.seventyfour;
      else if (element.status == 75)
        element.showstatus = OfferStatusEnum.seventyfive;
      else if (element.status == 80)
        element.showstatus = OfferStatusEnum.eighty;
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

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('Offers', 'searchtext', this.searchValue);

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
    this.router.navigate(['/offers/edit/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/offers/view/' + id]);
  }

  editClicked(id: number) {
    this.router.navigate(['/offers/edit/' + id]);
  }

  onOpportunityClick(opportunityid: number) {
    this.router.navigate(['/opportunities/view/' + opportunityid]);
  }

  onFilterStatusChange(event: any) {
    if (!event)
      this.filterForm.offerstatus.setValue(2);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('Offers', 'offerstatus', this.filterForm.offerstatus.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onFilterDetailStatusChange(event: any) {
    if (!event)
      this.filterForm.offerdetailstatus.setValue(0);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('Offers', 'offerdetailstatus', this.filterForm.offerdetailstatus.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onPendingOnChange(event: any) {
    if (!event)
      this.filterForm.pendingon.setValue(this.userid);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('Offers', 'pendingon', this.filterForm.pendingon.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onOMTPendingOnChange(event: any) {
    if (!event)
      this.filterForm.assignto.setValue(-1);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('Offers', 'assignto', this.filterForm.assignto.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onExport() {
    let validfromdate = this.filterForm.Validfrom.value.split('/').reverse().join('-');
    let validtodate = this.filterForm.Validto.value.split('/').reverse().join('-');

    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.offersService.getOffersList(filtermodel, this.filterForm.offerstatus.value, this.filterForm.offerdetailstatus.value, validfromdate, validtodate, this.filterForm.pendingon.value, this.filterForm.assignto.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.exportdatalist = response.responsedata.data.offers;
          let _flagtoShowMargin = response.responsedata.data.uiinfo;

          if (this.exportdatalist && this.exportdatalist.length > 0) {
            this.setStatus(this.exportdatalist);

            this.exportdatalist.forEach(element => {
              delete element.IsActive;
              delete element.IsExpired;
              delete element.offerid;
              delete element.oppid;
              delete element.opportunityid;

              if (element.offerCreatedDate != '0000-00-00')
                element.offerCreatedDate = this.datePipe.transform(element.offerCreatedDate, this.dateFormate);
              else
                element.offerCreatedDate = '';

              if (element.validto != '0000-00-00')
                element.validto = this.datePipe.transform(element.validto, this.dateFormate);
              else
                element.validto = '';

              if (element.SOCreatedDate && element.SOCreatedDate != '0000-00-00')
                element.SOCreatedDate = this.datePipe.transform(element.SOCreatedDate, this.dateFormate);
              else
                element.SOCreatedDate = '';
            });
          } else {
            this.notificationService.showError('There is no data to export.');
            return;
          }

          let offerlistheader = Config.masterfilesheaders.exportofferslist;

          this.exportdatalist = this.exportdatalist.map(item => {
            return {
              [offerlistheader[0]]: item.offernumber,
              [offerlistheader[1]]: item.offerCreatedDate,
              [offerlistheader[2]]: item.lappopportunityid,
              [offerlistheader[3]]: item.opportunity_name,
              [offerlistheader[4]]: item.accountname,
              [offerlistheader[5]]: item.ownername,
              [offerlistheader[6]]: item.offervalue,
              [offerlistheader[7]]: item.validto,
              [offerlistheader[8]]: item.showstatus,
              [offerlistheader[9]]: item.actionrequired,
              [offerlistheader[10]]: item.soNo,
              [offerlistheader[11]]: item.SOCreatedDate,
              [offerlistheader[12]]: _flagtoShowMargin.ShowTotalRMCGrossMargin ? item.TotalRMCGrossMargin : '',
              [offerlistheader[13]]: _flagtoShowMargin.ShowTotalGrossMargin ? item.TotalGrossMargin : '',
              [offerlistheader[14]]: _flagtoShowMargin.TotalTargetGrossMargin ? item.TotalTargetGrossMargin : ''
            };
          });

          let fileName = 'Offers - ' + this.createdDate;

          this.appService.exportAsExcelFile(this.exportdatalist, fileName);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  openAssigneeModal(offerid: number) {
    this.offersService.getAssignToList().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.offerid = offerid;
          this.AssignToList = response.responsedata.data;

          let _assignto = this.offerslist.find(x => x.offerid == this.offerid).assignto;
          if (_assignto)
            this.assigneeForm.assignto.setValue(_assignto);
          else
            this.assigneeForm.assignto.setValue([]);

          this.modalService.open(this.AssigneeModel, { size: 'sm' });
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onAssignToSaveClick() {
    let assigntosavemodel = {
      offerid: this.offerid,
      assignto: this.assigneeForm.assignto.value
    }

    this.offersService.saveassignto(assigntosavemodel).subscribe(
      response => {
        if (response) {
          this.offerid = null;
          this.modalService.dismissAll();
          this.notificationService.showSuccess('Assign To saved successfully.');
          this.getCount();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  assigntomeClick(offerid: number) {
    this.offerid = offerid;
    this.assigneeForm.assignto.setValue(this.userid);
    this.onAssignToSaveClick();
  }

  onResetClick() {
    this.authService.setScreenValues('Offers', 'searchtext', "");
    this.authService.setScreenValues('Offers', 'offerstatus', 1);
    this.authService.setScreenValues('Offers', 'offerdetailstatus', 0);
    this.authService.setScreenValues('Offers', 'from', "");
    this.authService.setScreenValues('Offers', 'to', "");
    this.authService.setScreenValues('Offers', 'pendingon', "");
    this.authService.setScreenValues('Offers', 'assignto', "");
    this.searchValue = "";
    this.searchModel.searchtext = "";
    // window.location.reload();
    this.getCount();
  }

  // onSearchReset(){
  //   // this.
  // }
}