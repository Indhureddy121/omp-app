import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { NotificationService } from '@core/services/common/notification.service';
import { SharedService } from '@core/services/common/shared.service';
import { ProductmasterService } from '@core/services/masters/productmaster.service';
import { NgbModal, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

@Component({
  selector: 'add-rate-contracts-items-popup',
  templateUrl: './add-rate-contracts-items-popup.component.html',
  styleUrls: ['./add-rate-contracts-items-popup.component.css']
})
export class AddRateContractsItemsPopupComponent implements OnInit {

  // @Output() onItemSearchEvent = new EventEmitter<any>();
  @Input() ItemForm;
  articleNo: string = '';
  isItemReady: boolean = true;
  showpclength: boolean = false;
  @Input() submitted;
  files: any[] = [];
  isEdit: boolean = false;
  isView: boolean = false;
  // @Output() cancelClick=new EventEmitter<any>();
  productsearchValue: string = '';
  itemErrorMessage: string = '';
  @ViewChild('ProductSearchModel', { static: false }) ProductSearchModel: any;
  modalRef: any;
  itemforEdit: boolean = false;
  isProductSearchFirst: boolean = true;
  searchValue: string = '';
  pageNumber = 1;
  itemType: string;
  itemSearched: any;
  msq: any;
  qtydisable: boolean = false;
  lengthandfactorbtndisable: boolean = true;
  itemLengthList: any[] = [];
  @ViewChild(FormGroupDirective, { static: false }) itemFgForm;
  @ViewChild('itemSearch', { static: false }) itemSearch;
  @Output() itemSaveClick = new EventEmitter<any>();
  itemForView: boolean = false;
  // @ViewChild('itemSearch',{static:false}) itemSearch;
  @Input() rcStatus;
  @Input() contarctItemStd;
  @Input() rcType;
  @Input() RCValidity;
  @Input() LMEBased;
  @Input() ALPBased;
  offervalidfromDate: { year: number; month: number; day: number; };
  offervalidtoDate: { year: number; month: number; day: number; };
  offerValidMaxdate: any;
  offerValidMindate: any;
  dateformate: string = "";
  todayMinDate: { year: number; month: number; day: number; };

  constructor(
    private modalService: NgbModal,
    private productmasterService: ProductmasterService,
    private router: Router,
    public formatter: NgbDateParserFormatter,
    private sharedService: SharedService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private notificationService: NotificationService
  ) { }


  ngOnInit() {
    this.onSelectProductClearClick(false);
    const url = this.router.url;
    this.dateformate = this.authService.getDateFormat();
    this.itemforEdit = url.includes('edit') ? true : false;
    this.itemForView = url.includes('view') ? true : false;
    this.articleNo = this.itemForm.articleno.value;

    this.todayMinDate = this.sharedService.convertDate(this.itemForm.validfrom.value);
    this.offervalidfromDate = this.sharedService.convertDate(this.itemForm.validfrom.value);
    this.offervalidtoDate = this.sharedService.convertDate(this.itemForm.validto.value);
    this.offerValidMaxdate = this.sharedService.convertDate(this.RCValidity.validto);
    this.offerValidMindate = this.sharedService.convertDate(this.RCValidity.validfrom);
  }

  get itemForm() { return this.ItemForm.controls }

  onOffValidFromDateSelection(date) {
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateformate);
    this.offervalidfromDate = this.sharedService.convertDate(offerValidFromdate);
    this.itemForm.validfrom.setValue(offerValidFromdate);

    if (new Date(this.itemForm.validfrom.value.split('/').reverse().join('-')) > new Date(this.itemForm.validto.value.split('/').reverse().join('-'))) {
      this.offervalidtoDate = this.sharedService.convertDate(offerValidFromdate);
      this.itemForm.validto.setValue(offerValidFromdate);
    }
  }

  onOffValidToDateSelection(date) {
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateformate);
    this.offervalidtoDate = this.sharedService.convertDate(offerValidTodate);
    this.itemForm.validto.setValue(offerValidTodate);
  }

  onItemSearch(event, isInputEvent = false) {
    let isItemExist: string = null;
    this.isItemReady = false;
    this.itemErrorMessage = null;
    if (isInputEvent)
      event.searchValue = event.target.value;

    if (this.contarctItemStd.length > 0)
      isItemExist = this.contarctItemStd.find(x => x.articleno == event.searchValue && x.isdelete === 0);

    if (isItemExist) {
      this.notificationService.showError('Item already added in the list.');
      this.articleNo = null;
      this.ItemForm.reset();
      return;
    }

    if (event && event.searchValue)
      this.itemSearchData(event.searchValue);
  }

  itemSearchData(searchValue) {
    this.productmasterService.getItemSearched(searchValue).then(
      response => {
        if (response.item.length > 0) {
          this.itemType = null;
          this.itemSearched = response.item[0];
          this.articleNo = this.itemSearched.articleno;
          this.msq = this.itemSearched.msq ? this.itemSearched.msq : 1;
          this.itemForm.stdItemName.setValue(this.itemSearched.description);
          this.itemForm.articledesc.setValue(this.itemSearched.description);
          this.itemForm.uom.setValue(this.itemSearched.uom);

          this.productmasterService.searchproductalpforrc(this.articleNo, 'STD', 'INR').then(
            resp => {

              if (resp.data && resp.data.statusCode == 200) {
                this.itemType = resp.data.data.itemtype;
                this.isItemReady = true;

                this.itemForm.itemtype.setValue(resp.data.data.itemtype == 'STD' ? 'MFG' : resp.data.data.itemtype);

                if (this.rcType == 10) {
                  this.itemForm.quantity.setValue(1);
                  this.itemForm.discount.setValue(0);
                }
                this.itemForm.price.setValue(resp.data.data.price);

              } else if (resp.data && resp.data.statusCode == 400) {
                this.isItemReady = false;
                this.itemType = null;
                this.itemErrorMessage = resp.data.errormessage;
                this.itemForm.itemtype.setValue(resp.data.data.itemtype);
                this.itemForm.price.setValue(resp.data.data.price);
                this.itemForm.itemtotal.setValue(null);
              }

              this.submitted = false;

              if (this.itemSearched.uom.toUpperCase() == 'PC') {
                this.qtydisable = false;
                this.lengthandfactorbtndisable = true;
                this.showpclength = true;
                this.itemForm.stdItemPCLength.setValue(this.itemSearched.length.split('|')[0]);
              } else if (this.itemSearched.uom.toUpperCase() == 'M') {
                this.qtydisable = true;
                this.lengthandfactorbtndisable = false;
                this.showpclength = false;
                if (this.itemSearched.length) {
                  let length = this.itemSearched.length.split('|');
                  this.itemLengthList = length;
                  this.itemLengthList.push('Other');
                } else {
                  this.itemLengthList = [];
                }
              }

              this.itemForm.customerpartno.setValue(null);
              this.itemForm.itemtotal.setValue(null);
            }, error => {
              this.notificationService.showError(error.error.error.message);
            });


        } else {
          this.lengthandfactorbtndisable = true;
          this.notificationService.showError('Item not found.');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSearchProductClick(event) {
    // const inputValue=event.searchForm.controls['searchValue'].value;

    // if(inputValue==='' || inputValue===undefined || inputValue===null)
    //   return;

    this.modalRef = this.modalService.open(this.ProductSearchModel, { size: 'lg' });
  }

  onSearchProductByFormClick(event) {
    const inputValue = event.value;

    // if (inputValue === '' || inputValue === undefined || inputValue === null)
    // return;

    this.onItemSearch(inputValue);

    this.modalRef = this.modalService.open(this.ProductSearchModel, { size: 'lg' });
  }


  onSelectProductClick(selectarticleno: string) {
    var data = { searchValue: selectarticleno };
    this.modalRef.close();
    this.itemforEdit = true;
    this.itemForm.articleno.setValue(selectarticleno);
    // this.itemSearch.searchForm.controls['searchValue'].patchValue(selectarticleno);
    this.isProductSearchFirst = true;
    this.productsearchValue = '';
    this.searchValue = selectarticleno;
    this.pageNumber = 1;
    this.onItemSearch(data);
  }

  closeModal() {
    this.modalRef.close();
  }

  // onItemQtyChange() { }


  onItemUnitnetPriceChange() {
    this.itemForm.discount.setValue(((Number(this.itemForm.price.value) - Number(this.itemForm.unitprice.value)) * 100 / Number(this.itemForm.price.value)).toFixed(2));
  }

  close() {
    this.modalService.dismissAll();
  }

  onItemSaveClick() {

    this.submitted = true;

    // if (this.itemForm.invalid || !this.isItemReady) {
    //   return;
    // } else if (!this.articleNo) {
    //   this.notificationService.showError('Please add Item.');
    //   return;
    // } else if (Number(this.itemForm.quantity.value) <= 0) {
    //   this.notificationService.showError('Please enter valid quantity.');
    //   return;
    // }

    if (this.ItemForm.invalid)
      return;

    this.itemSaveClick.emit();
  }

  onSelectProductClearClick(isClear: boolean) {
    this.itemforEdit = false;
    this.showpclength = false;
    if (this.itemFgForm !== undefined) {
      this.itemFgForm.resetForm();
    }
    this.isItemReady = true;
    this.itemErrorMessage = null;
    this.submitted = false;
    this.articleNo = null;

    if (isClear) {
      this.itemForm.validfrom.setValue(this.RCValidity.validfrom);
      this.itemForm.validto.setValue(this.RCValidity.validto);
    }
  }

  isEditSection(section: string) {
    return this.rcStatus < 20 || this.router.url.includes('add') ? true : false;
  }

  discountchange() {
    let _tempUnitNetPrice = (Number(this.itemForm.price.value) - ((Number(this.itemForm.price.value) * Number(this.itemForm.discount.value) / 100))).toFixed(2);
    this.itemForm.unitprice.setValue(_tempUnitNetPrice);
  }
}
