import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { OfferStatusEnum } from 'src/app/core/enums/offerstatus.enum';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Config } from '@core/configs/config';
import * as moment from 'moment';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { StockorderService } from 'src/app/core/services/stockorder/stockorder.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-stockoffers-list',
  templateUrl: './stockoffers-list.component.html',
  styleUrls: ['./stockoffers-list.component.css']
})
export class StockoffersListComponent implements OnInit {

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
  isReceivedtoOMT: boolean = false;
  exportdatalist: any[] = [];
  createdDate: any;
  searchModel = Object();
  dateformate: string;
  offerStatusList: any[] = [];
  offerDetailStatusList: any[] = [];
  pendingOnList: any[] = [];
  offerid: number;
  OrderType: number = 0;

  @ViewChild('AssigneeModel', { static: false }) AssigneeModel: any;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private pagerService: PagerService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private appService: AppService,
    private datePipe: DatePipe,
    private stockorderService: StockorderService
  ) { }

  get filterForm() { return this.FilterForm.controls }
  get assigneeForm() { return this.AssigneeForm.controls }

  ngOnInit() {
    if (this.router.url.includes('stockorder'))
      this.OrderType = 20;
    else if (this.router.url.includes('cpoorder'))
      this.OrderType = 30;

    this.userid = this.authService.getUserId();
    this.userrole = this.authService.getUserRoleCode();
    this.offerStatusList = Config.StatusList;

    this.pendingOnList.push({ code: -1, description: 'All' },
      { code: this.userid, description: 'My List' });

    if (this.userrole == 'TL' || this.userrole == 'RSM' || this.userrole == 'BL' || this.userrole == 'BH' || this.userrole == 'HoS' || this.userrole == 'MD' || this.userrole == 'FM' || this.userrole == 'Channel Head' || this.userrole == 'Admin')
      this.isShowMargin = true;
    else
      this.isShowMargin = false;

    // if (this.userrole == 'BH' || this.userrole == 'HoS' || this.userrole == 'MD' || this.userrole == 'FM' || this.userrole == 'Channel Head' || this.userrole == 'Admin')
    //   this.isShowRGroupMargin = true;
    // else
    //   this.isShowRGroupMargin = false;

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
      pendingon: [[]]
    });
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.offerDetailStatusList = [
      { code: 0, description: OfferStatusEnum.zero },
      { code: 10, description: OfferStatusEnum.ten },
      { code: 20, description: OfferStatusEnum.twenty },
      { code: 30, description: OfferStatusEnum.thirty },
      { code: 40, description: OfferStatusEnum.fourty },
      { code: 57, description: OfferStatusEnum.fiftyseven },
      { code: 62, description: OfferStatusEnum.sixtytwo },
      { code: 75, description: OfferStatusEnum.seventyfive },
      { code: 80, description: OfferStatusEnum.eighty }];

    this.filterForm.pendingon.setValue(this.userid);

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
    if (this.userrole == 'Admin') {
      var screenvalues = this.authService.getScreenValues().StockOrders;
      this.searchValue = screenvalues.searchtext;
      this.searchModel.searchtext = this.searchValue;
      this.filterForm.offerstatus.setValue(screenvalues.offerstatus);
      this.filterForm.offerdetailstatus.setValue(screenvalues.offerdetailstatus);

      if (screenvalues.pendingon)
        this.filterForm.pendingon.setValue(screenvalues.pendingon);
      else
        this.filterForm.pendingon.setValue(this.userid);
    }

    let filtermodel = { searchValue: this.searchValue }

    this.stockorderService.OrdersCount(filtermodel, this.filterForm.offerstatus.value, this.filterForm.offerdetailstatus.value, this.filterForm.pendingon.value, this.OrderType).subscribe(
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

    this.stockorderService.OrdersList(filtermodel, this.filterForm.offerstatus.value, this.filterForm.offerdetailstatus.value, this.filterForm.pendingon.value, this.OrderType).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.offerslist = response.responsedata.data;
          this.setStatus(this.offerslist);

          this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setStatus(list) {
    list.forEach(element => {
      if (element.status == 10) {
        element.showstatus = OfferStatusEnum.ten;
      } else if (element.status == 20) {
        element.showstatus = OfferStatusEnum.twenty;
      } else if (element.status == 30) {
        element.showstatus = OfferStatusEnum.thirty;
      } else if (element.status == 40) {
        element.showstatus = OfferStatusEnum.fourty;
      } else if (element.status == 50) {
        element.showstatus = OfferStatusEnum.fifty;
      } else if (element.status == 55) {
        element.showstatus = OfferStatusEnum.fiftyfive;
      } else if (element.status == 57) {
        element.showstatus = OfferStatusEnum.fiftyseven;
      } else if (element.status == 59) {
        element.showstatus = OfferStatusEnum.fiftynine;
      } else if (element.status == 60) {
        element.showstatus = OfferStatusEnum.sixty;
      } else if (element.status == 62) {
        element.showstatus = OfferStatusEnum.sixtytwo;
      } else if (element.status == 70) {
        element.showstatus = OfferStatusEnum.seventy;
      } else if (element.status == 72) {
        element.showstatus = OfferStatusEnum.seventytwo;
      } else if (element.status == 75) {
        element.showstatus = OfferStatusEnum.seventyfive;
      } else if (element.status == 80) {
        element.showstatus = OfferStatusEnum.eighty;
      }

      // if (element.ordertype == 20)
      //   element.displayordertype = OrderTypeEnum.twenty;
      // else if (element.ordertype == 30)
      //   element.displayordertype = OrderTypeEnum.thirty;
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
      this.authService.setScreenValues('StockOrders', 'searchtext', this.searchValue);

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
    if (this.OrderType == 20)
      this.router.navigate(['/order/stockorder/edit/' + id]);
    else if (this.OrderType == 30)
      this.router.navigate(['/order/cpoorder/edit/' + id]);
  }

  viewClicked(id: number) {
    if (this.OrderType == 20)
      this.router.navigate(['/order/stockorder/view/' + id]);
    else if (this.OrderType == 30)
      this.router.navigate(['/order/cpoorder/view/' + id]);
  }

  editClicked(id: number) {
    if (this.OrderType == 20)
      this.router.navigate(['/order/stockorder/edit/' + id]);
    else if (this.OrderType == 30)
      this.router.navigate(['/order/cpoorder/edit/' + id]);
  }

  onOpportunityClick(opportunityid: number) {
    this.router.navigate(['/opportunities/view/' + opportunityid]);
  }

  onFilterStatusChange(event: any) {
    if (!event)
      this.filterForm.offerstatus.setValue(2);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('StockOrders', 'offerstatus', this.filterForm.offerstatus.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onFilterDetailStatusChange(event: any) {
    if (!event)
      this.filterForm.offerdetailstatus.setValue(0);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('StockOrders', 'offerdetailstatus', this.filterForm.offerdetailstatus.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onPendingOnChange(event: any) {
    if (!event)
      this.filterForm.pendingon.setValue(this.userid);

    // if (this.userrole == 'Admin')
    this.authService.setScreenValues('StockOrders', 'pendingon', this.filterForm.pendingon.value);

    this.pageNumber = 1;
    this.getCount();
  }

  onExport() {
    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.stockorderService.OrdersList(filtermodel, this.filterForm.offerstatus.value, this.filterForm.offerdetailstatus.value, this.filterForm.pendingon.value, this.OrderType).subscribe(
      response => {
        this.exportdatalist = response.offers;

        if (this.exportdatalist && this.exportdatalist.length > 0) {
          this.setStatus(this.exportdatalist);

          this.exportdatalist.forEach(element => {
            delete element.IsActive;
            delete element.IsExpired;
            delete element.TotalDealerCommission;
            delete element.TotalGrossMargin;
            delete element.TotalTargetGrossMargin;
            delete element.offerid;
            delete element.oppid;
            delete element.opportunityid;

            if (element.validto != '0000-00-00')
              element.validto = this.datePipe.transform(element.validto, this.dateFormate);
            else
              element.validto = '';
          });
        } else {
          this.notificationService.showError('There is no data to export.');
          return;
        }

        let offerlistheader = Config.masterfilesheaders.exportofferslist;
        this.exportdatalist = this.exportdatalist.map(item => {
          return {
            [offerlistheader[0]]: item.offernumber,
            [offerlistheader[1]]: item.lappopportunityid,
            [offerlistheader[2]]: item.accountname,
            [offerlistheader[3]]: item.ownername,
            [offerlistheader[4]]: item.offervalue,
            [offerlistheader[5]]: item.validto,
            [offerlistheader[6]]: item.showstatus,
            [offerlistheader[7]]: item.actionrequired
          };
        });

        let fileName = 'Stock Orders - ' + this.createdDate;

        this.appService.exportAsExcelFile(this.exportdatalist, fileName);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}