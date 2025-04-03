import { Component, OnInit, ViewChild } from '@angular/core';
import { ReportsService } from '@core/services/reports/reports.service';
import { AppService } from 'src/app/app.service';
import * as moment from 'moment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Config } from 'src/app/core/configs/config';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { NgbDate, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '@core/services/masters/customer.service';
import { StorageService } from '@core/services/common/storage.service';
import { OmpusersService } from '@core/services/masters/ompusers.service';
import { NotificationService } from '@core/services/common/notification.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-orderdashboard',
  templateUrl: './orderdashboard.component.html',
  styleUrls: ['./orderdashboard.component.css']
})
export class OrderdashboardComponent implements OnInit {
  @ViewChild('OrderDashboardInvoiceModel', { static: false }) OrderDashboardInvoiceModel: any;
  @ViewChild('OrderDashboardDeliveryModel', { static: false }) OrderDashboardDeliveryModel: any;
  FilterForm: FormGroup;
  OrderDetailsForm: FormGroup;

  submitted: boolean = false;
  searchModel = Object();
  searchValue: string = '';
  dateformate: string;
  createdDate: string;
  // usertype: number = 0;
  OrderList: any[] = [];
  OrderListReport: any[] = [];
  OrderTypeList: any[] = [
    { code: -1, description: 'All' },
    { code: 0, description: 'Offer' },
    { code: 20, description: 'Stock Order' }];
  OwnerList: any[] = [];
  SegmentList: any[] = [];
  invoiceData: any[] = [];
  deliveryData: any[] = [];
  // invoicelistreport: any[] = [];
  // selectedfinancialyear: number;
  // currentmonth: string;
  // rpreviousyear: number = 0;
  // rcurrentyear: number = 0;
  // gmpreviousyear: number = 0;
  // gmcurrentyear: number = 0;
  // growthvspy: number = 0;
  // CurrentFinancialYear: string = '';
  CurrentFromDate: { year: number; month: number; day: number };
  CurrentToDate: { year: number; month: number; day: number };
  // PreviousFromDate: { year: number; month: number; day: number };
  // PreviousToDate: { year: number; month: number; day: number };
  CurrentToMindate: any;
  CurrentToMaxdate: any;
  Total_OfferValue: number = 0;
  sonumber: any;
  invoiceSONumber: any

  constructor(
    private formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private appService: AppService,
    private datePipe: DatePipe,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter,
    public customerService: CustomerService,
    private modalService: NgbModal,
    private storageService: StorageService,
    private ompusersService: OmpusersService,
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls; }
  get orderDetailsForm() { return this.OrderDetailsForm.controls; }

