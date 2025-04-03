import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { BalanceConfimationComponent } from './balance-confimation/balance-confimation.component';
import { BalanceConfirmationRoutingModule } from './balance-confirmation-routing';


@NgModule({
  declarations: [BalanceConfimationComponent],
  imports: [
    CommonModule,
		FormsModule,
		ReactiveFormsModule,
		NgSelectModule,
		SharedModule,
    BalanceConfirmationRoutingModule
  ]
})
export class BalanceConfirmationModule { }
