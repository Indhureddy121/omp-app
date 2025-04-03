import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { PagerService } from '@shared/directives';
import { AsmactionService } from '@core/services/asmaction/asmaction.service';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-asmaction-list',
  templateUrl: './asmaction-list.component.html',
  styleUrls: ['./asmaction-list.component.css']
})
export class AsmactionListComponent implements OnInit {

  asmactionlist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateformate: any;
  searchModel = Object();

  constructor(
    private router: Router,
    private asmactionService: AsmactionService,
    private pagerService: PagerService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.dateformate = this.authService.getDateFormat();
    this.getCount();
  }

  getCount() {
    var screenvalues = this.authService.getScreenValues().ASM_Action;
    if (screenvalues)
      this.searchValue = screenvalues.searchtext;

    this.asmactionService.getCount(this.searchValue).subscribe(
      response => {
        this.totalRows = response.asmactioncount[0].count;
        if (this.totalRows > 0)
          this.getData();
        else
          this.asmactionlist = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.asmactionService.getASMActionList(filtermodel).subscribe(
      response => {
        this.asmactionlist = response.asmactionlist;
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
    this.asmactionlist.forEach(element => {
      if (element.status == 10)
        element.showstatus = 'In Progress';
      else if (element.status == 14)
        element.showstatus = 'In Progress';
      else if (element.status == 20)
        element.showstatus = 'PE Completed';
      else if (element.status == 30)
        element.showstatus = 'PE Completed';
    });
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue)
      this.searchValue = response.searchValue;

    this.authService.setScreenValues('ASM_Action', 'searchtext', this.searchValue);
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
  //   this.router.navigate(['/asmaction/view/' + id]);
  // }

  onAddClick() {
    this.router.navigateByUrl('/asmaction/add');
  }

  editClicked(id: number) {
    this.router.navigate(['/asmaction/edit/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/asmaction/view/' + id]);
  }
}
