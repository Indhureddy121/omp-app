import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '@core/services/masters/customer.service';
import { ActivatedRoute, Router } from '@angular/router';
import { OffersService } from '@core/services/offers/offers.service';
import { OpportunitiesService } from '@core/services/opportunities/opportunities.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-customer-view',
  templateUrl: './customer-view.component.html',
  styleUrls: ['./customer-view.component.css']
})
export class CustomerViewComponent implements OnInit {

  customerForm: FormGroup;
  closeResult: string;
  frmcustomer: FormGroup;
  frmsapmodel: FormGroup;
  isView: boolean;
  isEdit: boolean;
  isAdd: boolean;
  customer: any;
  billingAddress: any[] = [];
  shipmentAddress: any[] = [];
  opportunity: any[] = [];
  sapExist: boolean;
  sfdcid1: any;
  SAPId: any;
  queryString: any;
  custId: any;
  sapData: any[];
  contactdetail: any[] = [];
  NacecodeList: any[] = [];
  dateFormate: string;
  canloginFlag: boolean = false;
  onLockCheckedFlag: boolean = false;

  constructor(private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private activateRoute: ActivatedRoute,
    private customerService: CustomerService,
    private router: Router,
    private notificationService: NotificationService,
    private offersService: OffersService,
    private opportunitiesService: OpportunitiesService,
    private authService: AuthService
  ) { }

  get f() { return this.customerForm.controls; }

  ngOnInit() {
    this.onLoad();
    this.dateFormate = this.authService.getDateFormat();
  }

  private onLoad() {
    this.onBuildForm();
    this.getActiveRoute();
    this.setformValue();
    this.getDisabledFields();
    this.isView = true;
  }

  open(content) {
    if (this.sapExist)
      this.frmsapmodel.controls.newSapId.setValue(this.customer.sapid);
    else
      this.frmsapmodel.controls.newSapId.setValue(null);

    this.modalService.open(content, { size: 'sm' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.SAPId = this.frmsapmodel.controls.newSapId.value;
      let sapData = {
        id: this.customer.id,
        sapid: this.SAPId,
        accountid: this.customer.sfdcid
      }
      this.addSAPId(sapData);
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDisabledFields() {
    this.f.nacecode.disable();
  }

  private addSAPId(data: any) {
    this.customerService.addSapId(data).subscribe(
      response => {
        if (response) {
          this.notificationService.showSuccess("SAP ID saved Successfully for customer " + this.customer.customername);
          this.router.navigate(['/customers/list']);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private onBuildForm() {
    this.customerForm = this.formBuilder.group({
      sfdcid: [''],
      sapid: [''],
      gstno: [''],
      email: [''],
      contactno: [''],
      status: [''],
      fullname: [''],
      nacecode: [''],
      nacelevel: [''],
      businessmodel: [''],
      canlogin: [0]
    });

    this.frmsapmodel = this.formBuilder.group({
      newSapId: ['']
    });
  }

  private setformValue() {
    this.customerService.getCustomerAddress(this.custId, "shippingAddress").subscribe(
      response => {
        if (response.customerAddress.length > 0) {
          this.shipmentAddress = response.customerAddress;

          this.shipmentAddress.forEach(element => {
            element.isDefault = element.isDefault == true ? 'Yes' : 'No';
          });
        }
        // else {
        //   this.notificationService.showError('Shipping address not found.');
        // }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

    this.customerService.getCustomerAddress(this.custId, "billingAddress").subscribe(
      response => {
        if (response.customerAddress.length > 0) {
          this.billingAddress = response.customerAddress;

          this.billingAddress.forEach(element => {
            element.isDefault = element.isDefault == true ? 'Yes' : 'No';
          });
        }
        //  else {
        //   this.notificationService.showError('Billing address not found.');
        // }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

    this.opportunitiesService.getOpportunityListbyCustomerId(this.custId).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.opportunity = response.responsedata.data;
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  cancelClicked() {
    this.router.navigateByUrl('/customers/list');
  }

  private getActiveRoute() {
    this.activateRoute.params.subscribe(parms => {
      this.queryString = parms;
      this.custId = this.queryString.id;
      this.customerService.getCustomerById(this.custId).subscribe(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.customer = response.responsedata.data[0];
            this.setData(this.customer)
            this.getAccountContactDetail(this.customer.sfdcid);

            if (this.customer.sapid != null && this.customer.sapid != 0)
              this.sapExist = true;
            else
              this.sapExist = false;

            if (this.customer.islocked == 1) {
              this.onLockCheckedFlag = true;
            }
            else {
              this.onLockCheckedFlag = false;
            }
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    });
  }

  private setData(data) {
    this.f.sfdcid.setValue(data.sfdcid);
    if (data.sapid)
      this.f.sapid.setValue(data.sapid);

    this.f.gstno.setValue(data.gstno);
    this.f.status.setValue(data.status);
    this.f.contactno.setValue(data.mobileno);
    this.f.email.setValue(data.email);
    this.f.fullname.setValue(data.customername);
    if (data.nacecode)
      this.f.nacecode.setValue(data.nacecode + ' - ' + data.description);
    else
      this.f.nacecode.setValue(null);
    this.f.nacelevel.setValue(data.level);
    this.f.businessmodel.setValue(data.businessmodel);

    this.canloginFlag = data.canlogin && data.canlogin.data.length ? data.canlogin.data[0] : false;
    this.f.canlogin.setValue(this.canloginFlag);
  }

  private getAccountContactDetail(id: string) {
    this.offersService.getAccountContactDetail(id).subscribe(
      response => {
        if (response) {
          if (response.responsedata && response.responsedata.data && response.responsedata.data.length > 0)
            this.contactdetail = response.responsedata.data;
          else
            this.contactdetail = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  canLoginChange(event: any) {
    if (event)
      this.canloginFlag = event.target.checked;
    else
      this.canloginFlag = false;

    this.UpdateCustomerLoginStatus();
  }

  UpdateCustomerLoginStatus() {
    let model = {
      customerid: this.custId,
      status: this.canloginFlag,
      email: this.customer.email,
      password: this.customer.password,
      sapid: this.customer.sapid
    }

    this.customerService.updateCustomerLoginStatus(model).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  toggleLock(event: any) {

    const model = {
      customerid: this.custId,
      islocked: event ? event.target.checked : false
    }

    this.customerService.updateCustomerLockStatus(model).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
    
  }

}