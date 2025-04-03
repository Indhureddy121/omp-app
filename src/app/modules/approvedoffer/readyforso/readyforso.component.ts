import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FilesService } from '@core/services/common/files.service';
import * as FileSaver from 'file-saver';
import { DatePipe } from '@angular/common';
import { OffersService } from '@core/services/offers/offers.service';
import * as moment from 'moment';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-readyforso',
  templateUrl: './readyforso.component.html',
  styleUrls: ['./readyforso.component.css']
})
export class ReadyforsoComponent implements OnInit {

  POForm: FormGroup;
  submitted: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  isAdd: boolean = true;
  poid: number;
  files: any[] = [];
  fileData: any;
  dateFormate: string;
  offerid: number;
  userid: number;
  todayDate: any;
  id: number;
  poDate: { day: number; month: number; year: number; };
  fileupdate: boolean = false;
  fileid: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
    private datePipe: DatePipe,
    private offersService: OffersService,
  ) { }

  get poForm() { return this.POForm.controls; }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.id = parms['id'];
    });

    this.userid = this.authService.getUserId();
    this.todayDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.onLoad();
  }

  private onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.onbuildForm();
    this.loadPageMode();
    this.disableFields();
  }

  private loadPageMode() {
    let currentUrl = this.router.url;

    if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
      this.poid = this.id;
      this.getPOData();
    }
    else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
      this.isAdd = false;
      this.poid = this.id;
      this.getPOData();
    } else {
      this.offerid = this.id;
    }
  }

  private onbuildForm() {
    this.POForm = this.formBuilder.group({
      ponumber: ['', [Validators.required]],
      podate: ['', [Validators.required]]
    });
  }

  onPODateSelection(date) {
    let podate = new Date(date.year, date.month - 1, date.day).toString();
    podate = this.datePipe.transform(podate, this.dateFormate);
    this.poForm.podate.setValue(podate);
  }

  convertDate(date) {
    const year = Number(this.datePipe.transform(date, 'yyyy'));
    const month = Number(this.datePipe.transform(date, 'MM'));
    const day = Number(this.datePipe.transform(date, 'dd'));
    let newdate = { day: day, month: month, year: year };
    return newdate;
  }

  disableFields() {
    if (this.isView) {
      this.poForm.ponumber.disable();
      this.poForm.podate.disable();
    }
  }

  private getPOData() {
    this.offersService.getPOData(this.poid).subscribe(
      response => {
        if (response && response.data.getPOData.length > 0) {
          this.setData(response.data.getPOData[0]);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private setData(data: any) {
    this.poForm.ponumber.setValue(data.po_number);
    this.poDate = this.convertDate(data.po_date);
    if (this.isView)
      this.poForm.podate.setValue(this.datePipe.transform(data.po_date, this.dateFormate));
    else if (this.isEdit)
      this.poForm.podate.setValue(this.datePipe.transform(data.podate, this.dateFormate));
    this.files = data.files;
    this.fileid = data.files[0].id;
  }

  onEditClick() {
    let id = 0;
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/approvedoffers/edit/' + id]);
  }

  cancelClicked() {
    this.router.navigateByUrl('/approvedoffers/list');
  }

  onSubmit() {
    this.submitted = true;
    if (this.POForm.invalid) {
      return;
    }

    if (this.isAdd) {
      this.offersService.getPOCount(this.offerid).subscribe(
        response => {
          if (response && response.data.length > 0) {
            if (response.data[0].count != 0) {
              this.notificationService.showError('Status has been changed please refresh the list.');
              return;
            } else {
              this.saveClicked();
            }
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.saveClicked();
    }
  }

  saveClicked() {
    var type: string = '';
    type = 'PO';
    var attachmentid = '';

    if (this.isAdd) {
      this.offersService.upload(this.files, type).then(
        response => {
          if (response && response.resultfiles.length > 0) {
            attachmentid = response.resultfiles[0].id;

            let podate = this.poForm.podate.value.split("/");
            podate = podate[2] + "-" + podate[1] + "-" + podate[0];

            let savemodel = {
              offerid: this.offerid,
              ponumber: Number(this.poForm.ponumber.value),
              podate: podate,
              attachmentid: attachmentid,
              createdby: this.userid,
              createddate: this.todayDate
            }

            this.offersService.savePO(savemodel).subscribe(
              response => {
                if (response) {
                  this.notificationService.showSuccess('PO added successfully.');
                  this.router.navigateByUrl('/approvedoffers/list');
                }
              }, error => {
                this.notificationService.showError(error.error.error.message);
              });
          }
        });
    } else if (this.isEdit) {
      let podate = this.poForm.podate.value.split("/");
      podate = podate[2] + "-" + podate[1] + "-" + podate[0];

      if (this.fileupdate) {
        this.offersService.upload(this.files, type).then(
          response => {
            if (response && response.resultfiles.length > 0) {
              attachmentid = response.resultfiles[0].id;

              let updatemodel = {
                poid: this.poid,
                ponumber: Number(this.poForm.ponumber.value),
                podate: podate,
                attachmentid: attachmentid,
                updatedby: this.userid,
                updateddate: this.todayDate
              }

              this.offersService.updatePO(updatemodel).subscribe(
                response => {
                  if (response) {
                    this.notificationService.showSuccess('PO updated successfully.');
                    this.router.navigateByUrl('/approvedoffers/list');
                  }
                }, error => {
                  this.notificationService.showError(error.error.error.message);
                });
            }
          });
      } else {
        let updatemodel = {
          poid: this.poid,
          ponumber: Number(this.poForm.ponumber.value),
          podate: podate,
          attachmentid: this.fileid,
          updatedby: this.userid,
          updateddate: this.todayDate
        }

        this.offersService.updatePO(updatemodel).subscribe(
          response => {
            if (response) {
              this.notificationService.showSuccess('PO updated successfully.');
              this.router.navigateByUrl('/approvedoffers/list');
            }
          }, error => {
            this.notificationService.showError(error.error.error.message);
          });
      }
    }
    
    this.submitted = false;
  }

  fileChangeListener(event: any): void {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
        if (this.isEdit) {
          this.fileupdate = true;
        }
        this.files.push(event.target.files[i]);
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
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

  removeFile(index: number) {
    this.files = Array.from(this.files)
    this.files.splice(index, 1);
  }

  downloadFile(name, id, filetype) {
    this.filesService.download(id).subscribe(
      response => {
        this.fileData = response.pecount;

        var sliceSize = 512;
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
}
