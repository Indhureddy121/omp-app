import { Component, OnInit, ViewChild } from "@angular/core";
import { NotificationService } from "@core/services/common/notification.service";
import { OrdersService } from "@core/services/orders/orders.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ItemsList } from "@ng-select/ng-select/lib/items-list";

@Component({
  selector: "app-request-approval",
  templateUrl: "./request-approval.component.html",
  styleUrls: ["./request-approval.component.css"],
})
export class RequestApprovalComponent implements OnInit {
  approvalList: any[];
  approvalLineItem: any;
  actionComment: string;
  @ViewChild("ApprovalRequestModel", { static: false })
  ApprovalRequestModel: any;

  constructor(
    private ordersService: OrdersService,
    private notificationService: NotificationService,
    private modalService: NgbModal
  ) {}

  ngOnInit() {
    this.loadData();
  }

  onRefreshClick() {
    this.loadData();
  }
  loadData() {
    this.ordersService.pendingCancellationApproval().subscribe((res: any) => {
      this.approvalList = res.data[0].map((item) => {
        return {
          ...item,
          metatada: JSON.parse(item.metadata),
        };
      });
      console.log(this.approvalList);
    });
  }

  takeAction(id: number, cancellationId: number, action: string) {
    const payload = {
      historyId: id,
      cancellationId,
      action,
      comment: this.actionComment,
    };
    this.ordersService.cancellationRequestAction(payload).subscribe(
      (res) => {
        console.log(res);
        this.notificationService.showSuccess("Your action captured.!");
        this.actionComment = "";
        this.loadData();
      },
      (err) => {
        console.log(err.error.error.message);
        this.notificationService.showError(err.error.error.message);
        this.actionComment = "";
        this.loadData();
      }
    );
  }

  openActionModel(id: number) {
    this.approvalLineItem = this.approvalList.find(
      (item) => item.approval_history_id === id
    );
    console.log(this.approvalLineItem);
    this.modalService.open(this.ApprovalRequestModel, { size: "xl" });
  }
}
