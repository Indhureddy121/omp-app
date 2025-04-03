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
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-openorder',
  templateUrl: './openorder.component.html',
  styleUrls: ['./openorder.component.css']
})
export class OpenorderComponent implements OnInit {

  FilterForm: FormGroup;
  OrderDetailsForm: FormGroup;

  submitted: boolean = false;
  dateformate: string;
  createdDate: string;
  usertype: number = 0;
  DealersList: any[] = [];
  openorderlist: any[] = [];
  openorderlistreport: any[] = [];
  // selectedfinancialyear: number;
  // currentmonth: string;
  // rpreviousyear: number = 0;
  // rcurrentyear: number = 0;
  // gmpreviousyear: number = 0;
  // gmcurrentyear: number = 0;
  // growthvspy: number = 0;
  // CurrentFinancialYear: string = '';
  // CurrentFromDate: { year: number; month: number; day: number };
  // CurrentToDate: { year: number; month: number; day: number };
  // PreviousFromDate: { year: number; month: number; day: number };
  // PreviousToDate: { year: number; month: number; day: number };
  // CurrentToMindate: any;
  // PreviousToMindate: any;
  dealerdata: any;
  OrderNo: string;
  ItemNo: string;
  StockData: any[] = [];
  lastgenerateddate: string = '';
  Total_Openquantity: number = 0;
  Total_NetValue: number = 0;
  Total_Open_Order_Value: number = 0;
  @ViewChild('OrderDetailModel', { static: false }) OrderDetailModel: any;

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
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls; }
  get orderDetailsForm() { return this.OrderDetailsForm.controls; }

  ngOnInit() {
    this.onLoad();

    this.dateformate = this.authService.getDateFormat();
    this.usertype = this.authService.getCurrentUser().usertype;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

    if (this.usertype == 20) {
      this.GetDealerDetail();
    }
  }

  onLoad() {
    this.buildForm();

    if (this.storageService.getValue('Reports')) {
      let openorderreport = JSON.parse(this.storageService.getValue('Reports')).openorder;
      if (openorderreport) {
        this.openorderlist = openorderreport.openorder;

        this.Total_Openquantity = 0;
        this.Total_NetValue = 0;
        this.Total_Open_Order_Value = 0;

        this.openorderlist.forEach(element => {
          this.Total_Openquantity += element.Openquantity;
          this.Total_NetValue += element.NetValue;
          this.Total_Open_Order_Value += element.Open_Order_Value;
        });

        this.Total_Openquantity = Number(this.Total_Openquantity.toFixed(2));
        this.Total_NetValue = Number(this.Total_NetValue.toFixed(2));
        this.Total_Open_Order_Value = Number(this.Total_Open_Order_Value.toFixed(2));

        this.lastgenerateddate = openorderreport.lastgenerateddate;

        this.openorderlistreport = JSON.parse(JSON.stringify(this.openorderlist));
      }
    }

    // let _currenttodate = moment().format('DD/MM/YYYY');
    // this.filterForm.currentto.setValue(_currenttodate);
    // this.CurrentToDate = this.convertDate(_currenttodate);
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      dealer: [null, [Validators.required]],
      sono: [null],
      // currentto: [null, [Validators.required]]
    });

    this.OrderDetailsForm = this.formBuilder.group({
      soldtoparty: [null],
      shiptoparty: [null],
      ponumber: [null],
      podate: [null],
      socreateddate: [null],
      soitemcreateddate: [null],
      importby: [null],
      freight: [null],
      employeeresponsible: [null],
      incoterms: [null],
      reqdlvdate: [null],
      onelot: [null],
      length: [null],
      factor: [null],
      untol: [null],
      ovtol: [null],
      orderqty: [null],
      openqty: [null],
      dlvqty: [null]
    });
  }

  // OnCurrentToDateSelection(date) {
  //   let currenttodate = new Date(date.year, date.month - 1, date.day).toString();
  //   currenttodate = this.datePipe.transform(currenttodate, this.dateformate);
  //   this.filterForm.currentto.setValue(currenttodate);
  //   this.CurrentToDate = this.convertDate(this.filterForm.currentto.value);
  // }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate: { year: number; month: number; day: number; } = { year: year, month: month, day: day };
    return newdate;
  }

  GetDealersList() {
    let element = (document.getElementById('ngSelectDealers') as HTMLInputElement);
    if (element.value && element.value.length >= 3) {
      this.GetDealersListAPI(element.value);
    }
  }

  GetDealersListAPI(dealer: string) {
    this.customerService.getdealerslist(dealer).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.DealersList = response.responsedata.data;
        }
      }, error => {
        this.DealersList = [];
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetDealerDetail() {
    this.customerService.getCustomerById(this.authService.getUserId()).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
          this.dealerdata = response.responsedata.data[0];
          this.filterForm.dealer.setValue(this.dealerdata.sapid + ' - ' + this.dealerdata.customername);
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
      dealer: this.usertype == 20 ? this.dealerdata.sapid : this.filterForm.dealer.value,
      sono: this.filterForm.sono.value && this.filterForm.sono.value.length > 0 ? this.filterForm.sono.value : '',
      useremail: this.usertype == 20 ? '' : this.authService.getCurrentUser().emailid
    }

    this.Total_Openquantity = 0;
    this.Total_NetValue = 0;
    this.Total_Open_Order_Value = 0;

    this.reportsService.getopenorder(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
          this.submitted = false;

          this.openorderlist = Config.fn_Arr_trim(response.responsedata.data);

          this.openorderlist.forEach(element => {
            element.Orderquantity = Number(Number(element.Orderquantity).toFixed(2));
            element.Delquantity = Number(Number(element.Delquantity).toFixed(2));
            element.Openquantity = Number(Number(element.Openquantity).toFixed(2));
            element.Unitprice = Number(Number(element.Unitprice).toFixed(2));
            element.NetValue = Number(Number(element.NetValue).toFixed(2));
            element.Open_Order_Value = Number(Number(element.Open_Order_Value).toFixed(2));

            this.Total_Openquantity += element.Openquantity;
            this.Total_NetValue += element.NetValue;
            this.Total_Open_Order_Value += element.Open_Order_Value;

            element.Soitemcreated = element.Soitemcreated ? this.datePipe.transform(new Date(Number(element.Soitemcreated.match(/(\d+)/)[0])), this.dateformate) : null;
            element.Requstdeldate = element.Requstdeldate ? this.datePipe.transform(new Date(Number(element.Requstdeldate.match(/(\d+)/)[0])), this.dateformate) : null;
            // element.DeliveryDate = element.DeliveryDate ? this.datePipe.transform(new Date(Number(element.DeliveryDate.match(/(\d+)/)[0])), this.dateformate) : null;
            element.MatavlDate = element.MatavlDate ? this.datePipe.transform(new Date(Number(element.MatavlDate.match(/(\d+)/)[0])), this.dateformate) : null;
            element.Podate = element.Podate ? this.datePipe.transform(new Date(Number(element.Podate.match(/(\d+)/)[0])), this.dateformate) : null;
            element.Socreated = element.Socreated ? this.datePipe.transform(new Date(Number(element.Socreated.match(/(\d+)/)[0])), this.dateformate) : null;
          });

          this.Total_Openquantity = Number(this.Total_Openquantity.toFixed(2));
          this.Total_NetValue = Number(this.Total_NetValue.toFixed(2));
          this.Total_Open_Order_Value = Number(this.Total_Open_Order_Value.toFixed(2));

          if (this.authService.getCurrentUser().usertype == 20) {
            let _reportsdata: any = JSON.parse(this.storageService.getValue('Reports'));

            if (_reportsdata)
              delete _reportsdata.openorder;
            else
              _reportsdata = {};

            _reportsdata.openorder = {
              openorder: this.openorderlist,
              lastgenerateddate: this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss')
            };
            this.lastgenerateddate = _reportsdata.openorder.lastgenerateddate;
            this.storageService.setValue('Reports', JSON.stringify(_reportsdata));
          }

          this.openorderlistreport = JSON.parse(JSON.stringify(this.openorderlist));
        } else {
          this.openorderlist = [];
          this.openorderlistreport = [];
          this.notificationService.showInfo('There is no data');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onOrderDetailClick(orderno: any, itemno: any) {
    let itemdetail = this.openorderlist.find(x => x.Salesord == orderno && x.ItemNo == itemno);
    this.OrderNo = orderno;
    this.ItemNo = itemno;

    if (itemdetail) {
      this.orderDetailsForm.soldtoparty.setValue(itemdetail.Soldparty + ' - ' + itemdetail.Soldname1);
      this.orderDetailsForm.shiptoparty.setValue(itemdetail.Shipparty + ' - ' + itemdetail.Shipname1);
      this.orderDetailsForm.ponumber.setValue(itemdetail.Custponumber);
      this.orderDetailsForm.podate.setValue(itemdetail.Podate);
      this.orderDetailsForm.socreateddate.setValue(itemdetail.Socreated);
      this.orderDetailsForm.soitemcreateddate.setValue(itemdetail.Soitemcreated);
      this.orderDetailsForm.importby.setValue(itemdetail.Meanoftran);
      this.orderDetailsForm.employeeresponsible.setValue(itemdetail.Empresno + ' - ' + itemdetail.Empresname);
      this.orderDetailsForm.incoterms.setValue(null);
      this.orderDetailsForm.reqdlvdate.setValue(itemdetail.Requstdeldate);
      this.orderDetailsForm.onelot.setValue(itemdetail.Completedel == 'X' ? 'Yes' : 'No');
      this.orderDetailsForm.length.setValue(itemdetail.Length);
      this.orderDetailsForm.factor.setValue(itemdetail.Factor);
      this.orderDetailsForm.untol.setValue(itemdetail.Untol);
      this.orderDetailsForm.ovtol.setValue(itemdetail.Ovtol);
      this.orderDetailsForm.orderqty.setValue(itemdetail.Orderquantity);
      this.orderDetailsForm.openqty.setValue(itemdetail.Openquantity);
      this.orderDetailsForm.dlvqty.setValue(itemdetail.Delquantity);

      this.modalService.open(this.OrderDetailModel, { size: 'xl' });
    }
  }

  onExport() {
    if (this.openorderlistreport && this.openorderlistreport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Open Order Report - ' + this.createdDate;

    let openorderheader = Config.ReportsHeaders.openorder;

    this.openorderlistreport = this.openorderlistreport.map(item => {
      return {
        [openorderheader[0]]: item.Salesord,
        [openorderheader[1]]: item.Socreated,
        [openorderheader[2]]: item.Soitemcreated,
        [openorderheader[3]]: item.Custponumber,
        [openorderheader[4]]: item.Podate,
        [openorderheader[5]]: item.Empresno + ' - ' + item.Empresname,
        [openorderheader[6]]: item.ItemNo,
        [openorderheader[7]]: item.MaterialNo,
        [openorderheader[8]]: item.MaterialDesc,
        [openorderheader[9]]: item.Orderquantity,
        [openorderheader[10]]: item.Openquantity,
        [openorderheader[11]]: item.Delquantity,
        [openorderheader[12]]: item.Unit,
        [openorderheader[13]]: item.Unitprice,
        [openorderheader[14]]: item.NetValue,
        [openorderheader[15]]: item.Open_Order_Value,
        [openorderheader[16]]: item.Currency,
        [openorderheader[17]]: item.Requstdeldate,
        [openorderheader[18]]: item.MatavlDate,
        [openorderheader[19]]: item.Soldparty + ' - ' + item.Soldname1,
        [openorderheader[20]]: item.Soldstate,
        [openorderheader[21]]: item.Shipparty + ' - ' + item.Shipname1,
        [openorderheader[22]]: item.Shipstate,
        [openorderheader[23]]: item.Meanoftran,
        [openorderheader[24]]: item.Factor,
        [openorderheader[25]]: item.Length,
        [openorderheader[26]]: item.Untol,
        [openorderheader[27]]: item.Ovtol,
        [openorderheader[28]]: item.Warehousename,
        [openorderheader[29]]: item.Laboratory + ' - ' + item.Laboratorydesc,
        [openorderheader[30]]: item.Salesorg,
        [openorderheader[31]]: item.Ompno,
        [openorderheader[32]]: item.Planningblock,
        [openorderheader[33]]: item.Endcustomername
      };
    });

    this.appService.exportAsExcelFile(this.openorderlistreport, fileName);
  }
}