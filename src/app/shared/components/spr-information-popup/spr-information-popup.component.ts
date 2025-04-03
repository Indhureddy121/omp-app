import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageKey, StorageService } from '@core/services/common/storage.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-spr-information-popup',
  templateUrl: './spr-information-popup.component.html',
  styleUrls: ['./spr-information-popup.component.scss']
})

export class SprInformationPopupComponent implements OnInit {

  ShowSubmitforButton: boolean = true;
  submitted: boolean = false;
  filterFields: any;
  filterForm: FormGroup;
  isSavedValidation: boolean = false;
  @Input() dataSheetObj: any;
  @Input() articleNo: any;
  @Input() description: any;
  @Input() isModelContentView: boolean = true;
  @Input() isReadOnlyForm: boolean = false;
  @Input() isSaveBtnDisplay: boolean = true;
  @Input() isSubmitBtnDisplay: boolean = true;
  @Input() isSaveandSubmitBtnDisplay: boolean = false;
  @Output() isSavedOrSubmitted: EventEmitter<Object> = new EventEmitter<Object>();
  sprformstatus: number;
  dptxtValueData: any = {};
  @Input() isDpTxtVisible: boolean = true;

  constructor(
    private modalService: NgbModal
    , private router: Router
    , private storageService: StorageService) { }

  ngOnInit() {
    this.initPopup();
  }

  initPopup() {
    let group: any = {};
    this.filterFields = JSON.parse(this.storageService.getValue(StorageKey.sprFormJsonData));
    if (this.dataSheetObj) {
      this.filterFields.map((ele, index) => {
        ele.value = this.dataSheetObj[ele.code];
        // if (ele.subcode && ele.value === 'Other') {
        //   ele.subvalue = this.dataSheetObj[ele.code + "_" + ele.subcode + index];
        //   if (ele.subvalue)
        //     ele.issubcode = true;
        // }
      })
    }

    // Dropdown textbox by default false set
    this.filterFields.map((ele) => {
      ele.issubcode = false;
      return ele;
    });

    this.filterFields.map((ele: any, index) => {
      if (ele.type === 'dpdown' && typeof ele.value === 'string' && ele.value !== '') {
        const findIndex = ele.options.findIndex(s => s.code === (ele.value).trim());
        // && ele.value.includes('Other_')
        // const value=ele.value.split('_')[1];

        if (findIndex === -1) {
          const obj = {
            [ele.code]: ele.value
          };
          Object.assign(this.dptxtValueData, obj);
          ele.issubcode = true;
          ele.value = "Other";
        }
      }

      group[ele.code] = new FormControl({ value: ele.value, disabled: this.isReadOnlyForm }, ele.isrequired ? Validators.required : null);
      // if (ele.subcode)
      //   group[ele.code + "_" + ele.subcode + index] = new FormControl({ value: ele.subvalue, disabled: this.isReadOnlyForm }, ele.subrequired ? Validators.required : null);

      return ele;
    });

    this.filterForm = new FormGroup(group);
    this.isSavedValidation = this.router.url.includes('peaction') ? true : false;
  }
  cancel() {
    this.modalService.dismissAll();
  }

  save() {
    this.sprformstatus = SPRFORMSTATUS.pending;
    if (this.isSavedValidation) {
      this.sprformstatus = SPRFORMSTATUS.completed;
      this.submitted = true;
      if (this.filterForm.invalid)
        return;
    }
    this.finalSaveOrSubmitted(false);
  }

  finalSaveOrSubmitted(submit: boolean) {
    const keyData = Object.keys(this.dptxtValueData);
    keyData.map((ele) => {
      this.filterForm.value[ele] = this.dptxtValueData[ele];
    });

    // Object.keys(this.filterForm.value).forEach(e => 
    //   this.filterForm.value[e] = (this.filterForm.value[e] != null && this.filterForm.value[e] != undefined) ? this.filterForm.value[e].replace(/[^\x00-\x7F]/g, '') : this.filterForm.value[e]    
    // );

    for (const key in this.filterForm.value)
    {
      if ((typeof this.filterForm.value[key] === 'string' || this.filterForm.value[key] instanceof String) && this.filterForm.value[key] != null && this.filterForm.value[key] != undefined) {
        this.filterForm.value[key] = this.filterForm.value[key].replace(/[^\x00-\x7F]/g, '');
      }
    }   

    const obj = {
      sprform_status: this.sprformstatus,
      sprform_fields: this.filterForm.value,
      submit: submit
    }

    this.isSavedOrSubmitted.emit(obj);
    this.modalService.dismissAll();
  }

  get filterFieldsForms() { return this.filterForm.controls };

  submitForSPRInformation(submit: boolean) {
    this.submitted = true;
    this.sprformstatus = SPRFORMSTATUS.completed;
    if (this.filterForm.invalid)
      return;

    //Dropdown 'Other' value selected after the textbox validation check
    const data = Object.keys(this.dptxtValueData);
    if (data.length > 0) {
      let isDpTxtValidation = false;
      for (let item of data) {
        if (this.dptxtValueData[item] === '') {
          isDpTxtValidation = true;
          break;
        }
      }
      if (isDpTxtValidation)
        return;
    }



    this.finalSaveOrSubmitted(submit);
  }

  isValid(code) {
    return this.filterForm.controls[code].invalid;
  }

  isSubValid(subcode) {
    return this.filterForm.controls[subcode].invalid;
  }

  isFieldError(code) {
    return this.filterForm.controls[code].errors;
  }

  isSubFieldError(subcode) {
    return this.filterForm.controls[subcode].errors;
  }

  isFieldRequired(code) {
    return this.filterForm.controls[code].errors ? this.filterForm.controls[code].errors.required : false;
  }

  isSubFieldRequired(subcode) {
    return this.filterForm.controls[subcode].errors ? this.filterForm.controls[subcode].errors.required : false;
  }

  ngOnDestroy() {
    if (this.filterForm) {
      this.filterForm.reset();
    }
  }

  ngOnChanges(changes) {
    if (changes && changes.dataSheetObj && changes.dataSheetObj.currentValue) {
      this.dataSheetObj = changes.dataSheetObj.currentValue;
      this.initPopup();
    }
  }

  onChange(event, item, index) {
    // if (event && event.code === 'Other')
    //   item.issubcode = true;
    // else {
    //   this.filterFields[index].issubcode = false;
    //   this.filterFields[index].subvalue = "";
    //   this.filterForm.value[item.code + "_" + item.subcode + index] = "";
    // }
    if (event && event.code === 'Other') {
      this.filterForm.controls[item.code].setValue('Other');
      this.filterFields[index].issubcode = true;
      const obj = {
        [item.code]: ''
      };
      Object.assign(this.dptxtValueData, obj);
    }
    else {
      this.filterFields[index].issubcode = false;
      delete this.dptxtValueData[item.code];
    }
  }

  dptxtvalueInput(event, item) {
    //  this.filterForm.controls[fieldName].setValue();
    const obj = {
      [item.code]: event.target.value
    };
    Object.assign(this.dptxtValueData, obj);
  }
}


export enum SPRFORMSTATUS {
  "pending" = 10,
  "completed" = 20
}