import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerts-list',
  templateUrl: './alerts-list.component.html',
  styleUrls: ['./alerts-list.component.css']
})
export class AlertsListComponent implements OnInit {
  ordersList: any = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = '';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';  
  countmodel: {};
  constructor() { }

  ngOnInit() {
  }
  setPage(page: number) {
    this.pageNumber = page;
    //this.getData();
  }
  headerClick(event:any){
    this.sortField = event.target.id;
    // if (this.sortDirection && this.sortDirection === 'DESC')
    //   this.sortDirection = 'ASC';
    // else if (this.sortDirection && this.sortDirection === 'ASC')
    //   this.sortDirection = 'DESC';
    // else
    //   this.sortDirection = 'DESC';
    //   var table = document.getElementById('table-approval-matrix');
    //   var targetTHs = table.querySelectorAll('tr > th');
    //   for (var i = 0; i < targetTHs.length; i++) {
    //     var th = targetTHs[i];
    //     th.className = "";
    //   }
    //   document.getElementById(event.target.id).className = this.sortDirection;
    // this.pageNumber = 1;  
    // this.getData();
  }
  onSearch(response) {
    this.searchValue = '';
    // if (response && response.searchValue) {
    //   this.searchValue = response.searchValue;
    // }
    // this.getData();
  }
}
