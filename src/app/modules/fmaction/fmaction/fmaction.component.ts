import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { PeactionService } from '@core/services/peaction/peaction.service';
import { NgbDate, NgbDateParserFormatter, NgbAccordion, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FilesService } from 'src/app/core/services/common/files.service';
import * as FileSaver from 'file-saver';
import { FmactionService } from '@core/services/fmaction/fmaction.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-fmaction',
  templateUrl: './fmaction.component.html',
  styleUrls: ['./fmaction.component.css']
})
export class FmactionComponent implements OnInit {

  RequirementForm: FormGroup;
  FreightInformationForm: FormGroup;

  submitted = false;
  isEdit = false;
  isView = false;
  isAdd = true;
  peData: any;
  dateformate: any;
  userid: any;
  username: any;
  currentDate: Date;
  itemid: any;
  iscomplete: boolean = false;
  requirementdocs: any[] = [];
  fileData: any;
  freightsection: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private peactionService: PeactionService,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
    private fmactionService: FmactionService,
    private notificationService: NotificationService
  ) { }

  get requirementForm() { return this.RequirementForm.controls; }
  get freightInformationForm() { return this.FreightInformationForm.controls; }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.itemid = parms['id'];
    });
    this.onLoad();
  }

  private onLoad() {
    this.dateformate = this.authService.getDateFormat();
    this.userid = this.authService.getUserId();
    this.currentDate = new Date(Date.now());
    this.loadPageMode();
    this.onbuildForm();
  }

  private loadPageMode() {
    let currentUrl = this.router.url;

    if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
      this.getDetaildata();
    } else if (currentUrl.includes('view')) {
      this.isEdit = false;
      this.isView = true;
      this.isAdd = false;
      this.getDetaildata();
    }
  }

  private onbuildForm() {
    this.RequirementForm = this.formBuilder.group({
      articleno: [null],
      reqdescription: [null],
      reqattachment: [null]
    });

    this.FreightInformationForm = this.formBuilder.group({
      owf: [null],
      adjfactone: [null],
      adjfacttwo: [null],
      adjfactthree: [null],
      adjfactfour: [null],
      adjfactfive: [null],
      adjfactsix: [null],
      iscomplete: [null]
    });
  }

  private getDetaildata() {
    this.peactionService.getPEDetail(this.itemid).subscribe(
      response => {
        if (response.pedata && response.pedata.sprdata.length > 0) {
          this.peData = response.pedata.sprdata[0];
          this.setData(this.peData);
        }
      }, error => {
        alert('error : ' + error);
      });
  }

  private setData(data: any) {
    this.requirementForm.articleno.setValue(data.articleno);
    this.requirementForm.reqdescription.setValue(data.description);
    this.requirementdocs = data.files;

    this.freightInformationForm.owf.setValue(data.owf == 0 ? null : data.owf);
    this.freightInformationForm.adjfactone.setValue(data.adjfactorone == 0 ? null : data.adjfactorone);
    this.freightInformationForm.adjfacttwo.setValue(data.adjfactortwo == 0 ? null : data.adjfactortwo);
    this.freightInformationForm.adjfactthree.setValue(data.adjfactorthree == 0 ? null : data.adjfactorthree);
    this.freightInformationForm.adjfactfour.setValue(data.adjfactorfour == 0 ? null : data.adjfactorfour);
    this.freightInformationForm.adjfactfive.setValue(data.adjfactorfive == 0 ? null : data.adjfactorfive);
    this.freightInformationForm.adjfactsix.setValue(data.adjfactorsix == 0 ? null : data.adjfactorsix);

    this.managePageSection(data.status, data.IsActive);
  }

  managePageSection(status: number, isactive: number) {
    this.freightsection = 0;

    if (isactive == 1) {
      if (status <= 20) {
        this.freightsection = 2;
      }
    } else {
      if (status <= 20) {
        this.freightsection = 1;
      }
    }
  }

  isEditSection(section: string) {
    let isEdit: boolean = false;

    if (section == 'freightsection')
      isEdit = this.freightsection == 2 ? true : false;

    return isEdit;
  }

  convertDate(date) {
    const year = Number(this.datePipe.transform(date, 'yyyy'));
    const month = Number(this.datePipe.transform(date, 'MM'));
    const day = Number(this.datePipe.transform(date, 'dd'));
    let newdate = { day: day, month: month, year: year };
    return newdate;
  }

  toggleIsComplete(event) {
    this.iscomplete = event.target.checked;
    // this.updateValidators();
  }

  updateValidators() {
    if (this.iscomplete) {
      this.freightInformationForm.owf.setValidators(Validators.required);
      this.freightInformationForm.adjfactone.setValidators(Validators.required);
      this.freightInformationForm.adjfacttwo.setValidators(Validators.required);
      this.freightInformationForm.adjfactthree.setValidators(Validators.required);
      this.freightInformationForm.adjfactfour.setValidators(Validators.required);
      this.freightInformationForm.adjfactfive.setValidators(Validators.required);
      this.freightInformationForm.adjfactsix.setValidators(Validators.required);
    } else {
      this.freightInformationForm.owf.clearValidators();
      this.freightInformationForm.adjfactone.clearValidators();
      this.freightInformationForm.adjfacttwo.clearValidators();
      this.freightInformationForm.adjfactthree.clearValidators();
      this.freightInformationForm.adjfactfour.clearValidators();
      this.freightInformationForm.adjfactfive.clearValidators();
      this.freightInformationForm.adjfactsix.clearValidators();
    }

    this.freightInformationForm.owf.updateValueAndValidity();
    this.freightInformationForm.adjfactone.updateValueAndValidity();
    this.freightInformationForm.adjfacttwo.updateValueAndValidity();
    this.freightInformationForm.adjfactthree.updateValueAndValidity();
    this.freightInformationForm.adjfactfour.updateValueAndValidity();
    this.freightInformationForm.adjfactfive.updateValueAndValidity();
    this.freightInformationForm.adjfactsix.updateValueAndValidity();
  }

  cancelClicked() {
    this.router.navigateByUrl('/fmaction/list');
  }

  setFileTypeIcon(filetype: any) {
    let fileicon = "icon-note.svg";
    if (filetype == 'application/pdf') {
      fileicon = "icon-pdf.svg"
    } else if (filetype == 'image/png' || filetype == 'image/gif' || filetype == 'image/jpeg' || filetype == 'image/jpg' || filetype == 'image/bmp') {
      fileicon = "icon-images.svg";
    } else if (filetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileicon = "icon-docs.svg";
    } else if (filetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      fileicon = "icon-excel.svg";
    }
    return fileicon;
  }

  downloadFile(name, id, filetype) {
    this.filesService.download(id).subscribe(
      response => {
        this.fileData = response.pecount;

        var sliceSize = 512
        const byteCharacters = atob(this.fileData);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: filetype });
        FileSaver.saveAs(blob, name);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSubmit() {
    this.submitted = true;

    if (this.FreightInformationForm.invalid)
      return;

    let freightsavemodel = {
      itemid: this.itemid,
      iscomplete: this.iscomplete,
      owf: this.freightInformationForm.owf.value,
      adjfactorone: this.freightInformationForm.adjfactone.value,
      adjfactortwo: this.freightInformationForm.adjfacttwo.value,
      adjfactorthree: this.freightInformationForm.adjfactthree.value,
      adjfactorfour: this.freightInformationForm.adjfactfour.value,
      adjfactorfive: this.freightInformationForm.adjfactfive.value,
      adjfactorsix: this.freightInformationForm.adjfactsix.value
    }

    this.SaveFreight(freightsavemodel);
  }

  SaveFreight(freightsavemodel) {
    this.fmactionService.saveFreight(freightsavemodel).subscribe(
      response => {
        if (response) {
          this.notificationService.showSuccess('Freight Information updated successfully.');
          this.router.navigateByUrl('/fmaction/list');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      }
    );
  }
}