  ngOnInit() {
    this.onLoad();
    this.searchModel.searchtext = this.searchValue;
    this.dateformate = this.authService.getDateFormat();
    // this.usertype = this.authService.getCurrentUser().usertype;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  }

  onLoad() {
    this.buildForm();
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      search: [''],
      ordertype: [-1],
      owner: [],
      segment: [],
      currentfrom: [],
      currentto: []
    });
  }

  OnCurrentFromDateSelection(date: any) {
    let currentfromdate = new Date(date.year, date.month - 1, date.day).toString();
    currentfromdate = this.datePipe.transform(currentfromdate, this.dateformate);

    this.filterForm.currentfrom.setValue(currentfromdate);
    this.CurrentFromDate = this.convertDate(this.filterForm.currentfrom.value);
    this.CurrentToMindate = this.CurrentFromDate;

    let maxdate = moment(currentfromdate, "DD/MM/YYYY").add(180, 'days').format('DD/MM/YYYY');
    this.CurrentToMaxdate = this.convertDate(maxdate);

    if (this.filterForm.currentto.value && new Date(this.filterForm.currentfrom.value.split('/').reverse().join('-')) > new Date(this.filterForm.currentto.value.split('/').reverse().join('-'))) {
      this.CurrentToDate = this.convertDate(currentfromdate);
      this.filterForm.currentto.setValue(currentfromdate);
    }
  }

  OnCurrentToDateSelection(date: any) {
    let currenttodate = new Date(date.year, date.month - 1, date.day).toString();
    currenttodate = this.datePipe.transform(currenttodate, this.dateformate);
    this.filterForm.currentto.setValue(currenttodate);
    this.CurrentToDate = this.convertDate(this.filterForm.currentto.value);
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate: { year: number; month: number; day: number; } = { year: year, month: month, day: day };
    return newdate;
  }

  onSearch(response) {
    this.searchValue = '';

    if (response && response.searchValue)
      this.searchValue = response.searchValue;
  }

  onOrderTypeChange(event: any) {
    if (!event)
      this.filterForm.ordertype.setValue(-1);

    // this.authService.setScreenValues('Orders', 'ordertype', this.filterForm.ordertype.value);
    // this.getCount();
  }

  onOwnerChange(event: any) {
    if (event && event.target.value && event.target.value.length >= 3) {
      this.getOwnerList(event.target.value);
    }
  }

  onSegmentChange(event: any) {
    if (event && event.target.value && event.target.value.length >= 3) {
      this.getSegmentList(event.target.value);
    }
  }

  getOwnerList(value: string) {
    this.ompusersService.getOwnerList(value).subscribe(
      response => {
        if (response && response.responsedata.statusCode == 200) {
          this.OwnerList = response.responsedata.data;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getSegmentList(value: string) {
    this.ompusersService.getSegmentList(value).subscribe(
      response => {
        if (response && response.responsedata.statusCode == 200) {
          this.SegmentList = response.responsedata.data;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OnGenerateReportClick() {
    this.submitted = true;

    if (this.FilterForm.invalid)
      return;

    this.getData();
  }

  getData() {
    let filter = {
      search: this.filterForm.search.value ? this.filterForm.search.value : '',
      ordertype: this.filterForm.ordertype.value ? this.filterForm.ordertype.value : -1,
      owner: this.filterForm.owner.value ? this.filterForm.owner.value : '',
      segment: this.filterForm.segment.value ? this.filterForm.segment.value : '',
      from: this.filterForm.currentfrom.value ? this.filterForm.currentfrom.value.split('/').reverse().join('-') : '',
      to: this.filterForm.currentto.value ? this.filterForm.currentto.value.split('/').reverse().join('-') : ''
    }

    this.reportsService.orderdashboard(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
          this.submitted = false;

          this.OrderList = response.responsedata.data;
          this.Total_OfferValue = 0;
          this.OrderList.forEach(element => {
            element.TotalGrossMargin = (element.TotalGrossMargin * 100).toFixed(2);

            element.TotalTargetGrossMargin = (element.TotalTargetGrossMargin * 100).toFixed(2);
            element.created_date = this.datePipe.transform(element.created_date, this.dateformate);
            this.Total_OfferValue += element.offervalue;
          });

          this.Total_OfferValue = Number(this.Total_OfferValue.toFixed(2));
          this.OrderList = Config.SetDetailStatus(this.OrderList, 'status', 'showstatus');
          this.OrderListReport = JSON.parse(JSON.stringify(this.OrderList));
        } else {
          this.Total_OfferValue = 0;
          this.OrderList = [];
          this.OrderListReport = [];
          this.notificationService.showInfo('There is no data');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onExport() {
    if (this.OrderListReport && this.OrderListReport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Order Dashboard Report - ' + this.createdDate;

    let orderdashboardheader = Config.ReportsHeaders.orderdashboard;
    this.OrderListReport = this.OrderListReport.map(item => {
      return {
        [orderdashboardheader[0]]: item.typedescription,
        [orderdashboardheader[1]]: item.directindirect,
        [orderdashboardheader[2]]: item.offerno,
        [orderdashboardheader[3]]: item.sono,
        [orderdashboardheader[4]]: item.created_date,
        [orderdashboardheader[5]]: item.SoldToParty,
        [orderdashboardheader[6]]: item.ShipToParty,
        [orderdashboardheader[7]]: item.accountname,
        [orderdashboardheader[8]]: item.ownername,
        [orderdashboardheader[9]]: item.segment,
        [orderdashboardheader[10]]: item.offervalue,
        [orderdashboardheader[11]]: item.TotalGrossMargin,
        [orderdashboardheader[12]]: item.TotalTargetGrossMargin,
        [orderdashboardheader[13]]: item.showstatus
      };
    });

    this.appService.exportAsExcelFile(this.OrderListReport, fileName);
  }

  sendSoNo(sono: any) {
    this.sonumber = sono;
    this.reportsService.salesorderpdf(this.sonumber).subscribe(
      (response: Blob) => {

        // const blob = new Blob([response.data.pdfdata], { type: 'application/pdf' });
        // saveAs(blob, `${sono}_sales_order.pdf`);
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, `${sono}_sales_order.pdf`);

      },
      error => {
        this.notificationService.showError(error.error.error.message);
      }
    );
  }

  onInvoiceLinkClicked(sonumber: any) {
    this.invoiceSONumber = sonumber;
    this.ompusersService.getInvoice(sonumber).subscribe(
      (res) => {
        if (res && res.data && res.data.invoiceData && res.data.invoiceData.length > 0 ) {
          this.invoiceData = res.data.invoiceData;
          this.modalService.open(this.OrderDashboardInvoiceModel, { size: 'xl' });
        } else {
          this.modalService.open(this.OrderDashboardInvoiceModel, { size: 'xl' });
        }
      },
      (error) => {
        console.error('Error fetching invoice data:', error);
      }
    );
  }

  onDeliveryLinkClicked(sonumber: any) {
    this.invoiceSONumber = sonumber;
    this.ompusersService.getDelivery(sonumber).subscribe(
      (res) => {
        if (res && res.data && res.data.deliveryData && res.data.deliveryData.length > 0) {
          this.deliveryData = res.data.deliveryData;
          this.modalService.open(this.OrderDashboardDeliveryModel, { size: 'xl' });
        } else {
          this.modalService.open(this.OrderDashboardDeliveryModel, { size: 'xl' });
        }
      },
      (error) => {
        console.error('Error fetching delivery data:', error);
      }
    );
  }
}