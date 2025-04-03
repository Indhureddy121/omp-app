import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from '@shared/directives';
import { AuthService } from '@core/services/auth/auth.service';
import { OffersService } from '@core/services/offers/offers.service';
import { NgbModal, ModalDismissReasons, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { FilesService } from '@core/services/common/files.service';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-readyforso-list',
  templateUrl: './readyforso-list.component.html',
  styleUrls: ['./readyforso-list.component.css']
})
export class ReadyforsoListComponent implements OnInit {

  POForm: FormGroup;
  readyforsolist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateFormate: string;
  length: any;
  userid: number;
  closeResult: string;
  files: any[] = [];
  PODate: { day: number; month: number; year: number; };
  fileData: any;
  submitted: boolean = false;
  todayDate: any;
  offerid: any;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private pagerService: PagerService,
    private authService: AuthService,
    private offersService: OffersService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
  ) { }

  get poForm() { return this.POForm.controls; }

  ngOnInit() {
    this.userid = this.authService.getUserId();
    this.todayDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.onLoad();
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.getCount(this.searchValue);
    this.onbuildForm();
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

  getCount(searchValue) {
    this.offersService.getReadyForSoCount(searchValue, this.userid).subscribe(
      response => {
        if (response) {
          this.totalRows = response.readyforsocount[0].count;
          if (this.totalRows > 0)
            this.getData();
          else
            this.readyforsolist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.offersService.getReadyForSoList(filtermodel, this.userid).subscribe(
      response => {
        if (response.finalSoList)
          this.readyforsolist = response.finalSoList;

        this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
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
    this.getCount(this.searchValue);
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-offers');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  onRowDoubleClick(id: number) {
    if (id)
      this.router.navigate(['/approvedoffers/view/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/approvedoffers/view/' + id]);
  }

  editClicked(id: number) {
    this.router.navigate(['/approvedoffers/edit/' + id]);
  }

  addpoclicked(id: number) {
    this.router.navigate(['/approvedoffers/add/' + id]);
  }

  openaddeditpo(AddEditPO, id) {
    if (id != undefined) {
      this.offersService.getPOData(id).subscribe(
        response => {
          if (response && response.length > 0) {
            this.offerid = id;
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.poForm.ponumber.setValue(null);
      this.poForm.ponumber.setValue(null);
    }


    this.modalService.open(AddEditPO, { size: 'md' }).result.then((result) => {

      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  posave() {
    this.submitted = true;
    if (this.POForm.invalid)
      return;
    var type: string = '';
    type = 'PO';
    this.offersService.upload(this.files, type).then(
      response => {
        if (response && response.resultfiles.length > 0) {
          let attachmentid = '';
          response.resultfiles.forEach(element => {
            attachmentid = element.id;
          });

          let savemodel = {
            offerid: this.offerid,
            ponumber: this.poForm.ponumber.value,
            podate: this.poForm.podate.value,
            attachmentid: attachmentid,
            createdby: this.userid,
            createddate: this.todayDate
          }

          this.offersService.savePO(savemodel).subscribe(
            response => {
              if (response) {
                this.notificationService.showSuccess('PO added successfully.');
              }
            }, error => {
              this.notificationService.showError(error.error.error.message);
            });
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
        return;
      });

    this.submitted = false;
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

  fileChangeListener(event: any): void {
    if (event.target.files) {
      for (let i = 0; i < event.target.files.length; i++) {
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