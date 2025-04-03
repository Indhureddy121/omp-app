import { Component, OnInit, ViewChild } from '@angular/core';
import { RolesService } from '@core/services/masters/roles.service';
import { OmpusersService } from '@core/services/masters/ompusers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '@core/services/auth/auth.service';
import { LookupService } from '@core/services/common/lookup.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmedValidator, NewPasswordValidator } from 'src/app/confirmed.validator';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-myprofile',
  templateUrl: './myprofile.component.html',
  styleUrls: ['./myprofile.component.css']
})
export class MyprofileComponent implements OnInit {

  usersForm: FormGroup;
  ChangePasswordForm: FormGroup;
  submitted = false;
  isView = true;
  editId: any;
  rolesList: any;
  managerList: any;
  createdDate: any;
  userStatusFlag: boolean = true;
  onleaveFlag: boolean = false;
  pageNumber = 1;
  pageSize = '';
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  disableUserStatus: boolean = false;
  selectedRoles: [];
  selectedRegions: [];
  userSource: string = '';
  userdata: any;
  varticalsList: any[] = [];
  segmentList: any[] = [];
  ShowOnLeaveButton: boolean = false;
  @ViewChild('changepasswordmodal', { static: false }) changepasswordmodal: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private rolesService: RolesService,
    private ompusersService: OmpusersService,
    private authService: AuthService,
    private lookupService: LookupService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  get f() { return this.usersForm.controls; } //edit
  get changePasswordForm() { return this.ChangePasswordForm.controls; } //edit

  ngOnInit() {
    this.loadData();
    this.loadPageData();
    this.onbuildForm();
    this.disableFields();
  }
  loadData() {
    let currentUrl = this.router.url;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.editId = this.authService.getUserId();
    this.getUserDetails();
  }

  private onbuildForm() {
    this.usersForm = this.formBuilder.group({
      fullName: [''],
      userEmail: [''],
      roleId: [[]],
      userStatus: true,
      managerId: [null],
      employeeSapId: [''],
      userPassword: [''],
      sfdcid: [''],
      vertical: [[]],
      segment: [[]],
      onleave: false
    });

    this.ChangePasswordForm = this.formBuilder.group({
      oldpassword: [null, [Validators.required]],
      newpassword: [null, [Validators.required]],
      confirmpassword: [null, [Validators.required]]
    }, {
      validators: [NewPasswordValidator('newpassword'),ConfirmedValidator('newpassword', 'confirmpassword')]
    });

    this.usersForm.controls["userStatus"].setValue(true);
    this.usersForm.controls["onleave"].setValue(false);
  }

  disableFields() {
    if (this.isView) {
      this.f.fullName.disable();
      this.f.userEmail.disable();
      this.f.employeeSapId.disable();
      this.f.roleId.disable();
      this.f.managerId.disable();
      this.f.vertical.disable();
      this.f.segment.disable();
      this.disableUserStatus = true;
    }
  }

  loadPageData() {
    this.getLookupdata();
    // shubham
    this.rolesService.getAllRolesList(this.authService.getCurrentUser().ischannelpartner).subscribe(
      response => {
        this.rolesList = response.rolelist;
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

    let filtermodel = {};

    this.ompusersService.getManagerList(filtermodel).subscribe(
      response => {
        if (response.ompusers.length > 0) {
          this.managerList = response.ompusers;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getLookupdata() {
    var lookuptype = { "lookup_type": "vertical,segment" }
    this.lookupService.getLookupdata(lookuptype).subscribe(
      response => {
        if (response.lookups) {
          this.varticalsList = response.lookups.filter(x => x.lookup_type == "vertical");
          this.segmentList = response.lookups.filter(x => x.lookup_type == "segment");
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getUserDetails() {
    this.ompusersService.GetUserById(this.editId).pipe().subscribe(
      response => {
        if (response) {
          this.userdata = response.data[0];

          this.f.fullName.setValue(this.userdata.fullname);
          this.f.userEmail.setValue(this.userdata.user_email);
          this.f.employeeSapId.setValue(this.userdata.employee_sap_id);
          this.f.roleId.setValue(this.userdata.level_c);
          this.f.userPassword.setValue(this.userdata.password);
          this.f.sfdcid.setValue(this.userdata.userid);
          this.f.managerId.setValue(Number(this.userdata.ManagerRowId));
          this.f.vertical.setValue(this.userdata.verticals_c);
          this.f.segment.setValue(this.userdata.Segment_c);

          if (this.userdata.status == 'inactive')
            this.userStatusFlag = false;
          else
            this.userStatusFlag = true;

          this.userSource = response.user_source;

          if (this.authService.getCurrentUser().usertype != 20 && this.authService.getCurrentUser().rolelevel >= 60)
            this.ShowOnLeaveButton = true;
          else
            this.ShowOnLeaveButton = false;

          if (this.userdata.onleave == 1)
            this.onleaveFlag = true;
          else
            this.onleaveFlag = false;

          this.f.onleave.setValue(this.onleaveFlag);
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onChangePassword() {
    this.submitted = false;
    this.changePasswordForm.oldpassword.setValue(null);
    this.changePasswordForm.newpassword.setValue(null);
    this.changePasswordForm.confirmpassword.setValue(null);
    this.modalService.open(this.changepasswordmodal, { size: 'sm' });
  }

  onChangePasswordSave() {
    this.submitted = true;

    if (this.ChangePasswordForm.invalid)
      return;

    let chagepasswordmodal = {
      currentpassword: this.changePasswordForm.oldpassword.value,
      newpassword: this.changePasswordForm.newpassword.value
    }

    this.ompusersService.changepassword(chagepasswordmodal).subscribe(
      response => {
        this.notificationService.showSuccess('Password updated successfully.');
        this.submitted = false;
        this.modalService.dismissAll();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setonleaveFlag(event: any) {
    if (event)
      this.onleaveFlag = event.target.checked;
    else
      this.onleaveFlag = false;

    this.onSaveClick();
  }

  oncancelClick() {
    this.router.navigate(['/home']);
  }

  onSaveClick() {
    let leavemodel = {
      userid: this.editId,
      status: this.onleaveFlag
    }

    this.ompusersService.updateleavestatus(leavemodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.submitted = false;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}