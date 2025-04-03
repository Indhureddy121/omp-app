import { Component, OnInit } from '@angular/core';
import { RolesService } from '@core/services/masters/roles.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ScreenAssignmentService } from '@core/services/masters/screen-assignment.service';
import { UserTypeEnum } from '@core/enums/usertype.enum';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-screen-assignment',
  templateUrl: './screen-assignment.component.html',
  styleUrls: ['./screen-assignment.component.css']
})
export class ScreenAssignmentComponent implements OnInit {

  screenAssignmentForm: FormGroup;
  screenAssignmentInnerForm: FormGroup;
  submitted = false;
  isEdit = false;
  isView = false;
  isAdd = true;
  submittedsearch: boolean;
  createdDate: any;
  rolesList: any;
  screensList: any = [];
  UserTypeList: any[] = [];
  showSaveButton = false;
  get f() { return this.screenAssignmentForm.controls; }
  get fInner() { return this.screenAssignmentInnerForm.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private rolesService: RolesService,
    private screenAssignmentService: ScreenAssignmentService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.UserTypeList = [
      { code: 0, description: UserTypeEnum.zero },
      { code: 10, description: UserTypeEnum.ten },
      { code: 20, description: UserTypeEnum.twenty },
      { code: 30, description: UserTypeEnum.thirty },
    ];

    this.loadPageMode();
    this.onbuildForm();
  }

  private loadPageMode() {
    let currentUrl = this.router.url;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

    if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
    } else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
      this.isAdd = false;
    }
  }

  private onbuildForm() {
    this.screenAssignmentForm = this.formBuilder.group({
      type: [[], [Validators.required]],
      roleId: [[], [Validators.required]]
    });
  }

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

  onSearchBtnClick() {
    this.submittedsearch = true;
    if (this.screenAssignmentForm.invalid) {
      return;
    } else {
      this.showSaveButton = true;
      this.getData();
    }
  }

  onTypeChange(event) {
    if (event) {
      this.getRolesList(event.code);
      this.rolesList = [];
      this.f.roleId.setValue(null);
    } else {
      this.rolesList = [];
      this.f.roleId.setValue(null);
    }

    this.showSaveButton = false;
    this.submittedsearch = false;
    this.screensList = [];
  }

  getData() {
    this.screenAssignmentService.getAllScreensList({}).subscribe(
      response => {
        this.screensList = response.screendetails;
        if (this.screensList.length > 0) {
          this.screenAssignmentService.getAllScreensList({ "role_id": this.f.roleId.value, "type": this.f.type.value }).subscribe(
            responseinner => {
              let roleScreensList = responseinner.screendetails;
              this.screensList.forEach(element => {
                if (element.screenroles.length > 0) {
                  let selectedArr = roleScreensList.filter(screenEle => screenEle.id === element.id);
                  if (selectedArr.length > 0) {
                    element.selectedscreen = true;
                  } else {
                    element.selectedscreen = false;
                  }
                }
                if (element.menus.length > 0) {
                  element.menus.forEach(elementmenu => {
                    let selectedArrInner = roleScreensList.filter(screenEleInner => screenEleInner.id === elementmenu.id);
                    if (selectedArrInner.length > 0) {
                      elementmenu.selectedscreen = true;
                    } else {
                      elementmenu.selectedscreen = false;
                    }
                  });
                }
              });
            }, errorinner => {
              this.notificationService.showError(errorinner.error.error.message);
            });
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  saveScreenDetails() {
    if (this.screenAssignmentForm.invalid)
      return;

    let filterModel = { 'role_id': this.f.roleId.value, 'type': this.f.type.value, 'screensList': this.screensList };
    this.screenAssignmentService.assignScreens(filterModel).subscribe(
      response => {
        if (response) {
          this.getData();
          this.notificationService.showSuccess("Screens assigned successfully created");
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  showHideChildScreens(id: number) {
    var x = document.getElementById('screen' + id);
    var imgtg = document.getElementById('image' + id);
    if (x.style.display === 'none') {
      x.removeAttribute('style');
      x.setAttribute("style", "background-color: #ffefe0");
      imgtg.setAttribute("src", "../../../../../assets/images/icon-minus.svg");
    } else {
      x.style.display = "none";
      imgtg.setAttribute("src", "../../../../../assets/images/icon-plus-6.svg");
    }
  }
}
