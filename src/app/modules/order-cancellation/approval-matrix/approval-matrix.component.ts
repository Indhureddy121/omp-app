import { Component, OnInit } from "@angular/core";
import { NotificationService } from "@core/services/common/notification.service";
import { OrdersService } from "@core/services/orders/orders.service";
import * as moment from "moment";
import { AppService } from "src/app/app.service";

@Component({
  selector: "app-approval-matrix",
  templateUrl: "./approval-matrix.component.html",
  styleUrls: ["./approval-matrix.component.css"],
})
export class ApprovalMatrixComponent implements OnInit {
  approvalList: any[];
  exportApprovalList :any[];
  createdDate: any;
  constructor(
    private ordersService: OrdersService,
    private notificationService: NotificationService,
    private appService: AppService
  ) {}

  ngOnInit() {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.loadData();
  }
  onRefreshClick() {
    this.loadData();
  }
  onExport(){
    let approvalListHeader = ["Region", "Division", "Order Value (in INR)", "Approvers"];

          this.exportApprovalList = this.approvalList.map(item => {
            return {
              [approvalListHeader[0]]: item.region,
              [approvalListHeader[1]]: item.division,
              [approvalListHeader[2]]: item.order_value_range,
              [approvalListHeader[3]]: item.approvers,
            };
          });

          let fileName = 'SO Cancellation Approval Matrix - ' + this.createdDate;

          this.appService.exportAsExcelFile(this.exportApprovalList, fileName);
  }
  loadData() {
    this.ordersService.getSOCancellationApprovalMatrix().subscribe(
      (matrix: any) => {
        this.approvalList = matrix.response.data;
      },
      (err) => {
        this.notificationService.showError(err.error.error.message);
      }
    );
  }
}
