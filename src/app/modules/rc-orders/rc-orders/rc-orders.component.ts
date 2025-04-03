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
import { StockorderService } from 'src/app/core/services/stockorder/stockorder.service';
import { ApprovalStatusEnum } from '@core/enums/approvalstatus.enum';
import { OfferStatusEnum } from '@core/enums/offerstatus.enum';
import { NgSelectComponent } from '@ng-select/ng-select/lib/ng-select.component';
import { RatecontractService } from '@core/services/masters/ratecontract.service';
import { RcOrdersService } from '@core/services/rc-orders/rc-orders.service';
import { CustomerService } from '@core/services/masters/customer.service';
import { NotificationService } from '@core/services/common/notification.service';
import { LookupService } from '@core/services/common/lookup.service';

@Component({
  selector: 'app-rc-orders',
  templateUrl: './rc-orders.component.html',
  styleUrls: ['./rc-orders.component.css']
})
export class RcOrdersComponent implements OnInit {

  OfferInformationForm: FormGroup;
  // AccountContactDetail: FormGroup;
  TermsandConditionForm: FormGroup;
  // SpecialTextForm: FormGroup;
  ItemsForm: FormGroup;
  StdItemForm: FormGroup;
  RejForm: FormGroup;
  confrmForm: FormGroup;
  LengthandFactorForm: FormGroup;
  // OtherForm: FormGroup;
  ManagePOForm: FormGroup;
  ImportItemsForm: FormGroup;
  // AdditionalFieldsForm: FormGroup;
  RejectForm: FormGroup;
  ApproveForm: FormGroup;
  SOnoForm: FormGroup;
  CPOValidatorForm: FormGroup;
  // ItemAdditionalFieldsForm: FormGroup;
  // CuttingChargesForm: FormGroup;
  // NaceDetailForm: FormGroup;

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
  // sap_id: any;
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
  items: FormArray;
  summaryTotalAmount: number = 0;
  summaryNetAmount: number = 0;
  userid: number;
  userSAPId: string;
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
  pofiles: any[] = [];
  stdItemEdit: boolean = false;
  offerValidMaxdate: any;
  offerValidMindate: any;
  orderId: number = 0;
  orderNo: string = '';
  todayMinDate: { year: number; month: number; day: number };
  rcOrderMaxDate: { year: number; month: number; day: number };
  offervalidfromDate: { year: number; month: number; day: number };
  offervalidtoDate: { year: number; month: number; day: number };
  poDate: { year: number; month: number; day: number };
  CustomerPODate: { year: number; month: number; day: number };
  reqdeliveryDate: { year: number; month: number; day: number };
  itemreqdeliveryDate: { year: number; month: number; day: number };
  pricingDate: { year: number; month: number; day: number };
  firstDate: { year: number; month: number; day: number };
  lengthreqdeliveryDate: { year: number; month: number; day: number };
  offerItemStd: any[] = [];
  articleno: string = '';
  itemsapid: string = '';
  todayDate: any;
  futureDate: any;
  approvaldata: any;
  otherDataId: number;
  salesId: number;
  itemforEdit: boolean = false;
  offerStatus: any[] = [];
  itemLengthList: any[] = [];
  itemCutLengthList: any[] = [];
  itemFactorList: any[] = [];
  LengthandFactordata: any[] = [];
  LengthandFactordataDelete: any[] = [];
  modalRef: any;
  itemtype: string;
  itemMaxDiscount: number;
  isItemExpire: boolean = false;
  specialtextdata: any[] = [];
  specialtextid: number = null;
  lengthandfactorbtndisable: boolean = true;
  totalnetvalue: number = 0;
  isRecommend: boolean = false;
  specialtextindex: number;
  itemindex: number;
  seqid: number;
  itemid: number;
  lengthandfactorid: number;
  // isOfferIndirect: boolean = false;
  offerdata: any = {};
  offerInformation: number = 0;
  approvedandrejectedby: number = 0;
  FMapproveandreject: number = 0;
  termsandcondition: number = 0;
  managepo: number = 0;
  cpovalidator: number = 0;
  additionalfields: number = 0;
  // managepo: number = 0;
  orderstatus: number = 0;
  saperror: number = 0;
  poId: number;
  isInitiateSOChecked: boolean = false;
  selectedRC: number = 0;
  deletedItem: boolean = false;
  offerDeletedItem: any[] = [];
  ImportItemFiles: any;
  worksheet: XLSX.WorkSheet;
  importitemjsonData: any[] = [];
  ImportItemsfileUploaded: any;
  storeData: any;
  importItemStatus: any[] = [];
  @ViewChild('ImportItems', { static: false }) ImportItems: any;
  @ViewChild('stditemdeletemodel', { static: false }) stditemdeletemodel: any;
  @ViewChild('ProductSearchModel', { static: false }) ProductSearchModel: any;
  @ViewChild('itemdeleteallmodel', { static: false }) itemdeleteallmodel: any;
  @ViewChild('RCItemsModel', { static: false }) RCItemsModel: any;
  @ViewChild('TermsModel', { static: false }) TermsModel: any;
  @ViewChild('Selecter', { static: false }) ngselect: NgSelectComponent;
  deleteConfirModel = Object();
  filesperitem: number;
  filesize: number;
  converttoYMD: string = 'yyyy-MM-dd';
  isItemReady: boolean = true;
  itemErrorMessage: string = '';
  offerdirectpdf: string = 'Offer PDF - Customer';
  offerindirectpdf: string = 'Offer PDF - Dealer';
  importitemheaderList: string[];
  PaymentTermsValue: string;
  ReasonforClone: string;
  SpecialTermTitle: string;
  SpecialTermDescription: string;
  InitiateSOComment: string;
  RejectReason: string;
  isRefrenceOffer: boolean = false;
  offerapprovaldata: any[] = [];
  incotermsList: any[] = [
    { code: "CCA", articledesc: 'Godown del consignee copy attn' },
    { code: "DCC", articledesc: 'DoorDelivery ag Consignee Copy' },
    { code: "DD", articledesc: 'Door Delivery' },
    { code: "GD", articledesc: 'Godown Delivery' }];

  isOfferOpen: boolean = false;
  packingmaterialtypeList: any[] = [];
  additionalfieldId: number;
  specialtextdeletedata: any[] = [];
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
  isShowExtraLength: boolean = false;
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
  tolocationList: any[] = [];
  isShowItemMargin: boolean = false;
  isShowItemRMCGrossMargin: boolean = false;
  isShowOverallMargin: boolean = false;
  isShowOverallRGroupMargin: boolean = false;
  shiptopartyList: any[] = [];
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
  usertype: number;
  isdealer: boolean;
  EURrate: number = 0;
  USDrate: number = 0;
  itemGrossMargin: any;
  itemTGrossMargin: any;
  itemRGrossMargin: any;
  DataSheets: any[] = [];
  OfferFreightCharges: number = 0;
  OrderType: number = 20;
  optStockOrder: boolean = true;
  optCPOOrder: boolean = false;
  optCompleteDlvNo: boolean = true;
  optCompleteDlvYes: boolean = false;
  StockData: any[] = [];
  AccountsList: any[] = [];
  ItemStockValue: number = 0;
  isFMApprovalReq: boolean = false;
  FMApprovalData: any[] = [];
  isOfferOpenforFM: boolean = false;
  itemCuttingChargesId: number = 0;
  importitemsstockdata: any;
  OrderStockData: any[] = [];
  isFactorError: boolean = false;
  isItemStockdataAvailable: boolean;
  showpclength: boolean = false;
  SelectedEndCustomerId: string = "";
  SelectedEndCustomer: string = "";
  ratecontracts: any[] = [];
  rcDetail: any;
  rcHeader: any;
  rcItems: any[] = [];
  SelectedRCItems: any[] = [];
  selectedItem: any;
  RCOrderAdditionalField: any;
  isOrderIndirect: boolean = false;
  customerData: any;
  orderFromRC: boolean = false;
  priceBasedonList: any[] = [
    { code: 10, description: 'LME' },
    { code: 20, description: 'Fixed' },
    { code: 30, description: 'ALP' },
    { code: 40, description: 'LCP(Cash Settlement)' },
  ];
  verticals: any[] = [];
  segments: any[] = [];

  createItem(): FormGroup {
    return this.formBuilder.group({
      stditemCode: '',
      stdItemName: '',
      stdItemUOM: '',
      stdItemMOQ: '',
      stdItemPCLength: '',
      ItemMOQ: '',
      stdItemPrice: '',
      lengthandfactor: '',
      stdItemQty: '',
      itemunitnetprice: '',
      enquiredquantity: '',
      seqno: '',
      itemstock: '',
      // importby: ''
    });
  }

  @ViewChild('acc', { static: true }) acc: NgbAccordion;

  constructor(
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private offersService: OffersService,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
    private productmasterService: ProductmasterService,
    private stockorderService: StockorderService,
    private ratecontractService: RatecontractService,
    private rcOrdersService: RcOrdersService,
    private customerService: CustomerService,
    private notificationService: NotificationService,
    private lookupService: LookupService
  ) { }

