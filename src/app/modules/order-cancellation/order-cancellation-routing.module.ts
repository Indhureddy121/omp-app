import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { SoListComponent } from "./so-list/so-list.component";
import { ApprovalMatrixComponent } from "./approval-matrix/approval-matrix.component";
import { RequestApprovalComponent } from "./request-approval/request-approval.component";
import { ListComponent } from "./list/list.component";

const routes: Routes = [
  {
    path: "",
    data: { breadcrumb: "SO List for Cancellation" },
    component: SoListComponent,
  },
  {
    path: "approval-matrix",
    data: { breadcrumb: "SO Cancellation Approval Matrix" },
    component: ApprovalMatrixComponent,
  },
  {
    path: "request-approval",
    data: { breadcrumb: "SO Cancellation Request Approval" },
    component: RequestApprovalComponent,
  },
  {
    path: "list",
    data: { breadcrumb: "Cancelled SO List" },
    component: ListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderCancellationRoutingModule {}
