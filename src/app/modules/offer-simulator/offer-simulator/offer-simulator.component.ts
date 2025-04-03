import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbAccordion, NgbPanel, NgbDateStruct, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth/auth.service';
import { OffersService } from 'src/app/core/services/offers/offers.service';
import { OpportunitiesService } from 'src/app/core/services/opportunities/opportunities.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { FilesService } from 'src/app/core/services/common/files.service';
import * as FileSaver from 'file-saver';
import { ProductmasterService } from 'src/app/core/services/masters/productmaster.service';
import * as XLSX from 'xlsx';
import { Config } from 'src/app/core/configs/config';
import { environment } from 'src/environments/environment';
import { SampleEnum } from '@core/enums/sample.enum';
import { PagerService } from '@shared/directives';
import { OfferStatusEnum } from '@core/enums/offerstatus.enum';
import { CustomerService } from '@core/services/masters/customer.service';
import { StockorderService } from '@core/services/stockorder/stockorder.service';
import { OffersimulatorService } from '@core/services/offersimulator/offersimulator.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-offer-simulator',
  templateUrl: './offer-simulator.component.html',
  styleUrls: ['./offer-simulator.component.css']
})
export class OfferSimulatorComponent implements OnInit {

  OfferInformationForm: FormGroup;
  AccountContactDetail: FormGroup;
  TermsandConditionForm: FormGroup;
  SpecialTextForm: FormGroup;
  ItemsForm: FormGroup;
  StdItemForm: FormGroup;
  RejForm: FormGroup;
  confrmForm: FormGroup;
  LengthandFactorForm: FormGroup;
  ImportItemsForm: FormGroup;

  type: string;
  requireApprovalList: any[] = [];
  searchValue: string = '';
  insertId: any;
  isPendingApproval: boolean = false;
  fileType: any;
  oppoData: any;
  isApproved: boolean = false;
  offerApprovalStatus: any;
  ispprovalStatus: boolean = false;
  sap_id: any;
  isOfferWithView: boolean = false;
  fileData: any;
  costtooltipdata: any;
  margintooltipdata: any;
  lme: number;
  cost: number;
  netalp: number;
  marginper: string;
  costperunit: number;
  finalNetALP: number = 0;
  finalcost: number = 0;
  finalMarginAmount: number = 0;
  finalMarginPer: string = '';
  msq: any;
  uom: any;
  itemSequenceId: number = 0;
  otherrmcostpacking: any;
  overheads: any;
  closeResult: string;
  isAdd: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;

  submitted: boolean = false;
  stditemsubmitted: boolean = false;
  dateformate: string; // = 'yyyy-MM-dd'
  billingstateCode: string;
  shippingstateCode: string;
  stdItemSubTotal: number;
  stdItemTotal: number = 0;
  stdItemsData: any[] = [];
  stdItem: boolean = false;
  sprItem: boolean = false;
  items: FormArray;
  spritems: FormArray;
  summaryTotalAmount: number = 0;
  summaryNetAmount: number = 0;
  userid: number;
  username: string;
  stdItemACValue: number = 0;
  stdItemDiscountValue: number = 0;
  stdItemAC: any[] = [];
  stdItemSearched: any;
  currentRate: any;
  del_baseprice: any;
  lme_baseprice: any;
  surcharge: any;
  copperindex: any;
  currencycode: string;
  files: any[] = [];
  pofiles: any[] = [];
  stdItemEdit: boolean = false;
  sprItemEdit: boolean = false;
  isShowFromToLocation: boolean = false;
  fromlocationList: any[] = [];
  tolocationList: any[] = [];
  // offerValidMaxdate: any;
  // offerValidMindate: any;
  offerID: number = 0;
  offerNo: string = '';
  // todayMinDate: { year: number; month: number; day: number };
  // offervalidfromDate: { year: number; month: number; day: number };
  // offervalidtoDate: { year: number; month: number; day: number };
  // poDate: { year: number; month: number; day: number };
  // afpoDate: { year: number; month: number; day: number };
  // reqdeliveryDate: { year: number; month: number; day: number };
  // pricingDate: { year: number; month: number; day: number };
  // firstDate: { year: number; month: number; day: number };
  offerItemStd: any[] = [];
  offerItemSPR: any[] = [];
  articleNo: string = '';
  todayDate: any;
  futureDate: any;
  approvaldata: any;
  otherDataId: number;
  salesId: number;
  itemforEdit: boolean = false;
  offerStatus: any[] = [];
  currencyTypeList: any[] = [
    { code: 'INR', description: 'INR' },
    { code: 'USD', description: 'USD' },
    { code: 'EUR', description: 'EURO' }];
  offerTypeList: any[] = [
    { code: 1, description: 'Direct' },
    { code: 2, description: 'Indirect' }];
  itemLengthList: any[] = [];
  itemFactorList: any[] = [];
  LengthandFactordata: any[] = [];
  LengthandFactordataDelete: any[] = [];
  SPRLengthandFactordata: any[] = [];
  SPRLengthandFactordataDelete: any[] = [];
  DeletedSPRLengthandFactordata: any[] = [];
  modalRef: any;
  itemType: string;
  isItemExpire: boolean = false;
  specialtextdata: any[] = [];
  specialtextid: number = null;
  lengthandfactorbtndisable: boolean = true;
  totalnetvalue: number = 0;
  specialtextindex: number;
  itemindex: number;
  seqid: number;
  itemid: number;
  lengthandfactorid: number;
  isOfferInderect: boolean = false;
  offerdata: any = {};
  SPRFiles: any[] = [];
  DeletedSPRFiles: any[] = [];
  DataSheetFiles: any[] = [];
  SPRItemSequenceId: number = 0;
  offerInformation: number = 0;
  approvedandrejectedby: number = 0;

  termsandcondition: number = 0;

  // poId: number;
  // isInitiateSOChecked: boolean = false;
  // contactdetail: any[] = [];
  // searchedcontactdetail: any[] = [];
  // selectedcontact: number = 0;
  // spritemid: number;
  // SPRItemArticleNo: string;
  // oppoid: string;
  // lappoppoid: string;
  // spritemindex: number;
  // SPRStatus: number;
  // SPRShowStatus: string;
  // SPRActionRequired: string;
  deletedItem: boolean = false;
  deletedSPRItem: boolean = false;
  offerDeletedItem: any[] = [];
  // offerDeletedSPRItem: any[] = [];
  ImportItemFiles: any;
  // ImportSPRItemFiles: any;
  worksheet: XLSX.WorkSheet;
  importitemjsonData: any[] = [];
  importspritemjsonData: any[] = [];
  ImportItemsfileUploaded: any;
  // ImportSPRItemsfileUploaded: any;
  storeData: any;
  importItemStatus: any[] = [];
  @ViewChild('specialtermsdeletemodel', { static: false }) specialtermsdeletemodel: any;
  @ViewChild('stditemdeletemodel', { static: false }) stditemdeletemodel: any;
  @ViewChild('ProductSearchModel', { static: false }) ProductSearchModel: any;
  @ViewChild('itemdeleteallmodel', { static: false }) itemdeleteallmodel: any;
  deleteConfirModel = Object();
  filesperitem: number;
  filesize: number;
  converttoYMD: string = 'yyyy-MM-dd';
  isItemReady: boolean = true;
  itemErrorMessage: string = '';
  offerdirectpdf: string = 'Offer PDF - Customer';
  offerindirectpdf: string = 'Offer PDF - Dealer';
  importitemheaderList: string[];
  importspritemheaderList: string[];
  sprItemDescription: string;
  ItemCatalogue: string;
  ASMapproveComment: string;
  PaymentTermsValue: string;
  DeliveryLeadTimeValue: string;
  SpecialTermTitle: string;
  SpecialTermDescription: string;
  specialtextdeletedata: any[] = [];
  offerItemSPRdeletedata: any[] = [];
  offerItemStddeletedata: any[] = [];
  verticalList: any[] = [];
  segmentList: any[] = [];
  isCreateSOChecked: boolean = false;
  isSOError: boolean = false;
  soerror: string = '';
  additionalFieldData: any;
  managepodata: any;
  sonumber: string = '';
  qtydisable: boolean = false;
  isShowOtherLength: boolean = false;
  OfferFiles: any[] = [];
  ApproveReason: string;

  //product search modal
  productmasterlist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchModel = Object();
  productsearchValue: string = '';
  searchproductcount: any;
  isProductSearchFirst: boolean = true;
  // isShowFromToLocation: boolean = false;
  // fromlocationList: any[] = [];
  // tolocationList: any[] = [];
  isShowItemMargin: boolean = false;
  isShowItemRMCGrossMargin: boolean = false;
  isShowOverallMargin: boolean = false;
  isShowOverallRGroupMargin: boolean = false;
  shiptopartyList: any[] = [];
  itemAdditionalFieldsList: any[] = [];
  itemAdditionalFieldsId: any;
  itemAdditionalFieldsIndex: any;
  itemAdditionalFieldsSeqId: any;
  itemAdditionalFieldsOfferid: any;
  itemAdditionalFieldsitemid: any;
  freightcharge: any;
  stdcuttingchargesvalue: any;
  stdcuttingchargesfinal: any;
  stdcuttingcurrency: any;
  trdcuttingchargesvalue: any;
  trdcuttingchargesfinal: any;
  trdcuttingcurrency: any;
  itemlevelcuttingcharges: any;
  offerlevelcuttingcharges: any;
  soldtopartySearchList: any[] = [];
  shiptopartySearchList: any[] = [];
  isOtherLengthExtra: boolean = false;
  DealerCommisionPer: number = 0;
  userrolecode: string;
  EURrate: number = 0;
  USDrate: number = 0;
  itemGrossMargin: any;
  itemTGrossMargin: any;
  itemRGrossMargin: any;
  DataSheets: any[] = [];
  AssignToList: any[] = [];
  OfferFreightCharges: number = 0;
  isExpiredItemsinOffer: boolean = false;
  _oldItemData: any;
  _oldSPRItemData: any;
  isFMApprovalReq: boolean = false;
  CPOComment: string = '';
  DealersList: any[] = [];
  importitemsstockdata: any;
  incotermsList: any[] = [
    { code: "AIR", description: 'By Air' },
    { code: "CFR", description: 'CFR- Costs & freight' },
    { code: "CIF", description: 'CIF- Costs, insurance & freight' },
    { code: "DD", description: 'Door delivery' },
    { code: "EXW", description: 'EXW - Ex works' },
    { code: "FOB", description: 'FOB - Free on board' },
    { code: "SEA", description: 'SEA - By Sea' }];

  createItem(): FormGroup {
    return this.formBuilder.group({
      stditemCode: '',
      stdItemName: '',
      stdItemUOM: '',
      stdItemMOQ: '',
      ItemMOQ: '',
      stdItemPrice: '',
      lengthandfactor: '',
      stdItemQty: '',
      itemunitnetprice: '',
      enquiredquantity: '',
      stdItemCatalog: '',
      seqno: ''
    });
  }

