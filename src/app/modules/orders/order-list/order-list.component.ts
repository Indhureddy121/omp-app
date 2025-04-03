import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { OrdersService } from 'src/app/core/services/orders/orders.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { OrderStatusEnum } from '@core/enums/orderstatus.enum';
import { NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { Config } from '@core/configs/config';
import { AppService } from 'src/app/app.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css']
})
export class OrderListComponent implements OnInit {

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
  OrderTypeList: any[] =
    [
      { code: -1, description: 'All' },
      { code: 0, description: 'Offer' },
      { code: 20, description: 'Stock Order' },
      { code: 30, description: 'CPO Order' },
      { code: 40, description: 'RC Order' }
    ];
  ItemDetailStatusList: any[] = [];
  SONO: string = '';
  ItemHeaderStatus: string = '';
  userrole: string = '';
  validfromDate: { year: number; month: number; day: number };
  validtoDate: { year: number; month: number; day: number };
  todayDate: any;
  futureDate: any;
  pastDate: any;

  @ViewChild('DetailStatusModel', { static: false }) DetailStatusModel: any;

  constructor(
    private router: Router,
    private pagerService: PagerService,
    private authService: AuthService,
    private ordersService: OrdersService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private appService: AppService,
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls }

  ngOnInit() {
    this.userid = this.authService.getUserId();
    this.userrole = this.authService.getUserRoleCode();

    this.onbuildForm();
    this.onLoad();
  }

  onbuildForm() {
    this.FilterForm = this.formBuilder.group({
      orderstatus: ['A'],
      ordertype: [-1],
      Validfrom: [''],
      Validto: ['']
    });
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

    this.todayDate = moment().format('DD/MM/YYYY');
    // this.futureDate = moment().add(30, 'd').format('DD/MM/YYYY');
    this.pastDate = moment().subtract(30, 'd').format('DD/MM/YYYY');

    this.validfromDate = this.convertDate(this.pastDate);
    this.filterForm.Validfrom.setValue(this.pastDate);

    this.validtoDate = this.convertDate(this.todayDate);
    // this.ValidMaxdate = this.validtoDate;
    this.filterForm.Validto.setValue(this.todayDate);

    this.getCount();
  }

  onValidFromDateSelection(date) {
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateFormate);

    // if (this.userrole == 'Admin')
    //   this.authService.setScreenValues('Orders', 'from', offerValidFromdate);

