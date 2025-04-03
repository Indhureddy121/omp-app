import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SoListComponent } from './so-list/so-list.component';
import { OrderCancellationRoutingModule } from './order-cancellation-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ApprovalMatrixComponent } from './approval-matrix/approval-matrix.component';
import { RequestApprovalComponent } from './request-approval/request-approval.component';
import { ListComponent } from './list/list.component';



@NgModule({
  declarations: [SoListComponent, ApprovalMatrixComponent, RequestApprovalComponent, ListComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgbModule,
    SharedModule,
    OrderCancellationRoutingModule,
  ]
})
export class OrderCancellationModule { }
