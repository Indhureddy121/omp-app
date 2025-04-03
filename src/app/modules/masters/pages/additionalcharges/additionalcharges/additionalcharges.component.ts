import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AdditionalchargesService } from '@core/services/masters/additionalcharges.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';

@Component({
  selector: 'app-additionalcharges',
  templateUrl: './additionalcharges.component.html',
  styleUrls: ['./additionalcharges.component.css']
})
export class AdditionalchargesComponent implements OnInit {

  additionalchargesForm: FormGroup;
  applyonList = [
    { value: 'Item', label: 'Item' },
    { value: 'Summary', label: 'Summary' }
  ];
  submitted: boolean = false;
  isEdit = false;
  isView = false;
  isAdd = true;
  ac_id: number;
  acdata: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private additionalChargesService: AdditionalchargesService,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService
  ) { }

  get f() { return this.additionalchargesForm.controls; }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.ac_id = parms['id'];
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
    this.additionalchargesForm = this.formBuilder.group({
      additionalchargesName: ['', [Validators.required]],
      additionalchargesPercentage: ['', [Validators.required]],
      additionalchargesapplyon: [[], Validators.required]
    });
  }

  disableFields() {
    if (this.isView) {
      this.f.additionalchargesName.disable();
      this.f.additionalchargesPercentage.disable();
      this.f.additionalchargesapplyon.disable();
    }
  }

  private getDetaildata() {
    this.additionalChargesService.getDetail(this.ac_id).subscribe(
      response => {
        if (response.additionalcharge !== '') {
          this.acdata = response["additionalcharge"];
          this.setData(this.acdata);
        }
      }, error => {
        alert('error : ' + error);
      });
  }

  private setData(data: any) {
    this.f.additionalchargesName.setValue(data.ac_name);
    this.f.additionalchargesPercentage.setValue(data.ac_percentage);
    this.f.additionalchargesapplyon.setValue(data.ac_applyon);
  }

  onEditClick() {
    let id = 0;
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/masters/additionalcharges/edit/' + id]);
  }

  cancelClicked() {
    this.router.navigateByUrl('/masters/additionalcharges/list');
  }

  onSubmit() {
    this.saveClicked();
  }

  saveClicked() {
    this.submitted = true;
    if (this.additionalchargesForm.invalid) {
      return;
    }

    if (this.isAdd) {
      let insertModel: any = {
        ac_name: this.f.additionalchargesName.value,
        ac_percentage: this.f.additionalchargesPercentage.value,
        ac_applyon: this.f.additionalchargesapplyon.value,
        created_date: new Date(),
        created_by: this.authService.getUserId(),
        updated_date: new Date(),
        updated_by: this.authService.getUserId()
      }

      
    }
    else if (this.isEdit) {
      let updateModel: any = {
        ac_name: this.f.additionalchargesName.value,
        ac_percentage: this.f.additionalchargesPercentage.value,
        ac_applyon: this.f.additionalchargesapplyon.value,
        updated_date: new Date(),
        updated_by: this.authService.getUserId(),
        id: this.ac_id
      }

     
    }
  }
}

