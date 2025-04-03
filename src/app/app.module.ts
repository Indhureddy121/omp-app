import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './modules/userprofile/pages/home/home.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { InnerLayoutComponent } from './layouts/inner-layout/inner-layout.component';
import { SharedModule } from './shared/shared.module';
import { NgSelectModule } from "@ng-select/ng-select";
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlertComponent } from "./shared/directives";
import { Config } from "src/app/core/configs/config";

// import { InterceptService } from '@core/services/common/http.interceptor';
// import { LoaderComponent } from './shared/loader/loader.component';
import { NgxUiLoaderModule, NgxUiLoaderHttpModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';
import { NgbActiveModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateCustomParserFormatter } from "././ngb-date-parser-formatter";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PwaService } from '@core/services/pwa/pwa.service';
import { CommonModule } from '@angular/common';



const initializer = (pwaService: PwaService) => () => pwaService.initPwaPrompt();

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    InnerLayoutComponent,
    AuthLayoutComponent,

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    CoreModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    NgxUiLoaderModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: environment.production,
    }),
  ],
  providers: [NgbActiveModal,
   { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
   {provide: APP_INITIALIZER, useFactory: initializer, deps: [PwaService], multi: true},],
  bootstrap: [AppComponent]
})
export class AppModule { }
