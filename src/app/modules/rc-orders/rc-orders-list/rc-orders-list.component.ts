import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Config } from '@core/configs/config';
import { RcOrdersService } from '@core/services/rc-orders/rc-orders.service';
import { OfferStatusEnum } from '@core/enums/offerstatus.enum';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-rc-orders-list',
  templateUrl: './rc-orders-list.component.html',
  styleUrls: ['./rc-orders-list.component.css']
})
export class RcOrdersListComponent implements OnInit {

  FilterForm: FormGroup;

  orderslist: any[] = [];
  exportdatalist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateFormate: string;
  createdDate: string;
  userid: number;
  searchModel = Object();
  orderStatusList: any[] = [
    { code: 'All', description: 'All' },
    { code: '', description: 'Not Relevant' },
    { code: 'A', description: 'Not yet processed' },
    { code: 'B', description: 'Partially processed' },
    { code: 'C', description: 'Completely processed' }];
  OrderTypeList: any[] = [
    { code: -1, description: 'All' },
    { code: 0, description: 'Offer' },
    { code: 20, description: 'Stock Order' },
    { code: 30, description: 'CPO Order' }];
  offerStatusList: any[] = [];
  offerDetailStatusList: any[] = [];
  ItemDetailStatusList: any[] = [];
  SONO: string = '';
  ItemHeaderStatus: string = '';
  userrole: string = '';
  validfromDate: { year: number; month: number; day: number };
  validtoDate: { year: number; month: number; day: number };
  todayDate: any;
  futureDate: any;
  pastDate: any;
  isShowMargin: boolean = false;
  isShowRGroupMargin: boolean = false;
  ValidMaxdate: any;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private pagerService: PagerService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private rcOrdersService: RcOrdersService
  ) { }

  get filterForm() { return this.FilterForm.controls }

  ngOnInit() {
    this.userid = this.authService.getUserId();
    this.userrole = this.authService.getUserRoleCode();
    this.offerStatusList = Config.StatusList;

    if (this.userrole == 'ASM' || this.userrole == 'Dealer Admin' || this.userrole == 'RCCustomer') {
      this.isShowMargin = false;
      this.isShowRGroupMargin = false;
    } else {
      this.isShowMargin = true;
      this.isShowRGroupMargin = true;
    }

    this.onbuildForm();
    this.onLoad();
  }

  onbuildForm() {
    this.FilterForm = this.formBuilder.group({
      offerstatus: [1],
      offerdetailstatus: [0],
      Validfrom: [''],
      Validto: [''],
      // pendingon: [-1]
    });
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    // this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

    this.todayDate = moment().format('DD/MM/YYYY');
    this.pastDate = moment().subtract(30, 'd').format('DD/MM/YYYY');

    this.validfromDate = this.convertDate(this.pastDate);
    this.filterForm.Validfrom.setValue(this.pastDate);

    this.validtoDate = this.convertDate(this.todayDate);
    this.ValidMaxdate = this.validtoDate;
    this.filterForm.Validto.setValue(this.todayDate);

    // this.pendingOnList.push({ code: -1, description: 'All' },
    //   { code: this.userid, description: 'My List' });

    this.offerDetailStatusList = [
      { code: 0, description: OfferStatusEnum.zero },
      { code: 10, description: OfferStatusEnum.ten },
      { code: 20, description: "OM Team Review" },
      { code: 80, description: OfferStatusEnum.eighty }];

    this.getCount();
  }

  onValidFromDateSelection(date) {
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateFormate);

    this.filterForm.Validfrom.setValue(offerValidFromdate);
    this.getCount();
  }

  onValidToDateSelection(date) {
    this.ValidMaxdate = date;
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateFormate);

    this.filterForm.Validto.setValue(offerValidTodate);

    if (new Date(this.filterForm.Validfrom.value.split('/').reverse().join('/')) > new Date(this.filterForm.Validto.value.split('/').reverse().join('/'))) {
      this.validfromDate = this.convertDate(offerValidTodate);
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
    let validfromdate = this.filterForm.Validfrom.value.split('/').reverse().join('-');
    let validtodate = this.filterForm.Validto.value.split('/').reverse().join('-');
    let filtermodel = { searchValue: this.searchValue }

    this.rcOrdersService.Count(filtermodel, this.filterForm.offerstatus.value, this.filterForm.offerdetailstatus.value, validfromdate, validtodate).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.totalRows = response.responsedata.data[0].count;
          if (this.totalRows > 0)
            this.getData();
          else
            this.orderslist = [];
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

    this.rcOrdersService.List(filtermodel, this.filterForm.offerstatus.value, this.filterForm.offerdetailstatus.value, validfromdate, validtodate).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.orderslist = response.responsedata.data;
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

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue)
      this.searchValue = response.searchValue;

    // this.authService.setScreenValues('Orders', 'searchtext', this.searchValue);
    this.pageNumber = 1;
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-orders');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  onFilterStatusChange(event: any) {
    if (!event)
      this.filterForm.offerstatus.setValue(2);

    this.pageNumber = 1;
    this.getCount();
  }

  onFilterDetailStatusChange(event: any) {
    if (!event)
      this.filterForm.offerdetailstatus.setValue(0);

    this.pageNumber = 1;
    this.getCount();
  }

  // onPendingOnChange(event: any) {
  //   if (!event)
  //     this.filterForm.pendingon.setValue(this.userid);

  //   this.pageNumber = 1;
  //   this.getCount();
  // }

  onRowDoubleClick(id: number) {
    this.router.navigate(['/rcorders/edit', id]);
  }

  // viewClicked(id: number, type: number) {
  //   if (type == 1 || type == 2)
  //     this.router.navigate(['/offers/view/' + id]);
  //   else if (type == 20)
  //     this.router.navigate(['/order/stockorder/view/' + id]);
  //   else if (type == 30)
  //     this.router.navigate(['/order/cpoorder/view/' + id]);
  // }

  // onFilterStatusChange(event: any) {
  //   if (!event)
  //     this.filterForm.orderstatus.setValue('All');

  //   this.getCount();
  // }
  onAdd() {
    this.router.navigate(['/rcorders/add']);
  }
}
