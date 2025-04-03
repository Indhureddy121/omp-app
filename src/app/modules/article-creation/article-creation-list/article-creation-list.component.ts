import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from '@shared/directives';
import { PeactionService } from '@core/services/peaction/peaction.service';
import { AuthService } from '@core/services/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SPRItemStatusEnum } from 'src/app/core/enums/spritemstatus.enum';
import * as XLSX from 'xlsx';
import { Config } from '@core/configs/config';
import { environment } from 'src/environments/environment';
import { SampleEnum } from '@core/enums/sample.enum';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { LookupService } from '@core/services/common/lookup.service';
import { NotificationService } from '@core/services/common/notification.service';
import { ArticleCreationService } from '@core/services/article-creation/article-creation.service';

@Component({
  selector: 'app-article-creation-list',
  templateUrl: './article-creation-list.component.html',
  styleUrls: ['./article-creation-list.component.css']
})
export class ArticleCreationListComponent implements OnInit {

  articleCreations: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = "";
  sortDirection = "DESC";
  totalRows: number;
  pager: any = {};
  searchValue: string = "";
  searchModel = Object();
  articleSAPId: string = "";
  submitted: boolean = false;
  selectedOfferId: number = 0;
  selectedArticleno: string = "";
  @ViewChild("sapidModal", { static: false }) sapidModal: any;

  constructor(
    private router: Router,
    private peactionservice: PeactionService,
    private pagerService: PagerService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private appService: AppService,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private articleCreationService: ArticleCreationService,
    private lookupService: LookupService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.getCount();
  }

  getCount() {
    var screenvalues = this.authService.getScreenValues().ArticleCreation;
    this.searchValue = screenvalues ? screenvalues.searchtext : "";
    this.searchModel.searchtext = this.searchValue;

    if (screenvalues && screenvalues.pagenumber)
      this.pageNumber = screenvalues.pagenumber;
    else
      this.pageNumber = 1;

    let filtermodel = { searchValue: this.searchValue }
    this.articleCreationService.count(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.totalRows = response.responsedata.data[0].count;
          if (this.totalRows > 0)
            this.getData();
          else
            this.articleCreations = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.articleCreationService.list(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.articleCreations = response.responsedata.data;
          this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.AfterFilter(this.pageNumber);
    this.getData();
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.authService.setScreenValues('ArticleCreation', 'searchtext', this.searchValue);
    // this.AfterFilter(null);
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-articlecreation');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  AfterFilter(pageNumber) {
    if (pageNumber)
      this.pageNumber = pageNumber;
    else
      this.pageNumber = 1;

    this.authService.setScreenValues('ArticleCreation', 'pagenumber', this.pageNumber);
  }

  addSAPId(offerId: number, articleno: string) {
    this.submitted = false;

    this.resetParam();
    this.selectedOfferId = offerId;
    this.selectedArticleno = articleno;
    this.modalService.open(this.sapidModal, { size: "sm" });
  }

  onSaveSApID() {
    this.submitted = true;

    if (!this.selectedArticleno.length || !this.articleSAPId.length) {
      return;
    }

    let saveModel = {
      offerid: this.selectedOfferId,
      articleno: this.selectedArticleno,
      sapid: this.articleSAPId
    }

    this.articleCreationService.save(saveModel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.getCount();
          this.resetParam();
          this.modalService.dismissAll();
          this.notificationService.showSuccess(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  resetParam() {
    this.selectedOfferId = 0;
    this.selectedArticleno = "";
    this.articleSAPId = "";
  }
}