  @ViewChild('acc', { static: true }) acc: NgbAccordion;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private offersService: OffersService,
    private offersimulatorService: OffersimulatorService,
    private opportunitiesService: OpportunitiesService,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
    private productmasterService: ProductmasterService,
    private pagerServcie: PagerService,
    private customerService: CustomerService,
    private stockorderService: StockorderService,
    private notificationService: NotificationService
  ) { }

  get offerInformationForm() { return this.OfferInformationForm.controls }
  get accountContactDetail() { return this.AccountContactDetail.controls }
  get itemsForm() { return this.ItemsForm.controls }
  get stdItemForm() { return this.StdItemForm.controls }
  get specialTextForm() { return this.SpecialTextForm.controls }
  get lengthandFactorForm() { return this.LengthandFactorForm.controls }
  get termsandConditionForm() { return this.TermsandConditionForm.controls }
  get importItemsForm() { return this.ImportItemsForm.controls }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.offerID = parms['id'];
    });

    this.onLoad();
  }

  private onLoad() {
    this.dateformate = this.authService.getDateFormat();
    // this.datetimeFormate = 'dd/MM/yyyy hh:mm:ss';
    this.userid = this.authService.getUserId();
    this.username = this.authService.getUserName();
    this.userrolecode = this.authService.getUserRoleCode();
    this.offerdata.TotalGrossMargin = 0;
    this.offerdata.TotalRMCGrossMargin = 0;
    this.offerdata.TotalTargetGrossMargin = 0;

    this.todayDate = moment().format('DD/MM/YYYY');
    this.futureDate = moment().add(this.authService.OfferValidupto(), 'd').format('DD/MM/YYYY');

    this.filesperitem = Config.getItemsFile.NumberofFiles + 1;
    this.filesize = Config.getItemsFile.filesize;
    this.onbuildForm();
    this.loadPageMode();
    this.disableFields();



    this.currencycode = this.offerInformationForm.currencyType.value;
  }

  private onbuildForm() {
    this.OfferInformationForm = this.formBuilder.group({
      customer: ['', [Validators.required]],
      currencyType: ['INR', [Validators.required]],
      offerType: [1, [Validators.required]],
      delearcommission: [''],
      soldtopartyType: [''],
      shiptopartyType: [''],
      incoterms: ['DD', [Validators.required]],
      fromlocation: [[]],
      tolocation: [[]],
      headerleveldiscount: [''],
      dealers: [null]
    });

    this.AccountContactDetail = this.formBuilder.group({
      contactsearch: [null]
    });

    this.TermsandConditionForm = this.formBuilder.group({
      paymentterms: [''],
      deliveryleadtime: ['']
    });

    this.SpecialTextForm = this.formBuilder.group({
      addspecialtexttitle: ['', [Validators.required]],
      addspecialtextdescription: ['', [Validators.required]]
    });

    this.LengthandFactorForm = this.formBuilder.group({
      itemLength: [[], [Validators.required]],
      otherLength: [null],
      itemFactor: ['', [Validators.required]],
      lfqty: ['']
    });

    this.ItemsForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()]),
      freightcharges: ['']
    });

    this.StdItemForm = this.formBuilder.group({
      searchValue: [''],
      stditemCode: [''],
      stdItemName: [''],
      stdItemUOM: [''],
      enquiredquantity: ['', [Validators.required]],
      stdItemMOQ: [''],
      ItemMOQ: [''],
      stdItemPrice: [''],
      stdItemCatalog: [''],
      stdItemQty: [''],
      itemunitnetprice: ['', [Validators.required]],
      itemDiscount: [''],
      customerpartno: [''],
      itemtotal: [''],
      seqno: ['']
    });
  }

  private loadPageMode() {
    let currentUrl = this.router.url;
    if (currentUrl.includes('add') && !currentUrl.includes('refrenceoffer')) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;

      let id: string = '';
      this.activatedRoute.params.subscribe(parms => {
        id = parms['id'];
      });

      this.offerID = 0;
      this.getcuttingcharges();
    } else if (currentUrl.includes('edit')) {
      this.isAdd = false;
      this.isEdit = true;
      this.isView = false;
      this.getcuttingcharges();
      this.getOffersDetail(this.offerID);
    } else if (currentUrl.includes('view')) {
      this.isAdd = false;
      this.isEdit = false;
      this.isView = true;
      this.getcuttingcharges();
      this.getOffersDetail(this.offerID);
    }
  }

  private disableFields() {
    if (this.isView) {
      this.offerInformationForm.currencyType.disable();
      this.offerInformationForm.offerType.disable();
      this.offerInformationForm.incoterms.disable();
      this.offerInformationForm.fromlocation.disable();
      this.offerInformationForm.tolocation.disable();
    }
  }

  getOffersDetail(id: number) {
    this.offersimulatorService.getOffersDetail(id).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.offerdetail.offerdata[0]) {
            this.offerdata = response.responsedata.data.offerdetail.offerdata[0];
            this.offerNo = this.offerdata.offerno;

            this.offerInformationForm.customer.setValue(this.offerdata.customername);
            this.offerInformationForm.currencyType.setValue(this.offerdata.currency);
            this.currencycode = this.offerdata.currency;
            this.offerInformationForm.offerType.setValue(this.offerdata.offertype);

            this.OfferFreightCharges = Number(this.offerdata.freightcharges);
            if (this.currencycode == 'USD') {
              this.itemsForm.freightcharges.setValue(Number((Number(this.offerdata.freightcharges) / Number(this.USDrate)).toFixed(2)));
            } else if (this.currencycode == 'EUR') {
              this.itemsForm.freightcharges.setValue(Number((Number(this.offerdata.freightcharges) / Number(this.EURrate)).toFixed(2)));
            } else if (this.currencycode == 'INR') {
              this.itemsForm.freightcharges.setValue(Number(this.offerdata.freightcharges));
            }

            if (this.offerdata.offertype == 2) {
              this.isOfferInderect = true;
              this.offerInformationForm.delearcommission.setValue((this.offerdata.dealercommissionper * 100).toFixed(2));
              this.DealerCommisionPer = Number(this.offerInformationForm.delearcommission.value);
            } else {
              this.DealerCommisionPer = 0;
            }
            this.offerInformationForm.headerleveldiscount.setValue(this.offerdata.headerleveldiscount);



            if (response.responsedata.data.offerdetail.getItems.length > 0) {
              this.stdItem = true;
              this.offerItemStd = response.responsedata.data.offerdetail.getItems;
              let i = 0;
              this.offerItemStd.forEach(element => {
                i += 1;
                element.itemSeqId = i;
                element.documents = [];
                element.lengthandfactor.forEach(element2 => {
                  element2.isDelete = 0;
                });

                if (element.length)
                  element.length += '|Other';
                else
                  element.length = 'Other';

                if (element.itemType.toUpperCase() == 'SPR')
                  element.approveddatasheets = [];
              });
              this.updateTotalValues();
            }

            this.isShowOverallRGroupMargin = response.responsedata.data.uiinfo.ShowTotalRMCGrossMargin;
            this.isShowOverallMargin = response.responsedata.data.uiinfo.ShowTotalGrossMargin;

            this.isShowItemMargin = response.responsedata.data.uiinfo.ShowItemMargin;
            this.isShowItemRMCGrossMargin = response.responsedata.data.uiinfo.ShowItemRMCGrossMargin;

            this.isExpiredItemsinOffer = this.offerItemStd.filter(x => x.isexpire == 1).length > 0 ? true : false;

            if (response.responsedata.data.offerdetail.getDeletedItems.length > 0) {
              this.deletedItem = true;
              this.offerDeletedItem = response.responsedata.data.offerdetail.getDeletedItems;
              this.offerDeletedItem.forEach(element => {
                element.documents = [];
              });
            }

            this.setStatus(this.offerdata.Status);

            // this.managePageSection(this.offerdata.Status, this.offerdata.IsActive);

            if (this.offerInformation == 1) {
              this.offerInformationForm.currencyType.disable();
              this.offerInformationForm.offerType.disable();

              this.offerInformationForm.incoterms.disable();
              this.offerInformationForm.fromlocation.disable();
              this.offerInformationForm.tolocation.disable();

            }


            // if (response.responsedata && response.responsedata.statusCode == 200) {
            //   this.termsandConditionForm.paymentterms.setValue(response.responsedata.data.paymentterms[0].paymentterm);
            //   this.PaymentTermsValue = response.responsedata.data.paymentterms[0].paymentterm;
            //   this.termsandConditionForm.deliveryleadtime.setValue(response.responsedata.data.paymentterms[0].deliveryleadtime);
            //   this.DeliveryLeadTimeValue = response.responsedata.data.paymentterms[0].deliveryleadtime;
            //   let i = 0;
            //   response.responsedata.data.specialterms.forEach(element => {
            //     i += 1;
            //     element.isDelete = 0;
            //     element.seqid = i;
            //   });
            //   this.specialtextdata = response.responsedata.data.specialterms;
            // }

          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  // managePageSection(status: number, active: number) {
  //   this.offerInformation = 0;
  //   this.approvedandrejectedby = 0;
  //   this.termsandcondition = 0;

  //   if (active == 1) {
  //     if (status < 20) {
  //       this.offerInformation = 2;
  //       this.termsandcondition = 2;
  //     } else if (status >= 20) {
  //       this.offerInformation = 1;
  //       this.termsandcondition = 1;
  //       this.approvedandrejectedby = 1;
  //     }
  //   } else {
  //     if (status < 20) {
  //       this.offerInformation = 1;
  //       this.termsandcondition = 1;
  //     } else if (status >= 20) {
  //       this.offerInformation = 1;
  //       this.termsandcondition = 1;
  //       this.approvedandrejectedby = 1;
  //     }
  //   }
  // }

  // isShowSection(section: string) {
  //   let isShow: boolean = false;

  //   if (section == 'offerInformation')
  //     isShow = this.offerInformation >= 1 ? true : false;

  //   else if (section == 'approvedandrejectedby')
  //     isShow = this.approvedandrejectedby >= 1 ? true : false;

  //   else if (section == 'termsandcondition')
  //     isShow = this.termsandcondition >= 1 ? true : false;

  //   return isShow;
  // }

  // isEditSection(section: string) {
  //   let isEdit: boolean = false;

  //   if (section == 'offerInformation')
  //     isEdit = this.offerInformation == 2 ? true : false;

  //   else if (section == 'approvedandrejectedby')
  //     isEdit = this.approvedandrejectedby == 2 ? true : false;

  //   else if (section == 'termsandcondition')
  //     isEdit = this.termsandcondition == 2 ? true : false;

  //   return isEdit;
  // }

  setStatus(status: number) {
    if (status == 10)
      this.offerApprovalStatus = OfferStatusEnum.ten;
    else if (status == 20)
      this.offerApprovalStatus = OfferStatusEnum.twenty;
    else if (status == 30)
      this.offerApprovalStatus = OfferStatusEnum.thirty;
    else if (status == 40)
      this.offerApprovalStatus = OfferStatusEnum.fourty;
    else if (status == 50)
      this.offerApprovalStatus = OfferStatusEnum.fifty;
  }

  offertypechange(event) {
    if (event) {
      if (event.code == 2) {
        this.isOfferInderect = true;
        this.offerInformationForm.delearcommission.setValidators(Validators.required);
      } else {
        this.isOfferInderect = false;
        this.DealerCommisionPer = 0;
        this.offerInformationForm.offerType.setValue(1);
        this.offerInformationForm.delearcommission.clearValidators();
      }
    } else {
      this.isOfferInderect = false;
      this.DealerCommisionPer = 0;
      this.offerInformationForm.offerType.setValue(1);
      this.offerInformationForm.delearcommission.clearValidators();
    }
    this.offerInformationForm.delearcommission.updateValueAndValidity();
    this.updateTotalValues();
  }



  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate = { year: year, month: month, day: day };
    return newdate;
  }





  onItemSearch(event) {
    let isItemExist: string = null;
    this.isItemReady = false;
    this.itemErrorMessage = null;
    if (this.offerItemStd.length > 0) {
      isItemExist = this.offerItemStd.find(x => x.articleNo == event.searchValue && x.isDelete != 1);
    }

    if (isItemExist) {
      this.notificationService.showError('Item already added in the list.');
      this.articleNo = null;
      this.itemType = null;
      this.stdItemSearched = null;
      this.msq = null;
      this.stdItemForm.stdItemName.setValue(null);
      this.stdItemForm.stdItemUOM.setValue(null);
      this.stdItemForm.stdItemMOQ.setValue(null);
      this.stdItemForm.ItemMOQ.setValue(null);
      this.itemLengthList = [];
      this.stdItemForm.enquiredquantity.setValue(null);
      this.stdItemForm.stdItemQty.setValue(null);
      this.stdItemForm.stdItemPrice.setValue(null);
      this.stdItemForm.itemunitnetprice.setValue(null);
      this.stdItemForm.seqno.setValue(null);

      if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
        this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
      else
        this.stdItemForm.itemDiscount.setValue(null);

      this.stdItemForm.customerpartno.setValue(null);
      this.stdItemForm.itemtotal.setValue(null);
      this.LengthandFactordata = [];
      return;
    } else {
      if (event && event.searchValue) {
        this.productmasterService.getItemSearched(event.searchValue).then(
          response => {
            if (response.item.length > 0) {
              this.itemType = null;
              this.stdItemSearched = response.item[0];
              this.articleNo = this.stdItemSearched.articleno;
              this.msq = this.stdItemSearched.msq ? this.stdItemSearched.msq : 1;
              this.stdItemForm.stdItemName.setValue(this.stdItemSearched.description);
              this.stdItemForm.stdItemUOM.setValue(this.stdItemSearched.uom);
              this.stdItemForm.stdItemMOQ.setValue(this.msq);

              if (this.stdItemSearched.uom.toUpperCase() == 'PC') {
                this.qtydisable = false;
                this.lengthandfactorbtndisable = true;
              } else if (this.stdItemSearched.uom.toUpperCase() == 'M') {
                this.qtydisable = true;
                this.lengthandfactorbtndisable = false;
                if (this.stdItemSearched.length) {
                  let length = this.stdItemSearched.length.split('|');
                  this.itemLengthList = length;
                  this.itemLengthList.push('Other');
                } else {
                  this.itemLengthList = [];
                }
              }

              this.stdItemForm.enquiredquantity.setValue(null);
              this.stdItemForm.stdItemQty.setValue(null);
              this.stdItemForm.stdItemPrice.setValue(null);
              this.stdItemForm.itemunitnetprice.setValue(null);
              this.stdItemForm.seqno.setValue(null);

              if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
                this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
              else
                this.stdItemForm.itemDiscount.setValue(null);

              this.stdItemForm.customerpartno.setValue(null);
              this.stdItemForm.itemtotal.setValue(null);
              this.LengthandFactordata = [];
            } else {
              this.lengthandfactorbtndisable = true;
              this.notificationService.showError('Item not found.');
            }
          }, error => {
            this.notificationService.showError(error.error.error.message);
          });
      }
    }
  }

  getSeqID(itemArray: any) {
    let max = 0;
    for (let i = 0; i < itemArray.length; i++) {
      if (itemArray[i].itemSeqId > max) {
        max = itemArray[i].itemSeqId;
      }
    }
    return max + 1;
  }

  getSeqNo() {
    let _Arr = this.offerItemStd.filter(x => x.isDelete == 0).concat(this.offerItemSPR.filter(y => y.isDelete == 0)).concat(this.offerDeletedItem).concat(this.offerItemSPRdeletedata);
    let maxseq = 0;
    for (let i = 0; i < _Arr.length; i++) {
      if (Number(_Arr[i].seqno) > Number(maxseq)) {
        maxseq = Number(_Arr[i].seqno);
      }
    }
    return (Number(maxseq) / 10 + 1) * 10;
  }

  openLg(content1, index) {
    if (!this.offerInformationForm.incoterms.value) {
      this.submitted = true;
      if (this.OfferInformationForm.invalid)
        return;
    }

    this.LengthandFactordata = [];

    if (index !== undefined) {
      this.itemforEdit = true;
      let data = this.filterDatatoDeletewithOrder(this.offerItemStd)[index];
      this._oldItemData = Object.assign({}, data);
      this._oldItemData.lengthandfactor = { ...data.lengthandfactor };
      this.stdItemForm.stditemCode.setValue(data.articleNo);
      this.stdItemForm.stdItemName.setValue(data.description);
      this.stdItemForm.stdItemPrice.setValue(data.price);
      this.stdItemForm.itemunitnetprice.setValue(data.unitprice);
      this.stdItemForm.stdItemCatalog.setValue(data.catalogLink);
      this.ItemCatalogue = data.catalogLink;
      this.stdItemForm.stdItemQty.setValue(data.quantity);
      this.stdItemForm.itemDiscount.setValue(data.discountPer);
      this.stdItemForm.customerpartno.setValue(data.customerpartno);
      this.stdItemForm.stdItemUOM.setValue(data.uom);
      this.stdItemForm.enquiredquantity.setValue(data.enquiredquantity);
      this.stdItemForm.stdItemMOQ.setValue(data.msq);
      this.stdItemForm.ItemMOQ.setValue(data.moq);
      this.itemSequenceId = data.itemSeqId;
      this.stdItemForm.seqno.setValue(data.seqno);
      // this.stdItemForm.itemunitnetprice.setValue(data.itemunitnetprice);

      // let netvalue: number = 0;
      // let price: number = Number(this.stdItemForm.stdItemPrice.value);
      // let unitprice: number = Number(this.stdItemForm.itemunitnetprice.value);
      // let discount: number = Number(this.stdItemForm.itemDiscount.value);
      // let quantity: number = Number(this.stdItemForm.stdItemQty.value);

      // netvalue = Number((unitprice * quantity).toFixed(2));
      // this.discountchange();
      // this.stdItemForm.itemtotal.setValue(netvalue);
      this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
      this.LengthandFactordata = data.lengthandfactor;
      // this._tempLengthandFactordata = data.lengthandfactor;
      // this.itemSequenceId = data.itemSeqId;
      this.itemid = data.id;
      this.itemType = data.itemType;
      this.isItemExpire = data.isexpire;
      this.files = data.files;
      this.articleNo = data.articleNo;
      this.msq = data.msq;
      this.uom = data.uom;

      if (this.itemType.toUpperCase() == 'SPR' && this.LengthandFactordata.length > 0) {
        this.qtydisable = true;
        this.lengthandfactorbtndisable = false;
      } else {
        this.qtydisable = false;
        this.lengthandfactorbtndisable = true;
      }

      this.itemLengthList = [];
      if (this.uom.toUpperCase() == 'M') {
        if (data.length && data.length.includes('|')) {
          let length = data.length.split('|');
          this.itemLengthList = length;
        } else {
          this.itemLengthList = data.length;
        }

        this.qtydisable = true;
        this.lengthandfactorbtndisable = false;
      } else {
        this.qtydisable = false;
        this.lengthandfactorbtndisable = true;
      }

      //calculate unit net price
      // this.stdItemForm.itemunitnetprice.setValue(this.converttocurrency(this.stdItemForm.itemtotal.value - (this.stdItemForm.itemtotal.value * this.DealerCommisionPer / 100)) / this.stdItemForm.stdItemQty.value);

      this.itemlevelcuttingcharges = data.cuttingcharges;
      this.itemGrossMargin = data.GrossMargin;
      this.itemTGrossMargin = data.TargetGrossMargin;
      this.itemRGrossMargin = data.RMCGrossMargin;
      this.itemindex = index;
      this.submitted = false;
      this.isItemReady = true;
      // this.modalService.open(content1, { size: 'lg' }).result.then((result) => {
      // }, (reason) => {
      //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // });
    } else {
      this.files = [];
      this.stdItemForm.stditemCode.setValue(null);
      this.stdItemForm.stdItemName.setValue(null);
      this.stdItemForm.stdItemPrice.setValue(null);
      this.stdItemForm.itemunitnetprice.setValue(null);
      this.stdItemForm.stdItemCatalog.setValue(null);
      this.stdItemForm.stdItemUOM.setValue(null);
      this.stdItemForm.enquiredquantity.setValue(null);
      this.stdItemForm.stdItemMOQ.setValue(null);
      this.stdItemForm.ItemMOQ.setValue(null);
      this.ItemCatalogue = null;
      this.LengthandFactordata = [];
      this.stdItemForm.stdItemQty.setValue(null);
      this.stdItemForm.seqno.setValue(null);
      this.stdItemForm.itemunitnetprice.setValue(null);

      if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
        this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
      else
        this.stdItemForm.itemDiscount.setValue(null);

      this.stdItemForm.customerpartno.setValue(null);
      this.stdItemForm.itemtotal.setValue(null);
      this.itemLengthList = [];
      this.itemid = 0;
      this.itemforEdit = false;
      this.lengthandfactorbtndisable = true;
      this.itemSequenceId = 0;
      this.itemType = null;
      this.isItemExpire = false;
      this.articleNo = null;
      this.msq = null;
      this.uom = null;
      this.submitted = false;
      this.isItemReady = true;
      this.itemlevelcuttingcharges = 0;
      this.itemGrossMargin = 0;
      this.itemTGrossMargin = 0;
      this.itemRGrossMargin = 0;
    }

    this.modalService.open(content1, { size: 'lg' }).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async onItemSaveClick() {
    this.submitted = true;

    if (this.StdItemForm.invalid || !this.isItemReady) {
      return;
    } else if (!this.articleNo) {
      this.notificationService.showError('Please add Item.');
      return;
    } else if (Number(this.stdItemForm.stdItemQty.value) <= 0) {
      this.notificationService.showError('Please enter valid quantity.');
      return;
    }

    // if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "PC") {
    if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
      this.notificationService.showError(`Quantity must be greater than or equal to MOQ ` + Number(this.stdItemForm.ItemMOQ.value) + `.`);
      return;
    }
    // }
    // else if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "M") {
    //   if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value) && this.LengthandFactordata.filter(x => x.isother == 1).length > 0) {
    //     this.notificationService.showError(`Quantity must be greater than or equal to MOQ ` + Number(this.stdItemForm.ItemMOQ.value) + `.`);
    //     return;
    //   }
    // }

    let itemModel = {
      "id": this.isAdd ? 0 : this.itemid,
      "itemId": this.isAdd ? 0 : this.itemid,
      "itemSeqId": this.itemSequenceId > 0 ? this.itemSequenceId : this.getSeqID(this.offerItemStd),
      "seqno": this.stdItemForm.seqno.value ? this.stdItemForm.seqno.value : this.getSeqNo(),
      "isexpire": this.isItemExpire,
      "articleNo": this.articleNo,
      "itemType": this.itemType,
      "description": this.stdItemForm.stdItemName.value,
      "quantity": Number(this.stdItemForm.stdItemQty.value),
      "msq": this.msq,
      "moq": this.stdItemForm.ItemMOQ.value,
      "uom": this.stdItemForm.stdItemUOM.value,
      "enquiredquantity": this.stdItemForm.enquiredquantity.value,
      "customerpartno": this.stdItemForm.customerpartno.value ? this.stdItemForm.customerpartno.value : '',
      "price": Number(this.stdItemForm.stdItemPrice.value),
      "unitprice": this.stdItemForm.itemunitnetprice.value,
      "discountPer": Number(this.stdItemForm.itemDiscount.value),
      "netvalue": this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)),
      "catalogLink": this.stdItemForm.stdItemCatalog.value ? this.stdItemForm.stdItemCatalog.value : '',
      "isDelete": 0,
      "length": this.itemLengthList,
      "lengthandfactor": this.LengthandFactordata.concat(this.LengthandFactordataDelete),
      "cuttingcharges": this.itemlevelcuttingcharges,
      "files": this.files,
      "filerefid": 0,
      "documents": [],
      "GrossMargin": this.itemGrossMargin ? this.itemGrossMargin : 0,
      "TargetGrossMargin": this.itemTGrossMargin ? this.itemTGrossMargin : 0,
      "RMCGrossMargin": this.itemRGrossMargin ? this.itemRGrossMargin : 0
    }

    this.items = this.ItemsForm.get('items') as FormArray;
    this.items.push(this.createItem());

    this.offerItemStd = this.offerItemStd.filter(x => x.itemSeqId != itemModel.itemSeqId);

    if (this.itemSequenceId > 0)
      this.offerItemStd.splice(this.itemindex, 0, itemModel);
    else
      this.offerItemStd.push(itemModel);

    if (Number(this.offerInformationForm.headerleveldiscount.value) != Number(this.stdItemForm.itemDiscount.value))
      this.offerInformationForm.headerleveldiscount.setValue(null);

    this.updateTotalValues();

    this.itemSequenceId = 0;
    this.itemlevelcuttingcharges = 0;
    this.stdItemForm.stditemCode.setValue(null);
    this.stdItemForm.stdItemName.setValue(null);
    this.stdItemForm.stdItemPrice.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.stdItemCatalog.setValue(null);
    this.ItemCatalogue = null;
    this.itemType = null;
    this.isItemExpire = false;
    this.stdItemForm.stdItemQty.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.seqno.setValue(null);
    this.files = [];
    if (this.offerItemStd.length > 0) {
      this.stdItem = true;
      this.submitted = false;
      this.modalService.dismissAll("");
    } else {
      this.stdItem = false;
    }
  }

  onItemCancelClick() {
    let itemModel: any;
    if (this._oldItemData) {
      let finalQty = 0;
      if (this._oldItemData && this._oldItemData.uom.toUpperCase() == 'M') {
        if (this.LengthandFactordata && this.LengthandFactordata.length > 0) {
          this.LengthandFactordata.forEach(element => {
            if (element.isDelete == 0)
              finalQty += Number(element.qty);
          });
        }
      } else if (this._oldItemData && this._oldItemData.uom.toUpperCase() == 'PC') {
        finalQty = Number(this._oldItemData.quantity);
      }

      itemModel = {
        "id": this.isAdd ? 0 : this.itemid,
        "itemId": this.isAdd ? 0 : this.itemid,
        "itemSeqId": this.itemSequenceId > 0 ? this.itemSequenceId : this.getSeqID(this.offerItemStd),
        "seqno": this._oldItemData.seqno,
        "isexpire": this._oldItemData.isexpire,
        "articleNo": this._oldItemData.articleNo,
        "itemType": this._oldItemData.itemType,
        "description": this._oldItemData.description,
        "quantity": Number(finalQty),
        "msq": this._oldItemData.msq,
        "moq": this._oldItemData.moq,
        "uom": this._oldItemData.uom,
        "enquiredquantity": this._oldItemData.enquiredquantity,
        "customerpartno": this._oldItemData.customerpartno,
        "price": Number(this._oldItemData.price),
        "unitprice": this._oldItemData.unitprice,
        "discountPer": Number(this._oldItemData.discountPer),
        "netvalue": this.calculateTotalinItemPopupByUnitPrice(Number(this._oldItemData.unitprice), Number(finalQty)),
        "catalogLink": this._oldItemData.catalogLink,
        "isDelete": this._oldItemData.isDelete,
        "length": this._oldItemData.length,
        "lengthandfactor": this.LengthandFactordata.concat(this.LengthandFactordataDelete),
        "cuttingcharges": this._oldItemData.cuttingcharges,
        "files": this._oldItemData.files,
        "filerefid": 0,
        "documents": [],
        "GrossMargin": this._oldItemData.GrossMargin,
        "TargetGrossMargin": this._oldItemData.TargetGrossMargin,
        "RMCGrossMargin": this._oldItemData.RMCGrossMargin
      }

      this.items = this.ItemsForm.get('items') as FormArray;
      this.items.push(this.createItem());

      this.offerItemStd = this.offerItemStd.filter(x => x.itemSeqId != itemModel.itemSeqId);

      if (this.itemSequenceId > 0)
        this.offerItemStd.splice(this.itemindex, 0, itemModel);
      else
        this.offerItemStd.push(itemModel);

      if (Number(this.offerInformationForm.headerleveldiscount.value) != Number(this.stdItemForm.itemDiscount.value))
        this.offerInformationForm.headerleveldiscount.setValue(null);
    }

    this.updateTotalValues();
    this.modalService.dismissAll();
  }

  onDeletedItemView(DeletedItem, index) {
    let data = this.offerDeletedItem[index];
    this.stdItemForm.stditemCode.setValue(data.articleNo);
    this.stdItemForm.stdItemName.setValue(data.description);
    this.stdItemForm.stdItemPrice.setValue(data.price);
    this.stdItemForm.itemunitnetprice.setValue(data.unitprice);
    this.stdItemForm.stdItemCatalog.setValue(data.catalogLink);
    this.ItemCatalogue = data.catalogLink;
    this.stdItemForm.stdItemQty.setValue(data.quantity);
    this.stdItemForm.seqno.setValue(data.seqno);
    this.stdItemForm.itemDiscount.setValue(data.discountPer);
    this.stdItemForm.customerpartno.setValue(data.customerpartno);
    this.stdItemForm.stdItemUOM.setValue(data.uom);
    this.stdItemForm.enquiredquantity.setValue(data.enquiredquantity);
    this.stdItemForm.stdItemMOQ.setValue(data.msq);
    this.stdItemForm.ItemMOQ.setValue(data.moq);

    // let netvalue: number = 0;
    // let price: number = Number(this.stdItemForm.stdItemPrice.value);
    // let unitprice: number = Number(this.stdItemForm.itemunitnetprice.value);
    // let discount: number = Number(this.stdItemForm.itemDiscount.value);
    // let quantity: number = Number(this.stdItemForm.stdItemQty.value);
    // netvalue = Number((unitprice * quantity).toFixed(2));
    // this.stdItemForm.itemtotal.setValue(netvalue);
    this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
    // this.discountchange();
    this.LengthandFactordata = data.lengthandfactor;
    this.itemSequenceId = data.itemSeqId;
    this.itemid = data.id;
    this.itemType = data.itemType;
    this.files = data.files;
    this.articleNo = data.articleNo;
    if (data.length && data.length.includes('|')) {
      let length = data.length.split('|');
      this.itemLengthList = length;
    }
    this.itemindex = index;
    this.itemlevelcuttingcharges = data.cuttingcharges;

    this.modalService.open(DeletedItem, { size: 'lg' }).result.then((result) => {
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }



  onSTDItemDelete(event: any) {
    if (this.isAdd) {
      this.offerItemStd = this.offerItemStd.filter(x => x.articleNo != event.model.articleno);
      // this.offerItemStd.splice(event.model.articleno, 1);
    } else if (this.isEdit) {
      if (event.model.id > 0) {
        this.offerItemStd.find(x => x.id == event.model.id).isDelete = 1
        this.offerDeletedItem.push(this.offerItemStd.find(x => x.id == event.model.id));
        // this.offerItemStd.splice(event.model.index, 1);
        this.offerItemStd = this.offerItemStd.filter(x => x.articleNo != event.model.articleno && x.id != event.model.id);
      }
      else
        // this.offerItemStd.splice(event.model.index, 1);
        this.offerItemStd = this.offerItemStd.filter(x => x.articleNo != event.model.articleno);
    }

    if (this.offerItemStd.length > 0) {
      this.stdItem = true;
      this.updateTotalValues();
    } else {
      this.stdItem = false;
    }

    if (this.offerDeletedItem.length > 0) {
      this.deletedItem = true;
    } else {
      this.deletedItem = false;
    }

    this.modalService.dismissAll('delete');
  }

  onDeleteAllClick() {
    //Delete all MFG/TRD Items
    if (this.isAdd) {
      this.offerItemStd = [];
    } else if (this.isEdit) {
      this.offerItemStd.forEach(element => {
        if (element.id > 0) {
          element.isDelete = 1;
          this.offerDeletedItem.push(element);
          this.offerItemStd = this.offerItemStd.filter(x => x.id != element.id);
        } else {
          this.offerItemStd.splice(element);
        }
      });
    }

    if (this.offerItemStd.length > 0) {
      this.stdItem = true;
      this.updateTotalValues();
    } else {
      this.stdItem = false;
    }

    if (this.offerDeletedItem.length > 0) {
      this.deletedItem = true;
    } else {
      this.deletedItem = false;
    }



    this.modalService.dismissAll('delete');
  }

  filterDatatoDeletewithOrder(data: any) {
    return data.filter(x => x.isDelete == 0).sort((a, b) => Number(a.seqno) - Number(b.seqno));
  }

  filterDatatoDelete(data: any) {
    return data.filter(x => x.isDelete == 0);
  }


  oncancelClick() {
    this.router.navigate(['/offersimulator/list']);
  }

  onEditClick() {
    let id: string = '';
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/offersimulator/edit/' + id]);
  }

  // toggleIsRecommend(event) {
  //   if (this.offerItemStd && this.offerItemStd.length == 0) {
  //     this.notificationService.showError('There must be one items.')
  //     return;
  //   }

  //   this.isRecommend = event.target.checked;
  //   if (this.isRecommend == true) {
  //     this.otherForm.asmapprovecomment.setValidators(Validators.required);
  //     this.otherForm.asmapprovecomment.updateValueAndValidity();
  //   } else {
  //     this.otherForm.asmapprovecomment.clearValidators();
  //     this.otherForm.asmapprovecomment.updateValueAndValidity();
  //   }
  // }

  onSaveasDraftClick(issubmit: boolean) {
    this.onSubmit();
  }

  // onSaveandSubmitClick(issubmit: boolean) {
  //   if (!this.oppoData.customerid && this.isRecommend) {
  //     this.notificationService.showError('Sold to party is required.');
  //     return;
  //   }

  //   if (this.filterDatatoDeletewithOrder(this.offerItemStd) && this.filterDatatoDeletewithOrder(this.offerItemStd).length == 0) {
  //     this.notificationService.showError('There is no item in the Offer.')
  //     return;
  //   }


  //   let isAllItemValid: boolean = true;
  //   this.offerItemStd.forEach(element => {
  //     if (element.isexpire)
  //       isAllItemValid = false;
  //   });

  //   if (!isAllItemValid) {
  //     this.notificationService.showError('There is an expire item(s) in the offer.');
  //     return;
  //   }

  //   // this.otherForm.asmapprovecomment.setValidators(Validators.required);
  //   // this.otherForm.asmapprovecomment.updateValueAndValidity();
  //   this.isRecommend = issubmit;
  //   this.UpdateFieldValidators(this.isRecommend);
  //   this.onSubmit();
  // }

  onGenerateOfferPDFClick(offertype: string) {
    let filename = 'offer_' + this.offerID + '_' + offertype + '.pdf';
    // let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/offerpdf/' + filename;
    FileSaver.saveAs(this.offerdata.pdfurl, filename);
  }

  async onSubmit() {
    this.submitted = true;

    this.acc.expandAll();
    if (this.OfferInformationForm.invalid || this.TermsandConditionForm.invalid) {
      return false;
    }

    this.offerDeletedItem.forEach(element => {
      var oldfiles = element.files.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element2 => {
        element.documents.push({ id: element2 });
      });
      element.files = [];
    });

    this.offerItemSPR = this.offerItemSPR.filter(x => x.isDelete == 0);
    let offerHeader = {
      Customer: this.offerInformationForm.customer.value,
      CurrencyType: this.offerInformationForm.currencyType.value,
      OfferType: this.offerInformationForm.offerType.value,
      DealerCommissionPer: this.offerInformationForm.offerType.value == 2 ? Number(this.offerInformationForm.delearcommission.value) : 0,
      headerleveldiscount: Number(this.offerInformationForm.headerleveldiscount.value),
      Incoterm: this.offerInformationForm.incoterms.value,
      fromlocation: this.isShowFromToLocation ? this.offerInformationForm.fromlocation.value : '',
      tolocation: this.isShowFromToLocation ? this.offerInformationForm.tolocation.value : '',
      freightcharges: this.currencycode == 'USD' ? Number(this.itemsForm.freightcharges.value) * this.USDrate : this.currencycode == 'EUR' ? Number(this.itemsForm.freightcharges.value) * this.EURrate : Number(this.itemsForm.freightcharges.value)
    }



    let _qtyerror: boolean = false;
    let _isAllItemValid: boolean = true;

    this.offerItemStd.forEach(element => {
      // if (element.uom.toUpperCase() == "PC" && this.isRecommend) {
      if (Number(element.quantity) < Number(element.moq)) {
        _qtyerror = true;
      }
      // }
      // else if (element.uom.toUpperCase() == "M" && this.isRecommend) {
      //   if (Number(element.quantity) < Number(element.moq) && element.lengthandfactor.filter(x => x.isother == 1).length > 0) {
      //     _qtyerror = true;
      //   }
      // }

      if (!element.itemType)
        _isAllItemValid = false;
    });

    if (_qtyerror) {
      this.notificationService.showError('Quantity must be greater than or equal to MOQ.');
      return;
    } else if (!_isAllItemValid) {
      this.notificationService.showError('Some item is invalid.');
      return;
    }

    let saveModel = {
      offerId: this.isAdd ? 0 : this.offerID,
      offervalue: this.totalnetvalue,
      offerHeader: offerHeader,
      offerItems: this.offerDeletedItem.concat(this.offerItemStd),
      // paymentterm: this.termsandConditionForm.paymentterms.value ? this.termsandConditionForm.paymentterms.value : '',
      // deliveryleadtime: this.termsandConditionForm.deliveryleadtime.value ? this.termsandConditionForm.deliveryleadtime.value : '',
      // specialterms: this.specialtextdata.concat(this.specialtextdeletedata)
    }

    this.createOffer(saveModel);
  }


  createOffer(saveModel: any) {
    this.offersimulatorService.CreateOffer(saveModel).subscribe(
      async response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (saveModel.offerId == 0)
            this.notificationService.showSuccess('Offer Created Successfully');
          else
            this.notificationService.showSuccess('Offer Updated Successfully');

          this.router.navigateByUrl('/offersimulator/list');
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }





  getID(itemArray: any) {
    let max = 0;
    for (let i = 0; i < itemArray.length; i++) {
      if (itemArray[i].seqid > max) {
        max = itemArray[i].seqid;
      }
    }
    return max + 1;
  }

  openAddSpecialText(AddSpecialText, index) {
    if (index != undefined) {
      var data = this.filterDatatoDelete(this.specialtextdata)[index];
      this.specialTextForm.addspecialtexttitle.setValue(data.title);
      this.SpecialTermTitle = data.title;
      this.specialTextForm.addspecialtextdescription.setValue(data.description);
      this.SpecialTermDescription = data.description;
      this.specialtextid = data.id;
      this.specialtextindex = index;
      this.seqid = data.seqid
    } else {
      this.specialTextForm.addspecialtexttitle.setValue(null);
      this.SpecialTermTitle = null;
      this.specialTextForm.addspecialtextdescription.setValue(null);
      this.SpecialTermDescription = null;
      this.specialtextid = 0;
      this.specialtextindex = null;
      this.seqid = null;
    }

    this.submitted = false;
    this.modalService.open(AddSpecialText, { size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.specialTextForm.addspecialtexttitle.setValue(null);
      this.SpecialTermTitle = null;
      this.specialTextForm.addspecialtextdescription.setValue(null);
      this.SpecialTermDescription = null;
      this.specialtextid = 0;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSpecialTextSave() {
    this.submitted = true;
    if (this.SpecialTextForm.invalid)
      return;

    let textdata = {
      id: this.isAdd ? 0 : this.specialtextid,
      seqid: this.seqid > 0 ? this.seqid : this.getID(this.specialtextdata),
      title: this.specialTextForm.addspecialtexttitle.value,
      description: this.specialTextForm.addspecialtextdescription.value,
      isDelete: 0
    }

    this.specialtextdata = this.specialtextdata.filter(x => x.seqid != textdata.seqid);

    if (this.specialtextid > 0)
      this.specialtextdata.splice(this.specialtextindex, 0, textdata);
    else
      this.specialtextdata.push(textdata);

    this.submitted = false;
    this.specialtextid = null;
    this.modalService.dismissAll('');
  }

  onSpecialTermsDelete(event) {
    if (this.specialtextdata[event.model.index].id > 0) {
      this.specialtextdata[event.model.index].isDelete = 1
      this.specialtextdeletedata.push(this.specialtextdata[event.model.index]);
      this.specialtextdata.splice(event.model.index, 1);
    } else {
      this.specialtextdata.splice(event.model.index, 1);
    }

    this.modalService.dismissAll('delete');
  }

  openAddLengthandFactor(AddLengthandFactor) {
    this.lengthandFactorForm.itemLength.setValue(null);
    this.lengthandFactorForm.itemFactor.setValue(null);
    this.lengthandFactorForm.lfqty.setValue(null);
    this.lengthandFactorForm.otherLength.setValue(null);
    this.submitted = false;
    this.isShowOtherLength = false;

    this.modalRef = this.modalService.open(AddLengthandFactor, { size: 'md' });
  }

  onLengthandFactorSave() {
    this.submitted = true;
    if (this.LengthandFactorForm.invalid)
      return;

    if (this.isOtherLengthExtra) {
      this.notificationService.showError('Please enter valid length.');
      return;
    }

    if (Number(this.lengthandFactorForm.itemFactor.value) <= 0)
      return;

    if (this.isShowOtherLength && this.lengthandFactorForm.otherLength.value <= 0)
      return;

    let lfdata = {
      id: 0,
      length: this.isShowOtherLength ? Number(this.lengthandFactorForm.otherLength.value) : Number(this.lengthandFactorForm.itemLength.value),
      factor: Number(this.lengthandFactorForm.itemFactor.value),
      qty: this.isShowOtherLength ? Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value) : Number(this.lengthandFactorForm.itemLength.value) * Number(this.lengthandFactorForm.itemFactor.value),
      isDelete: 0,
      cuttingcharges: 0,
      isother: this.isShowOtherLength ? 1 : 0
    }
    this.LengthandFactordata.push(lfdata);

    let finalQty = 0;
    if (this.LengthandFactordata && this.LengthandFactordata.length > 0) {
      this.LengthandFactordata.forEach(element => {
        if (element.isDelete == 0)
          finalQty += Number(element.qty);
      });
    }
    this.stdItemForm.stdItemQty.setValue(finalQty);

    this.onItemQtyChange();
  }

  onLengthandFactorRemove(index: number) {
    if (this.isAdd) {
      this.LengthandFactordata.splice(index, 1);
    } else if (this.isEdit) {
      if (this.LengthandFactordata[index].id > 0) {
        this.LengthandFactordata[index].isDelete = 1;
        this.LengthandFactordataDelete.push(this.LengthandFactordata[index]);
        this.LengthandFactordata.splice(index, 1);
      } else
        this.LengthandFactordata.splice(index, 1);
    }

    let finalQty = 0;
    this.itemlevelcuttingcharges = 0;
    if (this.LengthandFactordata && this.LengthandFactordata.length > 0) {
      this.LengthandFactordata.forEach(element => {
        if (element.isDelete == 0)
          finalQty += Number(element.qty);
      });
      this.stdItemForm.stdItemQty.setValue(finalQty);

      // let netvalue: number = 0;
      // let price: number = Number(this.stdItemForm.stdItemPrice.value);
      // let unitprice: number = Number(this.stdItemForm.itemunitnetprice.value);
      // let discount: number = Number(this.stdItemForm.itemDiscount.value);
      // let quantity: number = Number(this.stdItemForm.stdItemQty.value);
      // netvalue = Number((unitprice * quantity).toFixed(2));
      // this.stdItemForm.itemtotal.setValue(netvalue);
      this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));

      // this.LengthandFactordata.forEach(element => {
      //   if (element.isDelete == 0 && element.isother == 1) {
      //     element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
      //     this.itemlevelcuttingcharges += Number(element.cuttingcharges);
      //   }
      // });

      this.LengthandFactordata.forEach(element => {
        if (element.isDelete == 0 && element.isother == 1) {
          element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal);
          this.itemlevelcuttingcharges += Number(element.cuttingcharges);
        }
        // else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
        //   element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
        //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
        // } else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) >= Number(this.stdItemForm.ItemMOQ.value)) {
        //   element.cuttingcharges = 0;
        //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
        // }
      });

      this.onItemQtyChange();
    } else {
      this.stdItemForm.stdItemQty.setValue(null);
      this.stdItemForm.itemtotal.setValue(null);
    }
  }

  onLengthChange(event: any) {
    if (event) {
      if (event == 'Other') {
        this.isShowOtherLength = true;
        this.lengthandFactorForm.otherLength.setValidators(Validators.required);
        this.lengthandFactorForm.otherLength.updateValueAndValidity();

        let qty = Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
        this.lengthandFactorForm.lfqty.setValue(qty);
      } else {
        this.isShowOtherLength = false;
        this.isOtherLengthExtra = false;
        this.lengthandFactorForm.otherLength.setValue(null);
        this.lengthandFactorForm.otherLength.clearValidators();
        this.lengthandFactorForm.otherLength.updateValueAndValidity();

        let qty = Number(event) * Number(this.lengthandFactorForm.itemFactor.value);
        this.lengthandFactorForm.lfqty.setValue(qty);
      }
    } else {
      this.isShowOtherLength = false;
      this.isOtherLengthExtra = false;
      this.lengthandFactorForm.otherLength.setValue(null);
      this.lengthandFactorForm.itemFactor.setValue(null);
      this.lengthandFactorForm.lfqty.setValue(null);
    }
  }

  onOtherLengthChange() {
    this.itemLengthList.pop();
    let maxallowlength: number = 0;

    if (this.itemLengthList.length > 0)
      maxallowlength = Math.max(...this.itemLengthList);

    this.itemLengthList.push('Other');
    if (maxallowlength < Number(this.lengthandFactorForm.otherLength.value)) {
      this.isOtherLengthExtra = true;
      this.notificationService.showError('Length must be less than ' + maxallowlength);
      return;
    } else {
      this.isOtherLengthExtra = false;
    }
    let qty = Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
    this.lengthandFactorForm.lfqty.setValue(qty);
  }

  onfactorchange(event: any) {
    if (this.isShowOtherLength) {
      let qty = Number(this.lengthandFactorForm.otherLength.value) * Number(event.target.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    } else {
      let qty = Number(this.lengthandFactorForm.itemLength.value) * Number(event.target.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    }
  }

  discountchange() {
    // let netvalue: number = 0;
    // let price: number = Number(this.stdItemForm.stdItemPrice.value);
    // let unitprice: number = Number(this.stdItemForm.itemunitnetprice.value);
    // let discount: number = Number(this.stdItemForm.itemDiscount.value);
    // let quantity: number = Number(this.stdItemForm.stdItemQty.value);
    // netvalue = Number((unitprice * quantity).toFixed(2));
    // this.stdItemForm.itemtotal.setValue(netvalue);

    // List Price - (List Price * Discount / 100)
    let _tempUnitNetPrice = (Number(this.stdItemForm.stdItemPrice.value) - ((Number(this.stdItemForm.stdItemPrice.value) * Number(this.stdItemForm.itemDiscount.value) / 100))).toFixed(2);
    this.stdItemForm.itemunitnetprice.setValue(_tempUnitNetPrice);

    this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
  }

  calculateTotalinItemPopupByUnitPrice(unitprice: number, quantity: number) {
    return Number((unitprice * quantity).toFixed(2));
  }

  onItemQtyChange() {
    let producttype = '';
    if ((Number(this.stdItemForm.stdItemQty.value) <= 0)) {
      this.isItemReady = false;
      this.itemErrorMessage = 'Quantity must be greater than 0';
      return;
    }

    if (this.stdItemForm.stdItemUOM.value.toUpperCase() == 'PC') {
      if ((Number(this.stdItemForm.stdItemQty.value) % Number(this.stdItemForm.stdItemMOQ.value)) != 0) {
        this.isItemReady = false;
        this.itemErrorMessage = 'Quantity must be in multiples of MSQ';
        return;
      } else {
        this.isItemReady = true;
        this.itemErrorMessage = null;
      }
    }

    if ((this.offerInformationForm.fromlocation.value.length > 0 && !this.offerInformationForm.fromlocation.value.toUpperCase().includes('INDIA')) && (this.offerInformationForm.incoterms.value == 'EXW' || this.offerInformationForm.incoterms.value == 'CFR' || this.offerInformationForm.incoterms.value == 'CIF' || this.offerInformationForm.incoterms.value == 'FOB')) {
      producttype = 'TRD';
    } else {
      producttype = 'STD';
    }

    if (this.itemType != producttype && this.itemType != 'SPR') {
      this.productmasterService.searchproductalp(this.articleNo, producttype, 'INR', Number(this.stdItemForm.stdItemQty.value), []).then(
        response => {
          if (response.data && response.data.statusCode == 200) {
            this.itemType = response.data.data.itemtype;
            this.isItemReady = true;
            // let netvalue: number = 0;
            // let unitprice: number = Number(response.data.data.price);
            // let discount: number = Number(this.stdItemForm.itemDiscount.value);
            // let quantity: number = Number(this.stdItemForm.stdItemQty.value);
            // netvalue = Number((unitprice * quantity).toFixed(2));
            // this.stdItemForm.itemtotal.setValue(netvalue);
            this.stdItemForm.ItemMOQ.setValue(response.data.data.moq);
            this.stdItemForm.stdItemPrice.setValue(response.data.data.price);
            // if (!Number(this.stdItemForm.itemDiscount.value))
            //   this.stdItemForm.itemunitnetprice.setValue(response.data.data.price);

            if (Number(this.stdItemForm.itemDiscount.value) && Number(this.stdItemForm.itemDiscount.value) > 0)
              this.stdItemForm.itemunitnetprice.setValue((Number(this.stdItemForm.stdItemPrice.value) - ((Number(this.stdItemForm.stdItemPrice.value) * Number(this.stdItemForm.itemDiscount.value) / 100))).toFixed(2));
            else
              this.stdItemForm.itemunitnetprice.setValue(response.data.data.price);

            this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
            this.itemlevelcuttingcharges = 0;

            this.LengthandFactordata.forEach(element => {
              if (element.isDelete == 0 && element.isother == 1) {
                element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
                this.itemlevelcuttingcharges += Number(element.cuttingcharges);
              }
              // else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
              //   element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
              //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
              // } else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) >= Number(this.stdItemForm.ItemMOQ.value)) {
              //   element.cuttingcharges = 0;
              //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
              // }
            });

            // if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "PC") {
            if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
              this.isItemReady = false;
              this.itemErrorMessage = 'Quantity must be greater than or equal to MOQ.';
            } else {
              this.isItemReady = true;
              this.itemErrorMessage = null;
            }
            // }
            // else if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "M") {
            //   if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value) && this.LengthandFactordata.filter(x => x.isother == 1).length > 0) {
            //     this.isItemReady = false;
            //     this.itemErrorMessage = 'Quantity must be greater than or equal to MOQ.';
            //   }
            // }

          } else if (response.data && response.data.statusCode == 400) {
            this.isItemReady = false;
            this.itemType = null;
            this.itemErrorMessage = response.data.errormessage;
            this.stdItemForm.ItemMOQ.setValue(response.data.data.moq);
            this.stdItemForm.stdItemPrice.setValue(response.data.data.price);
            this.stdItemForm.itemunitnetprice.setValue(response.data.data.price);
            this.stdItemForm.itemtotal.setValue(null);
          }

          this.submitted = false;
          if (this.modalRef)
            this.modalRef.close();
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      // let netvalue: number = 0;
      // let price: number = Number(this.stdItemForm.stdItemPrice.value);
      // let unitprice: number = Number(this.stdItemForm.itemunitnetprice.value);
      // let discount: number = Number(this.stdItemForm.itemDiscount.value);
      // let quantity: number = Number(this.stdItemForm.stdItemQty.value);
      // netvalue = Number((unitprice * quantity).toFixed(2));
      // this.stdItemForm.itemtotal.setValue(netvalue);
      this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));

      this.submitted = false;
      if (this.modalRef)
        this.modalRef.close();
      this.itemlevelcuttingcharges = 0;

      this.LengthandFactordata.forEach(element => {
        if (element.isDelete == 0 && element.isother == 1) {
          element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal);
          this.itemlevelcuttingcharges += Number(element.cuttingcharges);
        }
        // else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
        //   element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
        //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
        // } else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) >= Number(this.stdItemForm.ItemMOQ.value)) {
        //   element.cuttingcharges = 0;
        //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
        // }
      });

      // if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "PC") {
      if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
        this.isItemReady = false;
        this.itemErrorMessage = 'Quantity must be greater than or equal to MOQ.';
      } else {
        this.isItemReady = true;
        this.itemErrorMessage = null;
      }
      // }
      // else if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "M") {
      //   if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value) && this.LengthandFactordata.filter(x => x.isother == 1).length > 0) {
      //     this.isItemReady = false;
      //     this.itemErrorMessage = 'Quantity must be greater than or equal to MOQ.';
      //   }
      // }
    }
  }

  onItemUnitnetPriceChange() {
    // this.isItemReady = true;
    // this.itemErrorMessage = null;
    // if (Number(this.stdItemForm.itemunitnetprice.value) >= Number(this.stdItemForm.stdItemPrice.value)) {
    //   this.isItemReady = false;
    //   this.itemErrorMessage = 'Unit Net Price should not be more than List Price';
    //   return;
    // } else
    if (!this.isItemReady) {
      return;
    } else if (Number(this.stdItemForm.itemunitnetprice.value) <= 0) {
      this.isItemReady = false;
      this.itemErrorMessage = 'Unit Net Price should not be less than 0';
      return;
    } else if (!this.isItemReady) {
      return;
    } else {
      this.isItemReady = true;
      this.itemErrorMessage = null;
    }

    // (List Price - Unit Net Price) * 100 / List Price
    let _tempDiscount = ((Number(this.stdItemForm.stdItemPrice.value) - Number(this.stdItemForm.itemunitnetprice.value)) * 100 / Number(this.stdItemForm.stdItemPrice.value)).toFixed(2);
    this.stdItemForm.itemDiscount.setValue(_tempDiscount);
    // this.discountchange();
    this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
  }

  downloadFile(name, id, filetype) {
    this.filesService.download(id).subscribe(
      response => {
        this.fileData = response.pecount;

        var sliceSize = 512
        const byteCharacters = atob(this.fileData);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);
          byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: filetype });
        FileSaver.saveAs(blob, name);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  openImportItemsModal(ImportItems) {
    this.ImportItemFiles = null;
    this.submitted = false;
    this.modalService.open(ImportItems, { size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  ImportItemsfileChangeListener(event: any) {
    var validExts = new Array(".xlsx", ".xls");
    var fileExt = event.target.files[0].name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.notificationService.showError("Invalid file selected, valid files are of " + validExts.toString() + " types.");
      return false;
    } else {
      this.ImportItemsfileUploaded = event.target.files[0];
      this.ImportItemFiles = event.target.files[0];
      this.readExcel(true);
    }
  }

  downloadImportItemSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.importitem;
    FileSaver.saveAs(url, SampleEnum.importitem);
  }

  private readExcel(isItemSTDTRD: boolean) {
    let readFile = new FileReader();

    readFile.onload = (e) => {
      this.storeData = readFile.result;
      var data = new Uint8Array(this.storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
    }
    readFile.readAsArrayBuffer(this.ImportItemsfileUploaded);
  }

  ValidateImportItemFile(isItemSTDTRD: boolean) {
    if (this.ImportItemFiles && isItemSTDTRD) {
      this.importitemjsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false, defval: null });
      let data = []
      for (let key in this.importitemjsonData[0]) {
        if (data.length != Config.masterfilesheaders.importitem.length)
          data.push(key.trim());
      }
      this.importitemheaderList = data;

      if (JSON.stringify(this.importitemheaderList).toUpperCase() != JSON.stringify(Config.masterfilesheaders.importitem).toUpperCase()) {
        this.notificationService.showError('Incorrect Template used. Please download correct template before importing.');
        return false;
      } else
        return true;
    } else {
      this.notificationService.showError('Please select file.');
      return false;
    }
  }

  async ValidateImportItemFileData() {
    var importitemheader = Config.masterfilesheaders.importitem;
    //sort array of object by article no
    this.importitemjsonData.sort(function (a, b) {
      if (a[importitemheader[1]])
        return a[importitemheader[1]].localeCompare(b[importitemheader[1]]);
    })

    //grouping of quantity/length/factor
    for (let i = 0; i < this.importitemjsonData.length; i++) {
      if (i + 1 < this.importitemjsonData.length) {
        if (this.importitemjsonData[i][importitemheader[1]] == this.importitemjsonData[i + 1][importitemheader[1]]) {
          this.importitemjsonData[i][importitemheader[2]] = Number(this.importitemjsonData[i][importitemheader[2]]) + Number(this.importitemjsonData[i + 1][importitemheader[2]]);

          if (this.importitemjsonData[i][importitemheader[5]] && this.importitemjsonData[i + 1][importitemheader[5]] && this.importitemjsonData[i][importitemheader[6]] && this.importitemjsonData[i + 1][importitemheader[6]]) {
            this.importitemjsonData[i][importitemheader[5]] = this.importitemjsonData[i][importitemheader[5]] + '|' + this.importitemjsonData[i + 1][importitemheader[5]];
            this.importitemjsonData[i][importitemheader[6]] = this.importitemjsonData[i][importitemheader[6]] + '|' + this.importitemjsonData[i + 1][importitemheader[6]];
          }

          this.importitemjsonData.splice(i + 1, 1);
          if (i + 1 != this.importitemjsonData.length)
            i--;
        }
      }
    }

    //article no/qty/unit price/discount/exist validation
    for (let i = 0; i < this.importitemjsonData.length; i++) {
      if (!this.importitemjsonData[i][importitemheader[1]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Article no is required';
      } else if (Number(this.importitemjsonData[i][importitemheader[2]]) <= 0) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Quantity must be greater than 0';
      } else if (this.importitemjsonData[i][importitemheader[4]] > 100) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Discount can not be more than 100.';
      } else if (!this.importitemjsonData[i][importitemheader[3]] && !this.importitemjsonData[i][importitemheader[4]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Either unit price or discount is required.';
      } else if (this.offerItemStd && this.offerItemStd.length > 0) {
        let existItemCheck = null;
        existItemCheck = this.offerItemStd.filter(z => z.articleNo == this.importitemjsonData[i][importitemheader[1]] && z.isDelete == 0);
        if (existItemCheck && existItemCheck.length > 0) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Item already added in the list.`;
        }
      }

      this.importitemjsonData[i].SrNo = i + 1;
      this.importitemjsonData[i].articleNo = this.importitemjsonData[i][importitemheader[1]];
      this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];

      if (this.importitemjsonData[i][importitemheader[3]]) {
        this.importitemjsonData[i][importitemheader[3]] = Number(this.importitemjsonData[i][importitemheader[3]].trim().replace(/,/g, ''));
        if (isNaN(this.importitemjsonData[i][importitemheader[3]])) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Unit price must be numeric.`;
        }
      }

      this.importitemjsonData[i].discountPer = this.importitemjsonData[i][importitemheader[4]];
    }

    // get stock for import articles
    let _articles = this.importitemjsonData.filter(x => !x.rowStatus).map(x => x['ARTICLE NO']).toString();
    if (_articles && _articles.length > 0)
      await this.onStockSearch(true, _articles);

    //call api for item searched
    for (let i = 0; i < this.importitemjsonData.length; i++) {

      if (this.importitemjsonData[i].rowStatus == undefined) {
        await this.productmasterService.getItemSearched(this.importitemjsonData[i][importitemheader[1]]).then(
          async response => {
            if (response.item && response.item.length > 0) {
              let _itemsearcheddata = response.item[0];

              let _producttype = '';
              //for UOM == 'PC' validation AND UOM == 'M' validation
              if (_itemsearcheddata.uom.toUpperCase() == 'PC') {
                if ((Number(this.importitemjsonData[i][importitemheader[2]]) % Number(_itemsearcheddata.msq)) != 0) {
                  this.importitemjsonData[i].rowStatus = false;
                  this.importitemjsonData[i].Remarks = 'Quantity must be in multiples of MSQ';
                }
              } else if (_itemsearcheddata.uom.toUpperCase() == 'M' && this.importitemjsonData[i][importitemheader[5]] && this.importitemjsonData[i][importitemheader[5]].length > 0) {
                let maxallowlength: number = 0;

                if (_itemsearcheddata.length.split('|').length > 0)
                  maxallowlength = Math.max(..._itemsearcheddata.length.split('|'));

                this.importitemjsonData[i][importitemheader[5]].split('|').forEach(element => {
                  if (maxallowlength < Number(element)) {
                    this.importitemjsonData[i].rowStatus = false;
                    this.importitemjsonData[i].Remarks = 'Length must be less than ' + maxallowlength;
                  }
                });
              } else if (_itemsearcheddata.uom.toUpperCase() == 'M' && !this.importitemjsonData[i][importitemheader[5]]) {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].Remarks = 'Length is required';
              }

              //if factor is not available then 1
              if (_itemsearcheddata.uom.toUpperCase() == 'M' && !this.importitemjsonData[i][importitemheader[6]]) {
                this.importitemjsonData[i][importitemheader[6]] = "1";
              }

              //set product type
              if ((this.offerInformationForm.fromlocation.value.length > 0 && !this.offerInformationForm.fromlocation.value.toUpperCase().includes('INDIA')) && (this.offerInformationForm.incoterms.value == 'EXW' || this.offerInformationForm.incoterms.value == 'CFR' || this.offerInformationForm.incoterms.value == 'CIF' || this.offerInformationForm.incoterms.value == 'FOB'))
                _producttype = 'TRD';
              else
                _producttype = 'STD';

              let _templengthandfactordata = [];
              if (_itemsearcheddata.uom.toUpperCase() == 'M') {
                _itemsearcheddata.length = _itemsearcheddata.length + '|' + 'Other';

                let _templength = this.importitemjsonData[i][importitemheader[5]].split('|');
                let _tempfactor = this.importitemjsonData[i][importitemheader[6]].split('|');
                let isOtherLength: boolean = false;

                let _tempActuallength = _itemsearcheddata.length.split('|');
                for (let i = 0; i < _templength.length && i < _tempfactor.length; i++) {
                  isOtherLength = !_tempActuallength.includes(_templength[i]);

                  let _tempArr = {
                    id: 0,
                    length: _templength[i],
                    factor: Number(_tempfactor[i]),
                    qty: Number(_templength[i]) * Number(_tempfactor[i]),
                    isDelete: 0,
                    cuttingcharges: 0,
                    isother: isOtherLength ? 1 : 0
                  }
                  _templengthandfactordata.push(_tempArr);
                }
              }

              this.importitemjsonData[i].articleNo = _itemsearcheddata.articleno;
              this.importitemjsonData[i].description = _itemsearcheddata.description;
              this.importitemjsonData[i].uom = _itemsearcheddata.uom;
              this.importitemjsonData[i].lengthandfactor = _templengthandfactordata;
              this.importitemjsonData[i].sapid = _itemsearcheddata.sapid;
              this.importitemjsonData[i].msq = _itemsearcheddata.msq;
              this.importitemjsonData[i].length = _itemsearcheddata.length;

              let _tempALPdata = this.importitemjsonData.find(x => x.articleNo == _itemsearcheddata.articleno);

              let _tempitemlevelcuttingcharges = 0;
              if (_tempALPdata.uom.toUpperCase() == 'M')
                this.importitemjsonData[i].quantity = 0;
              else
                this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];

              _tempALPdata.lengthandfactor.forEach(element => {
                if (element.isDelete == 0 && element.isother == 1) {
                  element.cuttingcharges = _tempALPdata.itemType == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
                  _tempitemlevelcuttingcharges += Number(element.cuttingcharges);
                }
                this.importitemjsonData[i].quantity += element.qty
              });
              _tempALPdata.cuttingcharges = _tempitemlevelcuttingcharges;

              if (this.importitemjsonData[i].rowStatus == undefined) {
                //call api to get alp
                await this.productmasterService.searchproductalp(_itemsearcheddata.articleno, _producttype, 'INR', this.importitemjsonData[i].quantity, this.importitemsstockdata).then(
                  response => {
                    if (response.data && response.data.statusCode == 200) {

                      this.importitemjsonData[i].SrNo = i + 1;
                      this.importitemjsonData[i].seqno = this.importitemjsonData[i][importitemheader[0]];
                      // this.importitemjsonData[i].articleNo = _itemsearcheddata.articleno;
                      // this.importitemjsonData[i].description = _itemsearcheddata.description;
                      this.importitemjsonData[i].itemType = response.data.data.itemtype;
                      // this.importitemjsonData[i].sapid = _itemsearcheddata.sapid;
                      // this.importitemjsonData[i].msq = _itemsearcheddata.msq;
                      this.importitemjsonData[i].moq = response.data.data.moq;
                      this.importitemjsonData[i].moq = response.data.data.moq;
                      // this.importitemjsonData[i].uom = _itemsearcheddata.uom;
                      this.importitemjsonData[i].price = Number(response.data.data.price);
                      // this.importitemjsonData[i].discountPer = this.importitemjsonData[i][importitemheader[4]];
                      // this.importitemjsonData[i].length = _itemsearcheddata.length;
                      this.importitemjsonData[i].factor = this.importitemjsonData[i][importitemheader[6]];
                      // this.importitemjsonData[i].lengthandfactor = _templengthandfactordata;
                      this.importitemjsonData[i].customerpartno = this.importitemjsonData[i][importitemheader[7]];
                      this.importitemjsonData[i].rowStatus = true;
                      this.importitemjsonData[i].Remarks = null;

                      // let _tempALPdata = this.importitemjsonData.find(x => x.articleNo == response.data.data.articleno);

                      // let _tempitemlevelcuttingcharges = 0;
                      // if (_tempALPdata.uom.toUpperCase() == 'M')
                      //   this.importitemjsonData[i].quantity = 0;
                      // else
                      //   this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];

                      // _tempALPdata.lengthandfactor.forEach(element => {
                      //   if (element.isDelete == 0 && element.isother == 1) {
                      //     element.cuttingcharges = _tempALPdata.itemType == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
                      //     _tempitemlevelcuttingcharges += Number(element.cuttingcharges);
                      //   }
                      //   this.importitemjsonData[i].quantity += element.qty
                      // });
                      // _tempALPdata.cuttingcharges = _tempitemlevelcuttingcharges;

                      if (this.importitemjsonData[i][importitemheader[3]] && !this.importitemjsonData[i][importitemheader[4]]) {
                        _tempALPdata.unitprice = this.importitemjsonData[i][importitemheader[3]];
                        _tempALPdata.netvalue = this.calculateTotalinItemPopupByUnitPrice(Number(this.importitemjsonData[i][importitemheader[3]]), Number(_tempALPdata.quantity));
                        _tempALPdata.discountPer = ((Number(response.data.data.price) - Number(this.importitemjsonData[i][importitemheader[3]])) * 100 / Number(response.data.data.price)).toFixed(2);
                      } else if (!this.importitemjsonData[i][importitemheader[3]] && this.importitemjsonData[i][importitemheader[4]]) {
                        _tempALPdata.unitprice = (Number(response.data.data.price) - ((Number(response.data.data.price) * Number(_tempALPdata.discountPer) / 100))).toFixed(2);
                        _tempALPdata.netvalue = this.calculateTotalinItemPopupByUnitPrice(Number(_tempALPdata.unitprice), Number(_tempALPdata.quantity));
                        _tempALPdata.discountPer = Number(this.importitemjsonData[i][importitemheader[4]]);
                      } else if (this.importitemjsonData[i][importitemheader[3]] && this.importitemjsonData[i][importitemheader[4]]) {
                        _tempALPdata.unitprice = this.importitemjsonData[i][importitemheader[3]];
                        _tempALPdata.netvalue = this.calculateTotalinItemPopupByUnitPrice(Number(this.importitemjsonData[i][importitemheader[3]]), Number(_tempALPdata.quantity));
                        _tempALPdata.discountPer = ((Number(response.data.data.price) - Number(this.importitemjsonData[i][importitemheader[3]])) * 100 / Number(response.data.data.price)).toFixed(2);
                      }

                      if (Number(this.importitemjsonData[i].quantity) < Number(response.data.data.moq)) {
                        this.importitemjsonData[i].rowStatus = false;
                        this.importitemjsonData[i].Remarks = `Quantity must be greater than or equal to MOQ ` + Number(response.data.data.moq) + `.`;
                      }
                    } else if (response.data && response.data.statusCode == 400) {
                      this.importitemjsonData[i].rowStatus = false;
                      this.importitemjsonData[i].Remarks = response.data.errormessage;
                    }
                  });
              }
            } else {
              this.importitemjsonData[i].SrNo = i + 1;
              this.importitemjsonData[i].articleNo = this.importitemjsonData[i][importitemheader[1]];
              this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];
              this.importitemjsonData[i].discountPer = this.importitemjsonData[i][importitemheader[4]];
              this.importitemjsonData[i].rowStatus = false;
              this.importitemjsonData[i].Remarks = 'Item not found.';
            }
          });
      }
    }
  }

  removeImportItemFile() {
    this.ImportItemFiles = null;
    this.ImportItemsfileUploaded = null;
  }

  async onImportItemSave(ItemStatusModal) {
    if (this.ValidateImportItemFile(true)) {
      await this.ValidateImportItemFileData();
      this.importItemStatus = this.importitemjsonData;

      this.modalService.open(ItemStatusModal, { size: 'lg' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  onProceedtoAddItem() {
    this.importItemStatus.forEach(element => {

      if (element.rowStatus == true) {

        let itemModel = {
          itemId: 0,
          itemSeqId: this.getSeqID(this.offerItemStd),
          seqno: element.seqno ? element.seqno : this.getSeqNo(),
          articleNo: element.articleNo,
          itemType: element.itemType,
          description: element.description,
          sapid: element.sapid,
          quantity: Number(element.quantity),
          msq: element.msq,
          moq: element.moq,
          uom: element.uom,
          enquiredquantity: Number(element.quantity),
          customerpartno: element.customerpartno,
          price: Number(element.price),
          unitprice: Number(element.unitprice),
          discountPer: Number(element.discountPer),
          netvalue: this.calculateTotalinItemPopupByUnitPrice(element.unitprice, element.quantity),
          catalogLink: '',
          isDelete: 0,
          length: element.length,
          lengthandfactor: element.lengthandfactor,
          cuttingcharges: element.cuttingcharges,
          files: [],
          filerefid: 0,
          documents: [],
          GrossMargin: 0,
          RMCGrossMargin: 0,
          TargetGrossMargin: 0
        }

        this.items = this.ItemsForm.get('items') as FormArray;
        this.items.push(this.createItem());

        this.offerItemStd.push(itemModel);
        if (this.offerItemStd.length > 0) {
          this.stdItem = true;
          this.offerInformationForm.headerleveldiscount.setValue(null);
        } else
          this.stdItem = false;
      }
    });

    this.updateTotalValues();
    this.modalService.dismissAll();
  }

  updateTotalValues() {
    this.totalnetvalue = 0;
    this.offerlevelcuttingcharges = 0;
    this.offerItemStd.forEach(element => {
      if (element.isDelete == 0) {
        this.totalnetvalue += Number(element.netvalue);
        this.offerlevelcuttingcharges += Number(element.cuttingcharges);
      }
    });
    // this.totalnetvalue += Number(this.itemsForm.freightcharges.value);
  }

  OpenSpecialTermsDeletePopup(index: number) {
    this.deleteConfirModel.index = index;
    this.modalService.open(this.specialtermsdeletemodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  OpenItemDeletePopup(index: number, id: number, articleno: string) {
    this.deleteConfirModel.index = index;
    this.deleteConfirModel.id = id;
    this.deleteConfirModel.articleno = articleno;
    this.modalService.open(this.stditemdeletemodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  OpenDeleteAllPopup() {
    this.modalService.open(this.itemdeleteallmodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onProductFinderClick() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.productfinder;
    FileSaver.saveAs(url, SampleEnum.productfinder);
  }

  onProductCatalogueClick() {
    window.open(Config.productcatalogue.url);
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
    var data = { searchValue: selectarticleno };
    this.modalRef.close();
    this.itemforEdit = true;
    this.stdItemForm.stditemCode.setValue(selectarticleno);
    this.isProductSearchFirst = true;
    this.productsearchValue = '';
    this.searchValue = selectarticleno;
    this.pageNumber = 1;
    this.onItemSearch(data);
  }

  onSelectProductClearClick() {
    this.itemforEdit = false;
    this.articleNo = null;
    this.stdItemSearched = null;
    this.msq = null;
    this.stdItemForm.stdItemName.setValue(null);
    this.stdItemForm.stdItemUOM.setValue(null);
    this.stdItemForm.stdItemMOQ.setValue(null);
    this.stdItemForm.ItemMOQ.setValue(null);
    this.qtydisable = false;
    this.lengthandfactorbtndisable = true;
    this.itemLengthList = [];
    this.stdItemForm.enquiredquantity.setValue(null);
    this.stdItemForm.stdItemQty.setValue(null);
    this.stdItemForm.stdItemPrice.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.seqno.setValue(null);

    if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
      this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
    else
      this.stdItemForm.itemDiscount.setValue(null);

    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.stdItemCatalog.setValue(null);
    this.stdItemForm.customerpartno.setValue(null);
    this.stdItemForm.itemtotal.setValue(null);
    this.ItemCatalogue = null;
    this.LengthandFactordata = [];
    this.isItemReady = true;
    this.itemErrorMessage = null;
    this.submitted = false;
  }

  onIncoTermsChange(event) {
    if (event) {
      if (event.code == 'EXW' || event.code == 'CFR' || event.code == 'CIF' || event.code == 'FOB') {
        this.isShowFromToLocation = true;
        this.offerInformationForm.fromlocation.setValidators(Validators.required);
        this.offerInformationForm.tolocation.setValidators(Validators.required);
        this.getFromlocation();
        this.getTolocation();
      } else {
        this.isShowFromToLocation = false;
        this.offerInformationForm.fromlocation.clearValidators();
        this.offerInformationForm.tolocation.clearValidators();
      }
    } else {
      this.offerInformationForm.incoterms.setValue('DD');
      this.isShowFromToLocation = false;
      this.offerInformationForm.fromlocation.clearValidators();
      this.offerInformationForm.tolocation.clearValidators();
    }
  }

  getFromlocation() {
    this.offersService.getFromlocation().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.fromlocationList = response.responsedata.data;
        else
          this.fromlocationList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getTolocation() {
    this.offersService.getTolocation().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.tolocationList = response.responsedata.data;
        else
          this.tolocationList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onFromLocationChange() {
    if (this.offerInformationForm.fromlocation.value && this.offerInformationForm.fromlocation.value.length > 0 && this.offerInformationForm.tolocation.value && this.offerInformationForm.tolocation.value.length > 0) {
      this.getcuttingcharges();
    }
  }

  onToLocationChange() {
    if (this.offerInformationForm.fromlocation.value && this.offerInformationForm.fromlocation.value.length > 0 && this.offerInformationForm.tolocation.value && this.offerInformationForm.tolocation.value.length > 0) {
      this.getcuttingcharges();
    }
  }

  getcuttingcharges() {
    this.offersService.getcuttingcharges(this.offerID, this.offerInformationForm.fromlocation.value, this.offerInformationForm.tolocation.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.freightcharge = response.responsedata.data[0].freightcharge;
          this.stdcuttingchargesvalue = response.responsedata.data[0].stdcuttingchargesvalue;
          this.stdcuttingcurrency = response.responsedata.data[0].stdcuttingcurrency;
          this.stdcuttingchargesfinal = response.responsedata.data[0].stdcuttingchargesfinal;
          this.trdcuttingchargesvalue = response.responsedata.data[0].trdcuttingchargesvalue;
          this.trdcuttingcurrency = response.responsedata.data[0].trdcuttingcurrency;
          this.trdcuttingchargesfinal = response.responsedata.data[0].trdcuttingchargesfinal;
          this.EURrate = response.responsedata.data[0].EURrate;
          this.USDrate = response.responsedata.data[0].USDrate;

          if (this.offerItemStd && this.offerItemStd.length > 0) {
            this.offerlevelcuttingcharges = 0;
            this.offerItemStd.forEach(element => {
              element.cuttingcharges = 0;
              element.lengthandfactor.forEach(element2 => {
                if (element2.isDelete == 0 && element2.isother == 1) {
                  element2.cuttingcharges = element.itemType == 'STD' ? Number(element2.factor) * Number(this.stdcuttingchargesfinal) : Number(element2.factor) * Number(this.trdcuttingchargesfinal)
                  element.cuttingcharges += Number(element2.cuttingcharges);
                }
              });
              this.offerlevelcuttingcharges += Number(element.cuttingcharges);
            });
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }




  converttocurrency(value: any) {
    if (Number(value)) {
      if (this.offerInformationForm.currencyType.value && this.offerInformationForm.currencyType.value.length > 0) {
        if (this.offerInformationForm.currencyType.value == 'USD' && this.USDrate) {
          return (Number(value) / this.USDrate).toFixed(2);
        } else if (this.offerInformationForm.currencyType.value == 'EUR' && this.EURrate) {
          return (Number(value) / this.EURrate).toFixed(2);
        } else {
          return Number(value).toFixed(2);
        }
      }
    } else {
      return value;
    }
  }

  finddiscountper(discountPer: any, decimal: number) {
    return (Number(discountPer) + ((100 - Number(discountPer)) * this.DealerCommisionPer / 100)).toFixed(decimal);
  }

  findnetunitprice(unitprice: number, quantity: number) {
    return Number(Number(unitprice - (unitprice * this.DealerCommisionPer / 100)).toFixed(2)) * quantity;
    // (stditem.unitprice - (stditem.unitprice * DealerCommisionPer / 100)) * stditem.quantity)
  }

  onCurrencyChange(event: any) {
    if (event) {
      this.currencycode = this.offerInformationForm.currencyType.value;
    } else {
      this.offerInformationForm.currencyType.setValue('INR');
      this.currencycode = 'INR';
    }

    this.OfferFreightCharges = 0;
    this.itemsForm.freightcharges.setValue(0);
  }




  onHeaderLevelDiscountChange() {
    if (this.offerItemStd && this.offerItemStd.length > 0) {
      this.offerItemStd.forEach(element => {
        element.discountPer = Number(this.offerInformationForm.headerleveldiscount.value)
        element.unitprice = (Number(element.price) - ((Number(element.price) * Number(element.discountPer) / 100))).toFixed(2);
      });
      this.reviseItemCalculation();
    }
  }

  reviseItemCalculation() {
    if (this.offerItemStd && this.offerItemStd.length > 0) {
      this.offerItemStd.forEach(element => {
        element.netvalue = Number((element.unitprice * element.quantity).toFixed(2))
      });

      this.updateTotalValues();
    }
  }

  onFreightChagesChange() {
    if (this.currencycode == 'USD') {
      this.OfferFreightCharges = Number((Number(this.itemsForm.freightcharges.value) * Number(this.USDrate)).toFixed(2));
    } else if (this.currencycode == 'EUR') {
      this.OfferFreightCharges = Number((Number(this.itemsForm.freightcharges.value) * Number(this.EURrate)).toFixed(2));
    } else if (this.currencycode == 'INR') {
      this.OfferFreightCharges = Number(this.itemsForm.freightcharges.value);
    }
    // this.totalnetvalue += Number(this.itemsForm.freightcharges.value);
    // this.updateTotalValues();
  }

  isValidMOQ(item: any) {
    return Config.isValidMOQ(item);
  }

  async onStockSearch(isimport: boolean, articles: any) {
    if (isimport) {
      this.importitemsstockdata = null;
      await this.stockorderService.StockAvailability(articles, isimport, false).then(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.importitemsstockdata = response.responsedata.data;
          } else if (response.responsedata && response.responsedata.statusCode == 400) {
            this.notificationService.showError(response.responsedata.message);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    }
  }

  setFileTypeIcon(filetype: any) {
    let fileicon = "icon-note.svg";
    if (filetype == 'application/pdf') {
      fileicon = "icon-pdf.svg"
    } else if (filetype == 'image/png' || filetype == 'image/gif' || filetype == 'image/jpeg' || filetype == 'image/jpg' || filetype == 'image/bmp') {
      fileicon = "icon-images.svg";
    } else if (filetype == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      fileicon = "icon-docs.svg";
    } else if (filetype == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
      fileicon = "icon-excel.svg";
    }
    return fileicon;
  }
}