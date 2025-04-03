import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '@core/services/common/notification.service';
import { PortService } from '@core/services/masters/port.service';

@Component({
  selector: 'app-port',
  templateUrl: './port.component.html',
  styleUrls: ['./port.component.css']
})
export class PortComponent implements OnInit {

  portForm: FormGroup;
  // indentGroupList: [{ 'id': 1, 'name': 'Item' }]
  port_id: any;
  submitted = false;
  isEdit = false;
  isView = false;
  isAdd = true;
  portData: any;
  portNo: any;


  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private portService: PortService,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService
  ) { }

  get f() { return this.portForm.controls; } //edit

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.port_id = parms['id'];
    });
    this.onLoad();
  }

  private onLoad() {
    this.loadPageMode();
    this.onbuildForm();
    this.disableFields();
  }

  private loadPageMode() {
    let currentUrl = this.router.url;

    if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
      this.getDetaildata();
    }
    else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
      this.isAdd = false;
      this.getDetaildata();
    }
  }

  private onbuildForm() {
    this.portForm = this.formBuilder.group({
      portNo: ['', [Validators.required]],
      portName: ['', [Validators.required]],
      portChrg: [[], Validators.required]
    });
  }

  disableFields() {
    if (this.isView) {
      this.f.portNo.disable();
      this.f.portName.disable();
      this.f.portChrg.disable();
    }
    if (this.isEdit) {
      this.f.portNo.disable();
    }
  }

  private getDetaildata() {
    this.portService.getDetail(this.port_id).subscribe(
      response => {
        if (response.ports !== '') {
          this.portData = response["port"];
          this.setData(this.portData);
        }
      }, error => {
        alert('error : ' + error);
      });
  }

  private setData(data: any) {
    this.f.portNo.setValue(data.port_no);
    this.portNo = data.port_no;
    this.f.portName.setValue(data.port_name);
    this.f.portChrg.setValue(data.charges);
  }

  cancelClicked() {
    this.router.navigateByUrl('/masters/ports/list');
  }

  onEditClick() {
    let id = 0;
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/masters/ports/edit/' + id]);
  }

  saveClicked() {
    this.submitted = true;
    if (this.portForm.invalid) {
      return;
    }



    if (this.isAdd) {

      if (this.f.portChrg.value > 99.99) {
        this.notificationService.showError("Charges can not be more than 100%")
        return
      }
      let portModel: any = {
        port_no: this.f.portNo.value,
        port_name: this.f.portName.value,
        charges: Number(this.f.portChrg.value),
        created_date: new Date(),
        created_by: 1,
        updated_date: new Date(),
        updated_by: 1
      }

      this.portService.createPortCharges(portModel).subscribe(
        response => {
          //  console.log(response.error.error.message)
          if (response.error) {
            this.notificationService.showError('Port ID Already Exists');
          }
          else {
            this.notificationService.showSuccess("Port Charges Created Successfully");
            this.router.navigateByUrl('/masters/ports/list');
          }
          // this.notificationService.showSuccess("Port Charges created successfully");
          // this.router.navigateByUrl('/masters/ports/list');
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    }
    else if (this.isEdit) {
      let updateModel: any = {
        port_no: this.f.portNo.value,
        port_name: this.f.portName.value,
        charges: this.f.portChrg.value,
        created_date: new Date(),
        created_by: 2,
        updated_date: new Date(),
        updated_by: 2,
        id: this.port_id
      }

      this.portService.updatePort(updateModel).subscribe(
        response => {
          this.notificationService.showSuccess("Port Charges Updated Successfully");
          this.router.navigateByUrl('/masters/ports/list');
        }, error => {
          this.notificationService.showSuccess(error);
        });
    }
  }
}

