import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NotificationService } from '@core/services/common/notification.service';
import { ProductmasterService } from '@core/services/masters/productmaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '@shared/directives';

@Component({
  selector: 'app-product-master-popup',
  templateUrl: './product-master-popup.component.html',
  styleUrls: ['./product-master-popup.component.css']
})
export class ProductMasterPopupComponent implements OnInit {
  productmasterlist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchModel = Object();
  productsearchValue: string = '';
  isProductSearchFirst: boolean = true;
  @Output() selectProductClick: EventEmitter<string> = new EventEmitter();
  @Output() closePopup = new EventEmitter<any>();
  isProductsLoaded: boolean = false;

  constructor(
    private productmasterService: ProductmasterService,
    private pagerServcie: PagerService,
    private notificationService: NotificationService,
    private modalService: NgbModal
  ) { }

  ngOnInit() {
    this.onSearchProductClick();
  }

  onSearchProductClick() {
    this.productmasterService.getProductCountforOffer(this.productsearchValue).subscribe(
      response => {
        if (response && response.productmastercount) {
          this.totalRows = response.productmastercount[0].count;

          if (this.totalRows > 0) {
            let skipdata = this.pageSize * (this.pageNumber - 1);
            let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.productsearchValue, sortField: this.sortField }

            this.productmasterService.getProductListforOffer(filtermodel).subscribe(
              response => {
                this.productmasterlist = response.productmaster;
                this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
                this.isProductsLoaded = true;
              }, error => {
                this.notificationService.showError(error.error.error.message);
              });
          } else {
            this.notificationService.showError('There is no product avaiable.');
            this.productmasterlist = [];
            this.isProductsLoaded = true;
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
        this.isProductsLoaded = true;
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.isProductSearchFirst = false;
    this.onSearchProductClick();
  }

  onSearch(response) {
    this.productsearchValue = '';
    if (response && response.searchValue) {
      this.productsearchValue = response.searchValue;
    }
    this.pageNumber = 1;
    this.isProductSearchFirst = false;
    this.onSearchProductClick();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-productmaster');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.isProductSearchFirst = false;
    this.onSearchProductClick();
  }

  onSelectProductClick(selectarticleno: string) {
    this.selectProductClick.emit(selectarticleno);
  }
  close() {
    this.closePopup.emit();
  }


}
