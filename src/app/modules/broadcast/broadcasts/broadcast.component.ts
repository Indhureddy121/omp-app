import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';
import { NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@core/services/auth/auth.service';
import { DatePipe } from '@angular/common';
import { Config } from '@core/configs/config';
import { OffersService } from '@core/services/offers/offers.service';
import { BroadcastsService } from '@core/services/broadcast/broadcasts.service';
import { FilesService } from '@core/services/common/files.service';
import * as FileSaver from 'file-saver';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-broadcast',
  templateUrl: './broadcast.component.html',
  styleUrls: ['./broadcast.component.css']
})
export class BroadcastComponent implements OnInit {

  BroadcastForm: FormGroup;

  submitted = false;
  isAdd = true;
  isEdit = false;
  isView = false;
  editId: any;

  Description: string = '';
  dateFormate: string = '';
  Mindate: any;
  todayDate: any;
  futureDate: any;
  filesize: number = 0;
  FromDate: { year: number; month: number; day: number };
  ToDate: { year: number; month: number; day: number };
  todayMinDate: { year: number; month: number; day: number };
  broadcastfiles: any[] = [];
  fileData: any;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public formatter: NgbDateParserFormatter,
    public authService: AuthService,
    private datePipe: DatePipe,
    private offersService: OffersService,
    private broadcastsService: BroadcastsService,
    private filesService: FilesService,
    private notificationService: NotificationService
  ) { }

  get broadcastForm() { return this.BroadcastForm.controls; }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.todayDate = moment().format('DD/MM/YYYY');
    this.futureDate = moment().add(7, 'd').format('DD/MM/YYYY');
    this.todayMinDate = this.convertDate(this.todayDate);
    this.FromDate = this.convertDate(this.todayDate);
    this.ToDate = this.convertDate(this.futureDate);
    this.Mindate = this.FromDate;
    this.filesize = Config.getItemsFile.filesize;

    this.loadPageMode();
    this.onbuildForm();
    this.disableFields();

    this.broadcastForm.fromdate.setValue(this.todayDate);
    this.broadcastForm.todate.setValue(this.futureDate);
  }

  private loadPageMode() {
    let currentUrl = this.router.url;
    this.dateFormate = this.authService.getDateFormat();

    this.activatedRoute.params.subscribe(parms => {
      this.editId = parms['id'];
    });

    if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
      this.GetBroadcastDetail();
    } else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
      this.isAdd = false;
      this.GetBroadcastDetail();
    }
  }

  private onbuildForm() {
    this.BroadcastForm = this.formBuilder.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required]],
      fromdate: [''],
      todate: ['']
    });
  }

  disableFields() {
    if (this.isView) {
      this.broadcastForm.fromdate.disable();
      this.broadcastForm.todate.disable();
    }
  }

  onFromDateSelection(date: any) {
    this.Mindate = date;
    let fromdate = new Date(date.year, date.month - 1, date.day).toString();

    this.FromDate = date;
    fromdate = this.datePipe.transform(fromdate, this.dateFormate);
    this.broadcastForm.fromdate.setValue(fromdate);

    if (new Date(this.broadcastForm.fromdate.value.split('/').reverse().join('-')) > new Date(this.broadcastForm.todate.value.split('/').reverse().join('-'))) {
      this.ToDate = this.convertDate(fromdate);
      this.broadcastForm.todate.setValue(fromdate);
    }
  }

  onToDateSelection(date: any) {
    let todate = new Date(date.year, date.month - 1, date.day).toString();
    todate = this.datePipe.transform(todate, this.dateFormate);
    this.ToDate = date;
    this.broadcastForm.todate.setValue(todate);
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    // let newdate = { year: year, month: month, day: day };
    return { year: year, month: month, day: day };
  }

  GetBroadcastDetail() {
    this.broadcastsService.GetDetail(this.editId).subscribe(
      response => {
        if (response) {
          this.SetData(response.broadcast.broadcastheader[0]);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  SetData(data: any) {
    this.broadcastForm.title.setValue(data.title);
    this.broadcastForm.description.setValue(data.description);

    this.FromDate = this.convertDate(this.datePipe.transform(data.fromdate, this.dateFormate));
    this.broadcastForm.fromdate.setValue(this.datePipe.transform(data.fromdate, this.dateFormate));

    this.ToDate = this.convertDate(this.datePipe.transform(data.todate, this.dateFormate));
    this.broadcastForm.todate.setValue(this.datePipe.transform(data.todate, this.dateFormate));

    this.broadcastfiles = data.files;
  }

  BroadcastfileChangeListener(event: any): void {
    if (this.broadcastfiles.length > 0) {
      this.broadcastfiles = [];
    }

    if (event.target.files) {
      if (event.target.files[0].size > this.filesize) {
        this.notificationService.showError('File exceeds the maximum size of ' + this.filesize);
        return;
      }

      for (let i = 0; i < event.target.files.length; i++) {
        this.broadcastfiles.push(event.target.files[i]);
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  removeBroadcastFile() {
    this.broadcastfiles = [];
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

  async onSaveClick() {
    this.submitted = true;

    if (this.BroadcastForm.invalid)
      return;

    let savemodel: any = {
      id: this.isAdd ? 0 : this.editId,
      title: this.broadcastForm.title.value,
      description: this.broadcastForm.description.value,
      fromdate: this.broadcastForm.fromdate.value.split('/').reverse().join('-'),
      todate: this.broadcastForm.todate.value.split('/').reverse().join('-'),
      attachmentid: ''
    }

    if (this.broadcastfiles.length > 0)
      await this.UploadBrodcastFile(savemodel);

    this.onBroadcastSave(savemodel);
  }

  async UploadBrodcastFile(savemodel) {
    var type: string = 'Broadcast';

    if (this.isEdit) {
      var oldfiles = this.broadcastfiles.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        savemodel.attachmentid = element;
      });
      this.broadcastfiles = this.broadcastfiles.filter(x => !x.id);
    }

    if (this.broadcastfiles && this.broadcastfiles.length > 0) {
      await this.offersService.upload(this.broadcastfiles, type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              savemodel.attachmentid = element.id;
            });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  onBroadcastSave(savemodel: any) {
    this.broadcastsService.Save(savemodel).subscribe(
      response => {
        if (savemodel && savemodel.id == 0)
          this.notificationService.showSuccess('Broadcast saved successfully.');
        else
          this.notificationService.showSuccess('Broadcast updated successfully.');

        this.router.navigate(['/broadcasts/list']);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onEditClick() {
    this.router.navigate(['/broadcasts/edit/' + this.editId]);
  }

  cancelClicked() {
    this.router.navigateByUrl('/broadcasts/list');
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
}
