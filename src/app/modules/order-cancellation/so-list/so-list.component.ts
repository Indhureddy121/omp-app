import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "@core/services/auth/auth.service";
import { NotificationService } from "@core/services/common/notification.service";
import { CustomerService } from "@core/services/masters/customer.service";
import { OmpusersService } from "@core/services/masters/ompusers.service";
import { OrdersService } from "@core/services/orders/orders.service";
import { ReportsService } from "@core/services/reports/reports.service";
import { NgbDateParserFormatter, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { saveAs } from "file-saver";
import * as moment from "moment";
import { forkJoin } from "rxjs";
import { AppService } from "src/app/app.service";
import { Config } from "src/app/core/configs/config";
@Component({
  selector: "app-so-list",
  templateUrl: "./so-list.component.html",
  styleUrls: ["./so-list.component.css"],
})
export class SoListComponent implements OnInit {
  @ViewChild("OrderDashboardInvoiceModel", { static: false })
  OrderDashboardInvoiceModel: any;
  @ViewChild("OrderDashboardDeliveryModel", { static: false })
  OrderDashboardDeliveryModel: any;
  dateformate: string;
  SAPForm: FormGroup;
  CurrentFromDate: { year: number; month: number; day: number };
  CurrentToDate: { year: number; month: number; day: number };
  CurrentToMindate: any;
  CurrentToMaxdate: any;
  submitted: boolean = false;
  OrderListReport: any[] = [];
  ompList: any = [
    {
      code: "O",
      name: "Offer",
    },
    {
      code: "C",
      name: "CPO",
    },
    {
      code: "S",
      name: "Stock Order",
    },
    {
      code: "R",
      name: "Rate Contract",
    },
  ];
  orderStatus: any = [
    {
      name: "Completely processed",
    },
    {
      name: "Partially processed",
    },
    {
      name: "Not yet processed",
    },
  ];
  sapData: any = [];
  invoiceData: any = [];
  deliveryData: any = [];
  reasons = [
    { reason: "13 Cancelled by customer" },
    { reason: "04 Competitor better" },
    { reason: "24 Delay in Delivery" },
    { reason: "16 Double entry" },
    { reason: "Y5 Order lost on price" },
    { reason: "Z4 Short closed by Customer / Dealer" },
    { reason: "50 Transaction is being checked" },
    { reason: "17 Transferred to Firm Order" },
    { reason: "Z8 Wrong Order Entry" },
  ];
  selectedReasons: {
    Salesorder: number;
    Salesitem: string;
    cancellationReason: string;
    status: string;
    comment: string;
    metadata: {};
  }[] = [];
  approverList = [];
  soNumber = "";
  itemNumber = "";
  @ViewChild("CancelConfirmationModal", { static: false })
  CancelConfirmationModal: any;
  @ViewChild("ApprovalHistoryModal", { static: false })
  ApprovalHistoryModal: any;
  @ViewChild("CompletelyProcessed", { static: false })
  CompletelyProcessed: any;
  dealerdata: any;
  usertype: number = 0;
  DealersList: any[] = [];
  createdDate: string;

  constructor(
    private datePipe: DatePipe,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public formatter: NgbDateParserFormatter,
    private ompusersService: OmpusersService,
    private notificationService: NotificationService,
    private modalService: NgbModal,
    private appService: AppService,
    public customerService: CustomerService,
    private reportsService: ReportsService,
    private ordersService: OrdersService
  ) {}

  get sapForm() {
    return this.SAPForm.controls;
  }

  ngOnInit() {
    this.dateformate = this.authService.getDateFormat();
    this.usertype = this.authService.getCurrentUser().usertype;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    if (this.usertype == 20) {
      this.GetDealerDetail();
    }
    this.SAPForm = this.formBuilder.group({
      sold_to: [null],
      currentfrom: [null],
      currentto: [null],
      omp_login_id: [this.authService.getCurrentUser().emailid],
      sales_order: [null],
      cust_po_no: [null],
      material: [null],
      omp: ["O"],
      order_status: [null],
      omp_text: [null],
    });

    const salesOrderControl = this.SAPForm.get("sales_order");
    const custPoNumberControl = this.SAPForm.get("cust_po_no");
    const ompNumberControl = this.SAPForm.get("omp");
    const omp_textControl = this.SAPForm.get("omp_text");

    const currentfromControl = this.SAPForm.get("currentfrom");
    const currenttoControl = this.SAPForm.get("currentto");

    const toggleDateRangeValidators = () => {
      const salesOrderValue = salesOrderControl.value;
      const custPoNumberValue = custPoNumberControl.value;
      const ompNumberValue = ompNumberControl.value;
      const omp_text = omp_textControl.value;

      if (salesOrderValue || custPoNumberValue || ompNumberValue + omp_text) {
        currentfromControl.clearValidators();
        currenttoControl.clearValidators();
      } else {
        currentfromControl.setValidators([Validators.required]);
        currenttoControl.setValidators([Validators.required]);
      }

      currentfromControl.updateValueAndValidity();
      currenttoControl.updateValueAndValidity();
    };

    salesOrderControl.valueChanges.subscribe(toggleDateRangeValidators);
    custPoNumberControl.valueChanges.subscribe(toggleDateRangeValidators);
    ompNumberControl.valueChanges.subscribe(toggleDateRangeValidators);
    omp_textControl.valueChanges.subscribe(toggleDateRangeValidators);
  }

  GetDealerDetail() {
    this.customerService
      .getCustomerById(this.authService.getUserId())
      .subscribe(
        (response) => {
          if (
            response.responsedata &&
            response.responsedata.statusCode == 200 &&
            response.responsedata.data &&
            response.responsedata.data.length > 0
          ) {
            this.dealerdata = response.responsedata.data[0];
            this.sapForm.sold_to.setValue(
              this.dealerdata.sapid + " - " + this.dealerdata.customername
            );
          }
        },
        (error) => {
          this.notificationService.showError(error.error.error.message);
        }
      );
  }

  GetDealersList() {
    let element = document.getElementById(
      "ngSelectDealers"
    ) as HTMLInputElement;
    if (element.value && element.value.length >= 3) {
      this.GetDealersListAPI(element.value);
    }
  }

  GetDealersListAPI(dealer: string) {
    this.customerService.getdealerslist(dealer).subscribe(
      (response) => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.DealersList = response.responsedata.data;
        }
      },
      (error) => {
        this.DealersList = [];
        this.notificationService.showError(error.error.error.message);
      }
    );
  }
  convertDate(date) {
    const year = Number(date.split("/")[2]);
    const month = Number(date.split("/")[1]);
    const day = Number(date.split("/")[0]);
    let newdate: { year: number; month: number; day: number } = {
      year: year,
      month: month,
      day: day,
    };
    return newdate;
  }

  OnCurrentFromDateSelection(date: any) {
    let currentfromdate = new Date(
      date.year,
      date.month - 1,
      date.day
    ).toString();
    currentfromdate = this.datePipe.transform(
      currentfromdate,
      this.dateformate
    );
    this.sapForm.currentfrom.setValue(currentfromdate);
    this.CurrentFromDate = this.convertDate(this.sapForm.currentfrom.value);
    this.CurrentToMindate = this.CurrentFromDate;

    let maxdate = moment(currentfromdate, "DD/MM/YYYY")
      .add(90, "days")
      .format("DD/MM/YYYY");
    this.CurrentToDate = this.convertDate(maxdate); //Setting the date automatically to the dat after 3 months
    this.sapForm.currentto.setValue(maxdate);
    this.CurrentToMaxdate = this.convertDate(maxdate);

    if (
      this.sapForm.currentto.value &&
      new Date(this.sapForm.currentfrom.value.split("/").reverse().join("-")) >
        new Date(this.sapForm.currentto.value.split("/").reverse().join("-"))
    ) {
      this.CurrentToDate = this.convertDate(currentfromdate);
      this.sapForm.currentto.setValue(currentfromdate);
    }
  }

  OnCurrentToDateSelection(date: any) {
    let currenttodate = new Date(
      date.year,
      date.month - 1,
      date.day
    ).toString();
    currenttodate = this.datePipe.transform(currenttodate, this.dateformate);
    this.sapForm.currentto.setValue(currenttodate);
    this.CurrentToDate = this.convertDate(this.sapForm.currentto.value);
  }

  OnGenerateReportClick() {
    this.submitted = true;

    if (!this.SAPForm.valid) {
      return;
    }

    //Concat omp dropdown value and  omp text value and later removing omp_text value
    if (
      this.SAPForm.value.omp != null &&
      this.SAPForm.value.omp_text != null &&
      this.SAPForm.value.omp_text != ""
    ) {
      this.SAPForm.value.omp += this.SAPForm.value.omp_text;
    } else if (
      this.SAPForm.value.omp_text == null ||
      this.SAPForm.value.omp_text == ""
    ) {
      this.SAPForm.value.omp = null;
    }

    this.SAPForm.value.sold_to =
      this.usertype == 20 ? this.dealerdata.sapid : this.sapForm.sold_to.value;

    let obj = {
      currentfrom: this.SAPForm.value.currentfrom
        ? this.SAPForm.value.currentfrom.split("/").reverse().join("-") +
          "T00:00:00"
        : null,
      currentto: this.SAPForm.value.currentto
        ? this.SAPForm.value.currentto.split("/").reverse().join("-") +
          "T00:00:00"
        : null,
      cust_po_no: this.SAPForm.value.cust_po_no,
      material: this.SAPForm.value.material,
      omp: this.SAPForm.value.omp,
      omp_text: this.SAPForm.value.omp_text,
      omp_login_id: this.SAPForm.value.omp_login_id,
      order_status: this.SAPForm.value.order_status,
      sales_order: this.SAPForm.value.sales_order,
      sold_to: this.SAPForm.value.sold_to,
    };

    delete obj.omp_text;

    forkJoin([
      this.ordersService.SAPOrders(obj),
      this.ordersService.getAllCancellations(),
    ]).subscribe(
      ([res, cancellationsResponse]) => {
        this.sapData = res.responsedata.data;
        this.sapData.forEach((element) => {
          const formatDate = (date) => moment(date).format("DD-MM-YYYY");

          element["Ordercreateddate"] = element["Ordercreateddate"]
            ? formatDate(element["Ordercreateddate"])
            : "";
          element["Custpodate"] = element["Custpodate"]
            ? formatDate(element["Custpodate"])
            : "";
          element["Itemcreatedate"] = element["Itemcreatedate"]
            ? formatDate(element["Itemcreatedate"])
            : "";
          element["DeliveryDate"] = element["DeliveryDate"]
            ? formatDate(element["DeliveryDate"])
            : "";
          element["Matavaldate"] = element["Matavaldate"]
            ? formatDate(element["Matavaldate"])
            : "";

          element.DBORDTODELIVERYNAV.results.forEach((data) => {
            data["Delcreateddate"] = data["Delcreateddate"]
              ? formatDate(data["Delcreateddate"])
              : "";
          });

          element.DBORDTOINVOICENAV.results.forEach((data) => {
            data["Billingdate"] = data["Billingdate"]
              ? formatDate(data["Billingdate"])
              : "";
          });
        });
        this.OrderListReport = JSON.parse(JSON.stringify(this.sapData));

        this.sapData = this.sapData.map((order) => {
          const matchingCancellations =
            cancellationsResponse.response.data.filter((cancellation) => {
              return (
                cancellation.sold_to_id === order.Soldtoparty &&
                cancellation.so_number === order.Salesorder &&
                cancellation.item_number === order.Salesitem
              );
            });

          // Get the last matching cancellation
          const matchingCancellation = matchingCancellations.length
            ? matchingCancellations[matchingCancellations.length - 1]
            : null;

          const isCancellationRequested = !!matchingCancellation;

          return {
            ...order,
            cancellationInProgress: isCancellationRequested,
            status: matchingCancellation ? matchingCancellation.status : null,
            comment: matchingCancellation ? matchingCancellation.comment : null,
          };
        });

        //filter for non completed SO
        this.sapData = this.sapData.filter(
          (data) => data.Itemorderstatus !== "Completely Processed"
        );
        console.log(this.sapData);
      },
      () => {}
    );
  }

  onDeliveryLinkClicked(deliveryData: any) {
    this.deliveryData = deliveryData;
    this.modalService.open(this.OrderDashboardDeliveryModel, { size: "xl" });
  }

  onInvoiceLinkClicked(invoiceData: any) {
    this.invoiceData = invoiceData;
    this.modalService.open(this.OrderDashboardInvoiceModel, { size: "xl" });
  }

  sendSoNo(sono: any) {
    this.reportsService.salesorderpdf(sono).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: "application/pdf" });
        saveAs(blob, `${sono}_sales_order.pdf`);
      },
      (error) => {
        this.notificationService.showError(error.error.error.message);
      }
    );
  }

  onExport() {
    if (this.OrderListReport && this.OrderListReport.length == 0) {
      this.notificationService.showError("There is no data to export.");
      return;
    }

    let fileName = "Order Dashboard Report - " + this.createdDate;

    let orderdashboardheader = Config.ReportsHeaders.sapOrderDashboard;
    this.OrderListReport = this.OrderListReport.map((item) => {
      return {
        [orderdashboardheader[0]]: item.Salesorder,
        [orderdashboardheader[1]]: item.Salesitem,
        [orderdashboardheader[2]]: item.Ompno,
        [orderdashboardheader[3]]: item.Ordercreateddate,
        [orderdashboardheader[4]]: item.Ordercreatedby,
        [orderdashboardheader[5]]: item.Soldtoparty,
        [orderdashboardheader[6]]: item.Soldtoname,
        [orderdashboardheader[7]]: item.Ordertype,
        [orderdashboardheader[8]]: item.Ordertypedesc,
        [orderdashboardheader[9]]: item.Salesorg,
        [orderdashboardheader[10]]: item.Salesdistribution,
        [orderdashboardheader[11]]: item.Salesdivision,
        [orderdashboardheader[12]]: item.Custponumber,
        [orderdashboardheader[13]]: item.Custpodate,
        [orderdashboardheader[14]]: item.Ordervaluehdr,
        [orderdashboardheader[15]]: item.Emprespnumber,
        [orderdashboardheader[16]]: item.Emprespname,
        [orderdashboardheader[17]]: item.Endcustname,
        [orderdashboardheader[18]]: item.Orderstatus,
        [orderdashboardheader[19]]: item.Plant,
        [orderdashboardheader[20]]: item.Itemcreatedate,
        [orderdashboardheader[21]]: item.Materialno,
        [orderdashboardheader[22]]: item.MaterialDesc,
        [orderdashboardheader[23]]: item.Quantity,
        [orderdashboardheader[24]]: item.Unit,
        [orderdashboardheader[25]]: item.Factor,
        [orderdashboardheader[26]]: item.Length,
        [orderdashboardheader[27]]: item.Untol,
        [orderdashboardheader[28]]: item.Ovtol,
        [orderdashboardheader[29]]: item.Unitprice,
        [orderdashboardheader[30]]: item.Currency,
        [orderdashboardheader[31]]: item.DeliveryDate,
        [orderdashboardheader[32]]: item.Openquanity,
        [orderdashboardheader[33]]: item.Matavaldate,
        [orderdashboardheader[34]]: item.Ordervalue,
        [orderdashboardheader[35]]: item.Openvalue,
        [orderdashboardheader[36]]: item.Delvalue,
        [orderdashboardheader[37]]: item.Itemorderstatus,
        [orderdashboardheader[38]]: item.City,
        [orderdashboardheader[39]]: item.Postalcode,
      };
    });
    this.appService.exportAsExcelFile(this.OrderListReport, fileName);
  }

  printOrder(invoiceNo: any) {
    this.reportsService.Invoicepdf(invoiceNo).subscribe(
      (response: Blob) => {
        const blob = new Blob([response], { type: "application/pdf" });
        saveAs(blob, `${invoiceNo}_Invoice.pdf`);
      },
      (error) => {
        this.notificationService.showError(error.error.error.message);
      }
    );
  }

  onReasonChange(sg: any) {
    const existingIndex = this.selectedReasons.findIndex(
      (item) =>
        item.Salesorder === sg.Salesorder && item.Salesitem === sg.Salesitem
    );
    if (sg.cancellationReason) {
      if (existingIndex > -1) {
        this.selectedReasons[existingIndex] = {
          Salesorder: sg.Salesorder,
          Salesitem: sg.Salesitem,
          cancellationReason: sg.cancellationReason,
          status: "PENDING",
          comment: "Pending Approval",
          metadata: sg,
        };
      } else {
        this.selectedReasons.push({
          Salesorder: sg.Salesorder,
          Salesitem: sg.Salesitem,
          cancellationReason: sg.cancellationReason,
          status: "PENDING",
          comment: "Pending Approval",
          metadata: sg,
        });
      }
    } else {
      if (existingIndex > -1) {
        this.selectedReasons.splice(existingIndex, 1);
      }
    }
  }

  submitCancellation() {
    console.log(this.selectedReasons);
    this.modalService.open(this.CancelConfirmationModal, { size: "xl" });
  }

  confirmDelete() {
    const payload = { items: this.selectedReasons };
    this.ordersService.updateOrCreateCancellation(payload).subscribe(
      (res: any) => {
        if (
          res.response.data.notInsertedRecords &&
          res.response.data.notInsertedRecords.length > 0
        ) {
          res.response.data.notInsertedRecords.forEach((record) => {
            this.notificationService.showError(
              `${record.error} on SO: ${record.item.Salesorder} - No: ${record.item.Salesitem}`
            );
          });
        } else {
          this.notificationService.showSuccess(
            "Cancellation request processed successfully.!"
          );
        }
        this.OnGenerateReportClick();
      },
      (err: any) => {
        this.notificationService.showError(
          JSON.stringify(err.error.error.message)
        );
        this.OnGenerateReportClick();
        console.log(err);
      }
    );
    this.selectedReasons = [];
  }

  fetchApprovers(item: any) {
    this.approverList = [];
    this.soNumber = item.Salesorder;
    this.itemNumber = item.Salesitem;
    this.ordersService
      .fetchApprovalHistory(this.soNumber, this.itemNumber)
      .subscribe(
        (approvers) => {
          this.approverList = [...approvers.data];
          console.log(approvers.data);
        },
        (err) => this.notificationService.showError(err.error.error.message)
      );
    this.modalService.open(this.ApprovalHistoryModal, { size: "xl" });
  }
  onRowClick(ol: any) {
    if (ol.Itemorderstatus === "Completely Processed") {
      this.modalService.open(this.CompletelyProcessed, { size: "md" });
    }
  }
}
