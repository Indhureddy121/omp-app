import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PortService } from '@core/services/masters/port.service';
import { PagerService } from '@core/services/common/pager.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-port-list',
  templateUrl: './port-list.component.html',
  styleUrls: ['./port-list.component.css']
})
export class PortListComponent implements OnInit {
  portList: any[] = []
  // portList = [
  //   { port_no: '00123', port_name: 'hne1', charges: 2 },
  //   { port_no: '00123', port_name: 'hne1', charges: 2 },
  //   { port_no: '00123', port_name: 'hne1', charges: 2 }
  // ];
  constructor(
    private router: Router,
    private portService: PortService,
    private pagerServcie: PagerService,
    private notificationService: NotificationService,
  ) { }

  aclist: any;
  itmPerPage: any;
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';

  ngOnInit() {
    this.onLoad();
    // this.binPortsData()
  }

  private onLoad() {
    // this.section = 'List';
    this.searchValue = this.searchValue != undefined ? this.searchValue : ''
    this.getCount(this.searchValue);
  }

  // private binPortsData() {
  //   this.portService.getPortList().subscribe(
  //     response => {
  //       this.portList = response.ports
  //     }, error => {
  //       alert('error : ' + error);
  //     });
  // }

  getCount(searchValue) {
    this.portService.getCount(this.searchValue).subscribe(
      response => {
        this.totalRows = response.port;
        this.getData();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.portService.getPortList(filtermodel).subscribe(
      response => {
        this.portList = response.ports
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
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
    // this.getData();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    this.pageNumber = 1
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

  onRowDoubleClick(id: number) {
    this.router.navigate(['/masters/ports/view/' + id]);
  }

  onAddClick() {
    this.router.navigateByUrl('/masters/ports/add');
  }

  editClicked(id: number) {
    this.router.navigate(['/masters/ports/edit/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/masters/ports/view/' + id]);
  }
}


