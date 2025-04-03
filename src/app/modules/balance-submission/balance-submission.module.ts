import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";

import { BalanceConfirmationRoutingModule } from "@module/balance-confirmation/balance-confirmation-routing";
import { BalanceSubmissionComponent } from "./balance-submission/balance-submission.component";
import { BalanceSubmissionRoutingModule } from "./balance-submission-routing";


@NgModule({
  declarations: [BalanceSubmissionComponent],
  imports: [
    CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NgSelectModule,
        SharedModule,
        BalanceSubmissionRoutingModule

  ]
})

export class BalanceSubmissionModule{}