import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
// import { AppHeaderComponent } from './components/app-header/app-header.component';
// import { AppFooterComponent } from './components/app-footer/app-footer.component';
// import { AppNavComponent } from './components/app-nav/app-nav.component';
import { Constants } from './constants';
import { NotifierModule } from "angular-notifier";
import { Config } from "src/app/core/configs/config";
import { AlertComponent } from "./directives";
import { AppsearchComponent } from "./components/appsearch/appsearch.component";
import { AllowAlphaNumericDirective } from "./directives/allowAlphaNumeric/allow-alpha-numeric-input.directive";
import { AllowAlphaNumericSpaceDirective } from "./directives/allowAlphaNumericSpace/allow-alpha-numeric-space-input.directive";
import { OnlyDecimalNumberDirective } from "./directives/onlyDecimalNumber/only-decimal-number-input.directive";
import { OnlyNumberDirective } from "./directives/onlyNumber/only-number-input.directive";
import { UppercaseInputDirective } from "./directives/uppecase/uppercase-input.directive";
import { AllowAlphaNumericSpacewithSpecialCharacterDirective } from "./directives/allowAlphaNumericSpacewithSpecialCharacter/allow-alpha-numeric-space-specialcharacter-input.directive";
import { NumericwithDecimalDirective } from "./directives/onlyNumberNumericInput/only-number-numeric-input.directive";
import { OnlyNumberPipeDirective } from "./directives/onlyNumberPipe/only-number-pipe.directive";
import { AllowAlphaNumericDashSlashDirective } from "./directives/allowAlphaNumericDashSlash/allow-alpha-numeric-dash-slash-input.directive";
import { NumericwithDecimalDirectiveMinus } from "./directives/onlyNumberNumericInputMinus/only-number-numeric-input-minus.directive";
import { NoDblClickDirective } from "./directives/noDoubleClick/no-dbl-click.directive";
import { CurrencySymbolPipe } from "./pipes/currency-symbol.pipe";
import {
  AppHeaderComponent,
  AppFooterComponent,
  AppNavComponent,
  AppSubHeaderComponent,
  AppListSubHeaderComponent,
  BreadcrumbComponent,
  DeleteConfirmationComponent,
  ArticleValidityComponent
} from "./components/";
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { ItemsearchComponent } from './components/itemsearch/itemsearch/itemsearch.component';

@NgModule({
  declarations: [
    AppHeaderComponent,
    AppFooterComponent,
    AppNavComponent,
    AlertComponent,
    AppsearchComponent,
    AppSubHeaderComponent,
    AppListSubHeaderComponent,
    BreadcrumbComponent,
    AllowAlphaNumericDirective,
    AllowAlphaNumericSpaceDirective,
    OnlyDecimalNumberDirective,
    OnlyNumberDirective,
    UppercaseInputDirective,
    AllowAlphaNumericSpacewithSpecialCharacterDirective,
    NumericwithDecimalDirective,
    OnlyNumberPipeDirective,
    DeleteConfirmationComponent,
    AllowAlphaNumericDashSlashDirective,
    NumericwithDecimalDirectiveMinus,
    NoDblClickDirective,
    ItemsearchComponent,
    CurrencySymbolPipe,
    ArticleValidityComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgbModule,
    NotifierModule.withConfig(Config.customNotifierOptions)
  ],
  exports: [
    AppHeaderComponent,
    AppFooterComponent,
    AppNavComponent,
    AlertComponent,
    NotifierModule,
    AppsearchComponent,
    AppSubHeaderComponent,
    AppListSubHeaderComponent,
    BreadcrumbComponent,
    AllowAlphaNumericDirective,
    AllowAlphaNumericSpaceDirective,
    OnlyDecimalNumberDirective,
    OnlyNumberDirective,
    UppercaseInputDirective,
    AllowAlphaNumericSpacewithSpecialCharacterDirective,
    NumericwithDecimalDirective,
    OnlyNumberPipeDirective,
    DeleteConfirmationComponent,
    AllowAlphaNumericDashSlashDirective,
    NumericwithDecimalDirectiveMinus,
    NoDblClickDirective,
    ItemsearchComponent,
    CurrencySymbolPipe,
    ArticleValidityComponent
  ],
  entryComponents: [

  ],
  providers: [DatePipe, CurrencyPipe]
})
export class SharedModule { }