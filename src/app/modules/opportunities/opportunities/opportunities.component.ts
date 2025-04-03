import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { OpportunitiesService } from '@core/services/opportunities/opportunities.service';
import { AuthService } from '@core/services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { CurrencyPipe } from '@angular/common';
import { OffersService } from '@core/services/offers/offers.service';
import { StockorderService } from '@core/services/stockorder/stockorder.service';
import { OfferStatusEnum } from '@core/enums/offerstatus.enum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Config } from '@core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-opportunities',
  templateUrl: './opportunities.component.html',
  styleUrls: ['./opportunities.component.css']
})
export class OpportunitiesComponent implements OnInit {

  OpportunityForm: FormGroup;

  isView = false;
  oppo_id: string;
  oppo_data: any;
  contactdetail: any[] = [];
  offerslist: any[] = [];
  userid: number;
  dateFormate: string;
  canOfferCreate: boolean = false;
  canMakeaClone: boolean = false;
  usertype: number = 0;
  approvalComments: any[] = [];
  @ViewChild('ApprovalCommentsModel', { static: false }) ApprovalCommentsModel: any;
  opportunityValidityErrorMsg: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private opportunitiesService: OpportunitiesService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private datePipe: DatePipe,
    private currencyPipe: CurrencyPipe,
    private offersService: OffersService,
    private modalService: NgbModal,
    private stockorderService: StockorderService,
    private notificationService: NotificationService
  ) {
    this.opportunityValidityErrorMsg = "Please update the opportunity close date in SFDC/OMP such that close date must be greater than today date.";
  }

  get opportunityForm() { return this.OpportunityForm.controls; }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.oppo_id = parms['id'];
    });
    this.onLoad();
  }

  private onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.userid = this.authService.getUserId();
    this.usertype = this.authService.getCurrentUser().usertype;
    this.onbuildForm();
    this.loadPageMode();
    this.disableFields();
  }

  private onbuildForm() {
    this.OpportunityForm = this.formBuilder.group({
      opportunityid: [''],
      lappopportunityid: [''],
      accountid: [''],
      name: [''],
      opportunityvalue: [''],
      amount: [''],
      closedate: [''],
      ownerid: [''],
      createddate: [''],
      createdby: [''],
      stage: [''],
      nacecode: [''],
      // nacedescription: [''],
      nacelevel: [''],
      nacemodel: [''],
      businessmodel: [''],
      Business_Segment2: [''],
      Business_Segment3: ['']
    });
  }

  private loadPageMode() {
    let currentUrl = this.router.url;

    if (currentUrl.includes('view')) {
      this.isView = true;
      this.getDetaildata();
    }
  }

  private disableFields() {
    this.OpportunityForm.disable();
  }

  cancelClicked() {
    this.router.navigateByUrl('/opportunities/list');
  }

  backClicked() {
    this.router.navigateByUrl('/opportunities/list');
  }

  getDetaildata() {
    this.opportunitiesService.getDetail(this.oppo_id).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.oppo_data = response.responsedata.data[0];
          this.setData(this.oppo_data);
          this.getOppoOffersList();
          this.getAccountContactDetail(this.oppo_data.customer_id);

          if (this.oppo_data.nacecode)
            this.getNaceDetail(this.oppo_data.nacecode);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private setData(data: any) {
    this.OpportunityForm.patchValue({
      opportunityid: data.opportunity_id,
      lappopportunityid: data.lappopportunityid,
      accountid: data.customerfullname,
      name: data.customer_name,
      stage: data.stage,
      opportunityvalue: this.currencyPipe.transform(data.oppValue, 'INR'),
      amount: this.currencyPipe.transform(data.offervalue, 'INR'),
      closedate: this.datePipe.transform(data.expiredate, this.dateFormate),
      ownerid: data.username,
      createddate: this.datePipe.transform(data.createddate, this.dateFormate),
      createdby: data.createdby,
      businessmodel: data.businessmodel,
      Business_Segment2: data.Business_Segment2,
      Business_Segment3: data.Business_Segment3
    });
  }

  private getAccountContactDetail(id: string) {
    this.offersService.getAccountContactDetail(id).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.length > 0)
            this.contactdetail = response.responsedata.data;
          else
            this.contactdetail = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private getNaceDetail(nacecode: string) {
    this.opportunitiesService.getNaceDetail(nacecode).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.opportunityForm.nacecode.setValue(this.oppo_data.nacecode + ' - ' + response.responsedata.data.description);
          this.opportunityForm.nacelevel.setValue(response.responsedata.data.level);
          this.opportunityForm.nacemodel.setValue(response.responsedata.data.model);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getOppoOffersList() {
    this.offersService.getOppoOffersList(this.oppo_id).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.offerslist = response.responsedata.data;

          if (this.offerslist && this.offerslist.length > 0) {

            if (this.offerslist[0].status < 80 && this.oppo_data.opportunitytype == 10 && this.usertype == 0)
              this.offerslist[0].canMakeaClone = true;
            else if (this.offerslist[0].status < 72 && (this.oppo_data.opportunitytype == 20 || this.oppo_data.opportunitytype == 30) && this.usertype != 0)
              this.offerslist[0].canMakeaClone = true;
            else
              this.offerslist[0].canMakeaClone = false;

          }

          this.setStatus();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      }
    );
  }

  setStatus() {
    this.offerslist.forEach(element => {
      if (element.status == 10)
        element.showstatus = OfferStatusEnum.ten;
      else if (element.status == 20)
        element.showstatus = OfferStatusEnum.twenty;
      else if (element.status == 30)
        element.showstatus = OfferStatusEnum.thirty;
      else if (element.status == 40)
        element.showstatus = OfferStatusEnum.fourty;
      else if (element.status == 50)
        element.showstatus = OfferStatusEnum.fifty;
      else if (element.status == 54)
        element.showstatus = OfferStatusEnum.fiftyfour;
      else if (element.status == 55)
        element.showstatus = OfferStatusEnum.fiftyfive;
      else if (element.status == 57)
        element.showstatus = OfferStatusEnum.fiftyseven;
      else if (element.status == 59)
        element.showstatus = OfferStatusEnum.fiftynine;
      else if (element.status == 60)
        element.showstatus = OfferStatusEnum.sixty;
      else if (element.status == 62)
        element.showstatus = OfferStatusEnum.sixtytwo;
      else if (element.status == 70)
        element.showstatus = OfferStatusEnum.seventy;
      else if (element.status == 72)
        element.showstatus = OfferStatusEnum.seventytwo;
      else if (element.status == 73)
        element.showstatus = OfferStatusEnum.seventythree;
      else if (element.status == 74)
        element.showstatus = OfferStatusEnum.seventyfour;
      else if (element.status == 75)
        element.showstatus = OfferStatusEnum.seventyfive;
      else if (element.status == 80)
        element.showstatus = OfferStatusEnum.eighty;
    });
  }

  offerviewClicked(id: number, opportunitytype: number) {
    if (opportunitytype == 10)
      this.router.navigate(['/offers/view/' + id]);
    else if (opportunitytype == 20)
      this.router.navigate(['/order/stockorder/view/' + id]);
    else if (opportunitytype == 30)
      this.router.navigate(['/order/cpoorder/view/' + id]);
  }

  offereditClicked(id: number, opportunitytype: number) {
    if (opportunitytype == 10)
      this.router.navigate(['/offers/edit/' + id]);
    else if (opportunitytype == 20)
      this.router.navigate(['/order/stockorder/edit/' + id]);
    else if (opportunitytype == 30)
      this.router.navigate(['/order/cpoorder/edit/' + id]);
  }

  // onCreateOffer() {
  //   this.router.navigate(['/offers/add/' + this.oppo_id]);
  // }

  // onCreateOrder() {
  //   this.router.navigate(['/stockorders/add/' + this.oppo_id]);
  // }

  onCreateOfferOrder() {
    if (new Date(this.oppo_data.expiredate) < new Date()) {
      this.notificationService.showError(this.opportunityValidityErrorMsg);
      return;
    }

    if (this.oppo_data.opportunitytype == 10)
      this.router.navigate(['/offers/add/' + this.oppo_id]);
    else if (this.oppo_data.opportunitytype == 20)
      this.router.navigate(['/order/stockorder/add/' + this.oppo_id + '/' + this.oppo_data.opportunitytype]);
    else if (this.oppo_data.opportunitytype == 30)
      this.router.navigate(['/order/cpoorder/add/' + this.oppo_id + '/' + this.oppo_data.opportunitytype]);
  }

  offerCloneClicked(offerid: number, opportunitytype: number, expiredate: Date) {
    if (new Date(expiredate) < new Date()) {
      this.notificationService.showError(this.opportunityValidityErrorMsg);
      return;
    }

    if (opportunitytype == 10)
      this.router.navigate(['/offers/add/refrenceoffer/' + offerid]);
    else if (opportunitytype == 20)
      this.router.navigate(['/order/stockorder/add/refrenceorder/' + offerid]);
    else if (opportunitytype == 30)
      this.router.navigate(['/order/cpoorder/add/refrenceorder/' + offerid]);
  }

  onShowApprovalCommentsClick(offerId: number, opportunitytype: number) {
    if (opportunitytype == 10) {
      this.getOfferApproval(offerId);
    } else if (opportunitytype == 20) {
      this.getOrderApproval(offerId);
    }
  }

  getOfferApproval(offerId: number) {
    this.offersService.getApprovalData(offerId).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.length) {
            this.approvalComments = response.responsedata.data;
            this.approvalComments = Config.setApprovaldatastatus(response.responsedata.data);

            let i = 0;
            this.approvalComments.forEach(element => {
              element.srno = ++i;
              element.senddate = Config.getDBdatetimeToDateTime(element.senddate);
              element.statusdate = Config.getDBdatetimeToDateTime(element.statusdate);
            });
            this.modalService.open(this.ApprovalCommentsModel, { size: 'lg' });
          } else {
            this.notificationService.showInfo("There is no approval data to show.");
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getOrderApproval(offerId: number) {
    this.stockorderService.getApprovalData(offerId).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.length) {
            this.approvalComments = response.responsedata.data;
            this.approvalComments = Config.setApprovaldatastatus(response.responsedata.data);

            let i = 0;
            this.approvalComments.forEach(element => {
              element.srno = ++i;
              element.senddate = Config.getDBdatetimeToDateTime(element.senddate);
              element.statusdate = Config.getDBdatetimeToDateTime(element.statusdate);
            });
            this.modalService.open(this.ApprovalCommentsModel, { size: 'lg' });
          } else {
            this.notificationService.showInfo("There is no approval data to show.");
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}
