import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LookupService } from '@core/services/common/lookup.service';
import { ApprovalmatrixService } from '@core/services/masters/approvalmatrix.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-approvalmatrix',
  templateUrl: './approvalmatrix.component.html',
  styleUrls: ['./approvalmatrix.component.css']
})
export class ApprovalmatrixComponent implements OnInit {
  approvalMatrixForm: FormGroup;
  approvalMatrixInnerForm: FormGroup;

  segmentCodeList: any;
  verticalList: any;
  regionList: any;
  levelsList: any = [];
  submitted: boolean = false;
  isEdit = false;
  isAdd = true;
  levelNo: any;
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = '';
  countmodel: {};
  approvalMatrixList: any[] = [];
  submittedsearch: boolean;
  segment: any;
  vertical: any;
  closeResult: string;
  showAddButton: boolean = false;
  showEditButton: boolean = false;
  altleastOneLevelSet: boolean = false;
  editId: any;
  selectedLevels: any = [];
  level1: any;
  level2: any;
  level3: any;
  level4: any;
  alreadyRoleAssigned: boolean = false;
  verticalFullList: any[];
  segmentFullList: any[];

  get f() { return this.approvalMatrixForm.controls; }
  get fInner() { return this.approvalMatrixInnerForm.controls; }

  constructor(
    private formBuilder: FormBuilder,
    private lookupService: LookupService,
    private apporvalMatrixService: ApprovalmatrixService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadPageMode();
    this.onbuildForm();
  }

  private loadPageMode() {
    this.getSearchFields();
  }

  private onbuildForm() {
    this.approvalMatrixForm = this.formBuilder.group({
      segmentCode: [[], [Validators.required]],
      vertical: [[], [Validators.required]]
    });

    this.approvalMatrixInnerForm = this.formBuilder.group({
      approvalMatrixMargin: ['']
    });
  }

  getSearchFields() {
    let data = { "lookup_type": "vertical,segment" };
    this.lookupService.getLookupdata(data).subscribe(response => {
      this.verticalFullList = response.lookups.filter(lookup => lookup.lookup_type === "vertical");
      this.verticalList = this.verticalFullList;
      this.segmentFullList = response.lookups.filter(lookup => lookup.lookup_type === "segment");
    }, error => {
      this.notificationService.showError(error.error.error.message);
    });
  }

  getCount() {
    this.countmodel = { segment: this.f.segmentCode.value, vertical: this.f.vertical.value };
    this.apporvalMatrixService.getCount(this.countmodel).subscribe(
      response => {
        this.totalRows = response.countapprovalmatrix[0].count;
        if (this.totalRows > 0)
          this.getData();
        else
          this.approvalMatrixList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private getData() {
    let filtermodel = { segment: this.f.segmentCode.value, vertical: this.f.vertical.value }
    this.apporvalMatrixService.getApprovalMatrixList(filtermodel).subscribe(
      response => {
        this.approvalMatrixList = response.approvalMatrix;
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  openLg(content1, id) {
    this.submittedsearch = true;

    if (this.approvalMatrixForm.invalid)
      return;

    if (id > 0) {
      this.editId = id;
      this.isEdit = true;
      this.isAdd = false;
    } else {
      this.isEdit = false;
      this.isAdd = true;
    }

    this.onSearchBtnClick();
    this.altleastOneLevelSet = false;
    this.modalService.open(content1, { size: 'md' }).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSearchBtnClick() {
    this.submittedsearch = true;
    if (this.approvalMatrixForm.invalid) {
      return;
    } else {
      this.segment = this.segmentCodeList.filter(obj => obj.code === this.f.segmentCode.value)[0].code;
      this.vertical = this.verticalList.filter(obj => obj.code === this.f.vertical.value)[0].code;
      this.showAddButton = true;
      this.showEditButton = true;
      this.getCount();
    }
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';
    else
      this.sortDirection = 'DESC';
    var table = document.getElementById('table-approval-matrix');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  onSaveClick() {
    this.submitted = true;
    if (this.approvalMatrixInnerForm.invalid) {
      return;
    }

    let _cnt = 0;
    this.approvalMatrixList.forEach(element => {
      _cnt++;
      if (element.margin == null || element.margin == '')
        _cnt--;
    });

    if (_cnt == 0) {
      this.altleastOneLevelSet = true;
      return;
    } else {
      this.altleastOneLevelSet = false;
    }

    let insertModel: any = {
      segment: this.f.segmentCode.value,
      vertical: this.f.vertical.value,
      margins: this.approvalMatrixList
    }

    this.apporvalMatrixService.update(insertModel).subscribe(
      response => {
        if (response) {
          this.editId = 0;
          this.isEdit = false;
          this.submitted = false;
          this.modalService.dismissAll("");
          this.notificationService.showSuccess("Approval Matrix added successfully");
          this.getCount();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onMarginChange(event) {
    if (event.target.id != '') {
      let id: number = Number(event.target.id.substr(3));
      this.approvalMatrixList[id].margin = event.target.value;
    }
  }

  setLevelValidation(event: any, levelid: any) {
    if (this.fInner.approvalMatrixLevel1.value == "" &&
      this.fInner.approvalMatrixLevel2.value == "" &&
      this.fInner.approvalMatrixLevel3.value == "" &&
      this.fInner.approvalMatrixLevel4.value == "" &&
      this.fInner.approvalMatrixLevel5.value == "" &&
      this.fInner.approvalMatrixLevel6.value == "" &&
      this.fInner.approvalMatrixLevel7.value == "" &&
      this.fInner.approvalMatrixLevel8.value == "") {
      this.altleastOneLevelSet = true;
    } else {
      this.altleastOneLevelSet = false;
      if (event.id && this.selectedLevels.indexOf(event.id) !== -1) {
        if (levelid == "level1") {
          this.fInner.approvalMatrixLevel1.setValue(0);
        } else if (levelid == "level2") {
          this.fInner.approvalMatrixLevel2.setValue(0);
        } else if (levelid == "level3") {
          this.fInner.approvalMatrixLevel3.setValue(0);
        } else if (levelid == "level4") {
          this.fInner.approvalMatrixLevel4.setValue(0);
        } else if (levelid == "level5") {
          this.fInner.approvalMatrixLevel5.setValue(0);
        } else if (levelid == "level6") {
          this.fInner.approvalMatrixLevel6.setValue(0);
        } else if (levelid == "level7") {
          this.fInner.approvalMatrixLevel7.setValue(0);
        } else if (levelid == "level8") {
          this.fInner.approvalMatrixLevel8.setValue(0);
        }
        this.alreadyRoleAssigned = true;
      } else {
        this.selectedLevels.push(event.id);
        this.alreadyRoleAssigned = false;
      }
    }
  }

  public findInvalidControls() {
    const invalid = [];
    const controls = this.approvalMatrixForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid.push(name);
      }
    }
    return invalid;
  }

  delApprovalMatrix(id: number) {
    this.apporvalMatrixService.deleteApprovalMatrix(id).subscribe(
      response => {
        this.notificationService.showSuccess("Approval Matrix deleted successfully");
        this.getCount();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onVerticalChange(event: any) {
    this.submittedsearch = false;
    this.f.segmentCode.setValue(null);
    this.approvalMatrixList = [];
    if (event)
      this.segmentCodeList = this.segmentFullList.filter(x => x.parent_code == event.code);
    else
      this.segmentCodeList = [];
  }

  onSegmentChange() {
    this.submittedsearch = false;
    this.approvalMatrixList = [];
  }

  onCancelClick() {
    this.getCount();
    this.modalService.dismissAll();
  }
}