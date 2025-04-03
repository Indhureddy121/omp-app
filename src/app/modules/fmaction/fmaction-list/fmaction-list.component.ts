import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from '@shared/directives';
import { FmactionService } from '@core/services/fmaction/fmaction.service';
import { AuthService } from '@core/services/auth/auth.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-fmaction-list',
  templateUrl: './fmaction-list.component.html',
  styleUrls: ['./fmaction-list.component.css']
})
export class FmactionListComponent implements OnInit {

  FilterForm: FormGroup;

  fmactionlist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateformate: any;
  searchModel = Object();
  itemSPRStatusList: any[] = [
    { code: 0, description: 'All' },
    { code: 20, description: 'PE Completed' },
    { code: 30, description: 'FM Completed' },
  ];

  constructor(
    private router: Router,
    private fmactionService: FmactionService,
    private pagerService: PagerService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls; }

  ngOnInit() {
    this.onbuildForm();
    this.onLoad();
  }

  onbuildForm() {
    this.FilterForm = this.formBuilder.group({
      itemSPRStatus: [0]
    });
  }

  private onLoad() {
    this.dateformate = this.authService.getDateFormat();
    this.getCount();
  }

  getCount() {
    var screenvalues = this.authService.getScreenValues().FM_Action;
    this.searchValue = screenvalues.searchtext;
    this.searchModel.searchtext = this.searchValue;
    this.filterForm.itemSPRStatus.setValue(screenvalues.itemSPRStatus);

    this.fmactionService.getCount(this.searchValue, this.filterForm.itemSPRStatus.value).subscribe(
      response => {
        this.totalRows = response.fmactioncount[0].count;
        if (this.totalRows > 0)
          this.getData();
        else
          this.fmactionlist = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.fmactionService.getFMActionList(filtermodel, this.filterForm.itemSPRStatus.value).subscribe(
      response => {
        this.fmactionlist = response.fmactionlist;
        this.setStatus();
        this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData();
  }

  setStatus() {
    this.fmactionlist.forEach(element => {
      if (element.status == 10)
        element.showstatus = 'In Progress';
      else if (element.status == 14)
        element.showstatus = 'In Progress';
      else if (element.status == 20)
        element.showstatus = 'PE Completed';
      else if (element.status == 30)
        element.showstatus = 'FM Completed';
    });
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.authService.setScreenValues('FM_Action', 'searchtext', this.searchValue);
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

  // onRowDoubleClick(id: number) {
  //   this.router.navigate(['/fmaction/view/' + id]);
  // }

  editClicked(id: number) {
    this.router.navigate(['/fmaction/edit/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/fmaction/view/' + id]);
  }

  onFilterStatusChange(event: any) {
    if (!event)
      this.filterForm.itemSPRStatus.setValue(0);

    this.authService.setScreenValues('FM_Action', 'itemSPRStatus', this.filterForm.itemSPRStatus.value);
    this.getCount();
  }
}