import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdditionalchargesService } from '@core/services/masters/additionalcharges.service';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-additionalcharges-list',
  templateUrl: './additionalcharges-list.component.html',
  styleUrls: ['./additionalcharges-list.component.css']
})
export class AdditionalchargesListComponent implements OnInit {

  AdditionalChargesForm: FormGroup;
  AdditionalChargesDefaultForm: FormGroup;

  aclist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  // section: string;
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditAdditionalChargesModal', { static: false }) AddEditAdditionalChargesModal: any;
  deleteConfirmModel = Object();
  searchModel = Object();
  submitted: boolean = false;
  defaultsubmitted: boolean = false;
  additionalchargesid: any;
  currencyTypeList: any[] = [
    { code: 'INR', description: 'INR' },
    { code: 'USD', description: 'USD' },
    { code: 'EUR', description: 'Euro' }];
  defaultadditionalchargesid: any;

  constructor(
    private router: Router,
    private additionalChargesService: AdditionalchargesService,
    private pagerService: PagerService,
    private activatedRoute: ActivatedRoute,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }

  get additionalChargesForm() { return this.AdditionalChargesForm.controls; }
  get additionalChargesDefaultForm() { return this.AdditionalChargesDefaultForm.controls; }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    // this.section = 'List';
    this.getCount();
    this.getDefaultData();
    this.onBuildForm();
  }

  onBuildForm() {
    this.AdditionalChargesForm = this.formBuilder.group({
      fromlocation: [null, [Validators.required]],
      tolocation: [null, [Validators.required]],
      freightcharges: [null, [Validators.required]],
      trdcuttingchargesvalue: [null, [Validators.required]],
      trdcurrency: [['INR'], [Validators.required]],
      stdcuttingchargesvalue: [null, [Validators.required]],
      stdcurrency: [['INR'], [Validators.required]]
    });

    this.AdditionalChargesDefaultForm = this.formBuilder.group({
      deffreightcharges: [null, [Validators.required]],
      deftrdcuttingchargesvalue: [null, [Validators.required]],
      deftrdcurrency: [['INR'], [Validators.required]],
      defstdcuttingchargesvalue: [null, [Validators.required]],
      defstdcurrency: [['INR'], [Validators.required]]
    });
  }

  getCount() {
    this.additionalChargesService.getCount(this.searchValue).subscribe(
      response => {
        this.totalRows = response.additionalcharges[0].count;
        if (this.totalRows > 0)
          this.getData();
        else
          this.aclist = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.additionalChargesService.getaclist(filtermodel).subscribe(
      response => {
        this.aclist = response.additionalchargeslist;
        this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getDefaultData() {
    this.additionalChargesService.getDefaultData().subscribe(
      response => {
        if (response.data && response.data.length > 0) {
          this.defaultadditionalchargesid = response.data[0].id;
          this.additionalChargesDefaultForm.deffreightcharges.setValue(response.data[0].freightcharge);
          this.additionalChargesDefaultForm.deftrdcuttingchargesvalue.setValue(response.data[0].trdcuttingchargesvalue);
          this.additionalChargesDefaultForm.deftrdcurrency.setValue(response.data[0].trdcuttingcurrency);
          this.additionalChargesDefaultForm.defstdcuttingchargesvalue.setValue(response.data[0].stdcuttingchargesvalue);
          this.additionalChargesDefaultForm.defstdcurrency.setValue(response.data[0].stdcuttingcurrency);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData();
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.pageNumber = 1;
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-additionalcharges');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  OpenDeletePopup(index: number) {
    this.deleteConfirmModel.index = index;
    this.modalService.open(this.DeleteConfirmationModal, { centered: true, size: 'md', backdrop: 'static' });
  }

  onAdditionalChargesDelete(event) {
    this.additionalChargesService.deleteadditionalcharges(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.notificationService.showSuccess('Additional Charges deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OpenAddEditALPMasterPopup(id: number) {
    if (id) {
      this.additionalChargesService.getDetail(id).subscribe(
        response => {
          if (response.data) {
            this.additionalchargesid = response.data[0].id;
            this.additionalChargesForm.fromlocation.setValue(response.data[0].fromlocation);
            this.additionalChargesForm.tolocation.setValue(response.data[0].tolocation);
            this.additionalChargesForm.freightcharges.setValue(response.data[0].freightcharge);
            this.additionalChargesForm.trdcuttingchargesvalue.setValue(response.data[0].trdcuttingchargesvalue);
            this.additionalChargesForm.trdcurrency.setValue(response.data[0].trdcuttingcurrency);
            this.additionalChargesForm.stdcuttingchargesvalue.setValue(response.data[0].stdcuttingchargesvalue);
            this.additionalChargesForm.stdcurrency.setValue(response.data[0].stdcuttingcurrency);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.additionalchargesid = null;
      this.additionalChargesForm.fromlocation.setValue(null);
      this.additionalChargesForm.tolocation.setValue(null);
      this.additionalChargesForm.freightcharges.setValue(null);
      this.additionalChargesForm.trdcuttingchargesvalue.setValue(null);
      this.additionalChargesForm.trdcurrency.setValue('INR');
      this.additionalChargesForm.stdcuttingchargesvalue.setValue(null);
      this.additionalChargesForm.stdcurrency.setValue('INR');
    }

    this.submitted = false;
    this.modalService.open(this.AddEditAdditionalChargesModal, { size: 'md', backdrop: 'static' });
  }

  onSaveClick() {
    this.submitted = true;

    if (this.AdditionalChargesForm.invalid)
      return;

    if (this.additionalChargesForm.freightcharges.value > 0.99)
      return;

    let additionalchargessavemodel = {
      additionalchargesid: this.additionalchargesid,
      fromlocation: this.additionalChargesForm.fromlocation.value,
      tolocation: this.additionalChargesForm.tolocation.value,
      freightcharges: this.additionalChargesForm.freightcharges.value,
      trdcuttingchargesvalue: this.additionalChargesForm.trdcuttingchargesvalue.value,
      trdcurrency: this.additionalChargesForm.trdcurrency.value,
      stdcuttingchargesvalue: this.additionalChargesForm.stdcuttingchargesvalue.value,
      stdcurrency: this.additionalChargesForm.stdcurrency.value,
      isdefault: 0
    }

    this.additionalChargesService.saveadditionalcharges(additionalchargessavemodel).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.modalService.dismissAll();
          this.notificationService.showSuccess('Additional Charges saved successfully.');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onDefaultSaveClick() {
    this.defaultsubmitted = true;

    if (this.AdditionalChargesDefaultForm.invalid)
      return;

    let additionalchargessavemodel = {
      defaultadditionalchargesid: this.defaultadditionalchargesid,
      freightcharges: this.additionalChargesDefaultForm.deffreightcharges.value,
      trdcuttingchargesvalue: this.additionalChargesDefaultForm.deftrdcuttingchargesvalue.value,
      trdcurrency: this.additionalChargesDefaultForm.deftrdcurrency.value,
      stdcuttingchargesvalue: this.additionalChargesDefaultForm.defstdcuttingchargesvalue.value,
      stdcurrency: this.additionalChargesDefaultForm.defstdcurrency.value,
      isdefault: 1
    }

    this.additionalChargesService.DefaultDataSave(additionalchargessavemodel).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.modalService.dismissAll();
          this.notificationService.showSuccess('Additional Charges saved successfully.');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}
