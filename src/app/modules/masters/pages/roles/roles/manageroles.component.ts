import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RolesService } from '@core/services/masters/roles.service';
import * as moment from 'moment';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-manageroles',
  templateUrl: './manageroles.component.html',
  styleUrls: ['./manageroles.component.css']
})
export class ManagerolesComponent implements OnInit {

  rolesForm: FormGroup;
  submitted = false;
  isEdit = false;
  isView = false;
  isAdd = true;
  editId: any;
  isRoleSourceManual: boolean = false;
  isConfigChecked: boolean = false;
  isChannelPartnerChecked: boolean = false;
  isDealerChecked: boolean = false;
  createdDate: any;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rolesService: RolesService,
    private notificationService: NotificationService
  ) { }

  get f() { return this.rolesForm.controls; } //edit

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.loadPageMode();
    this.onbuildForm();
    this.disableFields();
  }

  private loadPageMode() {
    let currentUrl = this.router.url;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.activatedRoute.params.subscribe(parms => {
      this.editId = parms['id'];
    });

    if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
      this.getRoleDetails();
    } else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
      this.isAdd = false;
      this.getRoleDetails();
    }
  }

  private onbuildForm() {
    this.rolesForm = this.formBuilder.group({
      roleCode: ['', [Validators.required]],
      roleName: ['', [Validators.required]],
      isconfig: [null],
      ischannelpartner: [null],
      isdealer: [null],
      orderlevel: [null]
    });
  }

  disableFields() {
    if (this.isView) {
      this.f.roleCode.disable();
      this.f.roleName.disable();
      this.f.orderlevel.disable();
    }
  }

  private getRoleDetails() {
    this.rolesService.GetRoleById(this.editId).pipe().subscribe(
      response => {
        if (response) {
          this.f.roleCode.setValue(response.role_code);
          this.f.roleName.setValue(response.role_name);
          this.f.orderlevel.setValue(response.role_level);
          this.f.isconfig.setValue(response.isconfig);
          this.f.ischannelpartner.setValue(response.ischannelpartner);
          this.f.isdealer.setValue(response.isdealer);
          this.isConfigChecked = response.isconfig;
          this.isChannelPartnerChecked = response.ischannelpartner;
          this.isDealerChecked = response.isdealer;

          if (response.role_source == "Manual")
            this.isRoleSourceManual = true;
          else {
            this.f.roleCode.disable();
            this.f.roleName.disable();
          }
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSaveClick() {
    this.submitted = true;

    if (this.rolesForm.invalid)
      return;

    let insertModel: any = {
      id: this.isAdd ? 0 : this.editId,
      role_name: this.f.roleName.value,
      role_code: this.f.roleCode.value,
      role_level: this.f.orderlevel.value,
      isconfig: this.isConfigChecked,
      ischannelpartner: this.isChannelPartnerChecked,
      isdealer: this.isDealerChecked
    }

    this.rolesService.SaveRole(insertModel).subscribe(
      response => {
        if (response && response.roledata.statusCode == 200)
          this.notificationService.showSuccess(response.roledata.message);
        else if (response && response.roledata.statusCode == 400)
          this.notificationService.showSuccess(response.roledata.message);

        this.router.navigate(['/masters/roles/list']);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onEditClick() {
    let id = 0;
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/masters/roles/edit/' + id]);
  }

  cancelClicked() {
    this.router.navigateByUrl('/masters/roles/list');
  }

  toggleIsConfig(event: any) {
    this.isConfigChecked = event.target.checked
  }

  toggleIsChannelPartner(event: any) {
    this.isChannelPartnerChecked = event.target.checked
  }

  toggleIsDealer(event: any) {
    this.isDealerChecked = event.target.checked
  }
}
