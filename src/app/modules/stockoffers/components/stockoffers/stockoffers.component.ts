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
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-stockoffers',
  templateUrl: './stockoffers.component.html',
  styleUrls: ['./stockoffers.component.css']
})
export class StockoffersComponent implements OnInit {

  OfferInformationForm: FormGroup;
  AccountContactDetail: FormGroup;
  TermsandConditionForm: FormGroup;
  SpecialTextForm: FormGroup;
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
  ItemAdditionalFieldsForm: FormGroup;
  CuttingChargesForm: FormGroup;
  NaceDetailForm: FormGroup;

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
  // sprItem: boolean = false;
  items: FormArray;
  // spritems: FormArray;
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
  // files: any[] = [];
  pofiles: any[] = [];
  stdItemEdit: boolean = false;
  // sprItemEdit: boolean = false;
  offerValidMaxdate: any;
  offerValidMindate: any;
  offerID: number = 0;
  // StockOfferType: number = 0;
  offerNo: string = '';
  todayMinDate: { year: number; month: number; day: number };
  offervalidfromDate: { year: number; month: number; day: number };
  offervalidtoDate: { year: number; month: number; day: number };
  poDate: { year: number; month: number; day: number };
  CustomerPODate: { year: number; month: number; day: number };
  // afpoDate: { year: number; month: number; day: number };
  reqdeliveryDate: { year: number; month: number; day: number };
  itemreqdeliveryDate: { year: number; month: number; day: number };
  pricingDate: { year: number; month: number; day: number };
  firstDate: { year: number; month: number; day: number };
  lengthreqdeliveryDate: { year: number; month: number; day: number };
  defaultDate :{ year: number; month: number; day: number };
  offerItemStd: any[] = [];
  // offerItemSPR: any[] = [];
  articleNo: string = '';
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
  itemType: string;
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
  isOfferIndirect: boolean = false;
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
  contactdetail: any[] = [];
  // searchedcontactdetail: any[] = [];
  selectedcontact: number = 0;
  spritemid: number;
  SPRItemArticleNo: string;
  oppoid: string;
  lappoppoid: string;
  spritemindex: number;
  SPRStatus: number;
  SPRShowStatus: string;
  SPRActionRequired: string;
  deletedItem: boolean = false;
  deletedSPRItem: boolean = false;
  offerDeletedItem: any[] = [];
  offerDeletedSPRItem: any[] = [];
  ImportItemFiles: any;
  worksheet: XLSX.WorkSheet;
  importitemjsonData: any[] = [];
  importspritemjsonData: any[] = [];
  ImportItemsfileUploaded: any;
  storeData: any;
  importItemStatus: any[] = [];
  @ViewChild('specialtermsdeletemodel', { static: false }) specialtermsdeletemodel: any;
  @ViewChild('stditemdeletemodel', { static: false }) stditemdeletemodel: any;
  @ViewChild('offerapprovemodel', { static: false }) offerapprovemodel: any;
  @ViewChild('offerrejectmodel', { static: false }) offerrejectmodel: any;
  @ViewChild('ProductSearchModel', { static: false }) ProductSearchModel: any;
  @ViewChild('ItemAdditionalFieldsModel', { static: false }) ItemAdditionalFieldsModel: any;
  @ViewChild('itemdeleteallmodel', { static: false }) itemdeleteallmodel: any;
  @ViewChild('stockmodel', { static: false }) stockmodel: any;
  @ViewChild('CuttingChargesModel', { static: false }) CuttingChargesModel: any;
  @ViewChild('NaceCodeModal', { static: false }) NaceCodeModal: any;
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
    { code: "CCA", description: 'Godown del consignee copy attn' },
    { code: "DCC", description: 'DoorDelivery ag Consignee Copy' },
    { code: "DD", description: 'Door Delivery' },
    { code: "GD", description: 'Godown Delivery' }];

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
  isShowOverallMargin: boolean = false;
  // isShowOverallRGroupMargin: boolean = false;
  shiptopartyList: any[] = [];
  // ItemAdditionalFieldsList: any[] = [];
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
  sbuofOrderList: any[] = [
    { code: '01', description: 'OEM' },
    { code: '02', description: 'Projects' },
    { code: '03', description: 'Catalogue' },
    { code: '', description: 'New' }];
  specialtexttypeList: any[] = [
    { code: '0001', description: 'INSTRUCTIONS:LOGISTIC/CPP/PROD' },
    { code: '0002', description: 'INSTRUCTIONS TO TRANSPORTER' },
    { code: '0003', description: 'LC NUMBER' }];
  importbyList: any[] = [
    { code: '0006', description: 'Air' }];
  paymenttermsList: any[] = [
    { code: "ZD11", description: "0%CD,0%PPDPayment within45days" },
    { code: "ZCD4", description: "1.5%CD 7 Days, Due Net After 45 Days" }];
  MROTypeList: any[] = [
    { code: 'YES', description: 'YES' },
    { code: 'NO', description: 'NO' }];
  employeeresponsibleList: any[] = [];
  OrderType: number = 20;
  optStockOrder: boolean = true;
  optCPOOrder: boolean = false;
  optCompleteDlvNo: boolean = true;
  optCompleteDlvYes: boolean = false;
  StockData: any[] = [];
  EmployeeResponsibleList: any[] = [];
  EmployeeResponsibleName: string = '';
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
  // itemCuttingCharges: number = 0;
  NacecodeList: any[] = [];
  BusinessModelList: any[] = [
    { code: 'Project', description: 'Project' },
    { code: 'VAS', description: 'VAS' },
    { code: 'E-Mobility', description: 'E-Mobility' },
    { code: 'Catalog', description: 'Catalog' }];
  showpclength: boolean = false;
  SelectedEndCustomerId: string = "";
  SelectedEndCustomer: string = "";
  addQuantity = {
    id: 0,
    quantity: null,
    reqdeliverydate: null
  }
  quantityData: any[] = [];
  errorMessage: string = "";
  subErrorMessage: string = "";
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
      importby: ''
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
    private opportunitiesService: OpportunitiesService,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
    private productmasterService: ProductmasterService,
    private pagerServcie: PagerService,
    private stockorderService: StockorderService,
    private notificationService: NotificationService
  ) { }

  get offerInformationForm() { return this.OfferInformationForm.controls }
  get accountContactDetail() { return this.AccountContactDetail.controls }
  get itemsForm() { return this.ItemsForm.controls }
  get stdItemForm() { return this.StdItemForm.controls }
  get specialTextForm() { return this.SpecialTextForm.controls }
  get lengthandFactorForm() { return this.LengthandFactorForm.controls }
  // get otherForm() { return this.OtherForm.controls }
  get termsandConditionForm() { return this.TermsandConditionForm.controls }
  get importItemsForm() { return this.ImportItemsForm.controls }
  get rejectForm() { return this.RejectForm.controls }
  get approveForm() { return this.ApproveForm.controls }
  get managePOForm() { return this.ManagePOForm.controls }
  get sonoForm() { return this.SOnoForm.controls }
  get cpovalidatorForm() { return this.CPOValidatorForm.controls }
  get itemAdditionalFieldsForm() { return this.ItemAdditionalFieldsForm.controls }
  get cuttingChargesForm() { return this.CuttingChargesForm.controls }
  get naceDetailForm() { return this.NaceDetailForm.controls }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.offerID = parms['id'];
      this.OrderType = parms['type'];
    });

    this.onLoad();
  }

  private onLoad() {
    this.GetNaceCodeList();

    this.dateformate = this.authService.getDateFormat();
    this.userid = this.authService.getUserId();
    this.username = this.authService.getUserName();
    this.userrolecode = this.authService.getUserRoleCode();
    this.usertype = this.authService.getCurrentUser().usertype;
    this.isdealer = this.authService.getCurrentUser().isdealer;
    this.offerdata.TotalGrossMargin = 0;
    // this.offerdata.TotalRMCGrossMargin = 0;
    this.offerdata.TotalTargetGrossMargin = 0;
    this.offerdata.Status = 0;

    this.todayDate = moment().format('DD/MM/YYYY');
    this.futureDate = moment().add(30, 'd').format('DD/MM/YYYY');
    this.todayMinDate = this.convertDate(this.todayDate);
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

    this.onOrderOptionChange(this.OrderType);

    this.managePOForm.podate.setValue(this.todayDate);
    this.managePOForm.customerpodate.setValue(this.todayDate);
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
      vertical: ['', [Validators.required]],
      segment: ['', [Validators.required]],
      currencyType: ['INR'],
      delearcommission: [''],
      incoterms: ['DD', [Validators.required]],
      reasonforclone: [null],
      industry: [null],
      headerleveldiscount: [''],
      completedlv: [''],
      importby: [null],
      employeeresponsible: [null, [Validators.required]],
      sbuoforder: [''],
      mrotype: [null],
      account: [null],
      reqdeliverydate: [null, [Validators.required]],
      nacecode: [null],
      description: [null],
      nacelevel: [null],
      nacemodel: [null],
      businessmodel: [null],
    });

    this.AccountContactDetail = this.formBuilder.group({
      contactsearch: [null]
    });

    this.TermsandConditionForm = this.formBuilder.group({
      paymentterms: [null]
    });

    this.SpecialTextForm = this.formBuilder.group({
      addspecialtexttype: ['', [Validators.required]],
      addspecialtextdescription: ['', [Validators.required]]
    });

    this.LengthandFactorForm = this.formBuilder.group({
      itemLength: [[], [Validators.required]],
      otherLength: [null],
      itemFactor: ['', [Validators.required]],
      lfqty: [''],
      extraLength: [null],
      lengthreqdeliverydate: ["", [Validators.required]]
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
      importby: [null]
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
      customerpodate: ['']
    });

    this.SOnoForm = this.formBuilder.group({
      sono: ['', [Validators.required]]
    });

    this.CPOValidatorForm = this.formBuilder.group({
      cpocomment: ['', [Validators.required]]
    });

    this.ItemAdditionalFieldsForm = this.formBuilder.group({
      iafItemno: [null],
      iafArticleno: [null],
      iafQuantity: [null],
      iafunitprice: [null],
      reqdeliverydate: [null],
      cuttingcharges: [null]
    });

    this.CuttingChargesForm = this.formBuilder.group({
      itemcuttingcharges: [null, [Validators.required]]
    });

    this.NaceDetailForm = this.formBuilder.group({
      nacecode: [null],
      description: [null],
      level: [null],
      model: [null],
      businessmodel: [null]
    });
  }

  private loadPageMode() {
    let currentUrl = this.router.url;

    if (currentUrl.includes('add') && !currentUrl.includes('refrenceorder')) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      this.managePageSection(0, 1);
      let id: string = '';
      this.activatedRoute.params.subscribe(parms => {
        id = parms['id'];
      });
      this.offerID = 0;
      this.getOpportunityData(id);
      this.getcuttingcharges();
    } else if (currentUrl.includes('edit')) {
      this.isAdd = false;
      this.isEdit = true;
      this.isView = false;
      this.getcuttingcharges();
      this.getOrdersDetail(this.offerID, false);
    } else if (currentUrl.includes('view')) {
      this.isAdd = false;
      this.isEdit = false;
      this.isView = true;
      this.getcuttingcharges();
      this.getOrdersDetail(this.offerID, false);
    } else if (currentUrl.includes('add') && currentUrl.includes('refrenceorder')) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      this.isRefrenceOffer = true;
      this.managePageSection(0, 1);
      this.getcuttingcharges();
      this.getOrdersDetail(this.offerID, true);
    }

    // if (this.router.url.includes('stockorder'))
    //   this.OrderType = 20;
    // else if (this.router.url.includes('cpoorder'))
    //   this.OrderType = 30;

    // this.GetSoldtoPartyList();
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
    this.offerInformationForm.nacecode.disable();
    // this.offerInformationForm.vertical.disable();

    if (this.OrderType == 30) {
      this.offerInformationForm.vertical.disable();
      this.offerInformationForm.segment.disable();
    }
  }

  onOrderOptionChange(type: any) {
    // 20: stock order, 30: CPO Order
    if (type == 20) {
      this.optStockOrder = true;
      this.optCPOOrder = false;
      this.OrderType = Number(type);
      // this.isOfferIndirect = false;
      this.offertypechange(this.OrderType);
    } else if (type == 30) {
      this.optStockOrder = false;
      this.optCPOOrder = true;
      this.OrderType = Number(type);
      // this.isOfferIndirect = true;
      this.offertypechange(this.OrderType);
    }
    // this.UpdateFieldValidators();
  }

  private UpdateFieldValidators(issubmit: boolean) {
    if (issubmit) {
      this.offerInformationForm.soldtoparty.setValidators(Validators.required);
      this.offerInformationForm.shiptoparty.setValidators(Validators.required);
      this.offerInformationForm.vertical.setValidators(Validators.required);
      this.offerInformationForm.segment.setValidators(Validators.required);
      this.offerInformationForm.incoterms.setValidators(Validators.required);
      this.offerInformationForm.employeeresponsible.setValidators(Validators.required);
      // this.offerInformationForm.sbuoforder.setValidators(Validators.required);
      this.offerInformationForm.reqdeliverydate.setValidators(Validators.required);
      this.termsandConditionForm.paymentterms.setValidators(Validators.required);

      if (this.OrderType == 30) {
        this.offerInformationForm.account.setValidators(Validators.required);
        this.offerInformationForm.mrotype.setValidators(Validators.required);
        this.managePOForm.ponumber.setValidators(Validators.required);
        this.managePOForm.podate.setValidators(Validators.required);
        // this.managePOForm.customerponumber.setValidators(Validators.required);
        // this.managePOForm.customerpodate.setValidators(Validators.required);
      }
    } else {
      this.offerInformationForm.account.clearValidators();
      this.offerInformationForm.soldtoparty.clearValidators();
      this.offerInformationForm.shiptoparty.clearValidators();
      this.offerInformationForm.vertical.clearValidators();
      this.offerInformationForm.segment.clearValidators();
      this.offerInformationForm.incoterms.clearValidators();
      this.offerInformationForm.employeeresponsible.clearValidators();
      // this.offerInformationForm.sbuoforder.clearValidators();
      this.offerInformationForm.reqdeliverydate.clearValidators();
      this.offerInformationForm.mrotype.clearValidators();
      this.termsandConditionForm.paymentterms.clearValidators();
      this.managePOForm.ponumber.clearValidators();
      this.managePOForm.podate.clearValidators();
      // this.managePOForm.customerponumber.clearValidators();
      // this.managePOForm.customerpodate.clearValidators();
    }


    // if (this.OrderType == 30) {
    //   this.offerInformationForm.mrotype.setValidators(Validators.required);
    //   this.termsandConditionForm.paymentterms.setValidators(Validators.required);
    //   this.managePOForm.ponumber.setValidators(Validators.required);
    //   this.managePOForm.podate.setValidators(Validators.required);
    // } else {
    //   this.offerInformationForm.mrotype.clearValidators();
    //   this.termsandConditionForm.paymentterms.clearValidators();
    //   this.managePOForm.ponumber.clearValidators();
    //   this.managePOForm.podate.clearValidators();
    // }
    this.offerInformationForm.account.updateValueAndValidity();
    this.offerInformationForm.soldtoparty.updateValueAndValidity();
    this.offerInformationForm.shiptoparty.updateValueAndValidity();
    this.offerInformationForm.vertical.updateValueAndValidity();
    this.offerInformationForm.segment.updateValueAndValidity();
    this.offerInformationForm.incoterms.updateValueAndValidity();
    this.offerInformationForm.employeeresponsible.updateValueAndValidity();
    // this.offerInformationForm.sbuoforder.updateValueAndValidity();
    this.offerInformationForm.reqdeliverydate.updateValueAndValidity();
    this.offerInformationForm.mrotype.updateValueAndValidity();
    this.termsandConditionForm.paymentterms.updateValueAndValidity();
    this.managePOForm.ponumber.updateValueAndValidity();
    this.managePOForm.podate.updateValueAndValidity();
    // this.managePOForm.customerponumber.updateValueAndValidity();
    // this.managePOForm.customerpodate.updateValueAndValidity();
  }

  onPODateSelection(date) {
    let podate = new Date(date.year, date.month - 1, date.day).toString();
    podate = this.datePipe.transform(podate, this.dateformate);
    this.managePOForm.podate.setValue(podate);
  }
  onQuantityReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.addQuantity.reqdeliverydate = reqdeliverydate;
  }

  onCustomerPODateSelection(date) {
    let customerpodate = new Date(date.year, date.month - 1, date.day).toString();
    customerpodate = this.datePipe.transform(customerpodate, this.dateformate);
    this.managePOForm.customerpodate.setValue(customerpodate);
  }

  onReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.offerInformationForm.reqdeliverydate.setValue(reqdeliverydate);

    if (this.offerItemStd && this.offerItemStd.length > 0) {
      this.offerItemStd.forEach(element => {
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
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    // this.itemreqdeliveryDate = reqdeliverydate;
    this.stdItemForm.itemreqdeliverydate.setValue(reqdeliverydate);
  }

  onLengthReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.lengthandFactorForm.lengthreqdeliverydate.setValue(reqdeliverydate);
  }

  getOrdersDetail(id: number, isclone: boolean) {
    this.stockorderService.OrderDetails(id, isclone).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.orderdetail.offerdata[0]) {
            this.offerdata = response.responsedata.data.orderdetail.offerdata[0];

            if (this.isRefrenceOffer) {
              this.offerdata.Status = 0;
              this.offerdata.IsActive = 1;
            }

            this.offerNo = this.offerdata.offerno;
            this.selectedcontact = Number(this.offerdata.contactid);
            this.OrderType = this.offerdata.ordertype;
            // this.StockOfferType = this.offerdata.ordertype;
            this.currencycode = "INR";
            this.disableFields();
            if (this.OrderType == 30) {
              this.isOfferIndirect = true;
              this.optCPOOrder = true;
              this.optStockOrder = false;
              this.offerInformationForm.delearcommission.setValue(this.offerdata.DealerCommissionPer * 100);
              this.DealerCommisionPer = Number(this.offerInformationForm.delearcommission.value);

              this.offerInformationForm.mrotype.setValue(this.offerdata.mrotype);

              // if (this.offerdata.account) {
              //   // this.GetAccountsList(this.offerdata.account);
              //   this.offerInformationForm.account.setValue(this.offerdata.account);
              // }

              // this.UpdateFieldValidators();
            } else {
              this.optCPOOrder = false;
              this.optStockOrder = true;
              this.DealerCommisionPer = 0;
            }

            this.termsandConditionForm.paymentterms.setValue(this.offerdata.paymentterm ? this.offerdata.paymentterm : null);
            this.offerInformationForm.headerleveldiscount.setValue(this.offerdata.headerleveldiscount);
            this.offerInformationForm.incoterms.setValue(this.offerdata.incoterms);
            this.offerInformationForm.industry.setValue(this.offerdata.customerindustrykey);

            if (this.isRefrenceOffer) {
              this.offerInformationForm.reasonforclone.setValue(null);
              this.ReasonforClone = '';
              this.offerInformationForm.reasonforclone.setValidators(Validators.required);
              this.offerInformationForm.reasonforclone.updateValueAndValidity();
            } else if (this.offerdata.RefOfferId) {
              this.offerInformationForm.reasonforclone.setValue(this.offerdata.reasonforclone);
              this.ReasonforClone = this.offerdata.reasonforclone;
            }

            if (this.offerdata.reqdlvdate && this.offerdata.reqdlvdate != '0000-00-00 00:00:00') {
              this.reqdeliveryDate = this.convertDate(this.datePipe.transform(this.offerdata.reqdlvdate, this.dateformate));
              this.offerInformationForm.reqdeliverydate.setValue(this.datePipe.transform(this.offerdata.reqdlvdate, this.dateformate));
            }
            this.offerInformationForm.completedlv.setValue(this.offerdata.completedlv);
            this.setCompleteDlv(this.offerdata.completedlv);

            this.offerInformationForm.importby.setValue(this.offerdata.importby ? this.offerdata.importby : null);

            this.offerInformationForm.employeeresponsible.setValue(this.offerdata.Status < 20 && this.offerdata.employeeresponsible ? this.offerdata.employeeresponsible : this.offerdata.employeeresponsible + " - " + this.offerdata.employeeresponsiblename);
            this.offerInformationForm.account.setValue(this.offerdata.endcustomerid ? this.offerdata.endcustomerid : null);
            this.SelectedEndCustomerId = this.offerdata.endcustomerid ? this.offerdata.endcustomerid : "";
            this.SelectedEndCustomer = this.offerdata.account ? this.offerdata.account : "";
            this.offerInformationForm.sbuoforder.setValue(this.offerdata.sbuoforder);
            this.offerInformationForm.mrotype.setValue(this.offerdata.mrotype);

            if (this.offerdata.errors && this.offerdata.errors.length > 0) {
              this.soerror = this.offerdata.errors;
              this.isSOError = true;
            }

            this.OfferFiles = response.responsedata.data.orderdetail.offer_docs;
            if (response.responsedata.data.orderdetail.getItems.length > 0) {
              this.stdItem = true;
              this.offerItemStd = response.responsedata.data.orderdetail.getItems;
              function formatDate(dateString) {
                const date = new Date(dateString);
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const year = date.getFullYear();
                return `${year}-${month}-${day}`;
            }
            
            this.offerItemStd.forEach(obj => {
                obj.pcqty.forEach(item => {
                    item.reqdeliverydate = formatDate(item.reqdeliverydate);
                });
            });
              let i = 0;
              this.offerItemStd.forEach(element => {
                i += 1;
                element.itemSeqId = i;
                element.documents = [];

                if (element.reqdlvdate && !element.reqdlvdate.includes("0000-00-00"))
                  element.reqdlvdate = this.datePipe.transform(element.reqdlvdate, this.dateformate);
                else
                  element.reqdlvdate = null;

                element.lengthandfactor.forEach(element2 => {
                  element2.isDelete = 0;

                  if (element2.lengthreqdeliverydate && !element2.lengthreqdeliverydate.includes("0000-00-00"))
                    element2.lengthreqdeliverydate = this.datePipe.transform(element2.lengthreqdeliverydate, this.dateformate);
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

            this.isShowItemMargin = response.responsedata.data.uiinfo.ShowItemMargin;
            this.isShowOverallMargin = response.responsedata.data.uiinfo.ShowTotalGrossMargin;
            this.isFMApprovalReq = (this.totalnetvalue - (this.totalnetvalue * this.DealerCommisionPer / 100)) > Config.fmapproval.amount;

            if (response.responsedata.data.orderdetail.getDeletedItems.length > 0) {
              this.deletedItem = true;
              this.offerDeletedItem = response.responsedata.data.orderdetail.getDeletedItems;

              this.offerDeletedItem.forEach(element => {
                if (element.reqdlvdate && !element.reqdlvdate.includes("0000-00-00"))
                  element.reqdlvdate = this.datePipe.transform(element.reqdlvdate, this.dateformate);
                else
                  element.reqdlvdate = null;

                element.lengthandfactor.forEach(lengthfactor => {
                  if (lengthfactor.lengthreqdeliverydate && !lengthfactor.lengthreqdeliverydate.includes("0000-00-00"))
                    lengthfactor.lengthreqdeliverydate = this.datePipe.transform(lengthfactor.lengthreqdeliverydate, this.dateformate);
                  else
                    lengthfactor.lengthreqdeliverydate = element.reqdlvdate ? element.reqdlvdate : null;
                });
              });
            }

            this.setStatus(this.offerdata.Status);

            this.managePageSection(this.offerdata.Status, this.offerdata.IsActive);

            if (this.offerInformation == 1) {
              this.offerInformationForm.soldtoparty.disable();
              this.offerInformationForm.shiptoparty.disable();
              this.offerInformationForm.vertical.disable();
              this.offerInformationForm.segment.disable();
              this.offerInformationForm.incoterms.disable();
              this.offerInformationForm.reqdeliverydate.disable();

              this.offerInformationForm.importby.disable();
              this.offerInformationForm.employeeresponsible.disable();
              this.offerInformationForm.account.disable();
              this.offerInformationForm.sbuoforder.disable();
              this.offerInformationForm.mrotype.disable();

              this.stdItemForm.itemreqdeliverydate.disable();
              this.stdItemForm.importby.disable();

              this.termsandConditionForm.paymentterms.disable();
            }

            if (this.managepo == 1) {
              this.managePOForm.podate.disable();
              this.managePOForm.customerpodate.disable();
            }

            this.offerapprovaldata = response.responsedata.data.orderdetail.getApprovalData;
            let i = 0;
            this.offerapprovaldata.forEach(element => {
              element.srno = ++i;
              element.senddate = Config.getDBdatetimeToDateTime(element.senddate);
              element.statusdate = Config.getDBdatetimeToDateTime(element.statusdate);
            });

            this.isOfferOpen = response.responsedata.data.uiinfo.showapproverejectbutton;
            // let checkofferopen = this.offerapprovaldata.find(x => x.userid == this.userid);
            // if (checkofferopen) {
            //   if (checkofferopen.status == 10)
            //     this.isOfferOpen = true;
            //   else
            //     this.isOfferOpen = false;
            // }

            this.setApprovaldatastatus(this.offerapprovaldata);

            this.additionalFieldData = response.responsedata.data.orderdetail.additionalfields[0];
            this.setAdditionalFieldData(response.responsedata.data.orderdetail.additionalfields[0]);
            this.managepodata = response.responsedata.data.orderdetail.podata[0];
            this.setPOData(this.managepodata);

            // this.ItemAdditionalFieldsList = response.responsedata.data.orderdetail.itemadditionalfields;

            if (response.responsedata.data.orderdetail.specialterms.length > 0) {
              let i = 0;
              response.responsedata.data.orderdetail.specialterms.forEach(element => {
                i += 1;
                element.isDelete = 0;
                element.seqid = i;
                element.displaytitle = this.specialtexttypeList.find(x => x.code == element.title).description;
              });
              this.specialtextdata = response.responsedata.data.orderdetail.specialterms;
            } else {
              this.specialtextdata = [];
            }

            if (this.FMapproveandreject >= 1 && this.isFMApprovalReq) {
              this.getFMApprovalData();
            }

            this.InitiateSOComment = this.offerdata.cpovalidatorcomment;
            this.cpovalidatorForm.cpocomment.setValue(this.offerdata.cpovalidatorcomment);

            if (this.offerdata.Status == 80) {
              this.sonumber = this.offerdata.sosapid;

              this.itemAdditionalFieldsForm.reqdeliverydate.disable();
            }

            this.getOpportunityData(this.offerdata.opportunityid);
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
    this.managePOForm.ponumber.setValue(data.po_number);
    this.poDate = this.convertDate(this.datePipe.transform(data.po_date, this.dateformate));
    this.managePOForm.podate.setValue(this.datePipe.transform(data.po_date, this.dateformate));

    this.managePOForm.customerponumber.setValue(data.customerponumber);
    if (data.customerpodate) {
      this.CustomerPODate = this.convertDate(this.datePipe.transform(data.customerpodate, this.dateformate));
      this.managePOForm.customerpodate.setValue(this.datePipe.transform(data.customerpodate, this.dateformate));
    }
    this.pofiles = data.files;
  }

  getFMApprovalData() {
    this.stockorderService.getFMApprovalData(this.offerID).subscribe(
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

  private setAdditionalFieldData(data) {
    this.additionalfieldId = data.id;

    if (data.soldtoparty) {
      this.offerInformationForm.soldtoparty.setValue(data.soldtoparty);
      this.GetShiptoPartyList();
      this.offerInformationForm.soldtopartyname.setValue(data.soldtopartyname);
      this.offerInformationForm.soldstreet1.setValue(data.soldstreet1);
      this.offerInformationForm.soldstreet2.setValue(data.soldstreet2);
      this.offerInformationForm.solddistrict.setValue(data.solddistrict);
      this.offerInformationForm.soldcity.setValue(data.soldcity);
      this.offerInformationForm.soldpostalcode.setValue(data.soldpostalcode);
      this.offerInformationForm.soldregion.setValue(data.soldregion);

      this.offerInformationForm.shiptoparty.setValue(data.shiptoparty && data.shiptoparty.length === 6 ? data.shiptoparty : null);
      this.offerInformationForm.shiptopartyname.setValue(data.shiptopartyname);
      this.offerInformationForm.shipstreet1.setValue(data.shipstreet1);
      this.offerInformationForm.shipstreet2.setValue(data.shipstreet2);
      this.offerInformationForm.shipdistrict.setValue(data.shipdistrict);
      this.offerInformationForm.shipcity.setValue(data.shipcity);
      this.offerInformationForm.shippostalcode.setValue(data.shippostalcode);
      this.offerInformationForm.shipregion.setValue(data.shipregion);
    }

    this.offerInformationForm.nacecode.setValue(data.ompnacecode ? data.ompnacecode.trim() : '');
    this.offerInformationForm.description.setValue(data.ompnacedescription);
    this.offerInformationForm.nacelevel.setValue(data.ompnacelevel);
    this.offerInformationForm.nacemodel.setValue(data.ompnacemodel);
    this.offerInformationForm.businessmodel.setValue(data.ompbusinessmodel);
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
      } else if (status >= 20) {
        this.offerInformation = 1;
        this.termsandcondition = 1;
        this.approvedandrejectedby = 1;
      }

      if (status < 20 && this.usertype >= 10) {
        this.managepo = 2;
      } else if (status >= 20 && status < 80 && this.usertype == 10) {
        this.managepo = 2;
      } else {
        this.managepo = 1;
      }

      if (status >= 57) {
        this.FMapproveandreject = 2;
      }

      if (status >= 70 && status != 80 && !this.isOfferIndirect && this.usertype == 10) { // stock order
        this.orderstatus = 2;
      } else if (status > 62 && status != 80 && this.isOfferIndirect && this.usertype == 10) { // cpo order
        this.orderstatus = 2;
      } else if (status == 75) {
        this.orderstatus = 1;
      }

      if (status === 62 && this.isOfferIndirect) {
        this.cpovalidator = 2;
      }

      if (status >= 70 && this.isOfferIndirect) {
        this.cpovalidator = 1;
      }

      if (status == 75 && this.usertype == 10) {
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

      if (status >= 60 && this.isOfferIndirect) {
        this.cpovalidator = 1;
      }

      if (status >= 70 && this.isOfferIndirect) {
        this.cpovalidator = 1;
        this.additionalfields = 1;
      }

      if (status >= 50 && !this.isOfferIndirect) { // stock order
        this.orderstatus = 1;
      } else if (status > 62 && this.isOfferIndirect) { // cpo order
        this.orderstatus = 1;
      }

      if (status == 75) {
        this.saperror = 1;
      }

      if (status >= 80) {
        this.managepo = 1;
      }
    }

    if (this.isdealer) // Dealer can't see the approval section
    {
      this.approvedandrejectedby = 0;
      this.FMapproveandreject = 0;
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

  offertypechange(type: number) {
    if (type == 30) {
      this.isOfferIndirect = true;
      this.offerInformationForm.delearcommission.setValidators(Validators.required);
      // this.offerInformationForm.shiptopartyType.setValue(null);
      // if (this.oppoData.sapid)
      //   this.getShiptoPartyList();
      // else
      //   this.shiptopartyList = [];
    } else {
      this.isOfferIndirect = false;
      this.DealerCommisionPer = 0;
      // this.offerInformationForm.offerType.setValue(1);
      this.offerInformationForm.delearcommission.clearValidators();
      this.offerInformationForm.shiptoparty.setValue(this.offerInformationForm.soldtoparty.value);
    }

    this.offerInformationForm.delearcommission.updateValueAndValidity();
    this.updateTotalValues();
  }

  convertDate(date) {
    if (date) {
      const year = Number(date.split('/')[2]);
      const month = Number(date.split('/')[1]);
      const day = Number(date.split('/')[0]);
      let newdate = { year: year, month: month, day: day };
      return newdate;
    }
  }

  private getOpportunityData(id: string) {
    this.opportunitiesService.getDetail(id).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.oppoData = response.responsedata.data[0];
          // this.offerInformationForm.soldtoparty.setValue(this.oppoData.sapid);

          this.oppoid = this.oppoData.opportunity_id;
          this.lappoppoid = this.oppoData.lappopportunityid;
          // this.getAccountContactDetail(this.oppoData.customer_id);

          this.verticalList = this.oppoData.vertical.split(';');
          this.segmentList = this.oppoData.segment.split(';');
          if (this.isAdd) {
            this.offerInformationForm.vertical.setValue(this.verticalList[0]);
            this.offerInformationForm.segment.setValue(this.segmentList[0]);
          } else {
            this.offerInformationForm.vertical.setValue(this.offerdata.vertical);
            this.offerInformationForm.segment.setValue(this.offerdata.segment);
          }

          // if (this.offerdata && this.offerdata.ordertype == 2) {
          //   this.GetShiptoPartyList();
          // } else {
          // this.getso
          // this.oppoData.sapid
          if (this.oppoData.sapid)
            this.GetSoldtoPartyList(this.oppoData.sapid);
          else {
            this.notificationService.showError('SAP Id is not available');
            return;
          }
          // this.offerInformationForm.shiptoparty.setValue(this.offerdata.ShipToParty);
          // }

          if (this.isAdd && !this.isRefrenceOffer) {
            this.offerInformationForm.industry.setValue(this.oppoData.industrytypec);
            // this.UpdateIndustryKeyforCustomer();
            this.offerInformationForm.nacecode.setValue(this.oppoData.nacecode ? this.oppoData.nacecode.trim() : "");

            if (this.oppoData.nacecode && this.oppoData.nacecode.trim())
              this.GetNacecodeDetail(this.oppoData.nacecode.trim(), 0);

            this.offerInformationForm.businessmodel.setValue(this.oppoData.businessmodel);
          }

          if ((this.isEdit || this.isRefrenceOffer || this.isView) && this.offerdata.account) {
            this.GetAccountsList(this.offerdata.account);
            if (this.offerdata.endcustomerid) {
              this.offerInformationForm.account.setValue(this.offerdata.endcustomerid);
            }
          }
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  // private getAccountContactDetail(id: string) {
  //   this.offersService.getAccountContactDetail(id).subscribe(
  //     response => {
  //       if (response) {
  //         if (response.contact.length > 0) {
  //           this.contactdetail = response.contact;
  //           this.searchedcontactdetail = this.contactdetail;
  //         } else {
  //           this.contactdetail = [];
  //           this.searchedcontactdetail = [];
  //         }
  //       }
  //     }, error => {
  //       this.notificationService.showError(error.error.error.message);
  //     });
  // }

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
      this.itemsapid = null;
      this.itemType = null;
      this.itemMaxDiscount = null;
      this.stdItemSearched = null;
      this.msq = null;
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
      this.stdItemForm.importby.setValue(null);

      if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
        this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
      else
        this.stdItemForm.itemDiscount.setValue(null);

      this.stdItemForm.customerpartno.setValue('');
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
              this.itemsapid = this.stdItemSearched.sapid;
              this.itemMaxDiscount = this.stdItemSearched.maxdiscount * 100;
              this.msq = this.stdItemSearched.msq ? this.stdItemSearched.msq : 1;
              this.stdItemForm.stdItemName.setValue(this.stdItemSearched.description);
              this.stdItemForm.stdItemUOM.setValue(this.stdItemSearched.uom);
              this.stdItemForm.stdItemMOQ.setValue(this.msq);
              this.stdItemForm.ItemMDQ.setValue(this.stdItemSearched.mdq);

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
              this.stdItemForm.importby.setValue(null);

              if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
                this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
              else
                this.stdItemForm.itemDiscount.setValue(null);

              this.stdItemForm.customerpartno.setValue('');
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
    let _Arr = this.offerItemStd.filter(x => x.isDelete == 0).concat(this.offerDeletedItem);
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

    if (index !== undefined) {
      this.itemforEdit = true;
      let data = this.filterDatatoDeletewithOrder(this.offerItemStd)[index];
      this.quantityData = [...data.pcqty]
      this.stdItemForm.stditemCode.setValue(data.articleNo);
      this.stdItemForm.stdItemName.setValue(data.description);
      this.stdItemForm.stdItemPrice.setValue(data.price);
      this.stdItemForm.itemunitnetprice.setValue(data.unitprice);
      // this.stdItemForm.stdItemCatalog.setValue(data.catalogLink);
      // this.ItemCatalogue = data.catalogLink;
      this.stdItemForm.stdItemQty.setValue(data.quantity);
      this.stdItemForm.itemDiscount.setValue(data.discountPer);
      this.stdItemForm.customerpartno.setValue(data.customerpartno);
      this.stdItemForm.stdItemUOM.setValue(data.uom);
      this.stdItemForm.enquiredquantity.setValue(data.enquiredquantity);
      this.stdItemForm.stdItemMOQ.setValue(data.msq);
      this.stdItemForm.stdItemPCLength.setValue(data.pclength);
      this.stdItemForm.ItemMOQ.setValue(data.moq);
      this.stdItemForm.ItemMDQ.setValue(data.mdq);
      this.itemSequenceId = data.itemSeqId;
      this.stdItemForm.seqno.setValue(data.seqno);
      this.stdItemForm.itemstock.setValue(data.itemstock);
      this.stdItemForm.importby.setValue(data.importby ? data.importby : null);

      if (data.reqdlvdate) {
        // data.reqdlvdate.split('T')[0]
        // dd/MM/yyyy converted date
        this.itemreqdeliveryDate = this.convertDate(data.reqdlvdate);
        this.stdItemForm.itemreqdeliverydate.setValue(data.reqdlvdate);

        // this.offervalidfromDate = this.convertDate(this.datePipe.transform(this.offerdata.offervalidfrom, this.dateformate));
        // this.offerInformationForm.offersValidfrom.setValue(this.datePipe.transform(this.offerdata.offervalidfrom, this.dateformate));
      } else {
        this.itemreqdeliveryDate = null;
        this.stdItemForm.itemreqdeliverydate.setValue(null);
      }

      this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
      this.LengthandFactordata = data.lengthandfactor;

      this.itemid = data.id;
      this.itemType = data.itemType;
      this.itemMaxDiscount = data.maxdiscount;
      // this.isItemExpire = data.isexpire;
      // this.files = data.files;
      this.articleNo = data.articleNo;
      this.itemsapid = data.sapid;
      this.msq = data.msq;
      this.uom = data.uom;

      // if (this.itemType.toUpperCase() == 'SPR' && this.LengthandFactordata.length > 0) {
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
      this.stdItemForm.importby.setValue(null);
      this.stdItemForm.itemunitnetprice.setValue(null);

      if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
        this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
      else
        this.stdItemForm.itemDiscount.setValue(null);

      this.stdItemForm.customerpartno.setValue('');
      this.stdItemForm.itemtotal.setValue(null);

      this.itemLengthList = [];
      this.itemid = 0;
      this.itemforEdit = false;
      this.lengthandfactorbtndisable = true;
      this.itemSequenceId = 0;
      this.itemType = null;
      this.itemMaxDiscount = null;
      this.isItemExpire = false;
      this.articleNo = null;
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
    } else if (!this.articleNo) {
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
    const formattedData = this.quantityData.map(item => {
      const formattedDate = moment(item.reqdeliverydate, ['YYYY-MM-DD', 'DD/MM/YYYY']).format('YYYY-MM-DD');
      
      return {
          id: item.id,
          quantity: item.quantity,
          reqdeliverydate: formattedDate
      };
    });

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
      importby: this.stdItemForm.importby.value,
      // isexpire: this.isItemExpire,
      articleNo: this.articleNo,
      sapid: this.itemsapid,
      itemType: this.itemType,
      maxdiscount: this.itemMaxDiscount,
      description: this.stdItemForm.stdItemName.value,
      quantity: quantity,
      pcqty: formattedData,
      msq: this.msq,
      moq: this.stdItemForm.ItemMOQ.value,
      mdq: this.stdItemForm.ItemMDQ.value,
      uom: this.stdItemForm.stdItemUOM.value,
      enquiredquantity: this.stdItemForm.enquiredquantity.value,
      customerpartno: this.stdItemForm.customerpartno.value ? this.stdItemForm.customerpartno.value : '',
      price: price,
      unitprice: this.stdItemForm.itemunitnetprice.value,
      discountPer: discount,
      netvalue: netvalue,
      // catalogLink: this.stdItemForm.stdItemCatalog.value ? this.stdItemForm.stdItemCatalog.value : '',
      isDelete: 0,
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

    if (Number(this.offerInformationForm.headerleveldiscount.value) != discount)
      this.offerInformationForm.headerleveldiscount.setValue(null);

    this.updateTotalValues();

    this.itemSequenceId = 0;
    this.itemlevelcuttingcharges = 0;
    this.stdItemForm.stditemCode.setValue(null);
    this.stdItemForm.stdItemName.setValue(null);
    this.stdItemForm.stdItemPrice.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.stdItemCatalog.setValue(null);
    // this.ItemCatalogue = null;
    this.itemType = null;
    this.itemMaxDiscount = null;
    this.isItemExpire = false;
    this.stdItemForm.stdItemQty.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.seqno.setValue(null);
    this.stdItemForm.itemstock.setValue(null);
    this.stdItemForm.importby.setValue(null);
    this.addQuantity.reqdeliverydate = null;
    this.addQuantity.quantity = null;
    this.quantityData = []
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
    this.stdItemForm.stditemCode.setValue(data.articleNo);
    this.stdItemForm.stdItemName.setValue(data.description);
    this.stdItemForm.stdItemPrice.setValue(data.price);
    this.stdItemForm.itemunitnetprice.setValue(data.unitprice);
    this.stdItemForm.stdItemQty.setValue(data.quantity);
    this.stdItemForm.seqno.setValue(data.seqno);
    this.stdItemForm.itemstock.setValue(data.itemstock);
    this.stdItemForm.importby.setValue(data.importby);
    this.stdItemForm.itemDiscount.setValue(data.discountPer);
    this.stdItemForm.customerpartno.setValue(data.customerpartno);
    this.stdItemForm.stdItemUOM.setValue(data.uom);
    this.stdItemForm.enquiredquantity.setValue(data.enquiredquantity);
    this.stdItemForm.stdItemMOQ.setValue(data.msq);
    this.stdItemForm.stdItemPCLength.setValue(data.pclength);
    this.stdItemForm.ItemMOQ.setValue(data.moq);
    this.stdItemForm.ItemMDQ.setValue(data.mdq);

    this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));

    this.LengthandFactordata = data.lengthandfactor;
    this.itemSequenceId = data.itemSeqId;
    this.itemid = data.id;
    this.itemType = data.itemType;
    this.itemMaxDiscount = data.maxdiscount;
    this.itemlevelcuttingcharges = data.cuttingcharges;
    // this.files = data.files;
    this.articleNo = data.articleNo;
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

    this.stdItemForm.importby.disable();

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
      this.offerItemStd = this.offerItemStd.filter(x => x.articleNo != event.model.articleno);
    } else if (this.isEdit) {
      if (event.model.id > 0) {
        this.offerItemStd.find(x => x.id == event.model.id).isDelete = 1
        this.offerDeletedItem.push(this.offerItemStd.find(x => x.id == event.model.id));
        this.offerItemStd = this.offerItemStd.filter(x => x.articleNo != event.model.articleno && x.id != event.model.id);
      } else
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
    this.RedirectTo(this.OrderType);
    // if (this.OrderType == 20)
    //   this.router.navigate(['/order/stockorder/list']);
    // else if (this.OrderType == 30)
    //   this.router.navigate(['/order/cpoorder/list']);
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
    this.onSubmit();
  }

  async onSubmit() {
    // if (this.isRecommend)
    this.submitted = true;
    // else
    //   this.submitted = false;

    this.acc.expandAll();
    if (this.OfferInformationForm.invalid || this.TermsandConditionForm.invalid || this.ManagePOForm.invalid) {
      return false;
    }

    // if (this.filterDatatoDeletewithOrder(this.offerItemStd).length == 0) {
    //   this.notificationService.showError('There is no item in the Order.');
    //   return false;
    // }

    // if (!this.oppoData.customerid && this.isRecommend) {
    //   this.notificationService.showError('Sold to party is required.');
    //   return;
    // }

    if (this.pofiles.length == 0 && this.OrderType && this.OrderType == 30 && this.isRecommend) {
      this.notificationService.showError('Please attached PO.');
      return;
    }

    // let selectedcontactid;
    // var ele = document.getElementsByTagName('input');
    // for (let i = 0; i < ele.length; i++) {
    //   if (ele[i].type == "radio") {
    //     if (ele[i].checked)
    //       selectedcontactid = Number(ele[i].value);
    //   }
    // }

    // if (!selectedcontactid && this.isRecommend) {
    //   this.notificationService.showError('Customer contact is required.');
    //   return;
    // }

    // this.offerItemStd.forEach(element => {
    //   if (element.reqdlvdate)
    //     element.reqdlvdate = element.reqdlvdate.split('/').reverse().join('-');
    // });

    this.EmployeeResponsibleList.forEach(element => {
      if (this.offerInformationForm.employeeresponsible.value == element.Empno)
        this.EmployeeResponsibleName = element.Empname;
    });


    let offerHeader = {
      opportunityid: this.oppoData.id,
      contactId: 0,
      paymentterm: this.termsandConditionForm.paymentterms.value ? this.termsandConditionForm.paymentterms.value : "",
      SoldToParty: this.oppoData.sapid,
      ShipToParty: this.offerInformationForm.shiptoparty.value ? this.offerInformationForm.shiptoparty.value : 0,
      vertical: this.offerInformationForm.vertical.value,
      segment: this.offerInformationForm.segment.value,
      Incoterm: this.offerInformationForm.incoterms.value,
      CurrencyType: this.currencycode,
      DealerCommissionPer: this.optCPOOrder ? Number(this.offerInformationForm.delearcommission.value) : 0,
      headerleveldiscount: Number(this.offerInformationForm.headerleveldiscount.value),
      reqdlvdate: this.offerInformationForm.reqdeliverydate.value ? this.offerInformationForm.reqdeliverydate.value.split('/').reverse().join('-') : '0000-00-00',
      completedlv: this.offerInformationForm.completedlv.value,
      importby: this.offerInformationForm.importby.value ? this.offerInformationForm.importby.value : '',
      employeeresponsible: this.offerInformationForm.employeeresponsible.value ? this.offerInformationForm.employeeresponsible.value : '',
      employeeresponsiblename: this.offerInformationForm.employeeresponsible.value ? this.EmployeeResponsibleName : '',
      account: this.SelectedEndCustomer ? this.SelectedEndCustomer : '',
      endcustomerid: this.SelectedEndCustomerId ? this.SelectedEndCustomerId : '',
      sbuoforder: this.offerInformationForm.sbuoforder.value ? this.offerInformationForm.sbuoforder.value : '',
      MROType: this.offerInformationForm.mrotype.value ? this.offerInformationForm.mrotype.value : '',
      OrderType: this.OrderType,
      customerindustrykey: this.offerInformationForm.industry.value,
      nacecode: this.offerInformationForm.nacecode.value ? this.offerInformationForm.nacecode.value : '',
      businessmodel: this.offerInformationForm.businessmodel.value ? this.offerInformationForm.businessmodel.value : '',
      OfferFiles: []
    }

    let podata = {
      Id: this.isAdd || this.isRefrenceOffer ? 0 : this.poId,
      ponumber: this.managePOForm.ponumber.value,
      podate: this.managePOForm.podate.value.split('/').reverse().join('-'),
      customerponumber: this.managePOForm.customerponumber.value,
      customerpodate: this.managePOForm.customerpodate.value ? this.managePOForm.customerpodate.value.split('/').reverse().join('-') : '',
      attachmentid: 0,
    }

    let additionalFieldData = {
      Id: this.isAdd || this.isRefrenceOffer ? 0 : this.additionalfieldId,
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

      if (!element.itemType)
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

    this.offerDeletedItem.forEach(element => {
      element.reqdlvdate = element.reqdlvdate ? element.reqdlvdate.split('/').reverse().join('-') : '0000-00-00';
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
      offerId: this.isAdd ? 0 : this.offerID,
      isrecommendforprocess: this.isRecommend == true ? 1 : 0,
      refofferid: this.isRefrenceOffer ? this.offerID : 0,
      oppoid: this.oppoData.opportunity_id,
      offervalue: this.totalnetvalue,
      stockorderHeader: offerHeader,
      stockorderpo: podata,
      stockorderadditionalfield: additionalFieldData,
      offerItems: this.offerDeletedItem.concat(this.offerItemStd),
      specialterms: this.specialtextdata.concat(this.specialtextdeletedata),
      reasonforclone: this.isRefrenceOffer ? this.offerInformationForm.reasonforclone.value : ''
    }

    if (this.OfferFiles.length > 0)
      await this.OfferFileUpload(saveModel.stockorderHeader);
    if (this.pofiles.length > 0)
      await this.UploadManagePOFile(saveModel.stockorderpo);

    this.createOffer(saveModel);
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
      type = 'offers/offerdoc';
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

  createOffer(saveModel: any) {
    this.stockorderService.CreateOrder(saveModel).subscribe(
      async response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (saveModel.offerId == 0)
            this.notificationService.showSuccess('Order Created Successfully');
          else
            this.notificationService.showSuccess('Order Updated Successfully');

          this.RedirectTo(this.OrderType);
          // if (this.OrderType == 20)
          //   this.router.navigate(['/order/stockorder/list']);
          // else if (this.OrderType == 30)
          //   this.router.navigate(['/order/cpoorder/list']);
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  // generateOfferPDF() {
  //   this.offersService.generateofferpdf(this.offerID).subscribe(
  //     response => {
  //       if (response) {
  //       }
  //     }, error => {
  //       this.notificationService.showError(error.error.error.message);
  //     });
  // }

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

  // removeSPRFile(index: number) {
  //   this.SPRFiles = Array.from(this.SPRFiles)
  //   this.SPRFiles.splice(index, 1);
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

  openAddSpecialText(AddSpecialText, index) {
    if (index != undefined) {
      var data = this.filterDatatoDelete(this.specialtextdata)[index];
      this.specialTextForm.addspecialtexttype.setValue(data.title);
      this.SpecialTermTitle = data.title;
      this.specialTextForm.addspecialtextdescription.setValue(data.description);
      this.SpecialTermDescription = data.description;
      this.specialtextid = data.id;
      this.specialtextindex = index;
      this.seqid = data.seqid
    } else {
      this.specialTextForm.addspecialtexttype.setValue(null);
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
      this.specialTextForm.addspecialtexttype.setValue(null);
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
      title: this.specialTextForm.addspecialtexttype.value,
      displaytitle: this.specialtexttypeList.find(x => x.code == this.specialTextForm.addspecialtexttype.value).description,
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

    let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleNo);
    if (!_itemstockdata)
      this.isItemStockdataAvailable = false;
    else
      this.isItemStockdataAvailable = true;

    this.modalRef = this.modalService.open(AddLengthandFactor, { size: 'md' });
  }

  openAddQuantity(AddQuantity){
    const [day, month, year] = (this.stdItemForm.itemreqdeliverydate.value).split('/').map(Number);
    this.defaultDate = {year: year, month: (month), day: day};
    this.modalRef = this.modalService.open(AddQuantity, { size: 'md' });
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
      qty: quantity,
      isDelete: 0,
      cuttingcharges: 0,
      isother: this.isShowOtherLength && this.isShowExtraLength ? 1 : 0,
      lengthreqdeliverydate: this.lengthandFactorForm.lengthreqdeliverydate.value
    }
    this.LengthandFactordata.push(lfdata);

    let finalQty = 0;
    if (this.LengthandFactordata && this.LengthandFactordata.length > 0) {
      this.LengthandFactordata.forEach(element => {
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

      this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));

      this.LengthandFactordata.forEach(element => {
        if (element.isDelete == 0 && element.isother == 1) {
          element.cuttingcharges = this.itemType == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
        }
        this.itemlevelcuttingcharges += Number(element.cuttingcharges);
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
        let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleNo);

        if (!_itemstockdata) {
          await this.onStockSearch(false, this.articleNo, false);
          _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleNo);
          this.itemCutLengthList = _itemstockdata ? _itemstockdata : [];
        }

        if (_itemstockdata && _itemstockdata.length) {
          let filteredX = _itemstockdata.length.map(itemX => { return itemX.length });
          let filteredY = filteredX.filter(itemX => !this.itemLengthList.includes(itemX.toString()));
          this.itemCutLengthList = _itemstockdata.length.filter(X => filteredY.includes(X.length));
        }

        if (this.isOfferIndirect) {
          if (this.itemCutLengthList.findIndex(x => x == 'Other') === -1)
            this.itemCutLengthList.push('Other');
        }

        this.lengthandFactorForm.otherLength.setValidators(Validators.required);
        this.lengthandFactorForm.otherLength.updateValueAndValidity();

        let qty = Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
        this.lengthandFactorForm.lfqty.setValue(qty);
      } else {
        this.isShowOtherLength = false;
        this.isShowExtraLength = false;
        this.isOtherLengthExtra = false;

        this.lengthandFactorForm.extraLength.setValue(null);
        this.lengthandFactorForm.extraLength.clearValidators();
        this.lengthandFactorForm.extraLength.updateValueAndValidity();

        this.lengthandFactorForm.otherLength.setValue(null);
        this.lengthandFactorForm.otherLength.clearValidators();
        this.lengthandFactorForm.otherLength.updateValueAndValidity();

        let qty = Number(event) * Number(this.lengthandFactorForm.itemFactor.value);
        this.lengthandFactorForm.lfqty.setValue(qty);
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
      let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleNo);

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

      let qty = Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    } else if (event && event == 'Other') {
      this.isShowExtraLength = true;
      this.isFactorError = false;
      this.lengthandFactorForm.extraLength.setValidators(Validators.required);

      let qty = Number(this.lengthandFactorForm.extraLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
      this.lengthandFactorForm.lfqty.setValue(qty);
    } else {
      this.lengthandFactorForm.extraLength.clearValidators();
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

      let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleNo);
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
    // if (Number(this.stdItemForm.itemDiscount.value) > this.itemMaxDiscount && false) {
    //   this.isItemReady = false;
    //   this.itemErrorMessage = `Discount must be less than ` + this.itemMaxDiscount + `%`;
    //   return;
    // } else {
    //   this.isItemReady = true;
    //   this.itemErrorMessage = null;
    // }

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
      if ((Number(this.stdItemForm.stdItemQty.value) % Number(this.stdItemForm.stdItemPCLength.value)) != 0) {
        this.isItemReady = false;
        this.itemErrorMessage = `Quantity must be in multiples of ${this.stdItemForm.stdItemPCLength.value}`;
        return;
      } else {
        this.isItemReady = true;
        this.itemErrorMessage = null;
      }
    } else if (this.stdItemForm.stdItemUOM.value.toUpperCase() == 'M') {
      if ((Number(this.stdItemForm.stdItemQty.value) % Number(this.stdItemForm.ItemMDQ.value)) != 0) {
        this.isItemReady = false;
        this.itemErrorMessage = `Quantity must be in multiples of ${this.stdItemForm.ItemMDQ.value}`;
        return;
      } else {
        this.isItemReady = true;
        this.itemErrorMessage = null;
      }
    }

    if (this.offerInformationForm.incoterms.value == 'EXW' || this.offerInformationForm.incoterms.value == 'CFR' || this.offerInformationForm.incoterms.value == 'CIF' || this.offerInformationForm.incoterms.value == 'FOB') {
      producttype = 'TRD';
    } else {
      producttype = 'STD';
    }

    // if (this.itemType != producttype) {
    let _itemstockdata = this.OrderStockData.find(x => x.articleno == this.articleNo);
    let MOQcheckRequired = this.checkforMOQBypass(this.LengthandFactordata, _itemstockdata ? _itemstockdata.data : []);

    this.productmasterService.searchproductalp(this.articleNo, producttype, 'INR', Number(this.stdItemForm.stdItemQty.value), [], MOQcheckRequired).then(
      response => {
        if (response.data && response.data.statusCode == 200) {
          this.itemType = response.data.data.itemtype;
          this.isItemReady = true;

          this.stdItemForm.ItemMOQ.setValue(response.data.data.moq);
          this.stdItemForm.stdItemPrice.setValue(response.data.data.price);

          if (Number(this.stdItemForm.itemDiscount.value) && Number(this.stdItemForm.itemDiscount.value) > 0)
            this.stdItemForm.itemunitnetprice.setValue((Number(this.stdItemForm.stdItemPrice.value) - ((Number(this.stdItemForm.stdItemPrice.value) * Number(this.stdItemForm.itemDiscount.value) / 100))).toFixed(2));
          else
            this.stdItemForm.itemunitnetprice.setValue(response.data.data.price);

          this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
          this.itemlevelcuttingcharges = 0;

          this.LengthandFactordata.forEach(element => {
            if (element.isDelete == 0 && element.isother == 1) {
              element.cuttingcharges = this.itemType == 'STD' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
              this.itemlevelcuttingcharges += Number(element.cuttingcharges);
            }
            // else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
            //   element.cuttingcharges = this.itemType == 'STD' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
            //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
            // } else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) >= Number(this.stdItemForm.ItemMOQ.value)) {
            //   element.cuttingcharges = 0;
            //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
            // }
          });

          // if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "PC") {
          // if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
          //   this.isItemReady = false;
          //   this.itemErrorMessage = 'Quantity must be greater than or equal to MOQ.';
          // } else {
          //   this.isItemReady = true;
          //   this.itemErrorMessage = null;
          // }
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
    // }
    // else {
    //   this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));

    //   this.submitted = false;
    //   if (this.modalRef)
    //     this.modalRef.close();
    //   this.itemlevelcuttingcharges = 0;

    //   this.LengthandFactordata.forEach(element => {
    //     if (element.isDelete == 0 && element.isother == 1 && false) {
    //       element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal);
    //       this.itemlevelcuttingcharges += Number(element.cuttingcharges);
    //     }
    //     // else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
    //     //   element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
    //     //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
    //     // } else if (element.isDelete == 0 && element.isother == 0 && Number(this.stdItemForm.stdItemQty.value) >= Number(this.stdItemForm.ItemMOQ.value)) {
    //     //   element.cuttingcharges = 0;
    //     //   this.itemlevelcuttingcharges += Number(element.cuttingcharges);
    //     // }
    //   });

    //   // if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "PC") {
    //   // if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value)) {
    //   //   this.isItemReady = false;
    //   //   this.itemErrorMessage = 'Quantity must be greater than or equal to MOQ.';
    //   // } else {
    //   //   this.isItemReady = true;
    //   //   this.itemErrorMessage = null;
    //   // }
    //   // }
    //   // else if (this.stdItemForm.stdItemUOM.value.toUpperCase() == "M") {
    //   //   if (Number(this.stdItemForm.stdItemQty.value) < Number(this.stdItemForm.ItemMOQ.value) && this.LengthandFactordata.filter(x => x.isother == 1).length > 0) {
    //   //     this.isItemReady = false;
    //   //     this.itemErrorMessage = 'Quantity must be greater than or equal to MOQ.';
    //   //   }
    //   // }
    // }
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

    if (Number(_tempDiscount) && Number(_tempDiscount) > this.itemMaxDiscount && false) {
      this.isItemReady = false;
      this.itemErrorMessage = `Discount must be less than ` + this.itemMaxDiscount + `%`;
      return;
    } else {
      this.isItemReady = true;
      this.itemErrorMessage = null;
    }

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
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.orderimportitem;
    FileSaver.saveAs(url, SampleEnum.orderimportitem);
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
        if (data.length != Config.masterfilesheaders.orderimportitem.length)
          data.push(key.trim());
      }
      this.importitemheaderList = data;

      if (JSON.stringify(this.importitemheaderList).toUpperCase() != JSON.stringify(Config.masterfilesheaders.orderimportitem).toUpperCase()) {
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
    var importitemheader = Config.masterfilesheaders.orderimportitem;
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
            this.importitemjsonData[i][importitemheader[6]] = (this.importitemjsonData[i][importitemheader[6]].includes("|") ? this.importitemjsonData[i][importitemheader[6]] : Math.round(+ this.importitemjsonData[i][importitemheader[6]])) + '|' + Math.round(+ this.importitemjsonData[i + 1][importitemheader[6]]);
            this.importitemjsonData[i][importitemheader[8]] = (this.importitemjsonData[i][importitemheader[8]] ? this.importitemjsonData[i][importitemheader[8]] : this.offerInformationForm.reqdeliverydate.value.split("/").reverse().join("/")) + '|' + (this.importitemjsonData[i + 1][importitemheader[8]] ? this.importitemjsonData[i + 1][importitemheader[8]] : this.offerInformationForm.reqdeliverydate.value.split("/").reverse().join("/"));
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
      } else if (!this.importitemjsonData[i][importitemheader[8]] && !this.offerInformationForm.reqdeliverydate.value) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Req Dlv Date is required.';
      }
      // else if (this.importitemjsonData[i][importitemheader[8]] && Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[8]], '-').date < moment().format('YYYY-MM-DD')) {
      //   this.importitemjsonData[i].rowStatus = false;
      //   this.importitemjsonData[i].Remarks = 'Req Dlv Date must be greater than today date.';
      // }
      else if (this.importitemjsonData[i][importitemheader[7]] && this.importitemjsonData[i][importitemheader[7]].length > 35) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Customer Part no can not be more than 35 char.';
      } else if (this.offerItemStd && this.offerItemStd.length > 0) {
        let existItemCheck = null;
        existItemCheck = this.offerItemStd.filter(z => z.articleNo == this.importitemjsonData[i][importitemheader[1]] && z.isDelete == 0);
        if (existItemCheck && existItemCheck.length > 0) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Item already added in the list.`;
        }
      }

      if (!this.importitemjsonData[i][importitemheader[8]] && this.offerInformationForm.reqdeliverydate.value) {
        this.importitemjsonData[i][importitemheader[8]] = this.offerInformationForm.reqdeliverydate.value.split("/").reverse().join("/");
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

      // this.importitemjsonData[i].discountPer = this.importitemjsonData[i][importitemheader[4]].split('%')[0];
    }

    // get stock for import articles
    let _articles = this.importitemjsonData.filter(x => x.rowStatus !== false).map(x => x['ARTICLE NO']).toString();
    if (_articles && _articles.length > 0)
      await this.onStockSearch(true, _articles, false);

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
              }
              // else if (_itemsearcheddata.uom.toUpperCase() == 'M' && this.importitemjsonData[i][importitemheader[5]] && this.importitemjsonData[i][importitemheader[5]].length > 0) {
              //   let maxallowlength: number = 0;

              //   if (_itemsearcheddata.length.split('|').length > 0)
              //     maxallowlength = Math.max(..._itemsearcheddata.length.split('|'));

              //   this.importitemjsonData[i][importitemheader[5]].split('|').forEach(element => {
              //     if (maxallowlength < Number(element) && !this.isOfferIndirect) {
              //       this.importitemjsonData[i].rowStatus = false;
              //       this.importitemjsonData[i].Remarks = 'Length must be less than ' + maxallowlength;
              //     }
              //   });
              // }
              else if (_itemsearcheddata.uom.toUpperCase() == 'M' && !this.importitemjsonData[i][importitemheader[5]]) {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].Remarks = 'Length is required';
              }

              //if factor is not available then 1
              if (_itemsearcheddata.uom.toUpperCase() == 'M' && !this.importitemjsonData[i][importitemheader[6]]) {
                this.importitemjsonData[i][importitemheader[6]] = "1";
              }

              //set product type
              if (this.offerInformationForm.incoterms.value == 'EXW' || this.offerInformationForm.incoterms.value == 'CFR' || this.offerInformationForm.incoterms.value == 'CIF' || this.offerInformationForm.incoterms.value == 'FOB')
                _producttype = 'TRD';
              else
                _producttype = 'STD';

              let _templengthandfactordata = [];
              if (_itemsearcheddata.uom.toUpperCase() == 'M' && this.importitemjsonData[i].rowStatus == undefined) {
                _itemsearcheddata.length = _itemsearcheddata.length + '|' + 'Cut Length';

                let _templength = this.importitemjsonData[i][importitemheader[5]].split('|');
                let _tempfactor = this.importitemjsonData[i][importitemheader[6]].split('|');
                let _tempreqdlvdate = this.importitemjsonData[i][importitemheader[8]].split('|');
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

                  if (isOtherLength && !this.isOfferIndirect && _tempitemstockdata && Number(_templength[k]) && Number(_templength[k]) > 0) {
                    let maxallowlength: number = 0;
                    maxallowlength = Math.max(..._tempitemstockdata.data.map(y => y.length));
                    if (maxallowlength < Number(_templength[k])) {
                      this.importitemjsonData[i].rowStatus = false;
                      this.importitemjsonData[i].Remarks = 'Length must be less than ' + maxallowlength;
                    }

                    let filteredX = _tempitemstockdata.length.map(x => x.length);

                    if (!filteredX.includes(Number(_templength[k]))) {
                      this.importitemjsonData[i].rowStatus = false;
                      this.importitemjsonData[i].Remarks = `Length ${_templength[k]} is not available.`;
                    }
                  } else if (isOtherLength && this.isOfferIndirect && Number(_templength[k]) && Number(_templength[k]) > 0) {
                    let filteredX = _tempitemstockdata && _tempitemstockdata.length ? _tempitemstockdata.length.map(x => x.length) : [];

                    if (!filteredX.includes(Number(_templength[k]))) {
                      isextraLength = true;
                    }
                  }

                  // if (_tempreqdlvdate[k] && Config.ExcelDateToJSDate(_tempreqdlvdate[k], '-').date < moment().format('YYYY-MM-DD')) {
                  //   _tempreqdlvdate[k] = null;
                  // }

                  if (_itemsearcheddata.uom.toUpperCase() == 'M' && this.importitemjsonData[i].rowStatus == undefined) {
                    let _tempArr = {
                      id: 0,
                      length: _templength[k],
                      factor: _tempfactor[k] ? Math.round(+_tempfactor[k]) : 1,
                      qty: Number(_templength[k]) * (_tempfactor[k] ? Math.round(+_tempfactor[k]) : 1),
                      isDelete: 0,
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
                // calculate quantity for UOM == M
                this.importitemjsonData[i].quantity = 0;

                _templengthandfactordata.forEach(element => {
                  this.importitemjsonData[i].quantity += element.qty;
                });
              }
              else {
                this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];
              }

              // validate UOM == M, for quantity must be in multiply with MDQ
              if (_itemsearcheddata.uom.toUpperCase() == 'M' && (Number(this.importitemjsonData[i].quantity) % Number(_itemsearcheddata.mdq)) != 0) {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].Remarks = `Quantity must be in multiples of ${_itemsearcheddata.mdq}`;
              }

              if (this.importitemjsonData[i].rowStatus == undefined) {
                let _itemstockdata = this.importitemsstockdata.find(x => x.articleno == _itemsearcheddata.articleno);
                let MOQcheckRequired = this.checkforMOQBypass(_templengthandfactordata, _itemstockdata ? _itemstockdata.data : []);
                //call api to get alp
                await this.productmasterService.searchproductalp(_itemsearcheddata.articleno, _producttype, 'INR', this.importitemjsonData[i].quantity, this.importitemsstockdata, MOQcheckRequired).then(
                  response => {
                    if (response.data && response.data.statusCode == 200) {

                      // find max req dlv date to set item req dlv date
                      let itemRequiredDeliveryDate = this.importitemjsonData[i][importitemheader[8]].split('|')[0] && Config.dateisGreaterThanEqualtoTodayDate(this.importitemjsonData[i][importitemheader[8]].split('|')[0]) ? Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[8]].split('|')[0], '/').date : "";
                      if (_templengthandfactordata.length > 0) {

                        let dates = _templengthandfactordata.map(x => x.lengthreqdeliverydate);

                        if (dates.filter(x => x).length > 0) {
                          let maxDate = Math.max.apply(Math, dates.map(x => new Date(x.split("/").reverse().join()).getTime()).map(function (o) { return o; }))
                          itemRequiredDeliveryDate = moment(new Date(maxDate)).format("YYYY/MM/DD");
                        }
                      }

                      this.importitemjsonData[i].SrNo = i + 1;
                      this.importitemjsonData[i].seqno = Number(this.importitemjsonData[i][importitemheader[0]]);
                      this.importitemjsonData[i].articleNo = _itemsearcheddata.articleno;
                      this.importitemjsonData[i].description = _itemsearcheddata.description;
                      this.importitemjsonData[i].sapid = _itemsearcheddata.sapid;
                      this.importitemjsonData[i].itemType = response.data.data.itemtype;
                      this.importitemjsonData[i].msq = _itemsearcheddata.msq;
                      this.importitemjsonData[i].moq = response.data.data.moq;
                      this.importitemjsonData[i].mdq = _itemsearcheddata.mdq;
                      this.importitemjsonData[i].uom = _itemsearcheddata.uom;
                      this.importitemjsonData[i].maxdiscount = _itemsearcheddata.maxdiscount ? _itemsearcheddata.maxdiscount * 100 : 99.99;
                      this.importitemjsonData[i].price = Number(response.data.data.price);
                      this.importitemjsonData[i].discountPer = this.importitemjsonData[i][importitemheader[4]] ? this.importitemjsonData[i][importitemheader[4]].split('%')[0] : 0;
                      this.importitemjsonData[i].length = _itemsearcheddata.length;
                      this.importitemjsonData[i].factor = this.importitemjsonData[i][importitemheader[6]];
                      this.importitemjsonData[i].lengthandfactor = _templengthandfactordata;
                      this.importitemjsonData[i].customerpartno = this.importitemjsonData[i][importitemheader[7]];
                      this.importitemjsonData[i].reqdlvdate = itemRequiredDeliveryDate;
                      this.importitemjsonData[i].rowStatus = true;
                      this.importitemjsonData[i].Remarks = null;

                      // Calculate item level cutting charges
                      let _tempitemlevelcuttingcharges = 0;
                      _tempALPdata.lengthandfactor.forEach(element => {
                        if (element.isDelete == 0 && element.isother == 1) {
                          element.cuttingcharges = response.data.data.itemtype == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
                          _tempitemlevelcuttingcharges += Number(element.cuttingcharges);
                        }
                      });
                      _tempALPdata.cuttingcharges = _tempitemlevelcuttingcharges;

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

                      // Max discount validation
                      // this.importitemjsonData[i][importitemheader[4]] ? this.importitemjsonData[i][importitemheader[4]].split('%')[0] : 0;
                      if (Number(_tempALPdata.discountPer) >= Number(_tempALPdata.maxdiscount) && false) {
                        this.importitemjsonData[i].rowStatus = false;
                        this.importitemjsonData[i].Remarks = `Discount must be less than ` + _tempALPdata.maxdiscount + `%`;
                      }

                      // if (this.importitemjsonData[i].uom.toUpperCase() == "PC") {
                      // if (Number(this.importitemjsonData[i].quantity) < Number(response.data.data.moq)) {
                      //   this.importitemjsonData[i].rowStatus = false;
                      //   this.importitemjsonData[i].Remarks = `Quantity must be greater than or equal to MOQ ` + Number(response.data.data.moq) + `.`;
                      // }
                      // }
                      // else if (this.importitemjsonData[i].uom.toUpperCase() == "M") {
                      //   if (Number(this.importitemjsonData[i].quantity) < Number(response.data.data.moq) && _tempALPdata.lengthandfactor.filter(x => x.isother == 1).length > 0) {
                      //     this.isItemReady = false;
                      //     this.itemErrorMessage = `Quantity must be greater than or equal to MOQ ` + Number(response.data.data.moq) + `.`;
                      //   }
                      // }

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
          mdq: element.mdq,
          uom: element.uom,
          enquiredquantity: Number(element.quantity),
          customerpartno: element.customerpartno,
          price: Number(element.price),
          unitprice: Number(element.unitprice),
          discountPer: Number(element.discountPer),
          maxdiscount: Number(element.maxdiscount),
          netvalue: this.calculateTotalinItemPopupByUnitPrice(element.unitprice, element.quantity),
          isDelete: 0,
          length: element.length,
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
      this.totalnetvalue += Number(element.netvalue);
      this.offerlevelcuttingcharges += Number(element.cuttingcharges);
    });
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

  toggleCompleteDlv(event: any) {
    if (event) {
      this.offerInformationForm.completedlv.setValue(event.target.value);

      this.setCompleteDlv(event.target.value);
    }
  }

  setCompleteDlv(value: string) {
    this.optCompleteDlvNo = value == 'X' ? false : true;
    this.optCompleteDlvYes = value == 'X' ? true : false;
  }

  onOfferApproveClick() {
    this.submitted = false;
    this.approveForm.approvereason.setValue(null);
    this.ApproveReason = null;
    this.modalService.open(this.offerapprovemodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onApprovedClick() {
    this.submitted = true;

    if (this.ApproveForm.invalid)
      return;

    var approvalmodel = {
      offerid: this.offerID,
      status: 50,
      reason: this.approveForm.approvereason.value,
      srno: 1, //this.offerapprovaldata.find(x => x.userid == this.userid).srno,
      opportunityid: this.oppoData.opportunity_id,
      comment: "[" + this.offerNo + "]" + " - [" + this.authService.getCurrentUser().fullname + " - " + this.authService.getCurrentUser().role_code + "] - [Approve] - " + this.approveForm.approvereason.value
    }

    if (this.offerdata.Status < 50)
      this.onOrderApproveReject(approvalmodel);
    else
      this.onFMOrderApproveReject(approvalmodel);
  }

  onOfferRejectClick() {
    this.rejectForm.rejectreason.setValue(null);
    this.submitted = false;
    this.modalService.open(this.offerrejectmodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onRejectClick() {
    this.submitted = true;

    if (this.RejectForm.invalid)
      return;

    var approvalmodel = {
      offerid: this.offerID,
      status: 30,
      reason: this.rejectForm.rejectreason.value,
      srno: this.offerapprovaldata.find(x => x.userid == this.userid).srno,
      opportunityid: this.oppoData.opportunity_id,
      comment: "[" + this.offerNo + "]" + " - [" + this.authService.getCurrentUser().fullname + " - " + this.authService.getCurrentUser().role_code + "] - [Reject] - " + this.approveForm.approvereason.value
    }

    if (this.offerdata.Status < 50)
      this.onOrderApproveReject(approvalmodel);
    else
      this.onFMOrderApproveReject(approvalmodel);
  }

  onOrderApproveReject(approvalmodel: any) {
    this.stockorderService.saveapprovaldata(approvalmodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.modalService.dismissAll();

          if (approvalmodel.status == 50)
            this.notificationService.showSuccess('Order approve successfully.');
          else if (approvalmodel.status == 30)
            this.notificationService.showSuccess('Order reject successfully.');

          this.RedirectTo(this.OrderType);
        }
      }, error => {
        this.modalService.dismissAll();
        this.notificationService.showError(error.error.error.message);

        this.RedirectTo(this.OrderType);
      });
  }

  onFMOrderApproveReject(approvalmodel: any) {
    this.stockorderService.SaveFMApprovalData(approvalmodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.modalService.dismissAll();

          if (approvalmodel.status == 50)
            this.notificationService.showSuccess('Order approve successfully.');
          else if (approvalmodel.status == 30)
            this.notificationService.showSuccess('Order reject successfully.');

          this.RedirectTo(this.OrderType);
        }
      }, error => {
        this.modalService.dismissAll();
        this.notificationService.showError(error.error.error.message);

        this.RedirectTo(this.OrderType);
      });
  }

  onProductFinderClick() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.productfinder;
    FileSaver.saveAs(url, SampleEnum.productfinder);
  }

  onProductCatalogueClick() {
    window.open(Config.productcatalogue.url);
  }

  // onContactSearch() {
  //   if (this.accountContactDetail.contactsearch.value)
  //     this.searchedcontactdetail = this.contactdetail.filter(x => (x.name.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase()) || x.department.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase()) || x.designation.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase()) || x.mobile.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase()) || x.email.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase())));
  //   else
  //     this.searchedcontactdetail = this.contactdetail;
  // }

  onContactSelect(event: any) {
    this.selectedcontact = Number(event.target.value);
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
    this.stdItemForm.importby.setValue(null);

    if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
      this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
    else
      this.stdItemForm.itemDiscount.setValue(null);

    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.stdItemCatalog.setValue(null);
    this.stdItemForm.customerpartno.setValue('');
    this.stdItemForm.itemtotal.setValue(null);
    // this.ItemCatalogue = null;
    this.LengthandFactordata = [];
    this.isItemReady = true;
    this.itemErrorMessage = null;
    this.submitted = false;
    this.quantityData = [];
    this.addQuantity.reqdeliverydate = null;
    this.addQuantity.quantity = null;
  }

  // onSoldtoPartySearch() {
  //   this.offersService.getSoldtoPartySearch().subscribe(
  //     response => {
  //       if (response.data && response.data.length > 0) {
  //         this.soldtopartySearchList = response.data;
  //       } else {
  //         this.soldtopartySearchList = [];
  //       }
  //     }, error => {
  //       this.notificationService.showError(error.error.error.message);
  //     });
  // }

  GetSoldtoPartyList(sapid: string) {
    this.stockorderService.SoldtoPartyList(sapid).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.soldtopartySearchList = response.responsedata.data;

          if (this.soldtopartySearchList && this.soldtopartySearchList.length == 1) {
            this.offerInformationForm.soldtoparty.setValue(this.soldtopartySearchList[0].partner);
            this.GetSoldtoPartyDetail(true);
          }
        } else {
          this.soldtopartySearchList = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetSoldtoPartyDetail(event: any) {
    if (event) {
      this.stockorderService.SoldtoPartyDetail(this.offerInformationForm.soldtoparty.value).subscribe(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.offerInformationForm.soldtopartyname.setValue(response.responsedata.data[0].name1);
            this.offerInformationForm.soldstreet1.setValue(response.responsedata.data[0].housenumber);
            this.offerInformationForm.soldstreet2.setValue('');
            this.offerInformationForm.solddistrict.setValue(response.responsedata.data[0].district);
            this.offerInformationForm.soldcity.setValue(response.responsedata.data[0].city);
            this.offerInformationForm.soldpostalcode.setValue(response.responsedata.data[0].postalcode);
            this.offerInformationForm.soldregion.setValue(response.responsedata.data[0].region);

            if (this.offerdata && this.offerdata.Status < 20)
              this.GetEmployeeResponsibleList(this.offerInformationForm.soldtoparty.value);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });

      // this.offerInformationForm.shiptoparty.setValue(null);

      this.GetShiptoPartyList();
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
    this.stockorderService.ShiptoPartyList(this.offerInformationForm.soldtoparty.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.shiptopartySearchList = response.responsedata.data;
          let _ShiptoParty = this.shiptopartySearchList.find(x => x.partner == this.offerInformationForm.shiptoparty.value);
          if (_ShiptoParty) {
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
      if (this.offerInformationForm.soldtoparty.value && this.offerInformationForm.soldtoparty.value.length > 0 && this.offerInformationForm.shiptoparty.value && this.offerInformationForm.shiptoparty.value.length > 0) {
        this.stockorderService.ShiptoPartyDetail(this.offerInformationForm.soldtoparty.value, this.offerInformationForm.shiptoparty.value).subscribe(
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

  onsendEmailClick() {
    location.href = "mailto:veron@gmail.com?subject=hello&body=fggf";
    // window.open('mailto:someone@somewhere.com?Subject=hello','email');
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
  }

  getcuttingcharges() {
    this.offersService.getcuttingcharges(this.offerID, null, null).subscribe(
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

  onReview() {
    this.notificationService.showInfo('Review Clicked');
    // this.stockorderService.SaveItemAdditionalFields(this.offerID).subscribe(
    //   response => {
    //     this.notificationService.showInfo('Review Clicked');
    //     this.router.navigate(['/stockorders/list']);
    //   }, error => {
    //     this.notificationService.showError(error.error.error.message);
    //   });
  }

  async onStockSearch(isimport: boolean, articles: any, openmodal: boolean) {
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
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      if (this.articleNo) {
        let _tempitemstockdata = this.OrderStockData.find(x => x.articleno == this.articleNo);
        if (!_tempitemstockdata) {
          await this.stockorderService.StockAvailability(this.itemsapid, isimport, true).then(
            response => {
              if (response.responsedata && response.responsedata.statusCode == 200) {
                this.StockData = response.responsedata.data[0].data;
                this.isItemStockdataAvailable = true;

                this.OrderStockData.filter(x => x.articleno == this.itemsapid);
                this.OrderStockData.push(response.responsedata.data[0]);

                this.stdItemForm.itemstock.setValue(response.responsedata.data[0].totalqty);
                this.ItemStockValue = this.stdItemForm.itemstock.value;

                if (openmodal)
                  this.modalService.open(this.stockmodel, { centered: true, size: 'md', backdrop: 'static' });
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

          if (openmodal)
            this.modalService.open(this.stockmodel, { centered: true, size: 'md', backdrop: 'static' });
        }
      } else {
        this.notificationService.showError('Please select the article first.');
        return;
      }
    }
  }

  // GetSumofStock(stockdata, sapid) {
  //   var total = 0;
  //   for (var i = 0; i < stockdata.length; i++) {
  //     if (stockdata[i].Matnr == sapid)
  //       total = total + stockdata[i].AQty;
  //   }
  //   return total;
  // }

  GetEmployeeResponsibleList(soldtoparty: string) {
    this.stockorderService.GetEmployeeResponsibleList(soldtoparty).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.EmployeeResponsibleList = response.responsedata.data;
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  // onAccountChange(event: any) {
  //   if (event) {
  //     this.GetAccountsList(event.target.value);
  //   }
  // }

  GetAccountListDropdown() {
    let element = (document.getElementById('ngSelectAccountId') as HTMLInputElement);
    if (element.value && element.value.length >= 3) {
      this.GetAccountsList(element.value);
    }
  }

  GetAccountsList(account: string) {
    this.stockorderService.GetAccountsList(account, this.oppoData.owner_id, this.oppoData.customer_id).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.AccountsList = response.responsedata.data;
        else
          this.AccountsList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  UpdateIndustryKeyforCustomer(sfdcid: string) {
    this.offerInformationForm.industry.setValue(this.AccountsList.find(x => x.sfdcid == sfdcid).industrytypec);
  }
  onRefreshAccountPartners() {
    console.log(this.oppoData.customer_id);

    this.stockorderService.RefreshAccountsList({ dealerId: this.oppoData.customer_id }).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.message);
      });
  }
  onCustomerChange(event: any) {
    if (event) {
      this.UpdateIndustryKeyforCustomer(event.sfdcid);
      if (event.nacecode) {
        this.GetNacecodeDetail(event.nacecode.trim(), 0);
      } else {
        this.onOfferNacecodeChange(false);
      }
      this.offerInformationForm.businessmodel.setValue(event.businessmodel);
      this.SelectedEndCustomerId = event.sfdcid;
      this.SelectedEndCustomer = event.customername;
    } else {
      this.SelectedEndCustomerId = "";
      this.SelectedEndCustomer = "";
      this.onOfferNacecodeChange(false);
      this.offerInformationForm.businessmodel.setValue(null);
    }
  }

  async onPONumberSaveClick() {
    this.submitted = true;

    if (this.ManagePOForm.invalid)
      return;

    let pomodel = {
      orderid: this.offerID,
      ponumber: this.managePOForm.ponumber.value,
      podate: this.managePOForm.podate.value.split('/').reverse().join('-'),
      customerponumber: this.managePOForm.customerponumber.value,
      customerpodate: this.managePOForm.customerpodate.value ? this.managePOForm.customerpodate.value.split('/').reverse().join('-') : '',
      attachmentid: 0
    }

    if (this.pofiles.length > 0)
      await this.UploadManagePOFile(pomodel);

    this.SavePO(pomodel);
  }

  SavePO(pomodel: any) {
    this.stockorderService.SavePO(pomodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess('PO number updated successfully.');

          this.RedirectTo(this.OrderType);
          // if (this.OrderType == 20)
          //   this.router.navigate(['/order/stockorder/list']);
          // else if (this.OrderType == 30)
          //   this.router.navigate(['/order/cpoorder/list']);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSOnoSaveClick() {
    this.submitted = true;

    if (this.SOnoForm.invalid)
      return;

    this.stockorderService.SaveSOno(this.offerID, this.sonoForm.sono.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess('SO no updated successfully.');

          this.RedirectTo(this.OrderType);
          // if (this.OrderType == 20)
          //   this.router.navigate(['/order/stockorder/list']);
          // else if (this.OrderType == 30)
          //   this.router.navigate(['/order/cpoorder/list']);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onCreateOrderClick() {
    this.stockorderService.CreateSAPOrder(this.offerID).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess('Order created successfully.');

          this.RedirectTo(this.OrderType);
          // if (this.OrderType == 20)
          //   this.router.navigate(['/order/stockorder/list']);
          // else if (this.OrderType == 30)
          //   this.router.navigate(['/order/cpoorder/list']);
        }
      }, error => {
        this.soerror = error.error.error.message;
        this.notificationService.showError(error.error.error.message);
      });
  }

  onCPOVaidatorSave() {
    this.submitted = true;

    if (this.CPOValidatorForm.invalid)
      return;

    let cpovalidatormodel = {
      offerid: this.offerID,
      comment: this.cpovalidatorForm.cpocomment.value
    }

    this.stockorderService.SaveCPOValidator(cpovalidatormodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess('CPO Validation saved successfully.');

          this.RedirectTo(this.OrderType);
          // if (this.OrderType == 20)
          //   this.router.navigate(['/order/stockorder/list']);
          // else if (this.OrderType == 30)
          //   this.router.navigate(['/order/cpoorder/list']);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);

        this.RedirectTo(this.OrderType);
        // if (this.OrderType == 20)
        //   this.router.navigate(['/order/stockorder/list']);
        // else if (this.OrderType == 30)
        //   this.router.navigate(['/order/cpoorder/list']);
      });
  }

  // openItemAdditionalFieldsModal(index: number) {
  //   this.submitted = false;
  //   var data = this.ItemAdditionalFieldsList[index];
  //   this.itemAdditionalFieldsId = data.id;
  //   this.itemAdditionalFieldsIndex = index;
  //   this.itemAdditionalFieldsSeqId = data.itemSeqId;
  //   this.itemAdditionalFieldsOfferid = data.offerid;
  //   this.itemAdditionalFieldsitemid = data.offeritemid;
  //   this.itemAdditionalFieldsForm.iafItemno.setValue(data.itemno);
  //   this.itemAdditionalFieldsForm.iafArticleno.setValue(data.articleno);
  //   this.itemAdditionalFieldsForm.iafQuantity.setValue(data.quantity);
  //   this.itemAdditionalFieldsForm.iafunitprice.setValue(data.unitprice);

  //   this.itemAdditionalFieldsForm.cuttingcharges.setValue(data.cuttingcharges);

  //   if (data.reqdeliverydate) {
  //     this.reqdeliveryDate = this.convertDate(this.datePipe.transform(data.reqdeliverydate, this.dateformate));
  //     this.itemAdditionalFieldsForm.reqdeliverydate.setValue(this.datePipe.transform(data.reqdeliverydate, this.dateformate));
  //   } else {
  //     this.itemAdditionalFieldsForm.reqdeliverydate.setValue(this.todayDate);
  //   }

  //   this.modalService.open(this.ItemAdditionalFieldsModel, { size: 'md' });
  // }

  // onItemAdditionalFieldsCancelClick() {
  //   if (this.submitted)
  //     this.submitted = false;

  //   this.modalService.dismissAll();
  // }

  // onItemAdditionalFieldsSaveClick() {

  // }

  RedirectTo(ordertype: number) {
    if (ordertype == 20)
      this.router.navigate(['/order/stockorder/list']);
    else if (ordertype == 30)
      this.router.navigate(['/order/cpoorder/list']);
  }

  onCuttingChargesUpdate(id: number, cuttingcharges: number) {
    this.itemCuttingChargesId = id;
    this.cuttingChargesForm.itemcuttingcharges.setValue(cuttingcharges);

    this.modalRef = this.modalService.open(this.CuttingChargesModel, { size: 'sm' });
  }

  onCuttingChargesSaveClick() {
    let savecuttingchargesmodel = {
      orderid: this.offerID,
      itemid: this.itemid,
      itemcuttingchargesid: this.itemCuttingChargesId,
      cuttingcharges: Number(this.cuttingChargesForm.itemcuttingcharges.value)
    }

    this.LengthandFactordata.find(x => x.id == this.itemCuttingChargesId).cuttingcharges = Number(this.cuttingChargesForm.itemcuttingcharges.value);

    this.itemlevelcuttingcharges = 0;
    this.LengthandFactordata.forEach(element => {
      if (element.isDelete == 0) {
        // element.cuttingcharges = this.itemType == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
        this.itemlevelcuttingcharges += Number(element.cuttingcharges);
      }
    });

    this.offerItemStd.find(x => x.id == this.itemid).cuttingcharges = this.itemlevelcuttingcharges;

    this.offerlevelcuttingcharges = 0;
    this.offerItemStd.forEach(element => {
      this.offerlevelcuttingcharges += Number(element.cuttingcharges);
    });

    this.SaveCuttingCharges(savecuttingchargesmodel);
  }

  SaveCuttingCharges(savecuttingchargesmodel: any) {
    this.stockorderService.savecuttingcharges(savecuttingchargesmodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          if (this.modalRef)
            this.modalRef.close();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  isValidMOQ(item: any) {
    return Config.isValidMOQ(item);
  }

  onSBUChange(event: any) {
    if (!event)
      this.offerInformationForm.sbuoforder.setValue('');
  }

  GetNaceCodeList() {
    this.opportunitiesService.getNacecodeList().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.NacecodeList = response.responsedata.data;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onNacecodeChange(event: any) {
    if (event) {
      this.GetNacecodeDetail(event.code, 1);
    } else {
      this.naceDetailForm.nacecode.setValue(null);
      this.naceDetailForm.description.setValue(null);
      this.naceDetailForm.level.setValue(null);
      this.naceDetailForm.model.setValue(null);
    }
  }

  onOfferNacecodeChange(event: any) {
    if (event) {
      this.GetNacecodeDetail(event.code, 0);
    } else {
      this.offerInformationForm.nacecode.setValue(null);
      this.offerInformationForm.description.setValue(null);
      this.offerInformationForm.nacelevel.setValue(null);
      this.offerInformationForm.nacemodel.setValue(null);
    }
  }

  GetNacecodeDetail(nacecode: string, calledfrom: number) {
    this.opportunitiesService.getNaceDetail(nacecode).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (calledfrom == 0) {
            // todo
            this.offerInformationForm.nacecode.setValue(response.responsedata.data.code.trim());
            this.offerInformationForm.description.setValue(response.responsedata.data.description);
            this.offerInformationForm.nacelevel.setValue(response.responsedata.data.level);
            this.offerInformationForm.nacemodel.setValue(response.responsedata.data.model);
          } else if (calledfrom == 1) {
            this.naceDetailForm.description.setValue(response.responsedata.data.description);
            this.naceDetailForm.level.setValue(response.responsedata.data.level);
            this.naceDetailForm.model.setValue(response.responsedata.data.model);
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onBusinessModelChange(event: any) {
    if (!event)
      this.naceDetailForm.businessmodel.setValue(null);
  }

  openNaceCodeModal() {
    this.naceDetailForm.nacecode.setValue(this.offerInformationForm.nacecode.value ? this.offerInformationForm.nacecode.value : null);
    this.naceDetailForm.description.setValue(this.offerInformationForm.description.value ? this.offerInformationForm.description.value : null);
    this.naceDetailForm.level.setValue(this.offerInformationForm.nacelevel.value ? this.offerInformationForm.nacelevel.value : null);
    this.naceDetailForm.model.setValue(this.offerInformationForm.nacemodel.value ? this.offerInformationForm.nacemodel.value : null);
    this.naceDetailForm.businessmodel.setValue(this.offerInformationForm.businessmodel.value ? this.offerInformationForm.businessmodel.value : null);

    this.modalService.open(this.NaceCodeModal, { size: 'md' });
  }

  SaveNacecodeDetail() {
    let datamodel = {
      offerid: this.offerID,
      oppoid: this.oppoid,
      offervalue: this.totalnetvalue,
      nacecode: this.naceDetailForm.nacecode.value ? this.naceDetailForm.nacecode.value : '',
      description: this.naceDetailForm.description.value ? this.naceDetailForm.description.value : '',
      level: this.naceDetailForm.level.value ? this.naceDetailForm.level.value : '',
      model: this.naceDetailForm.model.value ? this.naceDetailForm.model.value : '',
      businessmodel: this.naceDetailForm.businessmodel.value ? this.naceDetailForm.businessmodel.value : ''
    }

    this.stockorderService.SaveNacecodeDetail(datamodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.offerInformationForm.nacecode.setValue(this.naceDetailForm.nacecode.value);
          this.offerInformationForm.description.setValue(this.naceDetailForm.description.value);
          this.offerInformationForm.nacelevel.setValue(this.naceDetailForm.level.value);
          this.offerInformationForm.nacemodel.setValue(this.naceDetailForm.model.value);
          this.naceDetailForm.businessmodel.setValue(this.naceDetailForm.businessmodel.value);
          this.modalService.dismissAll();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  checkforMOQBypass(lengthandfactors, stocklength): boolean {
    let result: boolean = false;

    let availableStockLengths = stocklength.map(x => x.length);
    let availableStockFactors = stocklength.map(x => x.factor);

    if (availableStockLengths.length == 0) {
      return !result;
    }

    let temp: boolean = true;
    for (let index = 0; index < lengthandfactors.length; index++) {
      temp = availableStockLengths.includes(+lengthandfactors[index].length) && availableStockFactors.includes(+lengthandfactors[index].factor);

      if (temp && !result) {
        result = false;
      } else if (!temp) {
        result = true;
      }
    }

    return result;
  }

  closeQuantity() {
    this.addQuantity = {
      id: 0,
      quantity: null,
      reqdeliverydate: null
    };
    this.modalRef.close();
  }

  setError(message: string, subPopup: boolean = false) {
    if (subPopup) {
      this.subErrorMessage = message;
    } else {
      this.errorMessage = message;
    }
 }
  onQuantitySave() {
    this.addQuantity.reqdeliverydate = this.addQuantity.reqdeliverydate == null ? this.stdItemForm.itemreqdeliverydate.value : this.addQuantity.reqdeliverydate;
    this.submitted = true;
    if ((Number(this.addQuantity.quantity) % Number(this.stdItemForm.ItemMDQ.value)) != 0) {
      this.setError(`Quantity must be in multiples of MDQ ${Number(this.stdItemForm.ItemMDQ.value)}`, true);
      return;
    }
    if (Config.ExcelDateToJSDate(this.addQuantity.reqdeliverydate.split("/").reverse().join("-"), '-').date < moment().format('YYYY-MM-DD')) {
      this.notificationService.showError(`Req. Dlv. Date must be greated than today date.`);
      return;
    }
    if (!this.addQuantity.quantity) {
       return;
  }

    this.quantityData.push({ ...this.addQuantity });

    let totalQuantity = 0;

    this.quantityData.forEach(item => {
      totalQuantity += parseInt(item.quantity ? item.quantity:item.qty);
    });
    this.stdItemForm.stdItemQty.setValue(totalQuantity);
    this.onItemQtyChange();
    this.addQuantity = {
      id: 0,
      quantity: null,
      reqdeliverydate: null
    };
    this.subErrorMessage ="";
    this.errorMessage=""
    this.modalRef.close();

  }
  onquantityRemove(index: number) {
    this.quantityData.splice(index, 1)
  }
}