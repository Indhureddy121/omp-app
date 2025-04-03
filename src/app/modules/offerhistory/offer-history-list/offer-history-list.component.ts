import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from '@shared/directives';
import { AuthService } from '@core/services/auth/auth.service';
import { OffersService } from '@core/services/offers/offers.service';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-offer-history-list',
  templateUrl: './offer-history-list.component.html',
  styleUrls: ['./offer-history-list.component.css']
})
export class OfferHistoryListComponent implements OnInit {

  offerslist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateFormate: string;
  offerStatus: any[] = []
  closeResult: string;
  userid: any;

  constructor(
    private router: Router,
    private pagerService: PagerService,
    private authService: AuthService,
    private offersService: OffersService,
    private modalService: NgbModal,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.userid = this.authService.getUserId()
    this.getCount();

  }

  getOfferWithStatus(offerId) {

    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField,offer_id:offerId }
    this.offersService.getOfferWithStatus(filtermodel).subscribe(
      response => {
        // this.totalRows = response.offers.length > 0 ? response.offers[0].count : 0;
        this.offerStatus = response.offers;


      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  open(orderStatus,offerId) {
    this.getOfferWithStatus(offerId)
    this.modalService.open(orderStatus, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {


      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  public getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  getCount() {
    this.offersService.getOfferHistoryCount().subscribe(
      response => {
        if (response) {
          this.totalRows = response.historyCount[0].count;
          this.getData();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField,userid:this.userid }
    this.offersService.getOfferHistoryList(filtermodel).subscribe(
      response => {
        // this.totalRows = response.offers.length > 0 ? response.offers[0].count : 0;
        this.offerslist = response.offers;
        // this.offerslist.forEach(element => {
        //   if (element.status == 0)
        //     element.status = 'Pending';
        //   else if (element.status == 1)
        //     element.status = 'Sent for approval';
        //   else if (element.status == 2)
        //     element.status = 'Approved';
        //   else if (element.status == 3)
        //     element.status = 'Rejected';
        // });
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
    this.getData();
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
    this.router.navigate(['/offers/offerWithHistory/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/offers/offerWithHistory/' + id]);
  }

  editClicked(id: number) {
    this.router.navigate(['/offers/edit/' + id]);
  }
}