  get offerInformationForm() { return this.OfferInformationForm.controls }
  // get accountContactDetail() { return this.AccountContactDetail.controls }
  get itemsForm() { return this.ItemsForm.controls }
  get stdItemForm() { return this.StdItemForm.controls }
  // get specialTextForm() { return this.SpecialTextForm.controls }
  get lengthandFactorForm() { return this.LengthandFactorForm.controls }
  // get otherForm() { return this.OtherForm.controls }
  get termsandConditionForm() { return this.TermsandConditionForm.controls }
  get importItemsForm() { return this.ImportItemsForm.controls }
  get rejectForm() { return this.RejectForm.controls }
  get approveForm() { return this.ApproveForm.controls }
  get managePOForm() { return this.ManagePOForm.controls }
  get sonoForm() { return this.SOnoForm.controls }
  get cpovalidatorForm() { return this.CPOValidatorForm.controls }
  // get itemAdditionalFieldsForm() { return this.ItemAdditionalFieldsForm.controls }
  // get cuttingChargesForm() { return this.CuttingChargesForm.controls }
  // get naceDetailForm() { return this.NaceDetailForm.controls }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.orderId = parms['id'];
      this.selectedRC = parms['rcId'];
      this.OrderType = parms['type'];
    });

    this.onLoad();
  }

  private onLoad() {
    // this.GetNaceCodeList();

    this.dateformate = this.authService.getDateFormat();
    this.userid = this.authService.getUserId();
    this.userSAPId = this.authService.getUserSAPId();
    this.username = this.authService.getUserName();
    this.userrolecode = this.authService.getUserRoleCode();
    this.usertype = this.authService.getCurrentUser().usertype;
    this.isdealer = this.authService.getCurrentUser().isdealer;
    this.offerdata.TotalGrossMargin = 0;
    // this.offerdata.TotalRMCGrossMargin = 0;
    this.offerdata.TotalTargetGrossMargin = 0;
    // if (this.authService.getUserRoleCode() == 'BL' || this.authService.getUserRoleCode() == 'PM' || this.authService.getUserRoleCode() == 'BH' || this.authService.getUserRoleCode() == 'HoS' || this.authService.getUserRoleCode() == 'MD' || this.authService.getUserRoleCode() == 'FM' || this.authService.getUserRoleCode() == 'Channel Head' || this.authService.getUserRoleCode() == 'Admin') {
    //   this.isShowItemMargin = true;
    //   this.isShowOverallMargin = true;
    // } else {
    //   this.isShowItemMargin = false;
    //   this.isShowOverallMargin = false;
    // }

    // if (this.authService.getUserRoleCode() == 'TL' || this.authService.getUserRoleCode() == 'BL' || this.authService.getUserRoleCode() == 'PM' || this.authService.getUserRoleCode() == 'BH' || this.authService.getUserRoleCode() == 'HoS' || this.authService.getUserRoleCode() == 'MD' || this.authService.getUserRoleCode() == 'FM' || this.authService.getUserRoleCode() == 'Channel Head' || this.authService.getUserRoleCode() == 'Admin') {
    //   this.isShowOverallMargin = true;
    // } else {
    //   this.isShowOverallMargin = false;
    // }

    // if (this.authService.getUserRoleCode() == 'BH' || this.authService.getUserRoleCode() == 'HoS' || this.authService.getUserRoleCode() == 'MD' || this.authService.getUserRoleCode() == 'FM' || this.authService.getUserRoleCode() == 'Channel Head' || this.authService.getUserRoleCode() == 'Admin') {
    //   this.isShowOverallRGroupMargin = true;
    // } else {
    //   this.isShowOverallRGroupMargin = false;
    // }

    this.todayDate = moment().format('DD/MM/YYYY');
    this.futureDate = moment().add(3, 'M').format('DD/MM/YYYY');
    this.todayMinDate = this.convertDate(this.todayDate);
    this.rcOrderMaxDate = this.convertDate(this.futureDate);
    this.offervalidfromDate = this.convertDate(this.todayDate);
    this.offervalidtoDate = this.convertDate(this.futureDate);
    this.offerValidMaxdate = this.offervalidtoDate;
    this.offerValidMindate = this.offervalidfromDate;
    // this.reqdeliveryDate = this.convertDate(this.todayDate);
    this.pricingDate = this.convertDate(this.todayDate);
    this.firstDate = this.convertDate(this.todayDate);
    this.poDate = this.convertDate(this.todayDate);
    this.CustomerPODate = this.convertDate(this.todayDate);
    this.filesperitem = Config.getItemsFile.NumberofFiles + 1;
    this.filesize = Config.getItemsFile.filesize;
    this.onbuildForm();

    this.loadPageMode();
    this.disableFields();
    // this.getFromlocation();
    // this.getTolocation();

    // this.onOrderOptionChange(this.OrderType);

    this.managePOForm.podate.setValue(this.todayDate);
    // this.managePOForm.customerpodate.setValue(this.todayDate);
    this.currencycode = 'INR';
  }

  private onbuildForm() {
    this.OfferInformationForm = this.formBuilder.group({
      soldtoparty: [null, [Validators.required]],
      soldtopartyname: [''],
      soldstreet1: [''],
      soldstreet2: [''],
      solddistrict: [''],
      soldcity: [''],
      soldpostalcode: [''],
      soldregion: [''],
      shiptoparty: [null, [Validators.required]],
      shiptopartyname: [''],
      shipstreet1: [''],
      shipstreet2: [''],
      shipdistrict: [''],
      shipcity: [''],
      shippostalcode: [''],
      shipregion: [''],
      // vertical: ['', [Validators.required]],
      // segment: ['', [Validators.required]],
      // delearcommission: [''],
      incoterms: ['DD', [Validators.required]],
      // reasonforclone: [null],
      // industry: [null],
      // headerleveldiscount: [''],
      // completedlv: [''],
      // importby: [null],
      // sbuoforder: [''],
      // mrotype: [null],
      // account: [null],
      reqdeliverydate: [null, [Validators.required]],
      nacecode: [null],
      nacelevel: [null],
      businessmodel: [null],
      dealercommission: [null],
      account: [null],
      pricebasedon: [null],
      specialinstruction: [''],
      vertical: [null],
      segment: [null]
    });

    // this.AccountContactDetail = this.formBuilder.group({
    //   contactsearch: [null]
    // });

    this.TermsandConditionForm = this.formBuilder.group({
      paymentterms: [null]
    });

    // this.SpecialTextForm = this.formBuilder.group({
    //   addspecialtexttype: ['', [Validators.required]],
    //   addspecialtextdescription: ['', [Validators.required]]
    // });

    this.LengthandFactorForm = this.formBuilder.group({
      itemLength: [[], [Validators.required]],
      otherLength: [null],
      itemFactor: ['', [Validators.required]],
      lfqty: [''],
      extraLength: [null],
      lengthreqdeliverydate: ['', [Validators.required]]
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
      enquiredquantity: [''],
      stdItemMOQ: [''],
      stdItemPCLength: [''],
      ItemMOQ: [''],
      ItemMDQ: [''],
      stdItemPrice: [''],
      stdItemCatalog: [''],
      stdItemQty: ['', [Validators.required]],
      itemunitnetprice: ['', [Validators.required]],
      itemDiscount: [''],
      customerpartno: [''],
      itemtotal: [''],
      seqno: [''],
      itemreqdeliverydate: [null, [Validators.required]],
      itemstock: [''],
      // importby: ['']
    });

    this.ImportItemsForm = this.formBuilder.group({
    });

    this.RejectForm = this.formBuilder.group({
      rejectreason: [null, [Validators.required]]
    });

    this.ApproveForm = this.formBuilder.group({
      approvereason: [null, [Validators.required]]
    });

    this.ManagePOForm = this.formBuilder.group({
      ponumber: [''],
      podate: [''],
      customerponumber: [''],
      // customerpodate: ['']
    });

    this.SOnoForm = this.formBuilder.group({
      sono: ['', [Validators.required]]
    });

    this.CPOValidatorForm = this.formBuilder.group({
      cpocomment: ['', [Validators.required]]
    });

    // this.ItemAdditionalFieldsForm = this.formBuilder.group({
    //   iafItemno: [null],
    //   iafArticleno: [null],
    //   iafQuantity: [null],
    //   iafunitprice: [null],
    //   reqdeliverydate: [null],
    //   cuttingcharges: [null]
    // });

    // this.CuttingChargesForm = this.formBuilder.group({
    //   itemcuttingcharges: [null, [Validators.required]]
    // });

    // this.NaceDetailForm = this.formBuilder.group({
    //   nacecode: [null],
    //   articledesc: [null],
    //   level: [null],
    //   model: [null],
    //   businessmodel: [null]
    // });
  }

  private loadPageMode() {
    let currentUrl = this.router.url;
    this.getLookupDatas();

    if (currentUrl.includes('add') && !currentUrl.includes('refrenceorder') && !this.selectedRC) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      this.managePageSection(0, 1);
      // let id: string = '';
      // this.activatedRoute.params.subscribe(parms => {
      //   id = parms['id'];
      // });
      this.orderId = 0;
      this.getRateContracts();
    } else if (currentUrl.includes('add') && !currentUrl.includes('refrenceorder') && this.selectedRC > 0) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      this.managePageSection(0, 1);
      this.orderId = 0;
      this.orderFromRC = true;
      this.getRCDetail();
    } else if (currentUrl.includes('edit')) {
      this.isAdd = false;
      this.isEdit = true;
      this.isView = false;
      this.getOrdersDetail(this.orderId, false);
    } else if (currentUrl.includes('add') && currentUrl.includes('refrenceorder')) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      this.isRefrenceOffer = true;
      this.managePageSection(0, 1);
      this.getOrdersDetail(this.orderId, true);
    }

    this.getcuttingcharges();
  }

  viewClicked(oppid: string) {
    this.router.navigate(['/opportunities/view/' + oppid]);
  }

  private disableFields() {
    if (this.isView) {
      // this.offerInformationForm.offersValidfrom.disable();
      // this.offerInformationForm.offersValidto.disable();
      // this.offerInformationForm.currencyType.disable();
      // this.offerInformationForm.offerType.disable();
    } else if (this.isEdit) {
      // this.offerInformationForm.offersValidfrom.disable();
      // this.offerInformationForm.offersValidto.disable();
    }
    // this.offerInformationForm.nacecode.disable();
    // this.offerInformationForm.vertical.disable();

    this.offerInformationForm.soldtoparty.disable();
    this.offerInformationForm.shiptoparty.disable();

    if (this.OrderType == 30) {
      this.offerInformationForm.vertical.disable();
      this.offerInformationForm.segment.disable();
    }
  }

  // onOrderOptionChange(type: any) {
  //   // 20: stock order, 30: CPO Order
  //   if (type == 20) {
  //     this.optStockOrder = true;
  //     this.optCPOOrder = false;
  //     this.OrderType = Number(type);
  //     // this.isOfferIndirect = false;
  //     this.offertypechange(this.OrderType);
  //   } else if (type == 30) {
  //     this.optStockOrder = false;
  //     this.optCPOOrder = true;
  //     this.OrderType = Number(type);
  //     // this.isOfferIndirect = true;
  //     this.offertypechange(this.OrderType);
  //   }
  //   // this.UpdateFieldValidators();
  // }

  private UpdateFieldValidators(issubmit: boolean) {
    if (issubmit) {
      this.offerInformationForm.soldtoparty.setValidators(Validators.required);
      this.offerInformationForm.shiptoparty.setValidators(Validators.required);
      this.offerInformationForm.incoterms.setValidators(Validators.required);
      this.offerInformationForm.reqdeliverydate.setValidators(Validators.required);
      this.managePOForm.ponumber.setValidators(Validators.required);
      this.managePOForm.podate.setValidators(Validators.required);

      if (this.isOrderIndirect)
        this.managePOForm.customerponumber.setValidators(Validators.required);
      else
        this.managePOForm.customerponumber.clearValidators();
    } else {
      this.offerInformationForm.soldtoparty.clearValidators();
      this.offerInformationForm.shiptoparty.clearValidators();
      this.offerInformationForm.incoterms.clearValidators();
      this.offerInformationForm.reqdeliverydate.clearValidators();
      this.managePOForm.ponumber.clearValidators();
      this.managePOForm.podate.clearValidators();
      this.managePOForm.customerponumber.clearValidators();
    }

    this.offerInformationForm.soldtoparty.updateValueAndValidity();
    this.offerInformationForm.shiptoparty.updateValueAndValidity();
    this.offerInformationForm.incoterms.updateValueAndValidity();
    this.offerInformationForm.reqdeliverydate.updateValueAndValidity();
    this.managePOForm.ponumber.updateValueAndValidity();
    this.managePOForm.podate.updateValueAndValidity();
    this.managePOForm.customerponumber.updateValueAndValidity();
  }

  onPODateSelection(date) {
    let podate = new Date(date.year, date.month - 1, date.day).toString();
    podate = this.validateandConvertDatetoFormat(podate);
    this.managePOForm.podate.setValue(podate);
  }

  onReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.validateandConvertDatetoFormat(reqdeliverydate);
    this.offerInformationForm.reqdeliverydate.setValue(reqdeliverydate);

    if (this.offerItemStd && this.offerItemStd.length > 0) {
      this.offerItemStd.forEach(element => {
        if (!element.reqdlvdate)
          element.reqdlvdate = reqdeliverydate;

        element.lengthandfactor.forEach(element2 => {
          if (!element2.lengthreqdeliverydate)
            element2.lengthreqdeliverydate = element.reqdlvdate;
        });
      });
    }
  }

  onitemReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.validateandConvertDatetoFormat(reqdeliverydate);
    // this.itemreqdeliveryDate = reqdeliverydate;
    this.stdItemForm.itemreqdeliverydate.setValue(reqdeliverydate);
  }

  onLengthReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.validateandConvertDatetoFormat(reqdeliverydate);
    this.lengthandFactorForm.lengthreqdeliverydate.setValue(reqdeliverydate);
  }

  getOrdersDetail(id: number, isclone: boolean) {
    this.rcOrdersService.OrderDetails(id, isclone).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.rcOrderHeader) {
            this.offerdata = response.responsedata.data.rcOrderHeader;
            this.orderNo = this.offerdata.orderno;
            this.currencycode = "INR";
            this.selectedRC = this.offerdata.rcid;
            this.disableFields();
            this.userSAPId = this.offerdata.soldtoparty;
            this.getRateContracts();
            this.offerInformationForm.incoterms.setValue(this.offerdata.incoterms);

            if (this.isRefrenceOffer) {
              this.offerInformationForm.reasonforclone.setValue(null);
              this.ReasonforClone = '';
              this.offerInformationForm.reasonforclone.setValidators(Validators.required);
              this.offerInformationForm.reasonforclone.updateValueAndValidity();
            } else if (this.offerdata.RefOfferId) {
              this.offerInformationForm.reasonforclone.setValue(this.offerdata.reasonforclone);
              this.ReasonforClone = this.offerdata.reasonforclone;
            }

            if (this.offerdata.reqdlvdate && !this.offerdata.reqdlvdate.includes("0000-00-00")) {
              this.reqdeliveryDate = this.convertDate(this.validateandConvertDatetoFormat(this.offerdata.reqdlvdate));
              this.offerInformationForm.reqdeliverydate.setValue(this.validateandConvertDatetoFormat(this.offerdata.reqdlvdate));
            }

            if (this.offerdata.errors && this.offerdata.errors.length > 0) {
              this.soerror = this.offerdata.errors;
              this.isSOError = true;
            }

            this.OfferFiles = response.responsedata.data.rcDocs;
            if (response.responsedata.data.rcOrderItems.length > 0) {
              this.stdItem = true;
              this.offerItemStd = response.responsedata.data.rcOrderItems;
              let i = 0;
              this.offerItemStd.forEach(element => {
                i += 1;
                element.itemSeqId = i;
                element.discount = Number((element.discount * 100).toFixed(2));
                element.documents = [];
                element.reqdlvdate = this.validateandConvertDatetoFormat(element.reqdlvdate);

                element.lengthandfactor.forEach(element2 => {
                  element2.isdelete = 0;

                  if (element2.lengthreqdeliverydate && !element2.lengthreqdeliverydate.includes("0000-00-00"))
                    element2.lengthreqdeliverydate = this.validateandConvertDatetoFormat(element2.lengthreqdeliverydate);
                  else
                    element2.lengthreqdeliverydate = element.reqdlvdate ? element.reqdlvdate : null;
                });

                if (element.uom.toUpperCase() == 'PC' && element.length)
                  element.pclength = element.length.split('|')[0];

                if (element.length)
                  element.length += '|Cut Length';
                else
                  element.length = 'Cut Length';
              });
              this.updateTotalValues();
            }

            this.isShowOverallRGroupMargin = response.responsedata.data.uiinfo.ShowTotalRMCGrossMargin;
            this.isShowOverallMargin = response.responsedata.data.uiinfo.ShowTotalGrossMargin;

            this.isShowItemMargin = response.responsedata.data.uiinfo.ShowItemMargin;
            this.isShowItemRMCGrossMargin = response.responsedata.data.uiinfo.ShowItemRMCGrossMargin;

            // this.isFMApprovalReq = (this.totalnetvalue - (this.totalnetvalue * this.DealerCommisionPer / 100)) > Config.fmapproval.amount;

            if (response.responsedata.data.rcOrderDeleteditems.length > 0) {
              this.deletedItem = true;
              this.offerDeletedItem = response.responsedata.data.rcOrderDeleteditems;

              this.offerDeletedItem.forEach(element => {
                element.discount = Number((element.discount * 100).toFixed(2));
                element.reqdlvdate = this.validateandConvertDatetoFormat(element.reqdlvdate);

                element.lengthandfactor.forEach(lengthfactor => {
                  if (lengthfactor.lengthreqdeliverydate && !lengthfactor.lengthreqdeliverydate.includes("0000-00-00"))
                    lengthfactor.lengthreqdeliverydate = this.validateandConvertDatetoFormat(lengthfactor.lengthreqdeliverydate);
                  else
                    lengthfactor.lengthreqdeliverydate = element.reqdlvdate ? element.reqdlvdate : null;
                });
              });
            }

            // if (this.isRefrenceOffer) {
            //   this.offerdata.Status = 0;
            //   this.offerdata.IsActive = 1;
            // }

            this.setStatus(this.offerdata.status);

            this.managePageSection(this.offerdata.status, this.offerdata.active);

            if (this.offerInformation == 1) {
              // this.offerInformationForm.soldtoparty.disable();
              this.offerInformationForm.shiptoparty.disable();
              // this.offerInformationForm.vertical.disable();
              // this.offerInformationForm.segment.disable();
              this.offerInformationForm.incoterms.disable();
              this.offerInformationForm.reqdeliverydate.disable();



              this.stdItemForm.itemreqdeliverydate.disable();
              // this.stdItemForm.importby.disable();

              // this.termsandConditionForm.paymentterms.disable();
              this.managePOForm.podate.disable();
              // this.managePOForm.customerpodate.disable();
            }

            this.managepodata = response.responsedata.data.rcOrderPO[0];
            this.setPOData(this.managepodata);

            // this.ItemAdditionalFieldsList = response.responsedata.data.orderdetail.itemadditionalfields;

            // if (this.FMapproveandreject >= 1 && this.isFMApprovalReq) {
            //   this.getFMApprovalData();
            // }

            this.InitiateSOComment = this.offerdata.cpovalidatorcomment;
            this.RCOrderAdditionalField = response.responsedata.data.rcAdditionalField;
            this.setAdditionalFieldData();

            if (this.offerdata.status == 80) {
              this.sonumber = this.offerdata.sosapid;

              // this.itemAdditionalFieldsForm.reqdeliverydate.disable();
            }
            this.GetSoldtoPartyList(this.offerdata.soldtoparty);
            this.GetShiptoPartyList();
            this.getRCDetail();
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setApprovaldatastatus(approvaldatalist: any) {
    approvaldatalist.forEach(element => {
      if (element.status == 10)
        element.showstatus = ApprovalStatusEnum.ten;
      else if (element.status == 30)
        element.showstatus = ApprovalStatusEnum.thirty;
      else if (element.status == 50)
        element.showstatus = ApprovalStatusEnum.fifty;
      else
        element.showstatus = '';
    });

    return approvaldatalist;
  }

  private setPOData(data: any) {
    this.poId = data.id;
    this.managePOForm.ponumber.setValue(data.ponumber);
    this.managePOForm.customerponumber.setValue(data.customerponumber);
    this.poDate = this.convertDate(this.validateandConvertDatetoFormat(data.podate));
    this.managePOForm.podate.setValue(this.validateandConvertDatetoFormat(data.podate));

    this.pofiles = data.files ? data.files : [];
  }

  getFMApprovalData() {
    this.stockorderService.getFMApprovalData(this.orderId).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.FMApprovalData = response.responsedata.data.fmapprovaldata;

          this.FMApprovalData.forEach(element => {
            element.requesteddate = Config.getDBdatetimeToDateTime(element.requesteddate);
            element.statusdate = Config.getDBdatetimeToDateTime(element.statusdate);
          });

          this.isOfferOpenforFM = response.responsedata.data.uiinfo.showapproverejectbutton;
          // let checkofferopen = this.FMApprovalData.find(x => x.userid == this.userid);
          // if (checkofferopen) {
          //   if (checkofferopen.status == 10)
          //     this.isOfferOpenforFM = true;
          //   else
          //     this.isOfferOpenforFM = false;
          // }

          this.FMApprovalData = this.setApprovaldatastatus(this.FMApprovalData);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private setAdditionalFieldData() {
    this.additionalfieldId = this.RCOrderAdditionalField.id;

    if (this.RCOrderAdditionalField.soldtoparty) {
      this.offerInformationForm.soldtoparty.setValue(this.RCOrderAdditionalField.soldtoparty);
      // this.GetShiptoPartyList();
      this.offerInformationForm.soldtopartyname.setValue(this.RCOrderAdditionalField.soldtopartyname);
      this.offerInformationForm.soldstreet1.setValue(this.RCOrderAdditionalField.soldstreet1);
      this.offerInformationForm.soldstreet2.setValue(this.RCOrderAdditionalField.soldstreet2);
      this.offerInformationForm.solddistrict.setValue(this.RCOrderAdditionalField.solddistrict);
      this.offerInformationForm.soldcity.setValue(this.RCOrderAdditionalField.soldcity);
      this.offerInformationForm.soldpostalcode.setValue(this.RCOrderAdditionalField.soldpostalcode);
      this.offerInformationForm.soldregion.setValue(this.RCOrderAdditionalField.soldregion);

      this.offerInformationForm.shiptoparty.setValue(this.RCOrderAdditionalField.shiptoparty);
      this.offerInformationForm.shiptopartyname.setValue(this.RCOrderAdditionalField.shiptopartyname);
      this.offerInformationForm.shipstreet1.setValue(this.RCOrderAdditionalField.shipstreet1);
      this.offerInformationForm.shipstreet2.setValue(this.RCOrderAdditionalField.shipstreet2);
      this.offerInformationForm.shipdistrict.setValue(this.RCOrderAdditionalField.shipdistrict);
      this.offerInformationForm.shipcity.setValue(this.RCOrderAdditionalField.shipcity);
      this.offerInformationForm.shippostalcode.setValue(this.RCOrderAdditionalField.shippostalcode);
      this.offerInformationForm.shipregion.setValue(this.RCOrderAdditionalField.shipregion);
    }
    this.offerInformationForm.specialinstruction.setValue(this.RCOrderAdditionalField.specialinstruction ? this.RCOrderAdditionalField.specialinstruction : "");
  }

  managePageSection(status: number, active: number) {
    this.offerInformation = 0;
    this.approvedandrejectedby = 0;
    this.FMapproveandreject = 0;
    this.termsandcondition = 0;
    this.cpovalidator = 0;
    this.managepo = 0;
    this.orderstatus = 0;
    this.saperror = 0;

    // && this.usertype == 20
    if (active == 1) {
      if (status < 20) {
        this.offerInformation = 2;
        this.termsandcondition = 2;
        this.managepo = 2;
      } else if (status >= 20) {
        if (status < 75 && (this.userrolecode == 'OMT' || this.userrolecode == 'OM_Admin' && !this.isdealer)) {
          this.offerInformation = 2;
          this.termsandcondition = 2;
          this.approvedandrejectedby = 2;
          this.managepo = 2;
        } else {
          this.offerInformation = 1;
          this.termsandcondition = 1;
          this.approvedandrejectedby = 1;
          this.managepo = 1;
        }
      }

      // if (status < 20 && this.usertype >= 10) {
      //   this.managepo = 2;
      // } else if (status >= 20 && status < 80 && (this.userrolecode == 'OMT' || this.userrolecode == 'OM_Admin' && !this.isdealer)) {
      //   this.managepo = 2;
      // } else {
      //   this.managepo = 1;
      // }

      if (status >= 70 && status != 80) { // stock order
        this.orderstatus = 2;
      } else if (status == 75) {
        this.orderstatus = 1;
      }

      if (status == 75 && (this.userrolecode == 'OMT' || this.userrolecode == 'OM_Admin' && !this.isdealer)) {
        this.saperror = 2;
      } else if (status >= 75) {
        this.saperror = 1;
      }

      if (status >= 80) {
        this.saperror = 0;
        this.managepo = 1;
      }

    } else {
      if (status < 20) {
        this.offerInformation = 1;
        this.termsandcondition = 1;
        this.managepo = 1;
      } else if (status >= 20) {
        this.offerInformation = 1;
        this.termsandcondition = 1;
        this.approvedandrejectedby = 1;
        this.managepo = 1;
      }

      if (status >= 57) {
        this.FMapproveandreject = 1;
      }

      // if (status >= 60 && this.isOfferIndirect) {
      //   this.cpovalidator = 1;
      // }

      // if (status >= 70 && this.isOfferIndirect) {
      //   this.cpovalidator = 1;
      //   this.additionalfields = 1;
      // }

      // if (status >= 50 && !this.isOfferIndirect) { // stock order
      //   this.orderstatus = 1;
      // } else if (status > 62 && this.isOfferIndirect) { // cpo order
      //   this.orderstatus = 1;
      // }

      if (status == 75) {
        this.saperror = 1;
      }

      if (status >= 80) {
        this.managepo = 1;
      }
    }

  }

  isShowSection(section: string) {
    let isShow: boolean = false;

    if (section == 'offerInformation')
      isShow = this.offerInformation >= 1 ? true : false;

    else if (section == 'approvedandrejectedby')
      isShow = this.approvedandrejectedby >= 1 ? true : false;

    else if (section == 'FMapproveandreject')
      isShow = this.FMapproveandreject >= 1 ? true : false;

    else if (section == 'termsandcondition')
      isShow = this.termsandcondition >= 1 ? true : false;

    else if (section == 'managepo')
      isShow = this.managepo >= 1 ? true : false;

    else if (section == 'cpovalidator')
      isShow = this.cpovalidator >= 1 ? true : false;

    else if (section == 'orderstatus')
      isShow = this.orderstatus >= 1 ? true : false;

    else if (section == 'saperror')
      isShow = this.saperror >= 1 ? true : false;

    return isShow;
  }

  isEditSection(section: string) {
    let isEdit: boolean = false;

    if (section == 'offerInformation')
      isEdit = this.offerInformation == 2 ? true : false;

    else if (section == 'approvedandrejectedby')
      isEdit = this.approvedandrejectedby == 2 ? true : false;

    else if (section == 'FMapproveandreject')
      isEdit = this.FMapproveandreject == 2 ? true : false;

    else if (section == 'termsandcondition')
      isEdit = this.termsandcondition == 2 ? true : false;

    else if (section == 'managepo')
      isEdit = this.managepo == 2 ? true : false;

    else if (section == 'cpovalidator')
      isEdit = this.cpovalidator == 2 ? true : false;

    else if (section == 'orderstatus')
      isEdit = this.orderstatus == 2 ? true : false;

    else if (section == 'saperror')
      isEdit = this.saperror == 2 ? true : false;

    return isEdit;
  }

  setStatus(status: number) {
    if (status == 10) {
      this.offerApprovalStatus = OfferStatusEnum.ten;
    } else if (status == 20) {
      this.offerApprovalStatus = OfferStatusEnum.twenty;
    } else if (status == 30) {
      this.offerApprovalStatus = OfferStatusEnum.thirty;
    } else if (status == 40) {
      this.offerApprovalStatus = OfferStatusEnum.fourty;
    } else if (status == 50) {
      this.offerApprovalStatus = OfferStatusEnum.fifty;
    } else if (status == 55) {
      this.offerApprovalStatus = OfferStatusEnum.fiftyfive;
    } else if (status == 57) {
      this.offerApprovalStatus = OfferStatusEnum.fiftyseven;
    } else if (status == 59) {
      this.offerApprovalStatus = OfferStatusEnum.fiftynine;
    } else if (status == 60) {
      this.offerApprovalStatus = OfferStatusEnum.sixty;
    } else if (status == 62) {
      this.offerApprovalStatus = OfferStatusEnum.sixtytwo;
    } else if (status == 70) {
      this.offerApprovalStatus = OfferStatusEnum.seventy;
    } else if (status == 75) {
      this.offerApprovalStatus = OfferStatusEnum.seventyfive;
    } else if (status == 80) {
      this.offerApprovalStatus = OfferStatusEnum.eighty;
    }
  }

  // offertypechange(type: number) {
  //   if (type == 30) {
  //     this.isOfferIndirect = true;
  //     this.offerInformationForm.delearcommission.setValidators(Validators.required);
  //     // this.offerInformationForm.shiptopartyType.setValue(null);
  //     // if (this.oppoData.sapid)
  //     //   this.getShiptoPartyList();
  //     // else
  //     //   this.shiptopartyList = [];
  //   } else {
  //     this.isOfferIndirect = false;
  //     this.DealerCommisionPer = 0;
  //     // this.offerInformationForm.offerType.setValue(1);
  //     this.offerInformationForm.delearcommission.clearValidators();
  //     this.offerInformationForm.shiptoparty.setValue(this.offerInformationForm.soldtoparty.value);
  //   }

  //   this.offerInformationForm.delearcommission.updateValueAndValidity();
  //   this.updateTotalValues();
  // }

  convertDate(date) {
    if (date) {
      const year = Number(date.split('/')[2]);
      const month = Number(date.split('/')[1]);
      const day = Number(date.split('/')[0]);
      let newdate = { year: year, month: month, day: day };
      return newdate;
    }
  }

  private getRateContracts() {
    this.ratecontractService.getRCbysoldto(this.userSAPId).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (this.isAdd)
            this.ratecontracts = response.responsedata.data;
          else
            this.ratecontracts = response.responsedata.data.filter(rc => rc.id == this.selectedRC);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onItemSearch(event) {
    let isItemExist: string = null;
    this.isItemReady = false;
    this.itemErrorMessage = null;
    if (this.offerItemStd.length > 0) {
      isItemExist = this.offerItemStd.find(x => x.articleno == event.searchValue && x.isdelete != 1);
    }

    if (isItemExist) {
      this.notificationService.showError('Item already added in the list.');
      this.articleno = null;
      this.itemsapid = null;
      this.itemtype = null;
      this.itemMaxDiscount = null;
      this.stdItemSearched = null;
      this.msq = null;
      this.selectedItem = null;
      this.stdItemForm.stdItemName.setValue(null);
      this.stdItemForm.stdItemUOM.setValue(null);
      this.stdItemForm.stdItemMOQ.setValue(null);
      this.stdItemForm.stdItemPCLength.setValue(null);
      this.stdItemForm.ItemMOQ.setValue(null);
      this.stdItemForm.ItemMDQ.setValue(null);
      this.itemLengthList = [];
      this.stdItemForm.enquiredquantity.setValue(null);
      this.stdItemForm.stdItemQty.setValue(null);
      this.stdItemForm.stdItemPrice.setValue(null);
      this.stdItemForm.itemunitnetprice.setValue(null);
      this.stdItemForm.seqno.setValue(null);
      this.stdItemForm.itemstock.setValue(null);
      // this.stdItemForm.importby.setValue(null);

      // if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
      //   this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
      // else
      this.stdItemForm.itemDiscount.setValue(null);

      this.stdItemForm.customerpartno.setValue('');
      this.stdItemForm.itemtotal.setValue(null);
      this.LengthandFactordata = [];
      return;
    } else {
      if (event && event.searchValue && this.rcItems.find(i => i.articleno == event.searchValue)) {
        this.productmasterService.getItemSearched(event.searchValue).then(
          response => {
            if (response.item.length > 0) {
              this.itemtype = null;
              this.stdItemSearched = response.item[0];
              this.selectedItem = this.rcItems.find(i => i.articleno == this.stdItemSearched.articleno);
              this.articleno = this.stdItemSearched.articleno;
              this.itemsapid = this.stdItemSearched.sapid;
              this.itemMaxDiscount = this.stdItemSearched.maxdiscount * 100;
              this.msq = this.stdItemSearched.msq ? this.stdItemSearched.msq : 1;
              this.stdItemForm.stdItemName.setValue(this.stdItemSearched.description);
              this.stdItemForm.stdItemUOM.setValue(this.stdItemSearched.uom);
              this.stdItemForm.ItemMDQ.setValue(this.stdItemSearched.mdq);
              this.stdItemForm.stdItemMOQ.setValue(this.msq);

              if (this.stdItemSearched.uom.toUpperCase() == 'PC') {
                this.qtydisable = false;
                this.lengthandfactorbtndisable = true;
                this.showpclength = true;
                this.stdItemForm.stdItemPCLength.setValue(this.stdItemSearched.length.split('|')[0]);
              } else if (this.stdItemSearched.uom.toUpperCase() == 'M') {
                this.qtydisable = true;
                this.lengthandfactorbtndisable = false;
                this.showpclength = false;
                if (this.stdItemSearched.length) {
                  let length = this.stdItemSearched.length.split('|');
                  this.itemLengthList = length;
                  this.itemLengthList.push('Cut Length');
                } else {
                  this.itemLengthList = [];
                }
              }

              this.stdItemForm.enquiredquantity.setValue(null);
              this.stdItemForm.stdItemQty.setValue(null);
              this.stdItemForm.stdItemPrice.setValue(null);
              this.stdItemForm.itemunitnetprice.setValue(null);
              this.stdItemForm.seqno.setValue(null);
              this.stdItemForm.itemstock.setValue(null);
              // this.stdItemForm.importby.setValue(null);

              // if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
              //   this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
              // else
              this.stdItemForm.itemDiscount.setValue(null);

              // this.stdItemForm.customerpartno.setValue(this.selectedItem.customerpartno);
              this.stdItemForm.itemtotal.setValue(null);
              this.LengthandFactordata = [];
            } else {
              this.lengthandfactorbtndisable = true;
              this.notificationService.showError('Item not found.');
            }
          }, error => {
            this.notificationService.showError(error.error.error.message);
          });
      } else {
        this.notificationService.showError("Entered article is not available in selected RC.");
        return;
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
    let _Arr = this.offerItemStd.filter(x => x.isdelete == 0).concat(this.offerDeletedItem);
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

    if (!this.rcDetail) {
      this.notificationService.showError('Please select the Rate Contract first.');
      return;
    }

    if (index !== undefined) {
      this.itemforEdit = true;
      let data = this.filterDatatoDeletewithOrder(this.offerItemStd)[index];
      this.selectedItem = data;
      this.stdItemForm.stditemCode.setValue(data.articleno);
      this.stdItemForm.stdItemName.setValue(data.articledesc);
      this.stdItemForm.stdItemPrice.setValue(data.price);
      this.stdItemForm.itemunitnetprice.setValue(data.unitprice);
      // this.stdItemForm.stdItemCatalog.setValue(data.catalogLink);
      // this.ItemCatalogue = data.catalogLink;
      this.stdItemForm.stdItemQty.setValue(data.quantity);
      this.stdItemForm.itemDiscount.setValue(data.discount);
      this.stdItemForm.customerpartno.setValue(data.customerpartno);
      this.stdItemForm.stdItemUOM.setValue(data.uom);
      this.stdItemForm.enquiredquantity.setValue(data.enquiredquantity);
      this.stdItemForm.stdItemMOQ.setValue(data.msq);
      this.stdItemForm.stdItemPCLength.setValue(data.pclength);
      this.stdItemForm.ItemMOQ.setValue(+data.moq);
      this.stdItemForm.ItemMDQ.setValue(data.mdq);
      this.itemSequenceId = data.itemSeqId;
      this.stdItemForm.seqno.setValue(data.seqno);
      this.stdItemForm.itemstock.setValue(data.itemstock);
      // this.stdItemForm.importby.setValue(data.importby ? data.importby : null);

      if (data.reqdlvdate) {
        // data.reqdlvdate.split('T')[0]
        // dd/MM/yyyy converted date
        this.itemreqdeliveryDate = this.convertDate(data.reqdlvdate);
        this.stdItemForm.itemreqdeliverydate.setValue(data.reqdlvdate);

        // this.offervalidfromDate = this.convertDate(this.datePipe.transform(this.offerdata.offervalidfrom, this.dateformate));
        // this.offerInformationForm.offersValidfrom.setValue(this.datePipe.transform(this.offerdata.offervalidfrom, this.dateformate));
      } else if (this.offerInformationForm.reqdeliverydate.value) {
        this.itemreqdeliveryDate = this.convertDate(this.offerInformationForm.reqdeliverydate.value);
        this.stdItemForm.itemreqdeliverydate.setValue(this.offerInformationForm.reqdeliverydate.value);
      } else {
        this.itemreqdeliveryDate = null;
        this.stdItemForm.itemreqdeliverydate.setValue(null);
      }

      this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
      this.LengthandFactordata = data.lengthandfactor;

      this.itemid = data.id;
      this.itemtype = data.itemtype;
      this.itemMaxDiscount = data.maxdiscount;
      // this.isItemExpire = data.isexpire;
      // this.files = data.files;
      this.articleno = data.articleno;
      this.itemsapid = data.sapid;
      this.msq = data.msq;
      this.uom = data.uom;

      // if (this.itemtype.toUpperCase() == 'SPR' && this.LengthandFactordata.length > 0) {
      //   this.qtydisable = true;
      //   this.lengthandfactorbtndisable = false;
      // } else {
      //   this.qtydisable = false;
      //   this.lengthandfactorbtndisable = true;
      // }

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
        this.showpclength = false;
      } else {
        this.qtydisable = false;
        this.lengthandfactorbtndisable = true;
        this.showpclength = true;
      }

      this.itemlevelcuttingcharges = data.cuttingcharges;
      this.itemGrossMargin = data.GrossMargin;
      this.itemTGrossMargin = data.TargetGrossMargin;
      this.itemRGrossMargin = data.RMCGrossMargin;
      this.itemindex = index;
      this.submitted = false;
      this.isItemReady = true;
    } else {
      // this.files = [];
      this.stdItemForm.stditemCode.setValue(null);
      this.stdItemForm.stdItemName.setValue(null);
      this.stdItemForm.stdItemPrice.setValue(null);
      this.stdItemForm.itemunitnetprice.setValue(null);
      this.stdItemForm.stdItemCatalog.setValue(null);
      this.stdItemForm.stdItemUOM.setValue(null);
      this.stdItemForm.enquiredquantity.setValue(null);
      this.stdItemForm.stdItemMOQ.setValue(null);
      this.stdItemForm.stdItemPCLength.setValue(null);
      this.stdItemForm.ItemMOQ.setValue(null);
      this.stdItemForm.ItemMDQ.setValue(null);
      // this.ItemCatalogue = null;
      this.LengthandFactordata = [];
      this.stdItemForm.stdItemQty.setValue(null);
      this.stdItemForm.seqno.setValue(null);
      this.stdItemForm.itemstock.setValue(null);
      // this.stdItemForm.importby.setValue(null);
      this.stdItemForm.itemunitnetprice.setValue(null);

      // if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
      //   this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
      // else
      this.stdItemForm.itemDiscount.setValue(null);

      this.stdItemForm.customerpartno.setValue('');
      this.stdItemForm.itemtotal.setValue(null);

      this.itemLengthList = [];
      this.itemid = 0;
      this.itemforEdit = false;
      this.lengthandfactorbtndisable = true;
      this.itemSequenceId = 0;
      this.itemtype = null;
      this.itemMaxDiscount = null;
      this.isItemExpire = false;
      this.articleno = null;
      this.itemsapid = null;
      this.msq = null;
      this.uom = null;
      this.submitted = false;
      this.isItemReady = true;
      this.itemlevelcuttingcharges = 0;
      this.itemGrossMargin = 0;
      this.itemTGrossMargin = 0;
      this.itemRGrossMargin = 0;

      if (this.offerInformationForm.reqdeliverydate.value) {
        this.itemreqdeliveryDate = this.convertDate(this.offerInformationForm.reqdeliverydate.value);
        this.stdItemForm.itemreqdeliverydate.setValue(this.offerInformationForm.reqdeliverydate.value);
      } else {
        this.itemreqdeliveryDate = null;
        this.stdItemForm.itemreqdeliverydate.setValue(null);
      }
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
    } else if (!this.articleno) {
      this.notificationService.showError('Please add Item.');
      return;
    } else if (Number(this.stdItemForm.stdItemQty.value) <= 0) {
      this.notificationService.showError('Please enter valid quantity.');
      return;
    }

    // if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "PC") {
    // if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
    //   this.notificationService.showError(`Quantity must be greater than or equal to MOQ ` + Number(this.stdItemForm.ItemMOQ.value) + `.`);
    //   return;
    // }
    // }
    // else if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "M") {
    //   if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value) && this.LengthandFactordata.filter(x => x.isother == 1).length > 0) {
    //     this.notificationService.showError(`Quantity must be greater than or equal to MOQ ` + Number(this.stdItemForm.ItemMOQ.value) + `.`);
    //     return;
    //   }
    // }

    let netvalue: number = 0;
    let price: number = Number(this.stdItemForm.stdItemPrice.value);
    let unitprice: number = Number(this.stdItemForm.itemunitnetprice.value);
    let discount: number = Number(this.stdItemForm.itemDiscount.value);
    let quantity: number = Number(this.stdItemForm.stdItemQty.value);
    netvalue = Number((unitprice * quantity).toFixed(2));

    let itemModel = {
      id: this.isAdd ? 0 : this.itemid,
      itemId: this.isAdd ? 0 : this.itemid,
      itemSeqId: this.itemSequenceId > 0 ? this.itemSequenceId : this.getSeqID(this.offerItemStd),
      seqno: this.stdItemForm.seqno.value ? this.stdItemForm.seqno.value : this.getSeqNo(),
      itemstock: this.stdItemForm.itemstock.value,
      // importby: this.stdItemForm.importby.value,
      // isexpire: this.isItemExpire,
      articleno: this.articleno,
      sapid: this.itemsapid,
      itemtype: this.itemtype,
      maxdiscount: this.itemMaxDiscount,
      articledesc: this.stdItemForm.stdItemName.value,
      quantity: quantity,
      msq: this.msq,
      moq: this.stdItemForm.ItemMOQ.value,
      mdq: this.stdItemForm.ItemMDQ.value,
      uom: this.stdItemForm.stdItemUOM.value,
      pclength: this.stdItemForm.stdItemPCLength.value,
      enquiredquantity: quantity,
      customerpartno: this.stdItemForm.customerpartno.value ? this.stdItemForm.customerpartno.value : '',
      price: price,
      unitprice: this.stdItemForm.itemunitnetprice.value,
      discount: discount,
      netvalue: netvalue,
      // catalogLink: this.stdItemForm.stdItemCatalog.value ? this.stdItemForm.stdItemCatalog.value : '',
      isdelete: 0,
      length: this.itemLengthList,
      lengthandfactor: this.LengthandFactordata.concat(this.LengthandFactordataDelete),
      cuttingcharges: this.itemlevelcuttingcharges,
      // files: this.files,
      // filerefid: 0,
      // documents: [],
      GrossMargin: this.itemGrossMargin ? this.itemGrossMargin : 0,
      TargetGrossMargin: this.itemTGrossMargin ? this.itemTGrossMargin : 0,
      RMCGrossMargin: this.itemRGrossMargin ? this.itemRGrossMargin : 0,
      reqdlvdate: this.stdItemForm.itemreqdeliverydate.value
    }

    this.items = this.ItemsForm.get('items') as FormArray;
    this.items.push(this.createItem());

    this.offerItemStd = this.offerItemStd.filter(x => x.itemSeqId != itemModel.itemSeqId);

    if (this.itemSequenceId > 0)
      this.offerItemStd.splice(this.itemindex, 0, itemModel);
    else
      this.offerItemStd.push(itemModel);

    // if (Number(this.offerInformationForm.headerleveldiscount.value) != discount)
    //   this.offerInformationForm.headerleveldiscount.setValue(null);

    this.updateTotalValues();

    this.itemSequenceId = 0;
    this.itemlevelcuttingcharges = 0;
    this.stdItemForm.stditemCode.setValue(null);
    this.stdItemForm.stdItemName.setValue(null);
    this.stdItemForm.stdItemPrice.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.stdItemCatalog.setValue(null);
    // this.ItemCatalogue = null;
    this.itemtype = null;
    this.itemMaxDiscount = null;
    this.isItemExpire = false;
    this.stdItemForm.stdItemQty.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.seqno.setValue(null);
    this.stdItemForm.itemstock.setValue(null);
    // this.stdItemForm.importby.setValue(null);
    // this.files = [];
    if (this.offerItemStd.length > 0) {
      this.stdItem = true;
      this.submitted = false;
      this.modalService.dismissAll("");
    } else {
      this.stdItem = false;
    }
  }

  onDeletedItemView(DeletedItem, index) {
    let data = this.offerDeletedItem[index];
    this.stdItemForm.stditemCode.setValue(data.articleno);
    this.stdItemForm.stdItemName.setValue(data.articledesc);
    this.stdItemForm.stdItemPrice.setValue(data.price);
    this.stdItemForm.itemunitnetprice.setValue(data.unitprice);
    this.stdItemForm.stdItemQty.setValue(data.quantity);
    this.stdItemForm.seqno.setValue(data.seqno);
    this.stdItemForm.itemstock.setValue(data.itemstock);
    // this.stdItemForm.importby.setValue(data.importby);
    this.stdItemForm.itemDiscount.setValue(data.discount);
    this.stdItemForm.customerpartno.setValue(data.customerpartno);
    this.stdItemForm.stdItemUOM.setValue(data.uom);
    this.stdItemForm.enquiredquantity.setValue(data.enquiredquantity);
    this.stdItemForm.stdItemMOQ.setValue(data.msq);
    this.stdItemForm.stdItemPCLength.setValue(data.pclength);
    this.stdItemForm.ItemMOQ.setValue(+data.moq);
    this.stdItemForm.ItemMDQ.setValue(data.mdq);

    this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));

    this.LengthandFactordata = data.lengthandfactor;
    this.itemSequenceId = data.itemSeqId;
    this.itemid = data.id;
    this.itemtype = data.itemtype;
    this.itemMaxDiscount = data.maxdiscount;
    this.itemlevelcuttingcharges = data.cuttingcharges;
    // this.files = data.files;
    this.articleno = data.articleno;
    if (data.length && data.length.includes('|')) {
      let length = data.length.split('|');
      this.itemLengthList = length;
    }
    this.itemindex = index;

    if (data.reqdlvdate) {
      this.itemreqdeliveryDate = this.convertDate(data.reqdlvdate);
      this.stdItemForm.itemreqdeliverydate.setValue(data.reqdlvdate);
    } else {
      this.itemreqdeliveryDate = null;
      this.stdItemForm.itemreqdeliverydate.setValue(null);
    }

    if (data.uom.toUpperCase() == 'PC')
      this.showpclength = true;
    else
      this.showpclength = false;

    // this.stdItemForm.importby.disable();

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

  ManagePOfileChangeListener(event: any): void {
    if (this.pofiles.length > 0) {
      this.pofiles = [];
    }

    if (event.target.files) {
      if (event.target.files[0].size > this.filesize) {
        this.notificationService.showError('File exceeds the maximum size of ' + this.filesize);
        return;
      }

      for (let i = 0; i < event.target.files.length; i++) {
        this.pofiles.push(event.target.files[i]);
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  removePOFile(index: number) {
    this.pofiles.splice(index, 1);
  }

  onSTDItemDelete(event: any) {
    if (this.isAdd) {
      this.offerItemStd = this.offerItemStd.filter(x => x.articleno != event.model.articleno);
    } else if (this.isEdit) {
      if (event.model.id > 0) {
        this.offerItemStd.find(x => x.id == event.model.id).isdelete = 1
        this.offerDeletedItem.push(this.offerItemStd.find(x => x.id == event.model.id));
        this.offerItemStd = this.offerItemStd.filter(x => x.articleno != event.model.articleno && x.id != event.model.id);
      } else
        this.offerItemStd = this.offerItemStd.filter(x => x.articleno != event.model.articleno);
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
          element.isdelete = 1;
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
    return data.filter(x => x.isdelete == 0).sort((a, b) => Number(a.seqno) - Number(b.seqno));
  }

  filterDatatoDelete(data: any) {
    return data.filter(x => x.isdelete == 0);
  }

  oncancelClick() {
    this.router.navigate(['/rcorders/list']);
  }

  onEditClick() {
    let id: string = '';
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/offers/edit/' + id]);
  }

  onSaveasDraftClick(issubmit: boolean) {
    this.isRecommend = issubmit;
    this.UpdateFieldValidators(this.isRecommend);
    this.onSubmit();
  }

  onSaveandSubmitClick(issubmit: boolean) {
    if (this.filterDatatoDeletewithOrder(this.offerItemStd) && this.filterDatatoDeletewithOrder(this.offerItemStd).length == 0) {
      this.notificationService.showError('There is no item in the Order.')
      return;
    }

    this.isRecommend = issubmit;
    this.UpdateFieldValidators(this.isRecommend);
    this.submitted = true;

    this.acc.expandAll();
    if (this.OfferInformationForm.invalid || this.ManagePOForm.invalid)
      return false;

    this.modalService.open(this.TermsModel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onSubmitConfirm() {
    this.modalService.dismissAll('TermsModel');
    this.onSubmit();
  }

  async onSubmit() {
    this.submitted = true;

    this.acc.expandAll();
    if (this.OfferInformationForm.invalid) {
      return false;
    }

    let offerHeader = {
      rcId: this.rcHeader.id,
      SoldToParty: this.rcHeader.soldtoparty,
      ShipToParty: this.rcHeader.shiptoparty ? this.rcHeader.shiptoparty : 0,
      Incoterm: this.offerInformationForm.incoterms.value,
      reqdlvdate: this.offerInformationForm.reqdeliverydate.value ? this.offerInformationForm.reqdeliverydate.value.split('/').reverse().join('-') : '0000-00-00',
      OfferFiles: []
    }

    let podata = {
      Id: this.isAdd || this.isRefrenceOffer ? 0 : this.poId,
      ponumber: this.managePOForm.ponumber.value,
      podate: this.managePOForm.podate.value.split('/').reverse().join('-'),
      attachmentid: 0,
      customerponumber: this.managePOForm.customerponumber.value,
    }

    let additionalFieldData = {
      id: this.isAdd || this.isRefrenceOffer ? 0 : this.additionalfieldId,
      soldtoparty: this.offerInformationForm.soldtoparty.value ? this.offerInformationForm.soldtoparty.value : 0,
      soldtopartyname: this.offerInformationForm.soldtopartyname.value,
      soldstreet1: this.offerInformationForm.soldstreet1.value,
      soldstreet2: this.offerInformationForm.soldstreet2.value,
      solddistrict: this.offerInformationForm.solddistrict.value,
      soldcity: this.offerInformationForm.soldcity.value,
      soldpostalcode: this.offerInformationForm.soldpostalcode.value,
      soldregion: this.offerInformationForm.soldregion.value,
      shiptoparty: this.offerInformationForm.shiptoparty.value ? this.offerInformationForm.shiptoparty.value : 0,
      shiptopartyname: this.offerInformationForm.shiptopartyname.value,
      shipstreet1: this.offerInformationForm.shipstreet1.value,
      shipstreet2: this.offerInformationForm.shipstreet2.value,
      shipdistrict: this.offerInformationForm.shipdistrict.value,
      shipcity: this.offerInformationForm.shipcity.value,
      shippostalcode: this.offerInformationForm.shippostalcode.value,
      shipregion: this.offerInformationForm.shipregion.value,
      specialinstruction: this.offerInformationForm.specialinstruction.value,
      nacecode: this.offerInformationForm.nacecode.value ? this.offerInformationForm.nacecode.value.split(":")[0].trim() : "",
      nacedescription: this.offerInformationForm.nacecode.value ? this.offerInformationForm.nacecode.value.split(":")[1].trim() : "",
      nacelevel: this.offerInformationForm.nacelevel.value ? this.offerInformationForm.nacelevel.value : "",
      businessmodel: this.offerInformationForm.businessmodel.value ? this.offerInformationForm.businessmodel.value : "",
      customerindustrykey: this.customerData && this.customerData.industrytypec ? this.customerData.industrytypec : ""
    }

    if (this.isRefrenceOffer) {
      this.offerItemStd.forEach(element => {
        element.itemId = 0;

        element.lengthandfactor.forEach(element2 => {
          element2.id = 0;
        });
      });

      this.specialtextdata.forEach(element => {
        element.id = 0;
      });
    }

    // let _qtyerror: boolean = false;
    let _isAllItemValid: boolean = true;

    this.offerItemStd.forEach(element => {
      // if (element.uom.toUpperCase() == "PC") {
      // if (Number(element.quantity) < Number(element.moq)) {
      //   _qtyerror = true;
      // }
      // }
      // else if (element.uom.toUpperCase() == "M") {
      //   if (Number(element.quantity) < Number(element.moq) && element.lengthandfactor.filter(x => x.isother == 1).length > 0) {
      //     _qtyerror = true;
      //   }
      // }

      if (!element.itemtype)
        _isAllItemValid = false;

      if (!element.reqdlvdate)
        element.reqdlvdate = this.offerInformationForm.reqdeliverydate.value ? this.offerInformationForm.reqdeliverydate.value.split('/').reverse().join('-') : "0000-00-00";
      else
        element.reqdlvdate = element.reqdlvdate.split('/').reverse().join('-');

      element.lengthandfactor.forEach(lengthfactor => {
        if (!lengthfactor.lengthreqdeliverydate)
          lengthfactor.lengthreqdeliverydate = element.reqdlvdate;
        else
          lengthfactor.lengthreqdeliverydate = lengthfactor.lengthreqdeliverydate.split('/').reverse().join('-');
      });
    });

    // if (_qtyerror) {
    //   this.notificationService.showError('Quantity must be greater than or equal to MOQ.');
    //   return;
    // } else
    if (!_isAllItemValid) {
      this.notificationService.showError('Some item is invalid.');
      return;
    }

    this.offerDeletedItem.forEach(element => {
      if (!element.reqdlvdate)
        element.reqdlvdate = this.offerInformationForm.reqdeliverydate.value ? this.offerInformationForm.reqdeliverydate.value.split('/').reverse().join('-') : "0000-00-00";
      else
        element.reqdlvdate = element.reqdlvdate.split('/').reverse().join('-');

      element.lengthandfactor.forEach(lengthfactor => {
        if (!lengthfactor.lengthreqdeliverydate)
          lengthfactor.lengthreqdeliverydate = element.reqdlvdate;
        else
          lengthfactor.lengthreqdeliverydate = lengthfactor.lengthreqdeliverydate.split('/').reverse().join('-');
      });
    });

    let saveModel = {
      orderId: this.isAdd ? 0 : this.orderId,
      isrecommendforprocess: this.isRecommend == true ? 1 : 0,
      ompsave: this.isRecommend == true && ((this.userrolecode == 'OMT' || this.userrolecode == 'OM_Admin') && !this.isdealer) ? 1 : 0,
      refOrderId: this.isRefrenceOffer ? this.orderId : 0,
      oppoId: 0,//this.oppoData.opportunity_id,
      orderValue: this.totalnetvalue,
      rcOrderHeader: offerHeader,
      orderpo: podata,
      rcOrderAdditionalField: additionalFieldData,
      rcOrderItems: this.offerDeletedItem.concat(this.offerItemStd),
      // specialterms: this.specialtextdata.concat(this.specialtextdeletedata),
      reasonforclone: this.isRefrenceOffer ? this.offerInformationForm.reasonforclone.value : ''
    }

    if (this.OfferFiles.length > 0)
      await this.OfferFileUpload(saveModel.rcOrderHeader);
    if (this.pofiles.length > 0)
      await this.UploadManagePOFile(saveModel.orderpo);

    this.createOrder(saveModel);
  }

  async OfferFileUpload(offerHeader: any) {
    var type: string = '';

    if (this.isEdit) {
      var oldfiles = this.OfferFiles.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        offerHeader.OfferFiles.push({ id: element });
      });
      this.OfferFiles = this.OfferFiles.filter(x => !x.id);
    } else if (this.isRefrenceOffer) {
      var oldfiles = this.OfferFiles.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        offerHeader.OfferFiles.push({ id: element });
      });

      this.OfferFiles = this.OfferFiles.filter(x => !x.id);
    }

    if (this.OfferFiles && this.OfferFiles.length > 0) {
      type = 'rcorders/orderdoc';
      await this.offersService.upload(this.OfferFiles, type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              offerHeader.OfferFiles.push({ id: element.id });
            });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  async UploadManagePOFile(savemodel) {
    var type: string = 'PO';

    if (this.isEdit) {
      var oldfiles = this.pofiles.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        savemodel.attachmentid = element;
      });
      this.pofiles = this.pofiles.filter(x => !x.id);
    } else if (this.isRefrenceOffer) {
      var oldfiles = this.pofiles.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        savemodel.attachmentid = element;
      });

      this.pofiles = this.pofiles.filter(x => !x.id);
    }

    if (this.pofiles && this.pofiles.length > 0) {
      await this.offersService.upload(this.pofiles, type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              savemodel.attachmentid = element.id;
            });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  createOrder(saveModel: any) {
    this.rcOrdersService.CreateOrder(saveModel).subscribe(
      async response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (saveModel.orderId == 0)
            this.notificationService.showSuccess('Order Created Successfully');
          else
            this.notificationService.showSuccess('Order Updated Successfully');

          this.RedirectTo();
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
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

  // removeFile(index: number) {
  //   this.files = Array.from(this.files)
  //   this.files.splice(index, 1);
  // }

  getID(itemArray: any) {
    let max = 0;
    for (let i = 0; i < itemArray.length; i++) {
      if (itemArray[i].seqid > max) {
        max = itemArray[i].seqid;
      }
    }
    return max + 1;
  }

  openAddLengthandFactor(AddLengthandFactor) {
    this.lengthandFactorForm.itemLength.setValue(null);
    this.lengthandFactorForm.itemFactor.setValue(null);
    this.lengthandFactorForm.lfqty.setValue(null);
    this.lengthandFactorForm.otherLength.setValue(null);
    this.lengthandFactorForm.extraLength.setValue(null);

    this.submitted = false;
    this.isFactorError = false;
    this.isShowOtherLength = false;
    this.isShowExtraLength = false;

    if (this.stdItemForm.itemreqdeliverydate.value) {
      this.lengthreqdeliveryDate = this.convertDate(this.stdItemForm.itemreqdeliverydate.value);
      this.lengthandFactorForm.lengthreqdeliverydate.setValue(this.stdItemForm.itemreqdeliverydate.value);
    } else {
      this.lengthreqdeliveryDate = null;
      this.lengthandFactorForm.lengthreqdeliverydate.setValue(null);
    }

    let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleno);
    if (!_itemstockdata)
      this.isItemStockdataAvailable = false;
    else
      this.isItemStockdataAvailable = true;

    this.modalRef = this.modalService.open(AddLengthandFactor, { size: 'md' });
  }

  onLengthandFactorSave() {
    this.submitted = true;
    if (this.LengthandFactorForm.invalid || this.isFactorError)
      return;

    if (this.isOtherLengthExtra) {
      this.notificationService.showError('Please enter valid length.');
      return;
    }

    if (Number(this.lengthandFactorForm.itemFactor.value) <= 0)
      return;

    if (this.isShowOtherLength && this.lengthandFactorForm.otherLength.value <= 0)
      return;

    let quantity = this.isShowOtherLength ? this.isShowExtraLength ? Number(this.lengthandFactorForm.extraLength.value) * Number(this.lengthandFactorForm.itemFactor.value) : Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value) : Number(this.lengthandFactorForm.itemLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
    if (this.rcHeader.rctype == 20 && (this.stdItemForm.stdItemQty.value + quantity) > this.selectedItem.qtyremaining) {
      this.notificationService.showError(`Quantity can not be more than ${this.selectedItem.qtyremaining}.`);
      return;
    }

    // validate UOM == M, for quantity must be in multiply with MDQ
    if ((Number(quantity) % Number(this.stdItemForm.ItemMDQ.value)) != 0) {
      this.notificationService.showError(`Quantity must be in multiples of ${Number(this.stdItemForm.ItemMDQ.value)}`);
      return;
    }

    // Validate req dlv date
    if (Config.ExcelDateToJSDate(this.lengthandFactorForm.lengthreqdeliverydate.value.split("/").reverse().join("-"), '-').date < moment().format('YYYY-MM-DD')) {
      this.notificationService.showError(`Req. Dlv. Date must be greated than today date.`);
      return;
    }

    let lfdata = {
      id: 0,
      length: this.isShowOtherLength ? this.isShowExtraLength ? Number(this.lengthandFactorForm.extraLength.value) : Number(this.lengthandFactorForm.otherLength.value) : Number(this.lengthandFactorForm.itemLength.value),
      factor: Number(this.lengthandFactorForm.itemFactor.value),
      quantity: quantity,
      isdelete: 0,
      cuttingcharges: 0,
      isother: this.isShowOtherLength && this.isShowExtraLength ? 1 : 0,
      lengthreqdeliverydate: this.lengthandFactorForm.lengthreqdeliverydate.value
    }
    this.LengthandFactordata.push(lfdata);

    let finalQty = 0;
    if (this.LengthandFactordata && this.LengthandFactordata.length > 0) {
      this.LengthandFactordata.forEach(element => {
        finalQty += Number(element.quantity);
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
        this.LengthandFactordata[index].isdelete = 1;
        this.LengthandFactordataDelete.push(this.LengthandFactordata[index]);
        this.LengthandFactordata.splice(index, 1);
      } else
        this.LengthandFactordata.splice(index, 1);
    }

    let finalQty = 0;
    this.itemlevelcuttingcharges = 0;
    if (this.LengthandFactordata && this.LengthandFactordata.length > 0) {
      this.LengthandFactordata.forEach(element => {
        if (element.isdelete == 0)
          finalQty += Number(element.quantity);
      });
      this.stdItemForm.stdItemQty.setValue(finalQty);

      this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));

      this.LengthandFactordata.forEach(element => {
        if (element.isdelete == 0 && element.isother == 1) {
          element.cuttingcharges = this.itemtype == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
          this.itemlevelcuttingcharges += Number(element.cuttingcharges);
        }
      });

      this.onItemQtyChange();
    } else {
      this.stdItemForm.stdItemQty.setValue(null);
      this.stdItemForm.itemtotal.setValue(null);
    }
  }

  async onLengthChange(event: any) {
    if (event) {
      if (event == 'Cut Length') {
        this.isShowOtherLength = true;

        this.itemCutLengthList = [];
        let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleno);

        if (!_itemstockdata) {
          await this.onStockSearch(false, this.articleno);
          _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleno);
          this.itemCutLengthList = _itemstockdata.length;
        }

        if (_itemstockdata && _itemstockdata.length) {
          let filteredX = _itemstockdata.length.map(itemX => { return itemX.length });
          let filteredY = filteredX.filter(itemX => !this.itemLengthList.includes(itemX.toString()));
          this.itemCutLengthList = _itemstockdata.length.filter(X => filteredY.includes(X.length));
        }

        if (this.itemCutLengthList.findIndex(x => x == 'Other') === -1)
          this.itemCutLengthList.push('Other');

        this.lengthandFactorForm.otherLength.setValidators(Validators.required);
        this.lengthandFactorForm.otherLength.updateValueAndValidity();

        let quantity = (Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value)) + Number(this.stdItemForm.stdItemQty.value);

        if (this.rcHeader.rctype == 20 && quantity > this.selectedItem.qtyremaining) {
          this.notificationService.showError(`Quantity can not be more than ${this.selectedItem.qtyremaining}.`);
          return;
        }

        this.lengthandFactorForm.lfqty.setValue(Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value));
      } else {
        this.isShowOtherLength = false;
        this.isOtherLengthExtra = false;
        this.isShowExtraLength = false;

        this.lengthandFactorForm.extraLength.setValue(null);
        this.lengthandFactorForm.extraLength.clearValidators();
        this.lengthandFactorForm.extraLength.updateValueAndValidity();

        this.lengthandFactorForm.otherLength.setValue(null);
        this.lengthandFactorForm.otherLength.clearValidators();
        this.lengthandFactorForm.otherLength.updateValueAndValidity();

        let quantity = (Number(event) * Number(this.lengthandFactorForm.itemFactor.value)) + Number(this.stdItemForm.stdItemQty.value);

        if (this.rcHeader.rctype == 20 && quantity > this.selectedItem.qtyremaining) {
          this.notificationService.showError('You have entered more quantity than available.');
          return;
        }

        this.lengthandFactorForm.lfqty.setValue(Number(event) * Number(this.lengthandFactorForm.itemFactor.value));
      }
    } else {
      this.isShowOtherLength = false;
      this.isOtherLengthExtra = false;
      this.isShowExtraLength = false;
      this.lengthandFactorForm.otherLength.setValue(null);
      this.lengthandFactorForm.itemFactor.setValue(null);
      this.lengthandFactorForm.lfqty.setValue(null);

      this.lengthandFactorForm.extraLength.setValue(null);
      this.lengthandFactorForm.extraLength.clearValidators();
      this.lengthandFactorForm.extraLength.updateValueAndValidity();
    }
  }

  onOtherLengthChange(event: any) {
    this.isShowExtraLength = false;

    if (event && event != 'Other') {
      let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleno);

      if (_itemstockdata && Number(this.lengthandFactorForm.itemFactor.value) && Number(this.lengthandFactorForm.itemFactor.value) > 0) {
        let _itemfactordata = _itemstockdata.data.find(y => y.length == Number(this.lengthandFactorForm.otherLength.value));

        if (_itemfactordata.factor < Number(this.lengthandFactorForm.itemFactor.value)) {
          this.isFactorError = true;
          return;
        } else {
          this.isFactorError = false;
        }
      }

      this.lengthandFactorForm.extraLength.clearValidators();

      let _newQty = (Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value)) + Number(this.stdItemForm.stdItemQty.value);
      if (this.rcHeader.rctype == 20 && _newQty > this.selectedItem.qtyremaining) {
        this.notificationService.showError('You have entered more quantity than available.');
        return;
      }

      let qty = Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    } else if (event && event == 'Other') {
      this.isShowExtraLength = true;
      this.isFactorError = false;
      this.lengthandFactorForm.extraLength.setValidators(Validators.required);

      let _newQty = (Number(this.lengthandFactorForm.extraLength.value) * Number(this.lengthandFactorForm.itemFactor.value)) + Number(this.stdItemForm.stdItemQty.value);
      if (this.rcHeader.rctype == 20 && _newQty > this.selectedItem.qtyremaining) {
        this.notificationService.showError('You have entered more quantity than available.');
        return;
      }

      let qty = Number(this.lengthandFactorForm.extraLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    } else {
      this.lengthandFactorForm.extraLength.clearValidators();
      let _newQty = (Number(this.lengthandFactorForm.extraLength.value) * Number(this.lengthandFactorForm.itemFactor.value)) + Number(this.stdItemForm.stdItemQty.value);
      if (this.rcHeader.rctype == 20 && _newQty > this.selectedItem.qtyremaining) {
        this.notificationService.showError('You have entered more quantity than available.');
        return;
      }

      let qty = Number(this.lengthandFactorForm.extraLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    }

    this.lengthandFactorForm.extraLength.updateValueAndValidity();
  }

  onfactorchange(event: any) {
    if (this.isShowOtherLength) {
      if (this.isShowExtraLength) {
        this.isFactorError = false;
        let qty = Number(this.lengthandFactorForm.extraLength.value) * Number(event.target.value);
        this.lengthandFactorForm.lfqty.setValue(qty);
        return;
      }

      let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleno);
      if (_itemstockdata && Number(this.lengthandFactorForm.otherLength.value) && Number(this.lengthandFactorForm.otherLength.value) > 0) {
        let _itemfactordata = _itemstockdata.data.find(y => y.length == Number(this.lengthandFactorForm.otherLength.value));

        if (_itemfactordata.factor < Number(event.target.value)) {
          this.isFactorError = true;
          return;
        } else {
          this.isFactorError = false;
        }
      }

      let qty = Number(this.lengthandFactorForm.otherLength.value) * Number(event.target.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    } else {
      let qty = Number(this.lengthandFactorForm.itemLength.value) * Number(event.target.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    }
  }

  discountchange() {
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

    if (this.stdItemForm.stdItemUOM.value.toUpperCase() === 'PC') {
      if ((Number(this.stdItemForm.stdItemQty.value) % Number(this.stdItemForm.stdItemPCLength.value)) != 0) {
        this.isItemReady = false;
        this.itemErrorMessage = `Quantity must be in multiples of ${this.stdItemForm.stdItemPCLength.value}`;
        return;
      } else {
        this.isItemReady = true;
        this.itemErrorMessage = null;
      }
    } else if (this.stdItemForm.stdItemUOM.value.toUpperCase() === 'M') {
      if ((Number(this.stdItemForm.stdItemQty.value) % Number(this.stdItemForm.ItemMDQ.value)) != 0) {
        this.isItemReady = false;
        this.itemErrorMessage = `Quantity must be in multiples of ${Number(this.stdItemForm.ItemMDQ.value)}`;
        return;
      } else {
        this.isItemReady = true;
        this.itemErrorMessage = null;
      }
    }

    if (this.rcHeader.rctype == 20) {
      let _remainingQty = this.selectedItem.qtyremaining;
      if (_remainingQty < Number(this.stdItemForm.stdItemQty.value)) {
        this.notificationService.showError(`Quantity can not be more than ${_remainingQty}.`);
        return;
      }
    }

    if (this.offerInformationForm.incoterms.value == 'EXW' || this.offerInformationForm.incoterms.value == 'CFR' || this.offerInformationForm.incoterms.value == 'CIF' || this.offerInformationForm.incoterms.value == 'FOB') {
      producttype = 'TRD';
    } else {
      producttype = 'STD';
    }

    // if (this.itemtype != producttype) {
    this.productmasterService.searchproductalp(this.articleno, producttype, this.currencycode, Number(this.stdItemForm.stdItemQty.value), []).then(
      response => {
        if (response.data && response.data.statusCode == 200) {
          this.itemtype = response.data.data.itemtype;
          this.isItemReady = true;

          this.stdItemForm.ItemMOQ.setValue(response.data.data.moq);
          this.stdItemForm.stdItemPrice.setValue(response.data.data.price);

          if (+this.rcHeader.rcpricebasedon !== 30) { // Fixed Based RC Price
            this.stdItemForm.itemunitnetprice.setValue(this.selectedItem.unitprice);
            this.stdItemForm.itemDiscount.setValue(((Number(this.stdItemForm.stdItemPrice.value) - Number(this.stdItemForm.itemunitnetprice.value)) * 100 / Number(this.stdItemForm.stdItemPrice.value)).toFixed(2));
          } else if (+this.rcHeader.rcpricebasedon === 30) { // ALP Based RC Price
            this.stdItemForm.itemDiscount.setValue(this.selectedItem.discount.toFixed(2));
            this.stdItemForm.itemunitnetprice.setValue((Number(this.stdItemForm.stdItemPrice.value) - ((Number(this.stdItemForm.stdItemPrice.value) * Number(this.stdItemForm.itemDiscount.value) / 100))).toFixed(2));
          }

          this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
          this.itemlevelcuttingcharges = 0;

          this.LengthandFactordata.forEach(element => {
            if (element.isdelete == 0 && element.isother == 1) {
              element.cuttingcharges = this.itemtype == 'STD' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
              this.itemlevelcuttingcharges += Number(element.cuttingcharges);
            }

          });
        } else if (response.data && response.data.statusCode == 400) {
          this.isItemReady = false;
          this.itemtype = null;
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
  }

  onItemUnitnetPriceChange() {
    if (!this.isItemReady) {
      return;
    } else if (Number(this.stdItemForm.itemunitnetprice.value) >= Number(this.stdItemForm.stdItemPrice.value)) {
      this.isItemReady = false;
      this.itemErrorMessage = 'Unit Net Price should not be more than List Price';
      return;
    } else if (Number(this.stdItemForm.itemunitnetprice.value) <= 0) {
      this.isItemReady = false;
      this.itemErrorMessage = 'Unit Net Price should not be less than 0';
      return;
    } else {
      this.isItemReady = true;
      this.itemErrorMessage = null;
    }

    // (List Price - Unit Net Price) * 100 / List Price
    let _tempDiscount = ((Number(this.stdItemForm.stdItemPrice.value) - Number(this.stdItemForm.itemunitnetprice.value)) * 100 / Number(this.stdItemForm.stdItemPrice.value)).toFixed(2);

    this.isItemReady = true;
    this.itemErrorMessage = null;

    this.stdItemForm.itemDiscount.setValue(_tempDiscount);
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

  openImportItemsModal() {
    if (!this.rcDetail) {
      this.notificationService.showError('Please select the Rate Contract first.');
      return;
    }

    this.ImportItemFiles = null;
    this.submitted = false;
    this.modalService.open(this.ImportItems, { size: 'md' }).result.then((result) => {
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
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.rcorderimportitem;
    FileSaver.saveAs(url, SampleEnum.rcorderimportitem);
  }

  private readExcel(isItemSTDTRD: boolean) {
    let readFile = new FileReader();
    if (isItemSTDTRD) {
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
  }

  ValidateImportItemFile(isItemSTDTRD: boolean) {
    if (this.ImportItemFiles && isItemSTDTRD) {
      this.importitemjsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false, defval: null });
      let data = []
      for (let key in this.importitemjsonData[0]) {
        if (data.length != Config.masterfilesheaders.rcorderimportitem.length)
          data.push(key.trim());
      }
      this.importitemheaderList = data;

      if (JSON.stringify(this.importitemheaderList).toUpperCase() != JSON.stringify(Config.masterfilesheaders.rcorderimportitem).toUpperCase()) {
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
    var importitemheader = Config.masterfilesheaders.rcorderimportitem;

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

          if (this.importitemjsonData[i][importitemheader[3]] && this.importitemjsonData[i + 1][importitemheader[3]] && this.importitemjsonData[i][importitemheader[4]] && this.importitemjsonData[i + 1][importitemheader[4]]) {
            this.importitemjsonData[i][importitemheader[3]] = this.importitemjsonData[i][importitemheader[3]] + '|' + this.importitemjsonData[i + 1][importitemheader[3]];
            this.importitemjsonData[i][importitemheader[4]] = (this.importitemjsonData[i][importitemheader[4]] ? this.importitemjsonData[i][importitemheader[4]] : Math.round(+ this.importitemjsonData[i][importitemheader[4]])) + '|' + Math.round(+ this.importitemjsonData[i + 1][importitemheader[4]]);
            this.importitemjsonData[i][importitemheader[6]] = (this.importitemjsonData[i][importitemheader[6]] ? this.importitemjsonData[i][importitemheader[6]] : this.offerInformationForm.reqdeliverydate.value.split("/").reverse().join("/")) + '|' + (this.importitemjsonData[i + 1][importitemheader[6]] ? this.importitemjsonData[i + 1][importitemheader[6]] : this.offerInformationForm.reqdeliverydate.value.split("/").reverse().join("/"));
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
      } else if (!this.rcItems.find(x => x.articleno == this.importitemjsonData[i][importitemheader[1]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Article no not present in selected RC.';
      } else if (Number(this.importitemjsonData[i][importitemheader[2]]) <= 0) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Quantity must be greater than 0';
      } else if (!this.importitemjsonData[i][importitemheader[6]] && !this.offerInformationForm.reqdeliverydate.value) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Req Dlv Date is required.';
      }
      // else if (this.importitemjsonData[i][importitemheader[6]] && Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[6]], '-').date < moment().format('YYYY-MM-DD')) {
      //   this.importitemjsonData[i].rowStatus = false;
      //   this.importitemjsonData[i].Remarks = 'Req Dlv Date must be greater than today date.';
      // }
      else if (this.importitemjsonData[i][importitemheader[5]] && this.importitemjsonData[i][importitemheader[5]].length > 35) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Customer Part no can not be more than 35 char.';
      } else if (this.offerItemStd && this.offerItemStd.length > 0) {
        let existItemCheck = null;
        existItemCheck = this.offerItemStd.filter(z => z.articleno == this.importitemjsonData[i][importitemheader[1]] && z.isDelete == 0);
        if (existItemCheck && existItemCheck.length > 0) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Item already added in the list.`;
        }
      }

      if (!this.importitemjsonData[i][importitemheader[6]] && this.offerInformationForm.reqdeliverydate.value) {
        this.importitemjsonData[i][importitemheader[6]] = this.offerInformationForm.reqdeliverydate.value.split("/").reverse().join("/");
      }

      this.importitemjsonData[i].SrNo = i + 1;
      this.importitemjsonData[i].articleno = this.importitemjsonData[i][importitemheader[1]];
      this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];
    }

    // get stock for import articles
    let _articles = this.importitemjsonData.filter(x => x.rowStatus !== false).map(x => x['ARTICLE NO']).toString();
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
              if (_itemsearcheddata.uom.toUpperCase() == 'PC' && _itemsearcheddata.length) {
                if ((Number(this.importitemjsonData[i][importitemheader[2]]) % Number(_itemsearcheddata.length.split('|')[0])) != 0) {
                  this.importitemjsonData[i].rowStatus = false;
                  this.importitemjsonData[i].Remarks = `Quantity must be in multiples of ${_itemsearcheddata.length.split('|')[0]}`;
                }
              } else if (_itemsearcheddata.uom.toUpperCase() == 'M' && !this.importitemjsonData[i][importitemheader[3]]) {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].Remarks = 'Length is required';
              }

              //if factor is not available then 1
              if (_itemsearcheddata.uom.toUpperCase() == 'M' && !this.importitemjsonData[i][importitemheader[4]]) {
                this.importitemjsonData[i][importitemheader[4]] = "1";
              }

              //set product type
              if (this.offerInformationForm.incoterms.value == 'EXW' || this.offerInformationForm.incoterms.value == 'CFR' || this.offerInformationForm.incoterms.value == 'CIF' || this.offerInformationForm.incoterms.value == 'FOB')
                _producttype = 'TRD';
              else
                _producttype = 'STD';

              let _templengthandfactordata = [];
              if (_itemsearcheddata.uom.toUpperCase() == 'M' && this.importitemjsonData[i].rowStatus == undefined) {
                _itemsearcheddata.length = _itemsearcheddata.length + '|' + 'Cut Length';

                let _templength = this.importitemjsonData[i][importitemheader[3]].split('|');
                let _tempfactor = this.importitemjsonData[i][importitemheader[4]].split('|');
                let _tempreqdlvdate = this.importitemjsonData[i][importitemheader[6]].split('|');
                let isOtherLength: boolean = false;
                let isextraLength: boolean = false;

                let _tempActuallength = _itemsearcheddata.length.split('|');
                for (let k = 0; k < _templength.length && k < _tempfactor.length; k++) {
                  isOtherLength = false;
                  isextraLength = false;

                  isOtherLength = !_tempActuallength.includes(_templength[k]);

                  let _tempitemstockdata = this.importitemsstockdata.find(x => x.articleno == _itemsearcheddata.articleno);

                  if (!isOtherLength && _tempitemstockdata && Number(_templength[k]) && Number(_templength[k]) > 0) {
                    let _itemfactordata = _tempitemstockdata.data.find(y => y.length == Number(_templength[k]));

                    if (isOtherLength && _itemfactordata && _itemfactordata.factor < Number(_tempfactor[k])) {
                      this.importitemjsonData[i].rowStatus = false;
                      this.importitemjsonData[i].Remarks = `Max. ` + _itemfactordata.factor + ` factor(s) is available with ` + _templength[k] + ` cut length.`;
                    }
                  } else if (isOtherLength && _tempitemstockdata && Number(_templength[k]) && Number(_templength[k]) > 0) {
                    let _itemfactordata = _tempitemstockdata.data.find(y => y.length == Number(_templength[k]));

                    if (isOtherLength && _itemfactordata && _itemfactordata.factor < Number(_tempfactor[k])) {
                      this.importitemjsonData[i].rowStatus = false;
                      this.importitemjsonData[i].Remarks = `Max. ` + _itemfactordata.factor + ` factor(s) is available with ` + _templength[k] + ` cut length.`;
                    }
                  }

                  // if (_tempreqdlvdate[k] && Config.ExcelDateToJSDate(_tempreqdlvdate[k], '-').date < moment().format('YYYY-MM-DD')) {
                  //   this.importitemjsonData[i].rowStatus = false;
                  //   this.importitemjsonData[i].Remarks = 'Length Req Dlv Date must be greater than today date.';
                  // }

                  if (isOtherLength && Number(_templength[k]) && Number(_templength[k]) > 0) {
                    let filteredX = _tempitemstockdata && _tempitemstockdata.length ? _tempitemstockdata.length.map(x => x.length) : [];

                    if (!filteredX.includes(Number(_templength[k]))) {
                      isextraLength = true;
                    }
                  }

                  if (_itemsearcheddata.uom.toUpperCase() == 'M' && this.importitemjsonData[i].rowStatus == undefined) {
                    let _tempArr = {
                      id: 0,
                      length: _templength[k],
                      factor: _tempfactor[k] ? Math.round(+_tempfactor[k]) : 1,
                      quantity: Number(_templength[k]) * (_tempfactor[k] ? Math.round(+_tempfactor[k]) : 1),
                      isdelete: 0,
                      cuttingcharges: 0,
                      isother: isOtherLength && isextraLength ? 1 : 0,
                      lengthreqdeliverydate: _tempreqdlvdate[k] && Config.dateisGreaterThanEqualtoTodayDate(_tempreqdlvdate[k]) ? Config.ExcelDateToJSDate(_tempreqdlvdate[k], '/').date.split('/').reverse().join('/') : ""
                    }

                    _templengthandfactordata.push(_tempArr);
                  }
                }
              }

              let _tempALPdata = this.importitemjsonData.find(x => x['ARTICLE NO'] == response.item[0].articleno);

              if (response.item[0].uom.toUpperCase() == 'M') {
                this.importitemjsonData[i].quantity = 0;

                _templengthandfactordata.forEach(element => {
                  this.importitemjsonData[i].quantity += element.quantity;
                });
              } else {
                this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];
              }

              let tempSelectedItem = this.rcItems.find(x => x.articleno == _itemsearcheddata.articleno);

              // remaining quantity validation
              if (this.rcHeader.rctype == 20 && tempSelectedItem.qtyremaining < this.importitemjsonData[i].quantity) {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].Remarks = `Quantity can not be more than ${tempSelectedItem.qtyremaining}.`;
              }

              // validate UOM == M, for quantity must be in multiply with MDQ
              if (_itemsearcheddata.uom.toUpperCase() == 'M' && (Number(this.importitemjsonData[i].quantity) % Number(_itemsearcheddata.mdq)) != 0) {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].Remarks = `Quantity must be in multiples of ${_itemsearcheddata.mdq}`;
              }

              if (this.importitemjsonData[i].rowStatus == undefined) {
                //call api to get alp
                await this.productmasterService.searchproductalp(_itemsearcheddata.articleno, _producttype, 'INR', this.importitemjsonData[i].quantity, this.importitemsstockdata).then(
                  response => {
                    if (response.data && response.data.statusCode == 200) {

                      // find max req dlv date to set item req dlv date
                      let itemRequiredDeliveryDate = this.importitemjsonData[i][importitemheader[6]].split('|')[0] && Config.dateisGreaterThanEqualtoTodayDate(this.importitemjsonData[i][importitemheader[6]].split('|')[0]) ? Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[6]].split('|')[0], '/').date : "";
                      if (_templengthandfactordata.length > 0) {

                        let dates = _templengthandfactordata.map(x => x.lengthreqdeliverydate);

                        if (dates.filter(x => x).length > 0) {
                          let maxDate = Math.max.apply(Math, dates.map(x => new Date(x.split("/").reverse().join()).getTime()).map(function (o) { return o; }))
                          itemRequiredDeliveryDate = moment(new Date(maxDate)).format("YYYY/MM/DD");
                        }
                      }

                      this.importitemjsonData[i].SrNo = i + 1;
                      this.importitemjsonData[i].seqno = Number(this.importitemjsonData[i][importitemheader[0]]);
                      this.importitemjsonData[i].articleno = _itemsearcheddata.articleno;
                      this.importitemjsonData[i].description = _itemsearcheddata.description;
                      this.importitemjsonData[i].pclength = _itemsearcheddata.uom.toUpperCase() == 'PC' ? Number(_itemsearcheddata.length.split('|')[0]) : '';
                      this.importitemjsonData[i].sapid = _itemsearcheddata.sapid;
                      this.importitemjsonData[i].itemtype = response.data.data.itemtype;
                      this.importitemjsonData[i].msq = _itemsearcheddata.msq;
                      this.importitemjsonData[i].mdq = _itemsearcheddata.mdq;
                      this.importitemjsonData[i].moq = response.data.data.moq;
                      this.importitemjsonData[i].uom = _itemsearcheddata.uom;
                      this.importitemjsonData[i].length = _itemsearcheddata.length;
                      this.importitemjsonData[i].price = Number(response.data.data.price);
                      this.importitemjsonData[i].factor = this.importitemjsonData[i][importitemheader[4]];
                      this.importitemjsonData[i].lengthandfactor = _templengthandfactordata;
                      this.importitemjsonData[i].customerpartno = this.importitemjsonData[i][importitemheader[5]];
                      this.importitemjsonData[i].reqdlvdate = itemRequiredDeliveryDate;
                      this.importitemjsonData[i].rowStatus = true;
                      this.importitemjsonData[i].Remarks = null;

                      let _tempitemlevelcuttingcharges = 0;
                      _templengthandfactordata.forEach(element => {
                        if (element.isdelete == 0 && element.isother == 1) {
                          element.cuttingcharges = response.data.data.itemtype == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
                          _tempitemlevelcuttingcharges += Number(element.cuttingcharges);
                        }
                      });
                      _tempALPdata.cuttingcharges = _tempitemlevelcuttingcharges;

                      if (+this.rcHeader.rcpricebasedon !== 30) { // Fixed Based RC Price
                        _tempALPdata.unitprice = tempSelectedItem.unitprice
                        _tempALPdata.discount = ((Number(response.data.data.price) - Number(tempSelectedItem.unitprice)) * 100 / Number(response.data.data.price)).toFixed(2);
                      } else if (+this.rcHeader.rcpricebasedon === 30) { // ALP Based RC Price
                        _tempALPdata.discount = tempSelectedItem.discount;
                        _tempALPdata.unitprice = (Number(response.data.data.price) - (Number(response.data.data.price) * Number(tempSelectedItem.discount) / 100)).toFixed(2);
                      }
                    } else if (response.data && response.data.statusCode == 400) {
                      this.importitemjsonData[i].rowStatus = false;
                      this.importitemjsonData[i].Remarks = response.data.errormessage;
                    }
                  });
              }
            } else {
              this.importitemjsonData[i].SrNo = i + 1;
              this.importitemjsonData[i].articleno = this.importitemjsonData[i][importitemheader[1]];
              this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];
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
          id: 0,
          itemId: 0,
          itemSeqId: this.getSeqID(this.offerItemStd),
          seqno: element.seqno ? element.seqno : this.getSeqNo(),
          articleno: element.articleno,
          itemtype: element.itemtype,
          articledesc: element.description,
          sapid: element.sapid,
          quantity: Number(element.quantity),
          msq: element.msq,
          moq: element.moq,
          uom: element.uom,
          mdq: element.mdq,
          enquiredquantity: Number(element.quantity),
          customerpartno: element.customerpartno,
          price: Number(element.price),
          unitprice: Number(element.unitprice),
          discount: Number(element.discount),
          netvalue: this.calculateTotalinItemPopupByUnitPrice(element.unitprice, element.quantity),
          isdelete: 0,
          length: element.length,
          pclength: element.pclength,
          lengthandfactor: element.lengthandfactor,
          cuttingcharges: element.cuttingcharges,
          GrossMargin: 0,
          RMCGrossMargin: 0,
          TargetGrossMargin: 0,
          reqdlvdate: element.reqdlvdate ? element.reqdlvdate.split('/').reverse().join('/') : ''
        }

        this.items = this.ItemsForm.get('items') as FormArray;
        this.items.push(this.createItem());

        this.offerItemStd.push(itemModel);
        if (this.offerItemStd.length > 0) {
          this.stdItem = true;
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
      this.totalnetvalue += Number(element.netvalue);
      this.offerlevelcuttingcharges += Number(element.cuttingcharges);
    });
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

  onRCSelect(event: any) {
    if (!this.offerItemStd.length) {
      this.selectedRC = Number(event.target.value);
      this.getRCDetail();
    } else {
      this.notificationService.showError('RC cannot be changed untill you delete all the items from list.');
      return;
    }
  }

  getRCDetail() {
    this.ratecontractService.getRCDetail(this.selectedRC, false).subscribe(
      response => {
        this.rcDetail = response.responsedata.data;
        this.rcHeader = response.responsedata.data.rcheader;
        this.rcItems = response.responsedata.data.rcitems;

        this.rcItems.forEach(element => {
          element.discount = +(element.discount)
        });

        let rcPriceBasedOn = this.priceBasedonList.find(p => p.code == +this.rcHeader.rcpricebasedon).description;
        this.offerInformationForm.pricebasedon.setValue(rcPriceBasedOn);
        this.offerInformationForm.vertical.setValue(this.rcHeader.vertical);
        this.offerInformationForm.segment.setValue(this.rcHeader.segment);

        if (this.isAdd) {
          if (this.rcHeader.soldtoparty && this.rcHeader.shiptoparty) {
            this.offerInformationForm.soldtoparty.setValue(this.rcHeader.soldtoparty.toString());
            this.offerInformationForm.shiptoparty.setValue(this.rcHeader.shiptoparty);

            this.GetSoldtoPartyList(this.rcHeader.soldtoparty);
            this.GetShiptoPartyList();
          } else {
            this.notificationService.showError('Sold to Party is not available');
            return;
          }
        }

        if (this.orderFromRC) {
          this.ratecontracts.push(this.rcHeader);
        }

        if (this.rcHeader.rcfor == 20) {
          this.isOrderIndirect = true;
          let dealercommission = this.rcHeader.dealercommission ? Number((this.rcHeader.dealercommission * 100).toFixed(2)) : 0;
          this.DealerCommisionPer = dealercommission;
          this.offerInformationForm.dealercommission.setValue(dealercommission);
          this.getCustomerbySFDCId(this.rcHeader.account);
        } else {
          this.isOrderIndirect = false;
          let dealercommission = 0;
          this.DealerCommisionPer = 0
          this.offerInformationForm.dealercommission.setValue(dealercommission);
          this.GetNacecodebySAPId(this.rcHeader.soldtoparty);
        }

      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getCustomerbySFDCId(sfdcId: string) {
    this.customerService.getCustomerbySFDCId(sfdcId).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.customerData = response.responsedata.data[0];
          this.offerInformationForm.account.setValue(this.customerData.sapid + " - " + this.customerData.customername);

          if (this.customerData.sapid)
            this.getNaceCodebySAPIdandNacecode(this.customerData.sapid, this.customerData.nacecode);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OfferfileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateOfferFiles(event.target.files)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.OfferFiles.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  OfferFileRemove(index: number) {
    this.OfferFiles.splice(index, 1);
  }

  ValidateOfferFiles(files: any) {
    if (files.length > this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }

    if (this.OfferFiles.length == this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }

    if (this.OfferFiles.length + files.length > this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }

    for (let file of files) {
      if (file.size > this.filesize) {
        this.notificationService.showError('File exceeds the maximum size of ' + this.filesize);
        return false;
      }
    }

    return true;
  }

  onSearchProductClick() {
    if (this.rcItems) {
      this.totalRows = this.rcItems.length;

      if (this.totalRows > 0) {
        this.productmasterlist = this.rcItems;
        // this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);

        if (this.isProductSearchFirst)
          this.modalRef = this.modalService.open(this.ProductSearchModel, { size: 'lg' });
      } else {
        this.notificationService.showError('There is no product avaiable.');
        this.productmasterlist = [];
      }
    }
  }

  // setPage(page: number) {
  //   this.pageNumber = page;
  //   this.isProductSearchFirst = false;
  //   this.onSearchProductClick();
  // }

  // onSearch(response) {
  //   this.productsearchValue = '';
  //   if (response && response.searchValue) {
  //     this.productsearchValue = response.searchValue;
  //   }
  //   this.pageNumber = 1;
  //   this.isProductSearchFirst = false;
  //   this.onSearchProductClick();
  // }

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
    this.articleno = null;
    this.itemsapid = null;
    this.stdItemSearched = null;
    this.msq = null;
    this.stdItemForm.stdItemName.setValue(null);
    this.stdItemForm.stdItemUOM.setValue(null);
    this.stdItemForm.stdItemMOQ.setValue(null);
    this.stdItemForm.stdItemPCLength.setValue(null);
    this.stdItemForm.ItemMOQ.setValue(null);
    this.stdItemForm.ItemMDQ.setValue(null);
    this.qtydisable = false;
    this.showpclength = false;
    this.lengthandfactorbtndisable = true;
    this.itemLengthList = [];
    this.stdItemForm.enquiredquantity.setValue(null);
    this.stdItemForm.stdItemQty.setValue(null);
    this.stdItemForm.stdItemPrice.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.seqno.setValue(null);
    this.stdItemForm.itemstock.setValue(null);
    // this.stdItemForm.importby.setValue(null);
    this.stdItemForm.itemDiscount.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.stdItemCatalog.setValue(null);
    this.stdItemForm.customerpartno.setValue('');
    this.stdItemForm.itemtotal.setValue(null);
    this.LengthandFactordata = [];
    this.isItemReady = true;
    this.itemErrorMessage = null;
    this.submitted = false;
  }

  GetSoldtoPartyList(sapid: string) {
    this.offersService.getSoldtoPartyFilterSearch(this.offerInformationForm.soldtoparty.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.soldtopartySearchList = response.responsedata.data;

          if (this.isAdd)
            this.GetSoldtoPartyDetail(true);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetSoldtoPartyDetail(event: any) {
    if (event) {
      this.offersService.getSoldtoPartyDetail(this.offerInformationForm.soldtoparty.value).subscribe(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.offerInformationForm.soldtopartyname.setValue(response.responsedata.data[0].name1);
            this.offerInformationForm.soldstreet1.setValue(response.responsedata.data[0].housenumber);
            this.offerInformationForm.soldstreet2.setValue('');
            this.offerInformationForm.solddistrict.setValue(response.responsedata.data[0].district);
            this.offerInformationForm.soldcity.setValue(response.responsedata.data[0].city);
            this.offerInformationForm.soldpostalcode.setValue(response.responsedata.data[0].postalcode);
            this.offerInformationForm.soldregion.setValue(response.responsedata.data[0].region);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.offerInformationForm.soldtopartyname.setValue(null);
      this.offerInformationForm.soldstreet1.setValue(null);
      this.offerInformationForm.soldstreet2.setValue(null);
      this.offerInformationForm.solddistrict.setValue(null);
      this.offerInformationForm.soldcity.setValue(null);
      this.offerInformationForm.soldpostalcode.setValue(null);
      this.offerInformationForm.soldregion.setValue(null);
      this.offerInformationForm.shiptoparty.setValue(null);
      this.shiptopartySearchList = [];
      this.offerInformationForm.shiptopartyname.setValue(null);
      this.offerInformationForm.shipstreet1.setValue(null);
      this.offerInformationForm.shipstreet2.setValue(null);
      this.offerInformationForm.shipdistrict.setValue(null);
      this.offerInformationForm.shipcity.setValue(null);
      this.offerInformationForm.shippostalcode.setValue(null);
      this.offerInformationForm.shipregion.setValue(null);
    }
  }

  GetShiptoPartyList() {
    this.offersService.getShiptoPartySearch(this.offerInformationForm.soldtoparty.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.shiptopartySearchList = response.responsedata.data;

          let _ShiptoParty = this.shiptopartySearchList.find(x => x.partner == this.offerInformationForm.shiptoparty.value);
          if (_ShiptoParty && this.isAdd) {
            this.offerInformationForm.shiptoparty.setValue(_ShiptoParty.partner);
            this.GetShiptoPartyDetail(true);
          }
        } else {
          this.shiptopartySearchList = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetShiptoPartyDetail(event: any) {
    if (event) {
      if (this.offerInformationForm.soldtoparty.value > 0 && this.offerInformationForm.shiptoparty.value > 0) {
        this.offersService.getShiptoPartyDetail(this.offerInformationForm.soldtoparty.value, this.offerInformationForm.shiptoparty.value).subscribe(
          response => {
            if (response.responsedata && response.responsedata.statusCode == 200) {
              this.offerInformationForm.shiptopartyname.setValue(response.responsedata.data[0].name1);
              this.offerInformationForm.shipstreet1.setValue(response.responsedata.data[0].housenumber);
              this.offerInformationForm.shipstreet2.setValue('');
              this.offerInformationForm.shipdistrict.setValue(response.responsedata.data[0].district);
              this.offerInformationForm.shipcity.setValue(response.responsedata.data[0].city);
              this.offerInformationForm.shippostalcode.setValue(response.responsedata.data[0].postalcode);
              this.offerInformationForm.shipregion.setValue(response.responsedata.data[0].region);
            }
          }, error => {
            this.notificationService.showError(error.error.error.message);
          });
      }
    } else {
      this.offerInformationForm.shiptopartyname.setValue(null);
      this.offerInformationForm.shipstreet1.setValue(null);
      this.offerInformationForm.shipstreet2.setValue(null);
      this.offerInformationForm.shipdistrict.setValue(null);
      this.offerInformationForm.shipcity.setValue(null);
      this.offerInformationForm.shippostalcode.setValue(null);
      this.offerInformationForm.shipregion.setValue(null);
    }
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

  finddiscountper(discount: any, decimal: number) {
    return (Number(discount) + ((100 - Number(discount)) * this.DealerCommisionPer / 100)).toFixed(decimal);
  }

  findnetunitprice(unitprice: number, quantity: number) {
    return Number(Number(unitprice - (unitprice * this.DealerCommisionPer / 100)).toFixed(2)) * quantity;
    // (stditem.unitprice - (stditem.unitprice * DealerCommisionPer / 100)) * stditem.quantity)
  }

  onsendEmailClick() {
    location.href = "mailto:veron@gmail.com?subject=hello&body=fggf";
    // window.open('mailto:someone@somewhere.com?Subject=hello','email');
  }

  // onHeaderLevelDiscountChange() {
  //   if (this.offerItemStd && this.offerItemStd.length > 0) {
  //     this.offerItemStd.forEach(element => {
  //       element.discount = Number(this.offerInformationForm.headerleveldiscount.value)
  //       element.unitprice = (Number(element.price) - ((Number(element.price) * Number(element.discount) / 100))).toFixed(2);
  //     });
  //     this.reviseItemCalculation();
  //   }
  // }

  // reviseItemCalculation() {
  //   if (this.offerItemStd && this.offerItemStd.length > 0) {
  //     this.offerItemStd.forEach(element => {
  //       element.netvalue = Number((element.unitprice * element.quantity).toFixed(2))
  //     });

  //     this.updateTotalValues();
  //   }
  // }

  // onFreightChagesChange() {
  //   if (this.currencycode == 'USD') {
  //     this.OfferFreightCharges = Number((Number(this.itemsForm.freightcharges.value) * Number(this.USDrate)).toFixed(2));
  //   } else if (this.currencycode == 'EUR') {
  //     this.OfferFreightCharges = Number((Number(this.itemsForm.freightcharges.value) * Number(this.EURrate)).toFixed(2));
  //   } else if (this.currencycode == 'INR') {
  //     this.OfferFreightCharges = Number(this.itemsForm.freightcharges.value);
  //   }
  // }

  // onRefreshAccountPartners() {
  //   console.log(this.oppoData.customer_id);

  //   this.stockorderService.RefreshAccountsList({ dealerId: this.oppoData.customer_id }).subscribe(
  //     response => {
  //       if (response.responsedata && response.responsedata.statusCode == 200) {
  //         this.notificationService.showSuccess(response.responsedata.message);
  //       } else if (response.responsedata && response.responsedata.statusCode == 400) {
  //         this.notificationService.showError(response.responsedata.message);
  //       }
  //     }, error => {
  //       this.notificationService.showError(error.error.message);
  //     });
  // }

  async onPONumberSaveClick() {
    this.submitted = true;

    if (this.ManagePOForm.invalid)
      return;

    let pomodel = {
      orderid: this.orderId,
      Id: this.poId,
      ponumber: this.managePOForm.ponumber.value,
      podate: this.managePOForm.podate.value.split('/').reverse().join('-'),
      customerponumber: this.managePOForm.customerponumber.value,
      attachmentid: 0
    }

    if (this.pofiles.length > 0)
      await this.UploadManagePOFile(pomodel);

    this.SavePO(pomodel);
  }

  SavePO(pomodel: any) {
    this.rcOrdersService.SavePO(pomodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess('PO number updated successfully.');

          this.RedirectTo();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSOnoSaveClick() {
    this.submitted = true;

    if (this.SOnoForm.invalid)
      return;

    this.rcOrdersService.SaveSOno(this.orderId, this.sonoForm.sono.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess('SO no updated successfully.');

          this.RedirectTo();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onCreateOrderClick() {
    this.rcOrdersService.CreateSAPOrder(this.orderId).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess('Order created successfully.');

          this.RedirectTo();
        }
      }, error => {
        this.soerror = error.error.error.message;
        this.notificationService.showError(error.error.error.message);
      });
  }

  // onCPOVaidatorSave() {
  //   this.submitted = true;

  //   if (this.CPOValidatorForm.invalid)
  //     return;

  //   let cpovalidatormodel = {
  //     orderId: this.orderId,
  //     comment: this.cpovalidatorForm.cpocomment.value
  //   }

  //   this.stockorderService.SaveCPOValidator(cpovalidatormodel).subscribe(
  //     response => {
  //       if (response.responsedata && response.responsedata.statusCode == 200) {
  //         this.notificationService.showSuccess('CPO Validation saved successfully.');

  //         this.RedirectTo();
  //       }
  //     }, error => {
  //       this.notificationService.showError(error.error.error.message);

  //       this.RedirectTo();
  //     });
  // }

  RedirectTo() {
    this.router.navigate(['/rcorders/list']);
  }

  // onCuttingChargesUpdate(id: number, cuttingcharges: number) {
  //   this.itemCuttingChargesId = id;
  //   this.cuttingChargesForm.itemcuttingcharges.setValue(cuttingcharges);

  //   this.modalRef = this.modalService.open(this.CuttingChargesModel, { size: 'sm' });
  // }

  // onCuttingChargesSaveClick() {
  //   let savecuttingchargesmodel = {
  //     orderid: this.orderId,
  //     itemid: this.itemid,
  //     itemcuttingchargesid: this.itemCuttingChargesId,
  //     cuttingcharges: Number(this.cuttingChargesForm.itemcuttingcharges.value)
  //   }

  //   this.LengthandFactordata.find(x => x.id == this.itemCuttingChargesId).cuttingcharges = Number(this.cuttingChargesForm.itemcuttingcharges.value);

  //   this.itemlevelcuttingcharges = 0;
  //   this.LengthandFactordata.forEach(element => {
  //     if (element.isdelete == 0) {
  //       // element.cuttingcharges = this.itemtype == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
  //       this.itemlevelcuttingcharges += Number(element.cuttingcharges);
  //     }
  //   });

  //   this.offerItemStd.find(x => x.id == this.itemid).cuttingcharges = this.itemlevelcuttingcharges;

  //   this.offerlevelcuttingcharges = 0;
  //   this.offerItemStd.forEach(element => {
  //     this.offerlevelcuttingcharges += Number(element.cuttingcharges);
  //   });

  //   this.SaveCuttingCharges(savecuttingchargesmodel);
  // }

  // SaveCuttingCharges(savecuttingchargesmodel: any) {
  //   this.stockorderService.savecuttingcharges(savecuttingchargesmodel).subscribe(
  //     response => {
  //       if (response.responsedata && response.responsedata.statusCode == 200) {
  //         this.notificationService.showSuccess(response.responsedata.message);
  //         if (this.modalRef)
  //           this.modalRef.close();
  //       }
  //     }, error => {
  //       this.notificationService.showError(error.error.error.message);
  //     });
  // }

  isValidMOQ(item: any) {
    return Config.isValidMOQ(item);
  }

  getNaceCodebySAPIdandNacecode(sapid: string, nacecode: string) {
    this.customerService.getNacecodebySapIdandNaceCode(sapid, nacecode).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data.length) {
          if (response.responsedata.data && response.responsedata.data.length) {
            this.offerInformationForm.nacecode.setValue(response.responsedata.data[0].code.trim() + " : " + response.responsedata.data[0].description);
            this.offerInformationForm.nacelevel.setValue(response.responsedata.data[0].level);
            this.offerInformationForm.businessmodel.setValue(response.responsedata.data[0].businessmodel);
          } else
            this.resetNaceCodeFields();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetNacecodebySAPId(sapid: string) {
    this.customerService.getNacecodebySapId(sapid).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data.length) {
          this.offerInformationForm.nacecode.setValue(response.responsedata.data[0].code.trim() + " : " + response.responsedata.data[0].description);
          this.offerInformationForm.nacelevel.setValue(response.responsedata.data[0].level);
          this.offerInformationForm.businessmodel.setValue(response.responsedata.data[0].businessmodel);
        } else
          this.resetNaceCodeFields();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  resetNaceCodeFields() {
    this.offerInformationForm.nacecode.setValue(null);
    this.offerInformationForm.nacelevel.setValue(null);
    this.offerInformationForm.businessmodel.setValue(null);
  }

  onRCItemsClick(rcId: number) {
    this.ratecontractService.getRCItems(rcId).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.SelectedRCItems = response.responsedata.data;
          this.modalRef = this.modalService.open(this.RCItemsModel, { size: 'lg' });
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  headerClick(event) {

  }

  async onStockSearch(isimport: boolean, articles: any) {
    if (isimport) {
      this.importitemsstockdata = null;
      await this.stockorderService.StockAvailability(articles, isimport, true).then(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.importitemsstockdata = response.responsedata.data;

            let filteredX = this.importitemsstockdata.map(itemX => { return itemX.articleno });
            let filteredY = this.OrderStockData.map(itemY => { return itemY.articleno });
            let filteredZ = filteredX.filter(itemX => !filteredY.includes(itemX));

            filteredZ.forEach(element => {
              this.OrderStockData.push(this.importitemsstockdata.find(x => x.articleno == element));
            });
          } else if (response.responsedata && response.responsedata.statusCode == 400) {
            this.notificationService.showError(response.responsedata.message);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      if (this.articleno) {
        let _tempitemstockdata = this.OrderStockData.find(x => x.articleno == this.articleno);
        if (!_tempitemstockdata) {
          await this.stockorderService.StockAvailability(this.itemsapid, false, true).then(
            response => {
              if (response.responsedata && response.responsedata.statusCode == 200) {
                this.StockData = response.responsedata.data[0].data;
                this.isItemStockdataAvailable = true;

                this.OrderStockData.filter(x => x.articleno == this.itemsapid);
                this.OrderStockData.push(response.responsedata.data[0]);

                this.stdItemForm.itemstock.setValue(response.responsedata.data[0].totalqty);
                this.ItemStockValue = this.stdItemForm.itemstock.value;

              } else if (response.responsedata && response.responsedata.statusCode == 400) {
                this.notificationService.showError(response.responsedata.message);
              }
            }, error => {
              this.notificationService.showError(error.error.error.message);
            });
        } else {
          this.StockData = _tempitemstockdata.data;
          this.isItemStockdataAvailable = true;

          this.stdItemForm.itemstock.setValue(_tempitemstockdata.totalqty);
          this.ItemStockValue = this.stdItemForm.itemstock.value;
        }
      } else {
        this.notificationService.showError('Please select the article first.');
        return;
      }
    }
  }

  getcuttingcharges() {
    this.offersService.getcuttingcharges(this.orderId, null, null).subscribe(
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
                if (element2.isdelete == 0 && element2.isother == 1) {
                  element2.cuttingcharges = element.itemtype == 'STD' ? Number(element2.factor) * Number(this.stdcuttingchargesfinal) : Number(element2.factor) * Number(this.trdcuttingchargesfinal)
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

  validateandConvertDatetoFormat(date: any) {
    return date != null && date != undefined && date != "" && !date.includes("0000-00-00") ? this.datePipe.transform(date, this.dateformate) : null
  }

  getLookupDatas() {
    let data = { "lookup_type": "vertical,segment" };

    this.lookupService.getLookupdata(data).subscribe(response => {
      this.verticals = response.lookups.filter(lookup => lookup.lookup_type === "vertical");
      this.segments = response.lookups.filter(lookup => lookup.lookup_type === "segment");
    }, error => {
      this.notificationService.showError(error.error.error.message);
    });
  }
}
