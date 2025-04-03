import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReportsService } from '@core/services/reports/reports.service';
import { NotificationService } from '@core/services/common/notification.service';
import { ProductmasterService } from '@core/services/masters/productmaster.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '@shared/directives';


@Component({
  selector: 'app-article-price',
  templateUrl: './article-price.component.html',
  styleUrls: ['./article-price.component.css']
})
export class ArticlePriceComponent implements OnInit {

  FilterForm: FormGroup;
  searchModel = Object();
  searchValue: string = '';
  offerdata: any = {};
  articleno: any = ""
  description: string = ''
  uom: any;
  offerlength: any;
  mdq: any;
  mfg_moq: any;
  mfg_price: any

  trd_moq: any;
  trd_price: any

  showMfgTab: boolean;
  showTrdTab: boolean;
  mfg_errorMessage: string;
  trd_errorMessage: string;
  noOfferdata: string = '';
  formSubmitted: boolean = false;
  submitClickedFlag:boolean= false;
  productmasterlist: any[] = [];
  totalRows: number;
  productsearchValue: string = '';
  pageSize = 10;
  sortDirection = 'DESC';
  pageNumber:any=1;
  pager: any = {};
  modalRef: any;
  isProductSearchFirst: boolean = true;
  sortField = '';
  
  @ViewChild('ProductSearchModel', { static: false }) ProductSearchModel: any;
  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private notificationService: NotificationService,
    private productmasterService: ProductmasterService,
    private pagerServcie: PagerService,
  ) {
    this.FilterForm = this.formBuilder.group({
      search: ['']
    });
  }

  ngOnInit() {
    this.getData()
  }

  submitSearch() {
    this.formSubmitted = true;
    if (this.FilterForm.value.search == "") {
      this.notificationService.showError("Enter Article No");
      this.formSubmitted = false;
    }
    this.submitClickedFlag = true;
    this.getData()
  }

  getData() {
    this.offerdata = {};
    this.articleno = '';
    this.description = '';
    this.uom = '';
    this.offerlength = '';
    this.mdq = '';
    this.mfg_moq = '';
    this.mfg_price = '';
    this.trd_moq = '';
    this.trd_price = '';
    this.showMfgTab = false;
    this.showTrdTab = false;
    this.mfg_errorMessage = '';
    this.trd_errorMessage = '';
    this.noOfferdata = '';
    const searchValue = this.FilterForm.value.search.trim();
    let filter = {
      search: this.FilterForm.value.search ? searchValue : ''
    };
    this.reportsService.articlePrice(filter).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.offerdata = response.responsedata.data.offer[0];
          if (this.offerdata) {
            this.articleno = this.offerdata.articleno || '';
            this.description = this.offerdata.description || '';
            this.uom = this.offerdata.uom || '';
            this.offerlength = this.offerdata.length || '';
            this.mdq = this.offerdata.mdq || '';

            const mfgcost = response.responsedata.data.mfgcost;
            const trdcost = response.responsedata.data.trdcost;
            this.mfg_moq = mfgcost.moq;
            this.mfg_price = mfgcost.price;
            this.trd_moq = trdcost.moq;
            this.trd_price = trdcost.price;
            this.showMfgTab = mfgcost.errormessage === '';
            if (!this.showMfgTab) {
              this.mfg_errorMessage = mfgcost.errormessage;
            }

            this.showTrdTab = trdcost.errormessage === '';
            if (!this.showTrdTab) {
              this.trd_errorMessage = trdcost.errormessage;
            }
          } else if (this.formSubmitted) {
            this.noOfferdata = "The article no does not exists..!";
          }

        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
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
                if (this.isProductSearchFirst) {
                  this.modalRef = this.modalService.open(this.ProductSearchModel, { size: 'lg' });
                }
              }, error => {
                this.notificationService.showError(error.error.error.message);
              });
          } else {
            this.notificationService.showError('There is no product avaiable.');
            this.productmasterlist = [];
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
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

  onSelectProductClick(selectarticleno: string) {
    this.modalRef.close();
    this.FilterForm.setValue({
      search: selectarticleno
    });
    
    this.isProductSearchFirst = true;
    this.productsearchValue = '';
    this.searchValue = selectarticleno;
    this.pageNumber = 1;
    // this.onItemSearch(data);
  }
  headerClick(event:any){
    this.sortField = event.target.id;
  }
}
