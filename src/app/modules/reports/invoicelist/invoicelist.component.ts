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
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-invoicelist',
  templateUrl: './invoicelist.component.html',
  styleUrls: ['./invoicelist.component.css']
})
export class InvoicelistComponent implements OnInit {

  FilterForm: FormGroup;
  OrderDetailsForm: FormGroup;

  submitted: boolean = false;
  dateformate: string;
  createdDate: string;
  usertype: number = 0;
  DealersList: any[] = [];
  invoicelist: any[] = [];
  invoicelistreport: any[] = [];
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
  // PreviousToMindate: any;
  dealerdata: any;
  ItemNo: string;
  StockData: any[] = [];
  lastgenerateddate: string = '';
  Total_Quantity: number = 0;
  Total_Amount: number = 0;
  Total_Net_Value_Amount: number = 0;
  OrderNo: any;
  sonumber: any;
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
      let invoicelistreport = JSON.parse(this.storageService.getValue('Reports')).invoicelist;
      if (invoicelistreport) {
        this.Total_Quantity = 0;
        this.Total_Amount = 0;
        this.Total_Net_Value_Amount = 0;

        this.invoicelist = invoicelistreport.invoicelist;
        this.lastgenerateddate = invoicelistreport.lastgenerateddate;

        this.invoicelist.forEach(element => {
          this.Total_Quantity += element.Quantity;
          this.Total_Amount += element.TotalItemAmt;
          this.Total_Net_Value_Amount += element.ForeignAmount;
        });

        this.Total_Quantity = Number(Number(this.Total_Quantity).toFixed(2));
        this.Total_Amount = Number(Number(this.Total_Amount).toFixed(2));
        this.Total_Net_Value_Amount = Number(Number(this.Total_Net_Value_Amount).toFixed(2));

        this.invoicelistreport = JSON.parse(JSON.stringify(this.invoicelist));
      }
    }

    // let _currenttodate = moment().format('DD/MM/YYYY');
    // this.filterForm.currentto.setValue(_currenttodate);
    // this.CurrentToDate = this.convertDate(_currenttodate);
  }

  buildForm() {
    this.FilterForm = this.formBuilder.group({
      dealer: [null, [Validators.required]],
      currentfrom: [null, [Validators.required]],
      currentto: [null, [Validators.required]],
      sono: [null],
    });

    this.OrderDetailsForm = this.formBuilder.group({
      material: [null],
      quantity: [null],
      uom: [null],
      status: [null],
      invoicestatus: [null],
      soldtoparty: [null],
      shiptoparty: [null],
      ponumber: [null],
      podate: [null],
      employeeresponsible: [null],
      incoterms: [null],
      invoicetype: [null],
      cgstrate: [null],
      cgstamount: [null],
      sgstrate: [null],
      sgstamount: [null],
      igstrate: [null],
      igstamount: [null],
      tcsrate: [null],
      tcsamount: [null],
      inspectioncharges: [null],
      packingcharges: [null],
      cuttingcharges: [null],
      lappgstno: [null],
      payergstno: [null],
      transport: [null],
      paymentterm: [null],
      totalitemamount: [null],
      totalinvoiceamount: [null],
      netitemamount: [null]
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
      invoicefromdate: this.filterForm.currentfrom.value.split('/').reverse().join('-') + 'T00:00:00',
      invoicetodate: this.filterForm.currentto.value.split('/').reverse().join('-') + 'T00:00:00',
      sono: this.filterForm.sono.value ? this.filterForm.sono.value : '',
      useremail: this.usertype == 20 ? '' : this.authService.getCurrentUser().emailid
    }

    this.reportsService.getinvoicelist(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
          this.submitted = false;

          this.Total_Quantity = 0;
          this.Total_Amount = 0;
          this.Total_Net_Value_Amount = 0;

          this.invoicelist = Config.fn_Arr_trim(response.responsedata.data);

          this.invoicelist.forEach(element => {
            element.Quantity = Number(Number(element.Quantity).toFixed(2));
            element.TotalItemAmt = Number(Number(element.TotalItemAmt).toFixed(2));
            element.ForeignAmount = Number(Number(element.ForeignAmount).toFixed(2));

            this.Total_Quantity += element.Quantity;
            this.Total_Amount += element.TotalItemAmt;
            this.Total_Net_Value_Amount += element.ForeignAmount;

            element.InvoiceDate = element.InvoiceDate ? this.datePipe.transform(new Date(Number(element.InvoiceDate.match(/(\d+)/)[0])), this.dateformate) : null;
            element.DueDate = element.DueDate ? this.datePipe.transform(new Date(Number(element.DueDate.match(/(\d+)/)[0])), this.dateformate) : null;
            element.Podate = element.Podate ? this.datePipe.transform(new Date(Number(element.Podate.match(/(\d+)/)[0])), this.dateformate) : null;
            element.Lrdate = element.Lrdate ? this.datePipe.transform(new Date(Number(element.Lrdate.match(/(\d+)/)[0])), this.dateformate) : null;
          });

          this.Total_Quantity = Number(Number(this.Total_Quantity).toFixed(2));
          this.Total_Amount = Number(Number(this.Total_Amount).toFixed(2));
          this.Total_Net_Value_Amount = Number(Number(this.Total_Net_Value_Amount).toFixed(2));

          if (this.authService.getCurrentUser().usertype == 20) {
            let _reportsdata: any = JSON.parse(this.storageService.getValue('Reports'));

            if (_reportsdata)
              delete _reportsdata.invoicelist;
            else
              _reportsdata = {};

            _reportsdata.invoicelist = {
              invoicelist: this.invoicelist,
              lastgenerateddate: this.datePipe.transform(new Date(), 'dd/MM/yyyy hh:mm:ss')
            };
            this.lastgenerateddate = _reportsdata.invoicelist.lastgenerateddate;
            this.storageService.setValue('Reports', JSON.stringify(_reportsdata));
          }

          this.invoicelistreport = JSON.parse(JSON.stringify(this.invoicelist));
        } else {
          this.invoicelist = [];
          this.invoicelistreport = [];
          this.notificationService.showInfo('There is no data');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onOrderDetailClick(orderno: any, itemno: any) {
    let itemdetail = this.invoicelist.find(x => x.InvoiceNo == orderno && x.InvoiceItem == itemno);
    this.OrderNo = orderno;
    this.ItemNo = itemno;

    if (itemdetail) {
      this.orderDetailsForm.material.setValue(itemdetail.Matnr + ' - ' + itemdetail.Maktx);
      this.orderDetailsForm.quantity.setValue(itemdetail.Quantity);
      this.orderDetailsForm.uom.setValue(itemdetail.Salesunit);
      this.orderDetailsForm.status.setValue(itemdetail.Status);
      this.orderDetailsForm.invoicestatus.setValue(itemdetail.Opencloseinvtype);

      this.orderDetailsForm.soldtoparty.setValue(itemdetail.Payer + ' - ' + itemdetail.PayerName);
      this.orderDetailsForm.shiptoparty.setValue(itemdetail.ShipName);
      this.orderDetailsForm.ponumber.setValue(itemdetail.Custponumber);
      this.orderDetailsForm.podate.setValue(itemdetail.Podate);

      this.orderDetailsForm.employeeresponsible.setValue(itemdetail.SalesPerson + ' - ' + itemdetail.SalesPersonName);
      this.orderDetailsForm.incoterms.setValue(itemdetail.Incoterm1 + ' - ' + itemdetail.Inco1Desc);
      this.orderDetailsForm.invoicetype.setValue(itemdetail.InvoiceType + ' - ' + itemdetail.InvoiceTypeText);
      this.orderDetailsForm.cgstrate.setValue(itemdetail.CgstRate);
      this.orderDetailsForm.cgstamount.setValue(itemdetail.CgstAmount);
      this.orderDetailsForm.sgstrate.setValue(itemdetail.SgstRate);
      this.orderDetailsForm.sgstamount.setValue(itemdetail.SgstAmount);

      this.orderDetailsForm.igstrate.setValue(itemdetail.IgstRate);
      this.orderDetailsForm.igstamount.setValue(itemdetail.IgstAmount);
      this.orderDetailsForm.tcsrate.setValue(itemdetail.TcsRate);
      this.orderDetailsForm.tcsamount.setValue(itemdetail.TcsAmount);

      this.orderDetailsForm.inspectioncharges.setValue(itemdetail.InspectionCharges);
      this.orderDetailsForm.packingcharges.setValue(itemdetail.PackingCharges);
      this.orderDetailsForm.cuttingcharges.setValue(itemdetail.CuttingCharges);

      this.orderDetailsForm.lappgstno.setValue(itemdetail.LappGstNo);
      this.orderDetailsForm.payergstno.setValue(itemdetail.PayerGstNo);
      this.orderDetailsForm.transport.setValue(itemdetail.Trno + ' - ' + itemdetail.Tname);

      this.orderDetailsForm.paymentterm.setValue(itemdetail.PaymentTerm + ' - ' + itemdetail.PaymentTermText);

      this.orderDetailsForm.totalitemamount.setValue(itemdetail.TotalItemAmt);
      this.orderDetailsForm.totalinvoiceamount.setValue(itemdetail.TotalInvAmt);
      this.orderDetailsForm.netitemamount.setValue(itemdetail.NetItemAmountInr);

      this.modalService.open(this.OrderDetailModel, { size: 'xl' });
    }
  }

  onExport() {
    if (this.invoicelistreport && this.invoicelistreport.length == 0) {
      this.notificationService.showError('There is no data to export.');
      return;
    }

    let fileName = 'Invoice List Report - ' + this.createdDate;

    let invoicelistheader = Config.ReportsHeaders.invoicelist;
    this.invoicelistreport = this.invoicelistreport.map(item => {
      return {
        [invoicelistheader[0]]: item.GstInvNo,
        [invoicelistheader[1]]: item.InvoiceDate,
        [invoicelistheader[2]]: item.TotalItemAmt,
        [invoicelistheader[3]]: item.Currency,
        [invoicelistheader[4]]: item.InvoiceItem,
        [invoicelistheader[5]]: item.Matnr,
        [invoicelistheader[6]]: item.Maktx,
        [invoicelistheader[7]]: item.Quantity,
        [invoicelistheader[8]]: item.Salesord,
        [invoicelistheader[9]]: item.DeliveryNo,
        [invoicelistheader[10]]: item.Lrno,
        [invoicelistheader[11]]: item.Lrdate,
        [invoicelistheader[12]]: item.Trno + ' - ' + item.Tname,
        [invoicelistheader[13]]: item.Custponumber,
        [invoicelistheader[14]]: item.Podate,
        [invoicelistheader[15]]: item.InvoiceNo,
        [invoicelistheader[16]]: item.SalesPerson + ' - ' + item.SalesPersonName
      };
    });

    this.appService.exportAsExcelFile(this.invoicelistreport, fileName);
  }

  // printOrder(OrderNo: any) {
  //   this.OrderNo = OrderNo;
  //   this.reportsService.Invoicepdf(this.OrderNo).subscribe(
  //     response => {
  //       if (response && response.data && response.data.pdfdata) {
  //         const blob = new Blob([response.data.pdfdata], { type: 'application/pdf' });
  //         saveAs(blob, `${OrderNo}_Invoice.pdf`);
  //       }
  //     },
  //     error => {
  //       this.notificationService.showError(error.error.error.message);
  //     }
  //   );
  // }


  printOrder(OrderNo: any) {
    this.OrderNo = OrderNo;
    this.reportsService.Invoicepdf(this.OrderNo).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        saveAs(blob, `${OrderNo}_Invoice.pdf`);
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      }
    );
  }



}