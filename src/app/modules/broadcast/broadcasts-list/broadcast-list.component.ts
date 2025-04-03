import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { BroadcastsService } from 'src/app/core/services/broadcast/broadcasts.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/common/notification.service';


@Component({
  selector: 'app-broadcast-list',
  templateUrl: './broadcast-list.component.html',
  styleUrls: ['./broadcast-list.component.css']
})
export class BroadcastListComponent implements OnInit {

  broadcastslist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateFormate: string;
  userid: number;
  searchModel = Object();
  offerid: number;
  deleteConfirModel = Object();

  @ViewChild('AssigneeModel', { static: false }) AssigneeModel: any;
  @ViewChild('DeleteModel', { static: false }) DeleteModel: any;

  constructor(
    private router: Router,
    private notificationService: NotificationService,
    private pagerService: PagerService,
    private authService: AuthService,
    private modalService: NgbModal,
    private broadcastsService: BroadcastsService
  ) { }

  ngOnInit() {
    this.userid = this.authService.getUserId();
    // this.onbuildForm();
    this.onLoad();
  }

  onbuildForm() {
    // this.FilterForm = this.formBuilder.group({
    // });
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.getCount();
  }

  getCount() {
    this.broadcastsService.GetCount(this.searchValue).subscribe(
      response => {
        if (response) {
          this.totalRows = response.broadcast[0].count;
          if (this.totalRows > 0)
            this.getData();
          else
            this.broadcastslist = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }

    this.broadcastsService.GetList(filtermodel).subscribe(
      response => {
        this.broadcastslist = response.broadcast;

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

    this.pageNumber = 1;
    this.getCount();
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
    this.router.navigate(['/broadcasts/view/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/broadcasts/view/' + id]);
  }

  editClicked(id: number) {
    this.router.navigate(['/broadcasts/edit/' + id]);
  }

  onAddClick() {
    this.router.navigate(['/broadcasts/add/']);
  }

  OpenDeleteConfirmationPopup(index: number, id: number) {
    this.deleteConfirModel.index = index;
    this.deleteConfirModel.id = id;
    this.modalService.open(this.DeleteModel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onDelete(event: any) {
    this.broadcastsService.Delete(event.model.id).subscribe(
      response => {
        if (response) {
          this.notificationService.showSuccess('Deleted successfully.');
          this.modalService.dismissAll('delete');
          this.getCount();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
}