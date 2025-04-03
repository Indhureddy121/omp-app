import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthService } from '@core/services/auth/auth.service';
import { PeactionService } from '@core/services/peaction/peaction.service';
import { NgbDateParserFormatter, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { FilesService } from 'src/app/core/services/common/files.service';
import * as FileSaver from 'file-saver';
import { Config } from 'src/app/core/configs/config';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-asmaction',
  templateUrl: './asmaction.component.html',
  styleUrls: ['./asmaction.component.css']
})
export class AsmactionComponent implements OnInit {

  RequirementForm: FormGroup;
  CommentsForm: FormGroup;

  submitted = false;
  isEdit = false;
  isView = false;
  isAdd = true;
  peData: any;
  dateformate: any;
  userid: any;
  username: any;
  currentDate: Date;
  peid: any;
  validfromDate: { day: number; month: number; year: number; };
  validtoDate: { day: number; month: number; year: number; };
  currencyTypeList: any[] = [
    { code: 'INR', description: 'INR' },
    { code: 'USD', description: 'Doller' },
    { code: 'EUR', description: 'Euro' }];
  pgList: any[] = [];
  phList: any[] = [];
  iscomplete: boolean = false;
  ValidMindate: any;
  ValidMaxdate: { day: number; month: number; year: number; };
  todayDate: string;
  futureDate: string;
  CommentsFiles: any[] = [];
  fileData: any;
  peSection: number = 0;
  commentSection: number = 0;
  type: string = 'PEAction';
  closeResult: string;
  commentdata: any[] = [];
  isComment: boolean = false;
  requirementdocs: any[] = [];
  ASMComment: string;
  filesperitem: number;
  filesize: number;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private peactionService: PeactionService,
    private authService: AuthService,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  get requirementForm() { return this.RequirementForm.controls; }
  get commentsForm() { return this.CommentsForm.controls; }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.peid = parms['id'];
    });
    this.onLoad();
  }

  private onLoad() {
    this.dateformate = this.authService.getDateFormat();
    this.userid = this.authService.getUserId();
    this.username = this.authService.getUserName();
    this.currentDate = new Date(Date.now());
    this.todayDate = moment().format("YYYY-MM-DD");
    this.futureDate = moment().add(30, 'd').format("YYYY-MM-DD");
    this.filesperitem = Config.getItemsFile.NumberofFiles + 1;
    this.filesize = Config.getItemsFile.filesize;
    this.validfromDate = this.convertDate(this.todayDate);
    this.validtoDate = this.convertDate(this.futureDate);
    this.ValidMaxdate = this.validtoDate;
    this.ValidMindate = this.validfromDate;
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
    }
    else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
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

    this.CommentsForm = this.formBuilder.group({
      comments: [null, [Validators.required]]
    });
  }

  private getDetaildata() {
    this.peactionService.getPEDetail(this.peid).subscribe(
      response => {
        if (response.pedata && response.pedata.sprdata.length > 0) {
          this.peData = response.pedata.sprdata[0];
          this.setData(this.peData);
          this.GetComment();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private setData(data: any) {
    this.requirementForm.articleno.setValue(data.articleno);
    this.requirementForm.reqdescription.setValue(data.description);
    this.requirementdocs = data.files;
  }

  convertDate(date) {
    const year = Number(this.datePipe.transform(date, 'yyyy'));
    const month = Number(this.datePipe.transform(date, 'MM'));
    const day = Number(this.datePipe.transform(date, 'dd'));
    let newdate = { day: day, month: month, year: year };
    return newdate;
  }

  cancelClicked() {
    this.router.navigateByUrl('/asmaction/list');
  }

  CommentsfileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateCommentFiles(event.target.files)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.CommentsFiles.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  ValidateCommentFiles(files: any) {
    if (files.length > this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }


    if (this.CommentsFiles.length == this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }


    for (let file of files) {
      if (file.size > this.filesize) {
        this.notificationService.showError('File exceeds the maximum size of ' + this.filesize);
        return false;
      }
    }

    return true;
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
    this.CommentsFiles = Array.from(this.CommentsFiles)
    this.CommentsFiles.splice(index, 1);
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

  openCommentModal(CommentModal) {
    this.commentsForm.comments.setValue(null);
    this.ASMComment = null;
    this.CommentsFiles = [];
    this.submitted = false;

    this.modalService.open(CommentModal, { size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  async onCommentSaveClick() {
    this.submitted = true;

    if (this.CommentsForm.invalid)
      return;

    let commentsavemodel = {
      id: this.peid,
      comment: this.commentsForm.comments.value,
      files: this.CommentsFiles,
      documents: [],
      offerid: this.peData.offerid
    }

    await this.fileUpload(commentsavemodel);
    this.saveComments(commentsavemodel);
  }

  async fileUpload(commentsavemodel: any) {
    if (commentsavemodel.files && commentsavemodel.files.length > 0) {
      await this.peactionService.upload(commentsavemodel.files, this.type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              commentsavemodel.documents.push({ id: element.id });
            });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  saveComments(commentsavemodel: any) {
    this.peactionService.SaveComments(commentsavemodel).subscribe(
      response => {
        if (response && response.comment) {
          this.notificationService.showSuccess('Comments saved successfully.');
          this.modalService.dismissAll();
          this.GetComment();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetComment() {
    this.peactionService.GetComments(this.peid).subscribe(
      response => {
        if (response.comments && response.comments.commentdata.length > 0) {
          this.commentdata = response.comments.commentdata;
          this.isComment = true;
        } else {
          this.isComment = false;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onCommentCancelClick() {
    this.commentsForm.comments.setValue(null);
    this.ASMComment = null;
    this.CommentsFiles = [];
  }
}