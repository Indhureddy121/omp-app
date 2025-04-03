import { Component, OnInit } from '@angular/core';
import { RolesService } from '@core/services/masters/roles.service';
import { OmpusersService } from '@core/services/masters/ompusers.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import { AuthService } from '@core/services/auth/auth.service';
import { EmailService } from '@core/services/common/email.service';
import { LookupService } from '@core/services/common/lookup.service';
import { UserTypeEnum } from '@core/enums/usertype.enum';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-manageusers',
  templateUrl: './manageusers.component.html',
  styleUrls: ['./manageusers.component.css']
})
export class ManageusersComponent implements OnInit {

  usersForm: FormGroup;
  submitted = false;
  isEdit = false;
  isView = false;
  isAdd = true;
  editId: any;
  // regionList: any;
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
  disableLeaveStatus: boolean = false;
  disableLockStatus: boolean = false;
  selectedRoles: [];
  selectedRegions: [];
  userSource: string = '';
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  userdata: any;
  varticalsList: any[] = [];
  segmentList: any[] = [];
  UserTypeList: any[] = [];
  userID: any;
  onLockCheckedFlag: boolean = false;
  //Toggle Flags
  onLeaveToggleFlag: boolean = false;
  userStatusToggleFlag: boolean = false;
  onLockFlag: boolean = false
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService,
    private ompusersService: OmpusersService,
    private authService: AuthService,
    private emailService: EmailService,
    private lookupService: LookupService,
    private notificationService: NotificationService
  ) { }

  get f() { return this.usersForm.controls; } //edit 

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.UserTypeList = [
      { code: 0, description: UserTypeEnum.zero },
      { code: 10, description: UserTypeEnum.ten },
      { code: 20, description: UserTypeEnum.twenty }];

    this.loadPageMode();
    this.onbuildForm();

    this.loadPageData();

    this.disableFields();
  }

  loadPageMode() {
    let currentUrl = this.router.url;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

    if (currentUrl.includes('add')) {
      this.isEdit = false;
      this.isView = false;
      this.isAdd = true;
    } else if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
      this.getUserDetails();
    } else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
      this.isAdd = false;
      this.getUserDetails();
    }
  }

  private onbuildForm() {
    this.usersForm = this.formBuilder.group({
      fullName: ['', [Validators.required]],
      userEmail: ['', [Validators.required, Validators.pattern(this.emailPattern)]],
      roleId: [[], [Validators.required]],
      userStatus: true,
      managerId: [null],
      employeeSapId: [''],
      // userPassword: ['', [Validators.required]],
      sfdcid: [''],
      vertical: [[], [Validators.required]],
      segment: [[], [Validators.required]],
      Business_Segment2: [''],
      Business_Segment3: [''],
      phoneno: [''],
      onleave: false,
      lock: false,
      type: [null]
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
      this.f.Business_Segment2.disable();
      this.f.Business_Segment3.disable();
      this.f.type.disable();
      this.disableUserStatus = true;
      this.disableLeaveStatus = true;
      this.disableLockStatus = true;
    } else if (this.isEdit) {
      this.f.employeeSapId.disable();
    }
  }

  loadPageData() {
    this.getLookupdata();
    //shubham
    // this.rolesService.getAllRolesList(10).subscribe(
    //   response => {
    //     this.rolesList = response;
    //   }, error => {
    //     this.notificationService.showError(error.error.error.message);
    //   });
    this.getManagerList();
  }

  // getRoleList(ischannelpartner: any) {

  //   this.rolesService.getAllRolesList(ischannelpartner).subscribe(
  //     response => {
  //       this.rolesList = response.rolelist;
  //     }, error => {
  //       this.notificationService.showError(error.error.error.message);
  //     });
  // }

  getRolesList(type: number) {
    if (type == 10)
      type = 1;
    else if (type == 20)
      type = 2;

    this.rolesService.getAllRolesList(type).subscribe(
      response => {
        this.rolesList = response.rolelist;
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onTypeChange(event) {
    if (event) {
      this.getRolesList(event.code);
      this.rolesList = [];
    } else {
      this.rolesList = [];
    }
  }

  getManagerList() {
    let filtermodel = {};
    if (this.isEdit) {
      filtermodel = { "id": this.editId }
    }
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
    this.activatedRoute.params.subscribe(parms => {
      this.editId = parms['id'];
    });
    this.ompusersService.GetUserById(this.editId).pipe().subscribe(
      response => {
        if (response) {
          this.userdata = response.data[0];

          this.f.fullName.setValue(this.userdata.fullname);
          this.f.userEmail.setValue(this.userdata.user_email);
          this.f.employeeSapId.setValue(this.userdata.employee_sap_id);
          this.f.roleId.setValue(this.userdata.level_c);
          // this.f.userPassword.setValue(this.userdata.password);
          this.f.sfdcid.setValue(this.userdata.userid);

          if (Number(this.userdata.ManagerRowId) > 0)
            this.f.managerId.setValue(Number(this.userdata.ManagerRowId));

          this.f.vertical.setValue(this.userdata.verticals_c);
          this.f.segment.setValue(this.userdata.Segment_c);
          this.f.Business_Segment2.setValue(this.userdata.Business_Segment2);
          this.f.Business_Segment3.setValue(this.userdata.Business_Segment3);
          this.f.phoneno.setValue(this.userdata.user_mobile_no);

          if (this.userdata.ischannelpartner.data && this.userdata.ischannelpartner.data.length > 0) {
            this.f.type.setValue(this.userdata.ischannelpartner.data[0]);
            this.getRolesList(this.userdata.ischannelpartner.data[0]);
          }

          if (this.userdata.status == 'Inactive') {
            this.userStatusToggleFlag = false
            this.userStatusFlag = false;
          } else {
            this.userStatusToggleFlag = true
            this.userStatusFlag = true;
          }

          if (this.userdata.onleave == 1) {
            this.onLeaveToggleFlag = true
            this.onleaveFlag = true;
          }
          else {
            this.onLeaveToggleFlag = false; //For
            this.onleaveFlag = false;
          }

          if (this.userdata.islocked == 1) {
            this.onLockCheckedFlag = true;
            this.onLockFlag = true
          }
          else {
            this.onLockFlag = false
            this.onLockCheckedFlag = false;
          }

          this.userSource = response.user_source;
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSaveClick() {
    this.submitted = true;
    let ustat: string = '';
    if (this.userStatusFlag === true) {
      ustat = "active";
    } else {
      ustat = "inactive";
    }

    if (this.usersForm.invalid)
      return;

    var rolename = this.rolesList.find(x => x.role_code == this.f.roleId.value).role_name;
    let savemodel = {
      Id: this.isAdd ? 0 : this.editId,
      SAPId: this.f.employeeSapId.value,
      Name: this.f.fullName.value,
      RoleCode: this.f.roleId.value,
      RoleName: rolename,
      Region: '',
      Division: '',
      Verticals: this.f.vertical.value,
      Segment: this.f.segment.value,
      Business_Segment2: this.f.Business_Segment2.value,
      Business_Segment3: this.f.Business_Segment3.value,
      ManagerId: this.f.managerId.value,
      Email: this.f.userEmail.value,
      // Password: this.f.userPassword.value,
      Phone: '',
      Mobile: this.f.phoneno.value,
      Status: ustat,
    }

    this.ompusersService.saveuser(savemodel).subscribe(
      response => {
        if (response) {
          if (savemodel.Id == 0)
            this.notificationService.showSuccess("User successfully created");
          else
            this.notificationService.showSuccess("User successfully updated");

          this.router.navigate(['/userprofile/users/list']);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setStatusFlag(event: any) {
    // console.log(event);
    this.userStatusFlag = event.target.checked;
  }

  onEditClick() {
    let id: any;
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/userprofile/users/edit/' + id]);
  }

  cancelClicked() {
    this.router.navigateByUrl('/userprofile/users/list');
  }

  setonleaveFlag(event: any) {
    if (event)
      this.onleaveFlag = event.target.checked;
    else
      this.onleaveFlag = false;

    this.onLeaveSaveClick();
  }

  onLeaveSaveClick() {
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


  toggle(event: any, type: any) {
    if (type === 'lock') {
      this.onLockFlag = event.target.checked;
    } else if (type === 'onLeave') {
      this.onLeaveToggleFlag = event.target.checked;
    } else {
      this.userStatusToggleFlag = event.target.checked;
    }
    this.toggleFunc();
  }

  toggleFunc() {
    this.activatedRoute.params.subscribe(parms => {
      this.userID = parms['id'];
    });
    const payload = {
      userid: this.userID,
      onleave: this.onLeaveToggleFlag,
      isactive: this.userStatusToggleFlag ? 'Active' : 'Inactive',
      islocked: this.onLockFlag
    };


    this.ompusersService.updateUserTogglestatus(payload).subscribe(
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