    this.filterForm.Validfrom.setValue(offerValidFromdate);
    this.getCount();
  }

  onValidToDateSelection(date) {
    // this.ValidMaxdate = date;
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateFormate);

    // if (this.userrole == 'Admin')
    //   this.authService.setScreenValues('Orders', 'to', offerValidTodate);

    this.filterForm.Validto.setValue(offerValidTodate);

    if (new Date(this.filterForm.Validfrom.value.split('/').reverse().join('/')) > new Date(this.filterForm.Validto.value.split('/').reverse().join('/'))) {
      this.validfromDate = this.convertDate(offerValidTodate);

      // if (this.userrole == 'Admin')
      //   this.authService.setScreenValues('Orders', 'from', offerValidTodate);

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
    // var screenvalues = this.authService.getScreenValues().Orders;
    // this.searchValue = screenvalues.searchtext;
    // this.searchModel.searchtext = this.searchValue;
    // this.filterForm.orderstatus.setValue(screenvalues.orderstatus);

    let filtermodel = { searchValue: this.searchValue, status: this.filterForm.orderstatus.value, type: this.filterForm.ordertype.value, from: this.filterForm.Validfrom.value.split('/').reverse().join('-'), to: this.filterForm.Validto.value.split('/').reverse().join('-') }

    this.ordersService.getCount(filtermodel).subscribe(
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
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField, status: this.filterForm.orderstatus.value, type: this.filterForm.ordertype.value, from: this.filterForm.Validfrom.value.split('/').reverse().join('-'), to: this.filterForm.Validto.value.split('/').reverse().join('-') }

    this.ordersService.getOrdersList(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.orderslist = response.responsedata.data;
          this.SetDetailStatus(this.orderslist, 'status', 'showstatus');

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

  onRowDoubleClick(id: number, type: number) {
    if (type == 10)
      this.router.navigate(['/offers/view/' + id]);
    else if (type == 20)
      this.router.navigate(['/order/stockorder/view/' + id]);
    else if (type == 30)
      this.router.navigate(['/order/cpoorder/view/' + id]);
  }

  viewClicked(id: number, type: number) {
    if (type == 1 || type == 2)
      this.router.navigate(['/offers/view/' + id]);
    else if (type == 20)
      this.router.navigate(['/order/stockorder/view/' + id]);
    else if (type == 30)
      this.router.navigate(['/order/cpoorder/view/' + id]);
    else if (type == 40)
      this.router.navigate(['/rcorders/edit/' + id]);
  }

  onFilterStatusChange(event: any) {
    if (!event)
      this.filterForm.orderstatus.setValue('All');

    // this.authService.setScreenValues('Orders', 'orderstatus', this.filterForm.orderstatus.value);
    this.getCount();
  }

  onRefreshClick() {
    this.ordersService.onrefreshstatus().subscribe(
      response => {
        if (response && (response.orders.statusCode == 200 || response.orders.statusCode == 201)) {
          this.notificationService.showSuccess(response.orders.message);
          this.getCount();
        } else if (response && (response.orders.statusCode == 400 || response.orders.statusCode == 401 || response.orders.statusCode == 500)) {
          this.notificationService.showError(response.orders.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onDetailStatus(offerid: number, sono: string, type: number, status: string) {
    this.ItemHeaderStatus = '';

    this.ordersService.SODetailStatus(offerid, sono, type, status).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.SONO = sono;
          this.ItemDetailStatusList = response.responsedata.data;

          this.SetDetailStatus([this.ItemDetailStatusList[0]], 'DlvStatH', 'headerstatus');

          this.ItemHeaderStatus = this.ItemDetailStatusList[0].headerstatus;
          this.SetDetailStatus(this.ItemDetailStatusList, 'DlvStatI', 'itemstatus');

          this.orderslist.find(X => X.soid == sono).status = this.ItemDetailStatusList[0].DlvStatH;
          this.orderslist.find(X => X.soid == sono).showstatus = this.ItemDetailStatusList[0].headerstatus;

          this.modalService.open(this.DetailStatusModel, { size: 'lg' });
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  SetDetailStatus(list: any, columnname: string, setproperty: string) {
    return list.forEach(element => {
      if (element[columnname] == '')
        element[setproperty] = OrderStatusEnum.blank;
      else if (element[columnname] == 'A')
        element[setproperty] = OrderStatusEnum.A;
      else if (element[columnname] == 'B')
        element[setproperty] = OrderStatusEnum.B;
      else if (element[columnname] == 'C')
        element[setproperty] = OrderStatusEnum.C;
    });
  }

  onItemDetailPopupCancel() {
    this.modalService.dismissAll();
    this.getCount();
  }

  onOrderTypeChange(event: any) {
    if (!event)
      this.filterForm.ordertype.setValue(-1);

    // this.authService.setScreenValues('Orders', 'ordertype', this.filterForm.ordertype.value);
    this.getCount();
  }

  onExport() {

    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField, status: this.filterForm.orderstatus.value, type: this.filterForm.ordertype.value, from: this.filterForm.Validfrom.value.split('/').reverse().join('-'), to: this.filterForm.Validto.value.split('/').reverse().join('-') }

    this.ordersService.getOrdersList(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.orderslist = response.responsedata.data;
          this.SetDetailStatus(this.orderslist, 'status', 'showstatus');

          this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);

          this.exportdatalist = JSON.parse(JSON.stringify(this.orderslist));

          if (!this.exportdatalist || this.exportdatalist.length == 0) {
            this.notificationService.showError('There is no data to export.');
            return;
          }

          let orderlistheader = Config.masterfilesheaders.exportoderslist;

          this.exportdatalist = this.exportdatalist.map(item => {
            return {
              [orderlistheader[0]]: item.typedescription,
              [orderlistheader[1]]: item.lappopportunityid,
              [orderlistheader[2]]: item.offernumber,
              [orderlistheader[3]]: item.soid,
              [orderlistheader[4]]: item.soCreatedDate,
              [orderlistheader[5]]: item.accountname,
              [orderlistheader[6]]: item.ownername,
              [orderlistheader[7]]: item.offervalue,
              [orderlistheader[8]]: item.showstatus,
              [orderlistheader[9]]: item.ShowTotalGrossMargin ? item.TotalGrossMargin : ''
            };
          });

          let fileName = 'Orders - ' + this.createdDate;

          this.appService.exportAsExcelFile(this.exportdatalist, fileName);

        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

}