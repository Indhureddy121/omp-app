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
import * as sprformData from '../../../shared/components/spr-information-popup/./spr-information.json';
import { OcactionService } from '@core/services/ocactioninterim/ocaction.service';

import {
  buffer,
  bufferWhen,
  bufferTime,
  bufferCount,
  bufferToggle
} from 'rxjs/operators';
import { SPRFORMSTATUS } from '@shared/components/spr-information-popup/spr-information-popup.component';
import { StorageKey, StorageService } from '@core/services/common/storage.service';
import { ImportForEnum } from '@core/enums/importfor.enum';
import { AppService } from 'src/app/app.service';
import { NotificationService } from '@core/services/common/notification.service';
@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css']
})
export class OffersComponent implements OnInit {

  OfferInformationForm: FormGroup;
  AccountContactDetail: FormGroup;
  TermsandConditionForm: FormGroup;
  SpecialTextForm: FormGroup;
  ItemsForm: FormGroup;
  StdItemForm: FormGroup;
  RejForm: FormGroup;
  confrmForm: FormGroup;
  LengthandFactorForm: FormGroup;
  OtherForm: FormGroup;
  ManagePOForm: FormGroup;
  InitiateSOForm: FormGroup;
  SPRItemForm: FormGroup;
  ImportItemsForm: FormGroup;
  AdditionalFieldsForm: FormGroup;
  RejectForm: FormGroup;
  ApproveForm: FormGroup;
  SPRLengthandFactorForm: FormGroup;
  DeletedSPRItemForm: FormGroup;
  ItemAdditionalFieldsForm: FormGroup;
  ApprovedDataSheetForm: FormGroup;
  ImportSPRItemsForm: FormGroup;
  AssigneeForm: FormGroup;
  SOnoForm: FormGroup;
  CPOValidatorForm: FormGroup;

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
  usertype: number;
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
  offerValidMaxdate: any;
  offerValidMindate: any;
  offerID: number = 0;
  offerNo: string = '';
  offerInactiveText: string = '';
  todayMinDate: { year: number; month: number; day: number };
  offervalidfromDate: { year: number; month: number; day: number };
  offervalidtoDate: { year: number; month: number; day: number };
  poDate: { year: number; month: number; day: number };
  afpoDate: { year: number; month: number; day: number };
  reqdeliveryDate: { year: number; month: number; day: number };
  offerreqdeliveryDate: { year: number; month: number; day: number };
  pricingDate: { year: number; month: number; day: number };
  customerRequiredDeliveryDate: { year: number; month: number; day: number };
  firstDate: { year: number; month: number; day: number };
  itemreqdeliveryDate: { year: number; month: number; day: number };
  lengthreqdeliveryDate: { year: number; month: number; day: number };
  spritemreqdeliveryDate: { year: number; month: number; day: number };
  sprlengthreqdeliveryDate: { year: number; month: number; day: number };
  offerItemStd: any[] = [];
  offerItemSPR: any[] = [];
  articleNo: string = '';
  todayDate: any;
  createdDate: string;
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
  quantityData: any[] = []
  modalRef: any;
  itemType: string;
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
  isOfferInderect: boolean = false;
  offerdata: any = {};
  SPRFiles: any[] = [];
  DeletedSPRFiles: any[] = [];
  DataSheetFiles: any[] = [];
  SPRItemSequenceId: number = 0;
  offerInformation: number = 0;
  approvedandrejectedby: number = 0;
  FMapproveandreject: number = 0;
  termsandcondition: number = 0;
  managepo: number = 0;
  initiateso: number = 0;
  additionalfields: number = 0;
  somanually: number = 0;
  customerapproval: number = 0;
  orderstatus: number = 0;
  cpovalidator: number = 0;
  oc_bd: number = 0;
  poId: number;
  isInitiateSOChecked: boolean = false;
  contactdetail: any[] = [];
  searchedcontactdetail: any[] = [];
  selectedcontact: number = 0;
  spritemid: number;
  SPRItemArticleNo: string;
  oppoid: string;
  lappoppoid: string;
  spritemindex: number;
  SPRStatus: number;
  SPRFormStatus: number;
  SPRFormFields: object;
  SPRShowStatus: string;
  SPRActionRequired: string;
  deletedItem: boolean = false;
  deletedSPRItem: boolean = false;
  offerDeletedItem: any[] = [];
  offerDeletedSPRItem: any[] = [];
  ImportItemFiles: any;
  ImportSPRItemFiles: any;
  ImportSPRFormFiles: any;
  worksheet: XLSX.WorkSheet;
  importitemjsonData: any[] = [];
  importspritemjsonData: any[] = [];
  importsprformjsonData: any[] = [];
  ImportItemsfileUploaded: any;
  ImportSPRItemsfileUploaded: any;
  ImportSPRFormfileUploaded: any;
  storeData: any;
  importItemStatus: any[] = [];
  @ViewChild('specialtermsdeletemodel', { static: false }) specialtermsdeletemodel: any;
  @ViewChild('stditemdeletemodel', { static: false }) stditemdeletemodel: any;
  @ViewChild('spritemdeletemodel', { static: false }) spritemdeletemodel: any;
  @ViewChild('offerapprovemodel', { static: false }) offerapprovemodel: any;
  @ViewChild('offerrejectmodel', { static: false }) offerrejectmodel: any;
  @ViewChild('customerapprovemodel', { static: false }) customerapprovemodel: any;
  @ViewChild('customerrejectmodel', { static: false }) customerrejectmodel: any;
  @ViewChild('ProductSearchModel', { static: false }) ProductSearchModel: any;
  @ViewChild('ItemAdditionalFieldsModel', { static: false }) ItemAdditionalFieldsModel: any;
  @ViewChild('ImportSPRItems', { static: false }) ImportSPRItems: any;
  @ViewChild('ImportSPRForms', { static: false }) ImportSPRForms: any;
  @ViewChild('ImportSPRFormsStatus', { static: false }) ImportSPRFormsStatus: any;
  @ViewChild('itemdeleteallmodel', { static: false }) itemdeleteallmodel: any;
  @ViewChild('AssigneeModel', { static: false }) AssigneeModel: any;
  @ViewChild('ArticleValidityModel', { static: false }) ArticleValidityModel: any;
  @ViewChild('SPRInformationModel', { static: false }) SPRInformationModel: any;
  deleteConfirModel = Object();
  filesperitem: number;
  filesize: number;
  converttoYMD: string = 'yyyy-MM-dd';
  isItemReady: boolean = true;
  // itemErrorMessage: string = '';
  offerdirectpdf: string = 'Offer PDF - Customer';
  offerindirectpdf: string = 'Offer PDF - Dealer';
  importitemheaderList: string[];
  importspritemheaderList: string[];
  importsprformheaderList: string[];
  sprItemDescription: string;
  ItemCatalogue: string;
  ASMapproveComment: string;
  PaymentTermsValue: string;
  DeliveryLeadTimeValue: string;
  ReasonforClone: string;
  SpecialTermTitle: string;
  SpecialTermDescription: string;
  InitiateSOComment: string;
  RejectReason: string;
  isRefrenceOffer: boolean = false;
  offerapprovaldata: any[] = [];
  customerapprovaldata: any[] = [];
  FMApprovalData: any[] = [];
  orderTypeList: any[] = [
    { code: 'ZDOM', description: 'ZDOM' },
    { code: 'ZHSS', description: 'ZHSS' },
    { code: 'ZCOM', description: 'ZCOM' },
    { code: 'ZEXP', description: 'ZEXP' },
    { code: 'ZHSE', description: 'ZHSE' }];
  deliveryBlockList: any[] = [
    { code: '06', description: 'GSTN Number Missing' },
    { code: '14', description: 'Road Permit Reqd Blk' },
    { code: '15', description: 'Stock Order Blk' },
    { code: '19', description: 'LC Required Blk' },
    { code: '30', description: 'Inspection Reqd Blk' },
    { code: '31', description: 'Packing Inst Reqd Bk' },
    { code: '32', description: 'Back Calc Inst Reqd' },
    { code: '99', description: 'BLOCK PL' },
    { code: 'Z2', description: 'Customer Clearance' },
    { code: 'Z3', description: 'Advance Payment' },
    { code: 'Z6', description: '1 Lot Delivery Blk' },
    { code: 'Z7', description: 'NoDatasheet Approval' },
    { code: 'Z8', description: 'Blo for B.LAapprova' },
    { code: 'Z9', description: 'Blk for C.L.approval' }];

  completedlvChecked: boolean = false;
  incotermsList: any[] = [
    { code: "AIR", description: 'By Air' },
    { code: "CFR", description: 'CFR- Costs & freight' },
    { code: "CIF", description: 'CIF- Costs, insurance & freight' },
    { code: "DD", description: 'Door delivery' },
    { code: "EXW", description: 'EXW - Ex works' },
    { code: "FOB", description: 'FOB - Free on board' },
    { code: "SEA", description: 'SEA - By Sea' }];
  specialprocessingidList: any[] = [
    { code: 1, description: 'Paid' },
    { code: 2, description: 'Unpaid' }
  ];
  meansoftransportList: any[] = [
    { code: '0006', description: 'Import by Air' },
    { code: '0007', description: 'Air Freight Inclusive' },
    { code: '0009', description: 'Air Flash' }];
  alternatetaxclassification1List: any[] = [
    { code: '0', description: 'Registered' },
    { code: '1', description: 'Unregistered' },
    { code: '2', description: 'SEZ Customer' },
    { code: '3', description: 'Deemed export Customer' }
  ];
  alternatetaxclassification3List: any[] = [
    { code: '0', description: 'Tax Exempt' }
  ];
  alternatetaxclassification4List: any[] = [
    { code: '0', description: 'No Concession' },
    { code: '1', description: 'Exempted Supply' },
    { code: 'C', description: 'Concession 5%' },
    { code: 'D', description: 'Deeed Exports' },
    { code: 'E', description: 'Exports' },
    { code: 'S', description: 'STO(Within State)' },
    { code: 'X', description: 'SEZ' },
  ];
  requirementtypeList: any[] = [
    { code: 'ZKE', description: 'ZKE - Indv cust ord w/o consumption' },
    { code: 'Z41', description: 'Z41 - Cable Order' }];
  planningblockList: any[] = [
    { code: 'Z9', description: 'Z9' }
  ];
  importbyList: any[] = [
    { code: '0006', description: 'Air' }
  ];
  // datetimeFormate: string;
  isOfferOpen: boolean = false;
  isOfferOpenforFM: boolean = false;
  packingmaterialtypeList: any[] = [];
  additionalfieldId: number;
  specialtextdeletedata: any[] = [];
  offerItemSPRdeletedata: any[] = [];
  offerItemStddeletedata: any[] = [];
  verticalList: any[] = [];
  segmentList: any[] = [];
  isExportOrder: boolean = false;
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
  isShowFromToLocation: boolean = false;
  fromlocationList: any[] = [];
  tolocationList: any[] = [];
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
  // importitemsstockdata: any;
  NacecodeList: any[] = [];
  BusinessModelList: any[] = [
    { code: 'Project', description: 'Project' },
    { code: 'VAS', description: 'VAS' },
    { code: 'E-Mobility', description: 'E-Mobility' },
    { code: 'Catalog', description: 'Catalog' }];
  showpclength: boolean = false;
  articleValidityModel = Object();
  isRevalidation: boolean = false;
  // newOfferValidity: any = '';
  // articleValidity: any;
  revalidationErrorMsg: string;
  itemValidTo: any;
  // SubmitButtonText: string = "Submit for approval";
  ShowSubmitforApprovalButton: boolean = true;
  ShowSubmitforRevalidationButton: boolean = false;
  ShowSendtoPEButton: boolean = false;
  isChangeOfferValidity: boolean = false;
  selectedSPRDataSheetArticleNo: any;
  dataSheetObj: any;
  selectedArticleNo: any;
  description: any;
  sendtoPE: boolean = false;
  isReadOnlyForm: boolean = false;
  dataSheetrecordIndex: any;
  isSaveBtnDisplay: boolean = true;
  isDpTxtVisible: boolean = true;
  filterFields: any;
  exp_surcharge: number = 0;
  importSPRFormStatus: any[] = [];
  clonesubmitted: boolean = false;
  exportSPRItems: any[] = [];
  errorMessage: string = "";
  subErrorMessage: string = "";

  isHarnessing: boolean = false;
  OcActinFiles: any[] = [];
  filesidlist: any[] = [];

  addQuantity = {
    id: 0,
    quantity: null,
    reqdeliverydate: null
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      stditemCode: '',
      stdItemName: '',
      stdItemType: '',
      stdItemUOM: '',
      stdItemPCLength: '',
      stdItemMOQ: '',
      ItemMOQ: '',
      stdItemPrice: '',
      stdItemexpsurcharge: '',
      lengthandfactor: '',
      stdItemQty: '',
      itemunitnetprice: '',
      enquiredquantity: '',
      stdItemCatalog: '',
      itemsDocuments: '',
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
    private opportunitiesService: OpportunitiesService,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
    private productmasterService: ProductmasterService,
    private pagerServcie: PagerService,
    private customerService: CustomerService,
    private stockorderService: StockorderService,
    private storageService: StorageService,
    private appService: AppService,
    private notificationService: NotificationService,
    private OcactionService: OcactionService
  ) {
    this.revalidationErrorMsg = 'Kindly contact PE team to extend the article validity. Please create a clone after validity update.';
  }

  get offerInformationForm() { return this.OfferInformationForm.controls }
  get accountContactDetail() { return this.AccountContactDetail.controls }
  get itemsForm() { return this.ItemsForm.controls }
  get stdItemForm() { return this.StdItemForm.controls }
  get specialTextForm() { return this.SpecialTextForm.controls }
  get lengthandFactorForm() { return this.LengthandFactorForm.controls }
  get otherForm() { return this.OtherForm.controls }
  get termsandConditionForm() { return this.TermsandConditionForm.controls }
  get managePOForm() { return this.ManagePOForm.controls }
  get initiateSOForm() { return this.InitiateSOForm.controls }
  get sprItemForm() { return this.SPRItemForm.controls }
  get importItemsForm() { return this.ImportItemsForm.controls }
  get additionalFieldsForm() { return this.AdditionalFieldsForm.controls }
  get rejectForm() { return this.RejectForm.controls }
  get approveForm() { return this.ApproveForm.controls }
  get sprLengthandFactorForm() { return this.SPRLengthandFactorForm.controls }
  get deletedSPRItemForm() { return this.DeletedSPRItemForm.controls }
  get itemAdditionalFieldsForm() { return this.ItemAdditionalFieldsForm.controls }
  get approvedDataSheetForm() { return this.ApprovedDataSheetForm.controls }
  get importSPRItemsForm() { return this.ImportSPRItemsForm.controls }
  get assigneeForm() { return this.AssigneeForm.controls }
  get sonoForm() { return this.SOnoForm.controls }
  get cpoValidatorForm() { return this.CPOValidatorForm.controls }

  ngOnInit() {
    this.activatedRoute.params.subscribe(parms => {
      this.offerID = parms['id'];
    });
    this.storageService.setValue(StorageKey.sprFormJsonData, JSON.stringify((sprformData as any).default));
    this.onLoad();
  }

  private onLoad() {
    this.dateformate = this.authService.getDateFormat();
    // this.datetimeFormate = 'dd/MM/yyyy hh:mm:ss';
    this.userid = this.authService.getUserId();
    this.usertype = this.authService.getCurrentUser().usertype;
    this.username = this.authService.getUserName();
    this.userrolecode = this.authService.getUserRoleCode();
    this.offerdata.TotalGrossMargin = 0;
    this.offerdata.TotalRMCGrossMargin = 0;
    this.offerdata.TotalTargetGrossMargin = 0;
    // if (this.authService.getUserRoleCode() == 'BL' || this.authService.getUserRoleCode() == 'PM' || this.authService.getUserRoleCode() == 'BH' || this.authService.getUserRoleCode() == 'HoS' || this.authService.getUserRoleCode() == 'MD' || this.authService.getUserRoleCode() == 'FM' || this.authService.getUserRoleCode() == 'Admin') {
    //   this.isShowItemMargin = true;
    //   this.isShowOverallMargin = true;
    // } else {
    //   this.isShowItemMargin = false;
    //   this.isShowOverallMargin = false;
    // }

    // if (this.authService.getUserRoleCode() == 'TL' || this.authService.getUserRoleCode() == 'BL' || this.authService.getUserRoleCode() == 'PM' || this.authService.getUserRoleCode() == 'BH' || this.authService.getUserRoleCode() == 'HoS' || this.authService.getUserRoleCode() == 'MD' || this.authService.getUserRoleCode() == 'FM' || this.authService.getUserRoleCode() == 'Admin') {
    //   this.isShowOverallMargin = true;
    // } else {
    //   this.isShowOverallMargin = false;
    // }

    // if (this.authService.getUserRoleCode() == 'BH' || this.authService.getUserRoleCode() == 'HoS' || this.authService.getUserRoleCode() == 'MD' || this.authService.getUserRoleCode() == 'FM' || this.authService.getUserRoleCode() == 'Admin') {
    //   this.isShowOverallRGroupMargin = true;
    // } else {
    //   this.isShowOverallRGroupMargin = false;
    // }

    this.todayDate = moment().format('DD/MM/YYYY');
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.futureDate = moment().add(this.authService.OfferValidupto(), 'd').format('DD/MM/YYYY');
    this.todayMinDate = this.convertDate(this.todayDate);
    this.offervalidfromDate = this.convertDate(this.todayDate);
    this.offervalidtoDate = this.convertDate(this.futureDate);
    this.offerValidMaxdate = this.offervalidtoDate;
    this.offerValidMindate = this.offervalidfromDate;
    this.reqdeliveryDate = this.convertDate(this.todayDate);
    this.pricingDate = this.convertDate(this.todayDate);
    this.firstDate = this.convertDate(this.todayDate);
    this.poDate = this.convertDate(this.todayDate);
    this.filesperitem = Config.getItemsFile.NumberofFiles + 1;
    this.filesize = Config.getItemsFile.filesize;
    this.GetNaceCodeList();

    this.onbuildForm();
    this.loadPageMode();
    this.disableFields();
    // this.getFromlocation();
    // this.getTolocation();

    this.offerInformationForm.offersValidfrom.setValue(this.todayDate);
    this.offerInformationForm.offersValidto.setValue(this.futureDate);
    this.managePOForm.podate.setValue(this.todayDate);
    this.additionalFieldsForm.pricingdate.setValue(this.todayDate);
    this.additionalFieldsForm.firstdate.setValue(this.todayDate);
    this.currencycode = this.offerInformationForm.currencyType.value;
  }

  private onbuildForm() {
    this.OfferInformationForm = this.formBuilder.group({
      offersValidfrom: ['', [Validators.required]],
      offersValidto: ['', [Validators.required]],
      vertical: ['', [Validators.required]],
      segment: ['', [Validators.required]],
      currencyType: ['INR', [Validators.required]],
      offerType: [1, [Validators.required]],
      delearcommission: [''],
      soldtopartyType: [''],
      shiptopartyType: [''],
      incoterms: ['DD', [Validators.required]],
      fromlocation: [[]],
      tolocation: [[]],
      reasonforclone: [null],
      industry: [null],
      headerleveldiscount: [''],
      dealers: [null],
      nacecode: [null, [Validators.required]],
      nacelevel: [null],
      nacemodel: [null],
      businessmodel: [null],
      offerreqdeliverydate: [null, [Validators.required]]
    });

    this.AccountContactDetail = this.formBuilder.group({
      contactsearch: [null]
    });

    this.TermsandConditionForm = this.formBuilder.group({
      paymentterms: ['', [Validators.required]],
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
      lfqty: [''],
      lengthreqdeliverydate: [null, [Validators.required]]
    });

    this.ItemsForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()]),
      freightcharges: ['']
    });

    this.StdItemForm = this.formBuilder.group({
      searchValue: [''],
      stditemCode: [''],
      stdItemName: [''],
      stdItemType: [''],
      stdItemUOM: [''],
      stdItemPCLength: [''],
      enquiredquantity: ['', [Validators.required]],
      stdItemMOQ: [''],
      ItemMOQ: [''],
      ItemMDQ: [''],
      stdItemPrice: [''],
      stdItemexpsurcharge: [''],
      stdItemCatalog: [''],
      stdItemQty: ['', [Validators.required]],
      itemunitnetprice: ['', [Validators.required]],
      itemDiscount: [''],
      customerpartno: [''],
      itemtotal: [''],
      seqno: [''],
      itemreqdeliverydate: [null, [Validators.required]],
      importby: [null]
    });

    this.OtherForm = this.formBuilder.group({
      isrecommend: [''],
      asmapprovecomment: [null]
    });

    this.ManagePOForm = this.formBuilder.group({
      ponumber: ['', [Validators.required]],
      podate: ['', [Validators.required]]
    });

    this.InitiateSOForm = this.formBuilder.group({
      initiatecomments: ['', [Validators.required]]
    });

    this.SPRItemForm = this.formBuilder.group({
      sprItemDesc: ['', Validators.required],
      sprItemQty: ['', Validators.required],
      seqno: [''],
      customerpartno: [''],
      sprItemDocs: [''],
      itemreqdeliverydate: [null, [Validators.required]]
    });

    this.ImportItemsForm = this.formBuilder.group({

    });

    this.AdditionalFieldsForm = this.formBuilder.group({
      assignto: [''],
      salesorg: ['8200'],
      division: ['00'],
      ordertype: ['ZDOM'],
      distchannel: ['10'],
      deliveryblock: [[]],
      completedlv: [''],
      pricingdate: [''],
      specialprocessingid: [1],
      firstdate: [''],
      requirementtype: [[]],
      meansoftransport: [[]],
      alternatetaxclassification1: [[]],
      alternatetaxclassification3: [[]],
      alternatetaxclassification4: [[]],
      freetextbox: [''],
      iscreateso: [null],
      shiptoparty: [[], [Validators.required]],
      soldtoparty: [[], [Validators.required]],
      soldtopartyname: [''],
      soldtopartygstin: [''],
      shiptopartyname: [''],
      freightzfro: [null],
      freightzfrk: [null],
      cuttingcharges: [null],
      inspectioncharges: [null],
      packingcharges: [null],
      modeoftransportforforeigntrade: [null],
      portoflanding: [null],
      portofdischarge: [null],
      citydescription: [null],
      countryname: [null],
      countrykey: [null],
      insuranceby: [null],
      exportscheme: [null],
      adcode: [null],
      soldstreet1: [null],
      soldstreet2: [null],
      solddistrict: [null],
      soldcity: [null],
      soldpostalcode: [null],
      soldregion: [null],
      shipstreet1: [null],
      shipstreet2: [null],
      shipdistrict: [null],
      shipcity: [null],
      shippostalcode: [null],
      shipregion: [null],
      afpodate: [''],
      nacecode: [null],
      nacedescription: [null],
      nacelevel: [null],
      nacemodel: [null],
      businessmodel: [null],
      customerrequireddeliverydate: [''],
    });

    this.RejectForm = this.formBuilder.group({
      rejectreason: [null, [Validators.required]]
    });

    this.ApproveForm = this.formBuilder.group({
      approvereason: [null, [Validators.required]]
    });

    this.SPRLengthandFactorForm = this.formBuilder.group({
      sprlength: [null, [Validators.required]],
      sprFactor: [null, [Validators.required]],
      sprlfqty: [null],
      sprlengthreqdeliverydate: [null, [Validators.required]]
    });

    this.DeletedSPRItemForm = this.formBuilder.group({
      delsprItemDesc: [null],
      delsprItemQty: [null],
      delcustomerpartno: [null],
      delseqno: [null]
    });

    this.ItemAdditionalFieldsForm = this.formBuilder.group({
      iafItemno: [null],
      iafArticleno: [null],
      iafQuantity: [null],
      iafunitprice: [null],
      overdelvtolerance: [null, [Validators.required]],
      underdelvtolerance: [null, [Validators.required]],
      reqdeliverydate: [null],
      packingmaterialtype: [null],
      freightzfro: [null],
      freightzfrk: [null],
      cuttingcharges: [null],
      inspectioncharges: [null],
      meansoftransport: [[]],
      planningblock: [[]],
      packingcharges: [null]
    });

    this.ApprovedDataSheetForm = this.formBuilder.group({
      isAllDataSheetApproved: ['']
    });

    this.ImportSPRItemsForm = this.formBuilder.group({

    });

    this.AssigneeForm = this.formBuilder.group({
      assignto: [[]]
    });

    this.SOnoForm = this.formBuilder.group({
      sono: ['', [Validators.required]]
    });

    this.CPOValidatorForm = this.formBuilder.group({
      cpocomments: [null, [Validators.required]]
    });
  }

  private loadPageMode() {
    let currentUrl = this.router.url;
    if (currentUrl.includes('add') && !currentUrl.includes('refrenceoffer')) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      this.managePageSection(0, 1);
      let id: string = '';
      this.activatedRoute.params.subscribe(parms => {
        id = parms['id'];
      });
      this.getOpportunityData(id);
      this.offerID = 0;
      this.getcuttingcharges();
    }
    else if (currentUrl.includes('edit')) {
      this.isAdd = false;
      this.isEdit = true;
      this.isView = false;
      this.getcuttingcharges();
      this.getOffersDetail(this.offerID, false);

    }
    else if (currentUrl.includes('view')) {
      this.isAdd = false;
      this.isEdit = false;
      this.isView = true;
      this.getcuttingcharges();
      this.getOffersDetail(this.offerID, false);
    } else if (currentUrl.includes('add') && currentUrl.includes('refrenceoffer')) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      this.isRefrenceOffer = true;
      this.managePageSection(0, 1);
      this.getcuttingcharges();
      this.getOffersDetail(this.offerID, true);
    }

    this.getOcactionFileDetails(this.offerID, false)
    this.getOcFileslist(this.offerID, false)
  }

  viewClicked(oppid: string) {
    this.router.navigate(['/opportunities/view/' + oppid]);
  }

  private disableFields() {
    if (this.isView) {
      this.offerInformationForm.offersValidfrom.disable();
      this.offerInformationForm.offersValidto.disable();
      this.offerInformationForm.currencyType.disable();
      this.offerInformationForm.offerType.disable();
    } else if (this.isEdit) {
      this.offerInformationForm.offersValidfrom.disable();
      this.offerInformationForm.offersValidto.disable();
    }

    this.offerInformationForm.nacecode.disable();
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

  onOffValidFromDateSelection(date) {
    this.offerValidMindate = date;
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    let maxdate = moment(offerValidFromdate).add(this.authService.OfferValidupto(), 'd').format('DD/MM/YYYY');
    this.offerValidMaxdate = this.convertDate(maxdate);
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateformate);
    this.offerInformationForm.offersValidfrom.setValue(offerValidFromdate);

    if (new Date(this.offerInformationForm.offersValidfrom.value.split('/').reverse().join('-')) > new Date(this.offerInformationForm.offersValidto.value.split('/').reverse().join('-'))) {
      this.offervalidtoDate = this.convertDate(offerValidFromdate);
      this.offerInformationForm.offersValidto.setValue(offerValidFromdate);
    }
  }

  onOffValidToDateSelection(date) {
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateformate);
    this.offerInformationForm.offersValidto.setValue(offerValidTodate);
  }

  onOfferReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.offerInformationForm.offerreqdeliverydate.setValue(reqdeliverydate);

    // if (this.offerItemStd && this.offerItemStd.length > 0) {
    //   this.offerItemStd.forEach(element => {
    //     element.reqdlvdate = reqdeliverydate;
    //   });
    // }
  }

  onitemReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.stdItemForm.itemreqdeliverydate.setValue(reqdeliverydate);
  }

  onLengthReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.lengthandFactorForm.lengthreqdeliverydate.setValue(reqdeliverydate);
  }

  onQuantityReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.addQuantity.reqdeliverydate = reqdeliverydate;
  }

  onSPRLengthReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.sprLengthandFactorForm.sprlengthreqdeliverydate.setValue(reqdeliverydate);
  }

  onPODateSelection(date) {
    let podate = new Date(date.year, date.month - 1, date.day).toString();
    podate = this.datePipe.transform(podate, this.dateformate);
    this.managePOForm.podate.setValue(podate);
  }

  onAdditionalFieldPODateSelection(date) {
    let afpodate = new Date(date.year, date.month - 1, date.day).toString();
    afpodate = this.datePipe.transform(afpodate, this.dateformate);
    this.additionalFieldsForm.afpodate.setValue(afpodate);
  }

  onReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.itemAdditionalFieldsForm.reqdeliverydate.setValue(reqdeliverydate);
  }

  onSPRItemReqDeliveryDateSelection(date) {
    let reqdeliverydate = new Date(date.year, date.month - 1, date.day).toString();
    reqdeliverydate = this.datePipe.transform(reqdeliverydate, this.dateformate);
    this.sprItemForm.itemreqdeliverydate.setValue(reqdeliverydate);
  }

  onPricingDateSelection(date) {
    let pricedate = new Date(date.year, date.month - 1, date.day).toString();
    pricedate = this.datePipe.transform(pricedate, this.dateformate);
    this.additionalFieldsForm.pricingdate.setValue(pricedate);
  }

  onFirstDateSelection(date) {
    let firstdate = new Date(date.year, date.month - 1, date.day).toString();
    firstdate = this.datePipe.transform(firstdate, this.dateformate);
    this.additionalFieldsForm.firstdate.setValue(firstdate);
  }

  onCustomerRequiredDeliveryDateSelection(date) {
    let csrdate = new Date(date.year, date.month - 1, date.day).toString();
    csrdate = this.datePipe.transform(csrdate, this.dateformate);
    this.additionalFieldsForm.customerrequireddeliverydate.setValue(csrdate);
  }

  getOffersDetail(id: number, isclone: boolean) {
    this.offersService.getOffersDetail(id, isclone).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.offerdetail.offerdata[0]) {
            this.offerdata = response.responsedata.data.offerdetail.offerdata[0];
            this.offerNo = this.offerdata.offerno;
            this.offerInactiveText = this.offerdata.IsActive != 1 ? '[Inactive]' : '';
            this.selectedcontact = Number(this.offerdata.contactid);

            if (isclone) {
              this.offervalidfromDate = this.convertDate(this.todayDate);
              this.offerInformationForm.offersValidfrom.setValue(this.todayDate);
              this.offervalidtoDate = this.convertDate(this.futureDate);
              this.offerInformationForm.offersValidto.setValue(this.futureDate);
              this.offerValidMaxdate = this.offervalidtoDate;
              this.offerValidMindate = this.offervalidfromDate;
            } else {
              this.offervalidfromDate = this.convertDate(this.datePipe.transform(this.offerdata.offervalidfrom, this.dateformate));
              this.offerInformationForm.offersValidfrom.setValue(this.datePipe.transform(this.offerdata.offervalidfrom, this.dateformate));
              this.offervalidtoDate = this.convertDate(this.datePipe.transform(this.offerdata.offervalidto, this.dateformate));
              this.offerInformationForm.offersValidto.setValue(this.datePipe.transform(this.offerdata.offervalidto, this.dateformate));

              let _futureDate = moment(this.offerdata.offervalidfrom).add(this.authService.OfferValidupto(), 'd').format('DD/MM/YYYY');
              this.offerValidMaxdate = this.convertDate(_futureDate);
            }

            if (this.offerdata.offerreqdeliverydate && this.offerdata.offerreqdeliverydate != '0000-00-00 00:00:00') {
              this.offerreqdeliveryDate = this.convertDate(this.datePipe.transform(this.offerdata.offerreqdeliverydate, this.dateformate));
              this.offerInformationForm.offerreqdeliverydate.setValue(this.datePipe.transform(this.offerdata.offerreqdeliverydate, this.dateformate));
            } else {
              this.offerreqdeliveryDate = null;
              this.offerInformationForm.offerreqdeliverydate.setValue(null);
            }

            this.offerInformationForm.currencyType.setValue(this.offerdata.CurrencyType);
            this.currencycode = this.offerdata.CurrencyType;
            this.offerInformationForm.offerType.setValue(this.offerdata.OfferType);

            this.OfferFreightCharges = Number(this.offerdata.freightcharges);
            if (this.currencycode == 'USD') {
              this.itemsForm.freightcharges.setValue(Number((Number(this.offerdata.freightcharges) / Number(this.USDrate)).toFixed(2)));
            } else if (this.currencycode == 'EUR') {
              this.itemsForm.freightcharges.setValue(Number((Number(this.offerdata.freightcharges) / Number(this.EURrate)).toFixed(2)));
            } else if (this.currencycode == 'INR') {
              this.itemsForm.freightcharges.setValue(Number(this.offerdata.freightcharges));
            }

            if (this.offerdata.OfferType == 2) {
              this.isOfferInderect = true;
              this.offerInformationForm.delearcommission.setValue((this.offerdata.DealerCommissionPer * 100).toFixed(2));
              this.DealerCommisionPer = Number(this.offerInformationForm.delearcommission.value);
              if (this.offerdata.dealer && this.offerdata.dealer.length > 0) {
                this.offerInformationForm.dealers.setValue(this.offerdata.dealer);
                this.GetDealersListAPI(this.offerdata.dealer);
              } else {
                this.offerInformationForm.dealers.setValue(null);
              }
            } else {
              this.DealerCommisionPer = 0;
            }
            this.offerInformationForm.headerleveldiscount.setValue(this.offerdata.headerleveldiscount);
            this.offerInformationForm.incoterms.setValue(this.offerdata.incoterms);

            this.isShowFromToLocation = response.responsedata.data.uiinfo.ShowFromToLocation;
            if (this.isShowFromToLocation) {
              this.offerInformationForm.fromlocation.setValue(this.offerdata.fromlocation);
              this.offerInformationForm.tolocation.setValue(this.offerdata.tolocation);
              this.getcuttingcharges();
              this.getFromlocation();
              this.getTolocation();
            }

            if (this.isRefrenceOffer) {
              this.offerInformationForm.reasonforclone.setValue(null);
              this.ReasonforClone = '';
              this.offerInformationForm.reasonforclone.setValidators(Validators.required);
              this.offerInformationForm.reasonforclone.updateValueAndValidity();
            } else if (this.offerdata.RefOfferId) {
              this.offerInformationForm.reasonforclone.setValue(this.offerdata.reasonforclone);
              this.ReasonforClone = this.offerdata.reasonforclone;
            }

            this.OfferFiles = response.responsedata.data.offerdetail.offer_docs;
            if (response.responsedata.data.offerdetail.getItems.length > 0) {
              this.stdItem = true;
              this.offerItemStd = response.responsedata.data.offerdetail.getItems;

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
              this.filterDatatoDeletewithOrder(this.offerItemStd);
              let i = 0;
              this.offerItemStd.forEach(element => {
                i += 1;
                element.itemSeqId = i;
                element.documents = [];

                if (element.itemreqdeliverydate && !element.itemreqdeliverydate.includes("0000-00-00"))
                  element.itemreqdeliverydate = this.datePipe.transform(element.itemreqdeliverydate, this.dateformate);
                else
                  element.itemreqdeliverydate = null;

                element.lengthandfactor.forEach(element2 => {
                  element2.isDelete = 0;

                  if (element2.lengthreqdeliverydate && !element2.lengthreqdeliverydate.includes("0000-00-00"))
                    element2.lengthreqdeliverydate = this.datePipe.transform(element2.lengthreqdeliverydate, this.dateformate);
                  else
                    element2.lengthreqdeliverydate = element.itemreqdeliverydate ? element.itemreqdeliverydate : null;
                });

                if (element.uom.toUpperCase() == 'PC' && element.length)
                  element.pclength = element.length.split('|')[0];
                else if (element.uom.toUpperCase() === 'M') {
                  if (element.length)
                    element.length += '|Other';
                  else
                    element.length = 'Other';
                }

                if (element.itemType.toUpperCase() == 'SPR')
                  element.approveddatasheets = [];
              });
              this.updateTotalValues();
            }

            this.isShowOverallRGroupMargin = response.responsedata.data.uiinfo.ShowTotalRMCGrossMargin;
            this.isShowOverallMargin = response.responsedata.data.uiinfo.ShowTotalGrossMargin;

            this.isShowItemMargin = response.responsedata.data.uiinfo.ShowItemMargin;
            this.isShowItemRMCGrossMargin = response.responsedata.data.uiinfo.ShowItemRMCGrossMargin;

            this.isFMApprovalReq = this.totalnetvalue > Config.fmapproval.amount;

            this.isExpiredItemsinOffer = this.offerItemStd.filter(x => x.isexpire == 1).length > 0 ? true : false;

            if (response.responsedata.data.offerdetail.getDeletedItems.length > 0) {
              this.deletedItem = true;
              this.offerDeletedItem = response.responsedata.data.offerdetail.getDeletedItems;
              this.offerDeletedItem.forEach(element => {
                element.documents = [];

                if (element.itemreqdeliverydate && !element.itemreqdeliverydate.includes("0000-00-00"))
                  element.itemreqdeliverydate = this.datePipe.transform(element.itemreqdeliverydate, this.dateformate);
                else
                  element.itemreqdeliverydate = null;

                element.lengthandfactor.forEach(element2 => {
                  if (element2.lengthreqdeliverydate && !element2.lengthreqdeliverydate.includes("0000-00-00"))
                    element2.lengthreqdeliverydate = this.datePipe.transform(element2.lengthreqdeliverydate, this.dateformate);
                  else
                    element2.lengthreqdeliverydate = element.itemreqdeliverydate ? element.itemreqdeliverydate : null;
                });
              });
            }

            if (response.responsedata.data.offerdetail.deletedspritem.length > 0) {
              this.deletedSPRItem = true;
              this.offerItemSPRdeletedata = response.responsedata.data.offerdetail.deletedspritem;

              this.offerItemSPRdeletedata.forEach(element => {

                if (element.itemreqdeliverydate && !element.itemreqdeliverydate.includes("0000-00-00"))
                  element.itemreqdeliverydate = this.datePipe.transform(element.itemreqdeliverydate, this.dateformate);
                else
                  element.itemreqdeliverydate = null;

                element.sprlengthandfactor.forEach(element2 => {
                  if (element2.sprlengthreqdeliverydate && !element2.sprlengthreqdeliverydate.includes("0000-00-00"))
                    element2.sprlengthreqdeliverydate = this.datePipe.transform(element2.sprlengthreqdeliverydate, this.dateformate);
                  else
                    element2.sprlengthreqdeliverydate = element.itemreqdeliverydate ? element.itemreqdeliverydate : null;
                });
              });
            }

            if (response.responsedata.data.offerdetail.spritem.length > 0) {
              this.sprItem = true;
              this.offerItemSPR = response.responsedata.data.offerdetail.spritem;
              let i = 0;
              this.offerItemSPR.forEach(element => {
                i += 1;
                element.itemSeqId = i;
                element.sprdocuments = [];

                if (element.itemreqdeliverydate && !element.itemreqdeliverydate.includes("0000-00-00"))
                  element.itemreqdeliverydate = this.datePipe.transform(element.itemreqdeliverydate, this.dateformate);
                else
                  element.itemreqdeliverydate = null;

                element.sprlengthandfactor.forEach(element2 => {
                  element2.isDelete = 0;

                  if (element2.sprlengthreqdeliverydate && !element2.sprlengthreqdeliverydate.includes("0000-00-00"))
                    element2.sprlengthreqdeliverydate = this.datePipe.transform(element2.sprlengthreqdeliverydate, this.dateformate);
                  else
                    element2.sprlengthreqdeliverydate = element.itemreqdeliverydate ? element.itemreqdeliverydate : null;
                });
              });

              this.setSPRStatus();
            }

            if (this.filterSPRDatatoDeletewithOrder(this.offerItemSPR).length > 0) {
              this.ShowSendtoPEButton = true;
              this.ShowSubmitforApprovalButton = false;
            }

            if (this.isRefrenceOffer) {
              this.offerdata.Status = 0;
              this.offerdata.IsActive = 1;
            }

            this.setStatus(this.offerdata.Status);

            this.managePageSection(this.offerdata.Status, this.offerdata.IsActive);

            if (this.offerInformation == 1) {
              this.offerInformationForm.offersValidfrom.disable();
              this.offerInformationForm.offersValidto.disable();
              this.offerInformationForm.currencyType.disable();
              this.offerInformationForm.offerType.disable();
              this.offerInformationForm.shiptopartyType.disable();
              this.offerInformationForm.vertical.disable();
              this.offerInformationForm.segment.disable();
              this.offerInformationForm.incoterms.disable();
              this.offerInformationForm.fromlocation.disable();
              this.offerInformationForm.tolocation.disable();
              this.offerInformationForm.dealers.disable();
              this.offerInformationForm.offerreqdeliverydate.disable();
              this.stdItemForm.itemreqdeliverydate.disable();
              this.stdItemForm.importby.disable();
              this.sprItemForm.itemreqdeliverydate.disable();
            }

            this.offerapprovaldata = response.responsedata.data.offerdetail.getApprovalData;
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

            this.offerapprovaldata = this.setApprovaldatastatus(this.offerapprovaldata);

            if (this.termsandcondition >= 1) {
              this.offersService.getOfferTerms(this.offerID).subscribe(
                response => {
                  if (response.responsedata && response.responsedata.statusCode == 200) {
                    this.termsandConditionForm.paymentterms.setValue(response.responsedata.data.paymentterms[0].paymentterm);
                    this.PaymentTermsValue = response.responsedata.data.paymentterms[0].paymentterm;
                    this.termsandConditionForm.deliveryleadtime.setValue(response.responsedata.data.paymentterms[0].deliveryleadtime);
                    this.DeliveryLeadTimeValue = response.responsedata.data.paymentterms[0].deliveryleadtime;
                    let i = 0;
                    response.responsedata.data.specialterms.forEach(element => {
                      i += 1;
                      element.isDelete = 0;
                      element.seqid = i;
                    });
                    this.specialtextdata = response.responsedata.data.specialterms;
                  }
                }, error => {
                  this.notificationService.showError(error.error.error.message);
                });
            }

            if (this.managepo >= 1) {
              this.offersService.getPOData(this.offerID).subscribe(
                response => {
                  if (response.responsedata && response.responsedata.statusCode == 200) {
                    if (response.responsedata.data.getPOData && response.responsedata.data.getPOData.length > 0) {
                      this.managepodata = response.responsedata.data.getPOData[0];
                      this.DataSheets = response.responsedata.data.getOfferDataSheets;
                      if (response.responsedata.data.getSPRItemsDataSheets && response.responsedata.data.getSPRItemsDataSheets.length > 0) {
                        this.offerItemStd.forEach(element => {
                          element.spritemdatasheets = response.responsedata.data.getSPRItemsDataSheets.filter(x => x.articleno == element.articleNo);
                        });
                      }
                      this.setPOData(this.managepodata);

                      if (this.additionalfields >= 1) {
                        this.getAdditionalFieldsData();
                        this.getAssigntoList();
                      }
                    }
                  }
                }, error => {
                  this.notificationService.showError(error.error.error.message);
                });
            }

            if (this.managepo == 1) {
              this.managePOForm.podate.disable();
            }

            if (this.cpovalidator >= 1 && this.isOfferInderect) {
              this.cpoValidatorForm.cpocomments.setValue(this.offerdata.cpocomment);
              this.CPOComment = this.offerdata.cpocomment
            }

            if (this.FMapproveandreject >= 1 && this.isFMApprovalReq) {
              this.getFMApprovalData();
            }

            if (this.initiateso >= 1) {
              this.offersService.GETInitiateSO(this.offerID).subscribe(
                response => {
                  if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
                    this.isInitiateSOChecked = response.responsedata.data[0].IsInitiatedSO.data[0] == 1 ? true : false;
                    this.initiateSOForm.initiatecomments.setValue(response.responsedata.data[0].InitiateComments);
                    this.InitiateSOComment = response.responsedata.data[0].InitiateComments;
                  }
                  this.additionalFieldsForm.assignto.setValue(this.offerdata.fullname);
                }, error => {
                  this.notificationService.showError(error.error.error.message);
                });
            }

            // if (this.additionalfields >= 1) {
            //   this.getAdditionalFieldsData();
            //   this.getAssigntoList();
            // }

            if (this.additionalfields == 1) {
              this.additionalFieldsForm.ordertype.disable();
              this.additionalFieldsForm.deliveryblock.disable();
              this.additionalFieldsForm.specialprocessingid.disable();
              this.additionalFieldsForm.requirementtype.disable();
              this.additionalFieldsForm.meansoftransport.disable();
              this.additionalFieldsForm.pricingdate.disable();
              this.additionalFieldsForm.customerrequireddeliverydate.disable();
              this.additionalFieldsForm.firstdate.disable();
              this.additionalFieldsForm.soldtoparty.disable();
              this.additionalFieldsForm.shiptoparty.disable();
              this.additionalFieldsForm.alternatetaxclassification1.disable();
              this.additionalFieldsForm.alternatetaxclassification3.disable();
              this.additionalFieldsForm.alternatetaxclassification4.disable();
              this.additionalFieldsForm.afpodate.disable();
              this.itemAdditionalFieldsForm.reqdeliverydate.disable();
              this.itemAdditionalFieldsForm.meansoftransport.disable();
              this.itemAdditionalFieldsForm.planningblock.disable();
              this.itemAdditionalFieldsForm.packingmaterialtype.disable();
              this.additionalFieldsForm.nacecode.disable();
              this.additionalFieldsForm.businessmodel.disable();
            }

            if (this.customerapproval >= 1) {
              this.offersService.getcustomerapproval(this.offerID).subscribe(
                response => {
                  console.log(response);
                  if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data && response.responsedata.data.length > 0) {
                    response.responsedata.data.forEach((item: any) => {
                      item.created_date = Config.getDBdatetimeToDateTime(item.created_date);;
                    });

                    this.customerapprovaldata = response.responsedata.data;
                  }

                }, error => {
                  this.notificationService.showError(error.error.error.message);
                });
            }

            if (this.offerdata.Status === 75) {
              this.soerror = this.offerdata.errors;
            }
            else if (this.offerdata.Status === 80) {
              this.sonumber = this.offerdata.sosapid;
            }

            this.getOpportunityData(this.offerdata.opportunityid);
            this.CheckForSubmitButtonText();
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }


  getOcactionFileDetails(id: number, isclone: boolean) {
    this.OcactionService.getOcActiondetails(id, isclone).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.OcActinFiles = response.responsedata.data.offer_oc_docs;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getOcFileslist(id: number, isclone: boolean) {
    this.OcactionService.getOcFileslist(id, isclone).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.filesidlist = response.responsedata.data.offer_oc_docs;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getFMApprovalData() {
    this.offersService.getFMApprovalData(this.offerID).subscribe(
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

  getAdditionalFieldsData() {
    this.offersService.GETAdditionalFields(this.offerID).subscribe(
      response => {
        if (response) {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.additionalFieldData = response.responsedata.data.additionalfieldsdata[0];
            this.setAdditionalFieldData(this.additionalFieldData);
          }
          this.itemAdditionalFieldsList = response.responsedata.data.itemadditionalfieldsList;
          let i = 0;
          this.itemAdditionalFieldsList.forEach(element => {
            i += 1;
            element.itemSeqId = i;

            if (!element.reqdeliverydate) {
              element.reqdeliverydate = this.todayDate.split('/').reverse().join('-');
            } else {
              element.reqdeliverydate = this.datePipe.transform(element.reqdeliverydate, this.dateformate).split('/').reverse().join('-');
            }

            if (element.id <= 0 && !element.overdelvtolerance)
              element.overdelvtolerance = 5.0;

            if (element.id <= 0 && !element.underdelvtolerance)
              element.underdelvtolerance = 5.0;
          });
          this.onSoldtoPartySearch();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setApprovaldatastatus(approvaldatalist: any) {
    approvaldatalist.forEach(element => {
      if (element.status == 10)
        element.showstatus = 'Pending';
      else if (element.status == 30)
        element.showstatus = 'Rejected';
      else if (element.status == 50)
        element.showstatus = 'Approved';
      else
        element.showstatus = '';
    });

    return approvaldatalist;
  }

  setSPRStatus() {
    this.offerItemSPR.forEach(element => {
      if (element.status <= 5)
        element.showstatus = 'Open';
      if (element.status == 10)
        element.showstatus = 'In Progress';
      else if (element.status == 14)
        element.showstatus = 'In Progress';
      else if (element.status == 20)
        element.showstatus = 'PE Completed';
      else if (element.status == 30)
        element.showstatus = 'FM Completed';
    });
  }

  private setPOData(data: any) {
    this.poId = data.id;
    this.managePOForm.ponumber.setValue(data.po_number);
    this.poDate = this.convertDate(this.datePipe.transform(data.po_date, this.dateformate));
    this.managePOForm.podate.setValue(this.datePipe.transform(data.po_date, this.dateformate));
    this.pofiles = data.files;
    this.managePOForm.podate.disable();
  }

  private setAdditionalFieldData(data) {
    this.additionalfieldId = data.id;

    if (data.soldtoparty) {
      this.additionalFieldsForm.soldtoparty.setValue(data.soldtoparty);
      this.onSoldtoPartySearchChange(true);
      this.additionalFieldsForm.shiptoparty.setValue(data.shiptoparty);
      this.additionalFieldsForm.shiptopartyname.setValue(data.shiptopartyname);
      this.additionalFieldsForm.shipstreet1.setValue(data.shipstreet1);
      this.additionalFieldsForm.shipstreet2.setValue(data.shipstreet2);
      this.additionalFieldsForm.shipdistrict.setValue(data.shipdistrict);
      this.additionalFieldsForm.shipcity.setValue(data.shipcity);
      this.additionalFieldsForm.shippostalcode.setValue(data.shippostalcode);
      this.additionalFieldsForm.shipregion.setValue(data.shipregion);
    }
    if (data.ompnacecode)
      this.additionalFieldsForm.nacecode.setValue(data.ompnacecode ? data.ompnacecode.trim() : null);
    this.additionalFieldsForm.nacedescription.setValue(data.ompnacedescription);
    this.additionalFieldsForm.nacelevel.setValue(data.ompnacelevel);
    this.additionalFieldsForm.nacemodel.setValue(data.ompnacemodel);
    if (data.ompbusinessmodel)
      this.additionalFieldsForm.businessmodel.setValue(data.ompbusinessmodel);

    if (data.salesorg)
      this.additionalFieldsForm.salesorg.setValue(data.salesorg);
    else
      this.additionalFieldsForm.salesorg.setValue('8200');

    if (data.division)
      this.additionalFieldsForm.division.setValue(data.division);
    else
      this.additionalFieldsForm.division.setValue('00');

    if (data.ordertype)
      this.additionalFieldsForm.ordertype.setValue(data.ordertype);

    if (data.distchannel)
      this.additionalFieldsForm.distchannel.setValue(data.distchannel);
    else if (this.isOfferInderect)
      this.additionalFieldsForm.distchannel.setValue('20');
    else
      this.additionalFieldsForm.distchannel.setValue('10');

    if (data.deliveryblock)
      this.additionalFieldsForm.deliveryblock.setValue(data.deliveryblock);

    if (data.specialprocessingid)
      this.additionalFieldsForm.specialprocessingid.setValue(data.specialprocessingid);

    if (data.requirementtype)
      this.additionalFieldsForm.requirementtype.setValue(data.requirementtype);

    if (data.meansoftransport)
      this.additionalFieldsForm.meansoftransport.setValue(data.meansoftransport);

    if (data.alternatetaxclassification)
      this.additionalFieldsForm.alternatetaxclassification.setValue(data.alternatetaxclassification);

    if (data.completedlv && data.completedlv == 1)
      this.completedlvChecked = true;
    else
      this.completedlvChecked = false;

    this.additionalFieldsForm.completedlv.setValue(this.completedlvChecked);

    if (data.pricingdate) {
      this.pricingDate = this.convertDate(this.datePipe.transform(data.pricingdate, this.dateformate));
      this.additionalFieldsForm.pricingdate.setValue(this.datePipe.transform(data.pricingdate, this.dateformate));
    }

    if (data.customerrequireddeliverydate && !data.customerrequireddeliverydate.includes("0000-00-00")) {
      this.customerRequiredDeliveryDate = this.convertDate(this.datePipe.transform(data.customerrequireddeliverydate, this.dateformate));
      this.additionalFieldsForm.customerrequireddeliverydate.setValue(this.datePipe.transform(data.customerrequireddeliverydate, this.dateformate));
    } else if (this.offerdata.offerreqdeliverydate) {
      this.customerRequiredDeliveryDate = this.convertDate(this.datePipe.transform(this.offerdata.offerreqdeliverydate, this.dateformate));
      this.additionalFieldsForm.customerrequireddeliverydate.setValue(this.datePipe.transform(this.offerdata.offerreqdeliverydate, this.dateformate));
    }

    if (data.firstdate) {
      this.firstDate = this.convertDate(this.datePipe.transform(data.firstdate, this.dateformate));
      this.additionalFieldsForm.firstdate.setValue(this.datePipe.transform(data.firstdate, this.dateformate));
    }

    if (data.alternatetaxclassification1)
      this.additionalFieldsForm.alternatetaxclassification1.setValue(data.alternatetaxclassification1);
    else
      this.additionalFieldsForm.alternatetaxclassification1.setValue([]);

    if (data.alternatetaxclassification3)
      this.additionalFieldsForm.alternatetaxclassification3.setValue(data.alternatetaxclassification3);
    else
      this.additionalFieldsForm.alternatetaxclassification3.setValue([]);

    if (data.alternatetaxclassification4)
      this.additionalFieldsForm.alternatetaxclassification4.setValue(data.alternatetaxclassification4);
    else
      this.additionalFieldsForm.alternatetaxclassification4.setValue([]);

    if (data.afpodate) {
      this.afpoDate = this.convertDate(this.datePipe.transform(data.afpodate, this.dateformate));
      this.additionalFieldsForm.afpodate.setValue(this.datePipe.transform(data.afpodate, this.dateformate));
    } else {
      this.afpoDate = this.convertDate(this.datePipe.transform(this.managepodata.po_date, this.dateformate));
      this.additionalFieldsForm.afpodate.setValue(this.datePipe.transform(this.managepodata.po_date, this.dateformate));
    }

    this.additionalFieldsForm.freetextbox.setValue(data.freetextbox);
    this.additionalFieldsForm.freightzfro.setValue(data.freightzfro);
    this.additionalFieldsForm.freightzfrk.setValue(data.freightzfrk);
    this.additionalFieldsForm.cuttingcharges.setValue(data.cuttingcharges);
    this.additionalFieldsForm.inspectioncharges.setValue(data.inspectioncharges);
    this.additionalFieldsForm.packingcharges.setValue(data.packingcharges);
    this.additionalFieldsForm.modeoftransportforforeigntrade.setValue(data.modeoftransportforforeigntrade);
    this.additionalFieldsForm.portoflanding.setValue(data.portoflanding);
    this.additionalFieldsForm.portofdischarge.setValue(data.portofdischarge);
    this.additionalFieldsForm.citydescription.setValue(data.citydescription);
    this.additionalFieldsForm.countryname.setValue(data.countryname);
    this.additionalFieldsForm.countrykey.setValue(data.countrykey);
    this.additionalFieldsForm.insuranceby.setValue(data.insuranceby);
    this.additionalFieldsForm.exportscheme.setValue(data.exportscheme);
    this.additionalFieldsForm.adcode.setValue(data.adcode);
  }

  managePageSection(status: number, active: number) {
    this.offerInformation = 0;
    this.approvedandrejectedby = 0;
    this.termsandcondition = 0;
    this.managepo = 0;
    this.FMapproveandreject = 0;
    this.initiateso = 0;
    this.additionalfields = 0;
    this.somanually = 0;
    this.customerapproval = 0;
    this.orderstatus = 0;
    this.cpovalidator = 0;
    this.oc_bd = 0;

    if (active == 1) {
      if (status < 20 && status != 5) {
        this.offerInformation = 2;
        this.termsandcondition = 2;
      } else if (status >= 20 || status == 5) {
        this.offerInformation = 1;
        this.termsandcondition = 1;
        if (status >= 20)
          this.approvedandrejectedby = 1;
      }

      if (status >= 50 && status != 54) {
        this.managepo = 2;
      } else if (status >= 50 && status == 54) {
        this.managepo = 1;
      }

      if (status == 56 && this.isOfferInderect && this.authService.getCurrentUser().ischannelpartner == 1)
        this.cpovalidator = 2;
      else if (status >= 56 && this.isOfferInderect)
        this.cpovalidator = 1;

      if (status >= 57) {
        this.FMapproveandreject = 2;
      }

      if (status >= 60) {
        this.initiateso = 2;
      }

      if (status >= 70) {
        this.initiateso = 1;
        if ((this.userrolecode == 'OMT' || this.userrolecode == 'OM_Admin' || this.userrolecode == 'Admin') && this.offerdata.assignto) {
          this.additionalfields = 2;
        }
        else
          this.additionalfields = 1;
      }

      if (status === 71 && this.additionalfields === 2)
        this.additionalfields = 1;

      if (status >= 71 && this.isOfferInderect)
        this.customerapproval = 1;

      if (status >= 80) {
        this.managepo = 1;
        this.additionalfields = 1;
        this.orderstatus = 1;
      }
    } else {
      if (status < 20) {
        this.offerInformation = 1;
        this.termsandcondition = 1;
      } else if (status >= 20) {
        this.offerInformation = 1;
        this.termsandcondition = 1;
        this.approvedandrejectedby = 1;
      }

      if (status >= 50) {
        this.managepo = 1;
      }

      if (status >= 56 && this.isOfferInderect) {
        this.cpovalidator = 1;
      }

      if (status >= 57) {
        this.FMapproveandreject = 1;
      }

      if (status >= 60) {
        this.initiateso = 1;
      }

      if (status >= 70) {
        this.initiateso = 1;
        this.additionalfields = 1;
      }

      if (status >= 80) {
        this.managepo = 1;
        this.additionalfields = 1;
        this.orderstatus = 1;
      }
    }

    if (status === 75)
      this.isSOError = true;

    if (this.usertype === 20) // Dealer
    {
      //this.offerInformation = 0;
      this.approvedandrejectedby = 0;
      //this.termsandcondition = 0;
      this.managepo = 1;
      this.FMapproveandreject = 0;
      this.initiateso = 0;
      this.additionalfields = 0;
      //this.orderstatus = 0;
      this.cpovalidator = 0;
      this.oc_bd = 0;

      if (status === 71 && this.isOfferInderect)
        this.customerapproval = 2;
      if (status > 71 && this.isOfferInderect)
        this.customerapproval = 1;

      this.isSOError = false;

      this.somanually = 0;

    }

    //SO update manually 
    if ((this.userrolecode == 'OMT' || this.userrolecode == 'OM_Admin' || this.userrolecode == 'Admin') 
        && (status === 74 || status === 75)) {
      this.somanually = 2;
    }
    else
    {
      this.somanually = 0;
    }

    // no one can re-generate SO
    this.isSOError = false;

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

    else if (section == 'initiateso')
      isShow = this.initiateso >= 1 ? true : false;

    else if (section == 'additionalfields')
      isShow = this.additionalfields >= 1 ? true : false;

    else if (section == 'customerapproval')
      isShow = this.customerapproval >= 1 ? true : false;

    else if (section == 'somanually')
      isShow = this.somanually >= 1 ? true : false;

    else if (section == 'orderstatus')
      isShow = this.orderstatus >= 1 ? true : false;

    else if (section == 'oc_bd') {
      if (this.isHarnessing)
        isShow = this.offerdata.Status >= 15 ? true : false;
    }

    return isShow;
  }

  isEditSection(section: string) {
    let isEdit: boolean = false;

    if (section == 'offerInformation') {
      if (this.isHarnessing && this.userrolecode == 'BD')
        isEdit = this.offerdata.Status === 11 ? true : false;
      else if (this.isHarnessing && this.userrolecode == 'ASM')
        isEdit = this.offerdata.Status === undefined || this.offerdata.Status <= 10 ? true : false;
      else
        isEdit = this.offerInformation == 2 ? true : false;
    }

    else if (section == 'approvedandrejectedby')
      isEdit = this.approvedandrejectedby == 2 ? true : false;

    else if (section == 'termsandcondition')
      isEdit = this.termsandcondition == 2 ? true : false;

    else if (section == 'managepo')
      isEdit = this.managepo == 2 ? true : false;

    else if (section == 'FMapproveandreject')
      isEdit = this.FMapproveandreject == 2 ? true : false;

    else if (section == 'cpovalidator')
      isEdit = this.cpovalidator == 2 ? true : false;

    else if (section == 'initiateso')
      isEdit = this.initiateso == 2 ? true : false;

    else if (section == 'additionalfields')
      isEdit = this.additionalfields == 2 ? true : false;

    else if (section == 'customerapproval')
      isEdit = this.customerapproval == 2 ? true : false;

    else if (section == 'somanually')
      isEdit = this.somanually == 2 ? true : false;

    else if (section == 'orderstatus')
      isEdit = this.orderstatus == 2 ? true : false;

    else if (section == 'oc_bd') {
      if (this.isHarnessing && this.userrolecode == 'BD')
        isEdit = this.offerdata.Status === 11 || this.offerdata.Status === 15 ? true : false;
      else
        isEdit = false;
    }

    return isEdit;
  }

  setStatus(status: number) {
    if (status == 5 || status == 10)
      this.offerApprovalStatus = OfferStatusEnum.ten;
    else if (status == 20)
      this.offerApprovalStatus = OfferStatusEnum.twenty;
    else if (status == 30)
      this.offerApprovalStatus = OfferStatusEnum.thirty;
    else if (status == 40)
      this.offerApprovalStatus = OfferStatusEnum.fourty;
    else if (status == 50)
      this.offerApprovalStatus = OfferStatusEnum.fifty;
    else if (status == 54)
      this.offerApprovalStatus = OfferStatusEnum.fiftyfour;
    else if (status == 55)
      this.offerApprovalStatus = OfferStatusEnum.fiftyfive;
    else if (status == 56)
      this.offerApprovalStatus = OfferStatusEnum.fiftysix;
    else if (status == 57)
      this.offerApprovalStatus = OfferStatusEnum.fiftyseven;
    else if (status == 59)
      this.offerApprovalStatus = OfferStatusEnum.fiftynine;
    else if (status == 60)
      this.offerApprovalStatus = OfferStatusEnum.sixty;
    else if (status == 70)
      this.offerApprovalStatus = OfferStatusEnum.seventy;
    else if (status == 71)
      this.offerApprovalStatus = OfferStatusEnum.seventyone;
    else if (status == 73)
      this.offerApprovalStatus = OfferStatusEnum.seventythree;
    else if (status == 74)
      this.offerApprovalStatus = OfferStatusEnum.seventyfour;
    else if (status == 75)
      this.offerApprovalStatus = OfferStatusEnum.seventyfive;
    else if (status == 80)
      this.offerApprovalStatus = OfferStatusEnum.eighty;
  }

  offertypechange(event) {
    if (event) {
      if (event.code == 2) {
        this.isOfferInderect = true;
        this.offerInformationForm.delearcommission.setValidators(Validators.required);
        // this.offerInformationForm.dealers.setValidators(Validators.required);
        this.offerInformationForm.shiptopartyType.setValue(null);
        if (this.oppoData.sapid) {
          this.getShiptoPartyList();
        } else {
          this.shiptopartyList = [];
        }
      } else {
        this.isOfferInderect = false;
        this.DealerCommisionPer = 0;
        this.offerInformationForm.offerType.setValue(1);
        this.offerInformationForm.delearcommission.clearValidators();
        // this.offerInformationForm.dealers.clearValidators();
        this.offerInformationForm.shiptopartyType.setValue(this.offerInformationForm.soldtopartyType.value);
      }
    } else {
      this.isOfferInderect = false;
      this.DealerCommisionPer = 0;
      this.offerInformationForm.offerType.setValue(1);
      this.offerInformationForm.delearcommission.clearValidators();
      // this.offerInformationForm.dealers.clearValidators();
      this.offerInformationForm.shiptopartyType.setValue(this.offerInformationForm.soldtopartyType.value);
    }
    this.offerInformationForm.delearcommission.updateValueAndValidity();
    // this.offerInformationForm.dealers.updateValueAndValidity();
    this.updateTotalValues();
  }

  getShiptoPartyList() {
    this.offersService.getShiptoParty(this.oppoData.sapid).subscribe(
      response => {
        if (response.data && response.data.length > 0) {
          this.shiptopartyList = response.data;
        } else {
          this.shiptopartyList = [];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate = { year: year, month: month, day: day };
    return newdate;
  }

  private getOpportunityData(id: string) {
    this.opportunitiesService.getDetail(id).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.oppoData = response.responsedata.data[0];
          this.offerInformationForm.soldtopartyType.setValue(this.oppoData.customerfullname);

          this.oppoid = this.oppoData.opportunity_id;
          this.lappoppoid = this.oppoData.lappopportunityid;
          this.getAccountContactDetail(this.oppoData.customer_id);

          this.verticalList = this.oppoData.vertical.split(';');
          this.segmentList = this.oppoData.segment.split(';');

          this.isExportOrder = this.oppoData.op_vertical.toLowerCase().includes('export') && this.oppoData.op_segment.toLowerCase().includes('lapp');

          this.isHarnessing = this.oppoData.businessnature.toLowerCase().includes('harnessing') ? true : false;
          //#TODO - Temp commented
          // if(this.isExportOrder)
          // {
          //     this.offerInformationForm.currencyType.setValue('EUR');
          //     this.currencycode = 'EUR';
          //     this.currencyTypeList = this.currencyTypeList.filter(item => item.code != 'INR');
          // }

          if (this.isAdd && !this.isRefrenceOffer) {
            this.offerInformationForm.vertical.setValue(this.verticalList[0]);
            this.offerInformationForm.segment.setValue(this.segmentList[0]);
          } else {
            this.offerInformationForm.vertical.setValue(this.offerdata.vertical);
            this.offerInformationForm.segment.setValue(this.offerdata.segment);
          }

          if (this.offerdata && this.offerdata.OfferType == 2 && this.oppoData.sapid) {
            this.getShiptoPartyList();
            this.offerInformationForm.shiptopartyType.setValue(this.offerdata.ShipToParty.toString());
          } else {
            this.offerInformationForm.shiptopartyType.setValue(this.oppoData.customerfullname);
          }

          this.offerInformationForm.industry.setValue(this.oppoData.industrytypec);
          this.offerInformationForm.nacecode.setValue(this.oppoData.nacecode ? this.oppoData.nacecode.trim() : null);

          if (this.oppoData.nacecode && this.oppoData.nacecode.trim())
            this.GetNacecodeDetail(this.oppoData.nacecode ? this.oppoData.nacecode.trim() : null, 0);

          this.offerInformationForm.businessmodel.setValue(this.oppoData.businessmodel);

          if (this.isExportOrder) {
            this.updateTotalValues();
          }
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private getAccountContactDetail(id: string) {
    this.offersService.getAccountContactDetail(id).subscribe(
      response => {
        if (response) {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.contactdetail = response.responsedata.data;
            this.searchedcontactdetail = this.contactdetail;
          } else {
            this.contactdetail = [];
            this.searchedcontactdetail = [];
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onItemSearch(event) {
    let isItemExist: string = null;
    this.isItemReady = false;
    // this.itemErrorMessage = null;
    this.resetError();
    if (this.offerItemStd.length > 0) {
      isItemExist = this.offerItemStd.find(x => x.articleNo == event.searchValue && x.isDelete != 1);
    }

    if (isItemExist) {
      this.notificationService.showError('Item already added in the list.');
      this.articleNo = null;
      this.itemType = null;
      this.exp_surcharge = null;
      this.stdItemSearched = null;
      this.msq = null;
      // this.articleValidity = null;
      this.stdItemForm.stdItemName.setValue(null);
      this.stdItemForm.stdItemType.setValue(null);
      this.stdItemForm.stdItemUOM.setValue(null);
      this.stdItemForm.stdItemPCLength.setValue(null);
      this.stdItemForm.stdItemMOQ.setValue(null);
      this.stdItemForm.ItemMOQ.setValue(null);
      this.stdItemForm.ItemMDQ.setValue(null);
      this.itemLengthList = [];
      this.stdItemForm.enquiredquantity.setValue(null);
      this.stdItemForm.stdItemQty.setValue(null);

      this.stdItemForm.stdItemPrice.setValue(null);
      this.stdItemForm.stdItemexpsurcharge.setValue(null);

      this.stdItemForm.itemunitnetprice.setValue(null);
      this.stdItemForm.seqno.setValue(null);

      if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
        this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
      else
        this.stdItemForm.itemDiscount.setValue(null);

      this.stdItemForm.customerpartno.setValue(null);
      this.stdItemForm.importby.setValue(null);
      this.stdItemForm.itemtotal.setValue(null);
      this.LengthandFactordata = [];
      return;
    } else {
      if (event && event.searchValue) {
        this.productmasterService.getItemSearched(event.searchValue).then(
          response => {
            if (response.item.length > 0) {
              this.itemType = null;
              this.exp_surcharge = null;
              this.stdItemSearched = response.item[0];
              this.articleNo = this.stdItemSearched.articleno;
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
                  this.itemLengthList.push('Other');
                } else {
                  this.itemLengthList = [];
                }
              }

              this.stdItemForm.enquiredquantity.setValue(null);
              this.stdItemForm.stdItemQty.setValue(null);

              this.stdItemForm.stdItemPrice.setValue(null);
              this.stdItemForm.stdItemexpsurcharge.setValue(null);

              this.stdItemForm.itemunitnetprice.setValue(null);
              this.stdItemForm.seqno.setValue(null);

              // this.articleValidity = null;

              if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
                this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
              else
                this.stdItemForm.itemDiscount.setValue(null);

              this.stdItemForm.customerpartno.setValue(null);
              this.stdItemForm.importby.setValue(null);
              this.stdItemForm.itemtotal.setValue(null);
              this.LengthandFactordata = [];
            } else {
              this.lengthandfactorbtndisable = true;
              this.notificationService.showError('Item not found.');
              this.onSelectProductClearClick();
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
      this.quantityData = [...data.pcqty]
      this._oldItemData = Object.assign({}, data);
      this._oldItemData.lengthandfactor = { ...data.lengthandfactor };
      this.stdItemForm.stditemCode.setValue(data.articleNo);
      this.stdItemForm.stdItemName.setValue(data.description);
      this.stdItemForm.stdItemPrice.setValue(data.price);
      this.stdItemForm.stdItemexpsurcharge.setValue(data.exp_surcharge);

      this.stdItemForm.itemunitnetprice.setValue(data.unitprice);
      this.stdItemForm.stdItemCatalog.setValue(data.catalogLink);
      this.ItemCatalogue = data.catalogLink;
      this.stdItemForm.stdItemQty.setValue(data.quantity);

      this.stdItemForm.itemDiscount.setValue(data.discountPer);
      this.stdItemForm.customerpartno.setValue(data.customerpartno);
      this.stdItemForm.importby.setValue(data.importby ? data.importby : []);
      this.stdItemForm.stdItemType.setValue(data.itemType == 'STD' ? 'MFG' : data.itemType);
      this.stdItemForm.stdItemUOM.setValue(data.uom);
      this.stdItemForm.stdItemPCLength.setValue(data.pclength);
      this.stdItemForm.enquiredquantity.setValue(data.enquiredquantity);
      this.stdItemForm.stdItemMOQ.setValue(data.msq);
      this.stdItemForm.ItemMOQ.setValue(data.moq);
      this.stdItemForm.ItemMDQ.setValue(data.mdq);
      this.itemSequenceId = data.itemSeqId;
      this.stdItemForm.seqno.setValue(data.seqno);
      this.itemValidTo = data.validto;
      // this.stdItemForm.itemunitnetprice.setValue(data.itemunitnetprice);

      if (data.itemreqdeliverydate) {
        this.itemreqdeliveryDate = this.convertDate(data.itemreqdeliverydate);
        this.stdItemForm.itemreqdeliverydate.setValue(data.itemreqdeliverydate);
      } else if (this.offerInformationForm.offerreqdeliverydate.value) {
        this.itemreqdeliveryDate = this.convertDate(this.offerInformationForm.offerreqdeliverydate.value);
        this.stdItemForm.itemreqdeliverydate.setValue(this.offerInformationForm.offerreqdeliverydate.value);
      } else {
        this.itemreqdeliveryDate = null;
        this.stdItemForm.itemreqdeliverydate.setValue(null);
      }

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
      this.exp_surcharge = data.exp_surcharge;
      this.isItemExpire = data.isexpire;
      this.files = data.files;
      this.articleNo = data.articleNo;
      this.msq = data.msq;
      this.uom = data.uom;
      // this.articleValidity = data.articleValidity;

      if (this.itemType.toUpperCase() == 'SPR' && this.LengthandFactordata.length > 0) {
        this.qtydisable = true;
        this.lengthandfactorbtndisable = false;
        this.showpclength = false;
      } else {
        this.qtydisable = false;
        this.lengthandfactorbtndisable = true;
        this.showpclength = true;
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
        this.showpclength = false;
      } else {
        this.qtydisable = false;
        this.lengthandfactorbtndisable = true;
        this.showpclength = true;
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
      this.stdItemForm.stdItemexpsurcharge.setValue(null);

      this.stdItemForm.itemunitnetprice.setValue(null);
      this.stdItemForm.stdItemCatalog.setValue(null);
      this.stdItemForm.stdItemType.setValue(null);
      this.stdItemForm.stdItemUOM.setValue(null);
      this.stdItemForm.stdItemPCLength.setValue(null);
      this.stdItemForm.enquiredquantity.setValue(null);
      this.stdItemForm.stdItemMOQ.setValue(null);
      this.stdItemForm.ItemMOQ.setValue(null);
      this.stdItemForm.ItemMDQ.setValue(null);
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
      this.stdItemForm.importby.setValue(null);
      this.stdItemForm.itemtotal.setValue(null);
      this.itemLengthList = [];
      this.itemid = 0;
      this.itemforEdit = false;
      this.lengthandfactorbtndisable = true;
      this.itemSequenceId = 0;
      this.itemType = null;
      this.exp_surcharge = null;
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
      this.itemValidTo = null;
      // this.articleValidity = null;

      if (this.offerInformationForm.offerreqdeliverydate.value) {
        this.itemreqdeliveryDate = this.convertDate(this.offerInformationForm.offerreqdeliverydate.value);
        this.stdItemForm.itemreqdeliverydate.setValue(this.offerInformationForm.offerreqdeliverydate.value);
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


    let itemModel = {
      id: this.isAdd ? 0 : this.itemid,
      itemId: this.isAdd ? 0 : this.itemid,
      itemSeqId: this.itemSequenceId > 0 ? this.itemSequenceId : this.getSeqID(this.offerItemStd),
      seqno: this.stdItemForm.seqno.value ? this.stdItemForm.seqno.value : this.getSeqNo(),
      isexpire: this.isItemExpire,
      articleNo: this.articleNo,
      itemType: this.itemType,
      sapid: this.stdItemSearched ? this.stdItemSearched.sapid : this._oldItemData.sapid,
      description: this.stdItemForm.stdItemName.value,
      quantity: Number(this.stdItemForm.stdItemQty.value),
      pcqty: formattedData,
      msq: this.msq,
      moq: this.stdItemForm.ItemMOQ.value,
      mdq: this.stdItemForm.ItemMDQ.value,
      uom: this.stdItemForm.stdItemUOM.value,
      pclength: this.stdItemForm.stdItemPCLength.value,
      enquiredquantity: this.stdItemForm.enquiredquantity.value,
      customerpartno: this.stdItemForm.customerpartno.value ? this.stdItemForm.customerpartno.value : '',
      importby: this.stdItemForm.importby.value,
      price: Number(this.stdItemForm.stdItemPrice.value),
      exp_surcharge: Number(this.stdItemForm.stdItemexpsurcharge.value),

      unitprice: this.stdItemForm.itemunitnetprice.value,
      discountPer: Number(this.stdItemForm.itemDiscount.value),
      netvalue: this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)),
      catalogLink: this.stdItemForm.stdItemCatalog.value ? this.stdItemForm.stdItemCatalog.value : '',
      isDelete: 0,
      length: this.itemLengthList,
      lengthandfactor: this.LengthandFactordata.concat(this.LengthandFactordataDelete),
      cuttingcharges: this.itemlevelcuttingcharges,
      files: this.files,
      filerefid: 0,
      documents: [],
      GrossMargin: this.itemGrossMargin ? this.itemGrossMargin : 0,
      TargetGrossMargin: this.itemTGrossMargin ? this.itemTGrossMargin : 0,
      RMCGrossMargin: this.itemRGrossMargin ? this.itemRGrossMargin : 0,
      validto: this.itemValidTo,
      itemreqdeliverydate: this.stdItemForm.itemreqdeliverydate.value
      // articleValidity: this.articleValidity
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
    this.stdItemForm.stdItemexpsurcharge.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.stdItemCatalog.setValue(null);
    this.ItemCatalogue = null;
    this.itemType = null;
    this.exp_surcharge = null;
    this.isItemExpire = false;
    this.stdItemForm.stdItemQty.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.seqno.setValue(null);
    this.itemValidTo = null;
    this.addQuantity.reqdeliverydate = null;
    this.addQuantity.quantity = null;
    this.quantityData = []
    // this.articleValidity = null;
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
        id: this.isAdd ? 0 : this.itemid,
        itemId: this.isAdd ? 0 : this.itemid,
        itemSeqId: this.itemSequenceId > 0 ? this.itemSequenceId : this.getSeqID(this.offerItemStd),
        seqno: this._oldItemData.seqno,
        isexpire: this._oldItemData.isexpire,
        articleNo: this._oldItemData.articleNo,
        itemType: this._oldItemData.itemType,
        description: this._oldItemData.description,
        quantity: Number(finalQty),
        sapid: this._oldItemData.sapid,
        pclength: this._oldItemData.pclength,
        msq: this._oldItemData.msq,
        moq: this._oldItemData.moq,
        mdq: this._oldItemData.mdq,
        uom: this._oldItemData.uom,
        enquiredquantity: this._oldItemData.enquiredquantity,
        customerpartno: this._oldItemData.customerpartno,
        importby: this._oldItemData.importby,
        price: Number(this._oldItemData.price),
        exp_surcharge: Number(this._oldItemData.exp_surcharge),
        unitprice: this._oldItemData.unitprice,
        discountPer: Number(this._oldItemData.discountPer),
        netvalue: this.calculateTotalinItemPopupByUnitPrice(Number(this._oldItemData.unitprice), Number(finalQty)),
        catalogLink: this._oldItemData.catalogLink,
        isDelete: this._oldItemData.isDelete,
        length: this._oldItemData.length,
        lengthandfactor: this.LengthandFactordata.concat(this.LengthandFactordataDelete),
        pcqty: this.quantityData,
        cuttingcharges: this._oldItemData.cuttingcharges,
        files: this._oldItemData.files,
        filerefid: 0,
        documents: [],
        GrossMargin: this._oldItemData.GrossMargin,
        TargetGrossMargin: this._oldItemData.TargetGrossMargin,
        RMCGrossMargin: this._oldItemData.RMCGrossMargin,
        validto: this._oldItemData.validto,
        itemreqdeliverydate: this._oldItemData.itemreqdeliverydate
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
    this.stdItemForm.stdItemexpsurcharge.setValue(data.exp_surcharge);
    this.stdItemForm.itemunitnetprice.setValue(data.unitprice);
    this.stdItemForm.stdItemCatalog.setValue(data.catalogLink);
    this.ItemCatalogue = data.catalogLink;
    this.stdItemForm.stdItemQty.setValue(data.quantity);
    this.stdItemForm.seqno.setValue(data.seqno);
    this.stdItemForm.itemDiscount.setValue(data.discountPer);
    this.stdItemForm.customerpartno.setValue(data.customerpartno);

    let importByValue = this.importbyList.find(x => x.code == data.importby);
    this.stdItemForm.importby.setValue(importByValue ? importByValue.description : "");

    this.stdItemForm.stdItemType.setValue(data.itemType == 'STD' ? 'MFG' : data.itemType);
    this.stdItemForm.stdItemUOM.setValue(data.uom);
    this.stdItemForm.stdItemPCLength.setValue(data.pclength);
    this.stdItemForm.enquiredquantity.setValue(data.enquiredquantity);
    this.stdItemForm.stdItemMOQ.setValue(data.msq);
    this.stdItemForm.ItemMOQ.setValue(data.moq);
    this.stdItemForm.ItemMDQ.setValue(data.mdq);

    if (data.itemreqdeliverydate) {
      this.itemreqdeliveryDate = this.convertDate(data.itemreqdeliverydate);
      this.stdItemForm.itemreqdeliverydate.setValue(data.itemreqdeliverydate);
    } else {
      this.itemreqdeliveryDate = null;
      this.stdItemForm.itemreqdeliverydate.setValue(null);
    }

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
    this.exp_surcharge = data.exp_surcharge;
    this.files = data.files;
    this.articleNo = data.articleNo;
    // this.articleValidity = data.articleValidity;
    if (data.length && data.length.includes('|')) {
      let length = data.length.split('|');
      this.itemLengthList = length;
    }
    this.itemindex = index;
    this.itemlevelcuttingcharges = data.cuttingcharges;

    if (data.uom.toUpperCase() == 'PC')
      this.showpclength = true;
    else
      this.showpclength = false;

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

  fileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateItemsFile(event.target.files, 'STD')) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.files.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  ValidateItemsFile(files: any, itemtype: string) {
    if (files.length > this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }

    if (itemtype == 'STD') {
      if (this.files.length == this.filesperitem || this.files.length + files.length > this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }
    } else if (itemtype == 'SPR') {
      if (this.SPRFiles.length == this.filesperitem || this.SPRFiles.length + files.length > this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }
    } else if (itemtype == 'IDataSheet') {
      if (this.DataSheetFiles.length == this.filesperitem || this.DataSheetFiles.length + files.length > this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }
    } else if (itemtype == 'GDataSheet') {
      if (this.DataSheets.length == this.filesperitem || this.DataSheets.length + files.length > this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }
    }

    for (let file of files) {
      if (file.size > this.filesize) {
        this.notificationService.showError('File exceeds the maximum size of ' + this.filesize);
        return false;
      }
    }

    return true;
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
    this.CheckForSubmitButtonText();
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

    //Delete all SPR Items
    this.offerItemSPR.forEach(element => {
      if (element.spritemId > 0) {
        element.isDelete = 1
        this.offerItemSPRdeletedata.push(element);
        this.offerItemSPR = this.offerItemSPR.filter(x => x.spritemId != element.spritemId);
      } else {
        this.offerItemSPR.splice(element);
      }
    });

    if (this.offerItemSPR.length > 0) {
      this.sprItem = true;
    } else {
      this.sprItem = false;
    }

    if (this.offerItemSPRdeletedata.length > 0)
      this.deletedSPRItem = true;
    else
      this.deletedSPRItem = false;

    this.modalService.dismissAll('delete');
    this.CheckForSubmitButtonText();
  }

  filterDatatoDeletewithOrder(data: any) {
    return data.filter(x => x.isDelete == 0).sort((a, b) => Number(a.seqno) - Number(b.seqno));
  }

  filterDatatoDelete(data: any) {
    return data.filter(x => x.isDelete == 0);
  }

  filterSPRDatatoDeletewithOrder(data: any) {
    return data.filter(x => x.isDelete == 0 && x.status < 30).sort((a, b) => Number(a.seqno) - Number(b.seqno));
  }

  filterSPRData(data: any) {
    return data.filter(x => x.isDelete == 0 && x.status < 30);
  }

  oncancelClick() {
    this.router.navigate(['/offers/list']);
  }

  onEditClick() {
    let id: string = '';
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/offers/edit/' + id]);
  }

  toggleIsRecommend(event) {
    if (this.offerItemStd && this.offerItemStd.length == 0) {
      this.notificationService.showError('There must be one items.')
      return;
    }
    if (this.filterSPRData(this.offerItemSPR).length > 0) {
      this.notificationService.showError('There must be no open SPR items.')
      return;
    }
    this.isRecommend = event.target.checked;
    if (this.isRecommend == true) {
      this.otherForm.asmapprovecomment.setValidators(Validators.required);
      this.otherForm.asmapprovecomment.updateValueAndValidity();
    } else {
      this.otherForm.asmapprovecomment.clearValidators();
      this.otherForm.asmapprovecomment.updateValueAndValidity();
    }
  }

  onSendtoPEClick() {
    let isAllItemValid: boolean = true;

    this.offerItemSPR.forEach(element => {
      if (!element.isDelete && (!element.sprform_status || element.sprform_status == SPRFORMSTATUS.pending)) {
        isAllItemValid = false;
      }
    });

    if (!isAllItemValid) {
      this.notificationService.showError(`There are pending datasheets for the SPR article(s).`);
      return;
    }

    this.sendtoPE = true;
    this.onSaveasDraftClick(false);
  }

  onSaveasDraftClick(issubmit: boolean) {
    this.isRecommend = issubmit;
    this.clonesubmitted = true;
    this.UpdateFieldValidators(this.isRecommend);
    if (this.checkFormforValid(issubmit))
      this.onSubmit();
  }
  onSaveandSubmitToBD(issubmit: boolean) {
    if (!this.oppoData.customerid && this.isRecommend) {
      this.notificationService.showError('Sold to party is required.');
      return;
    }

    this.isRecommend = issubmit;
    this.clonesubmitted = true;

    this.UpdateFieldValidators(this.isRecommend);

    this.offerInformationForm.offersValidto.setValue(moment().add(this.authService.OfferValidupto(), 'd').format('YYYY-MM-DD'));

    this.onSubmit();

  }
  onSaveandSubmitClick(issubmit: boolean) {
    if (!this.oppoData.customerid && this.isRecommend) {
      this.notificationService.showError('Sold to party is required.');
      return;
    }

    if (this.filterDatatoDeletewithOrder(this.offerItemStd) && this.filterDatatoDeletewithOrder(this.offerItemStd).length == 0 && this.filterSPRData(this.offerItemSPR).length == 0) {
      this.notificationService.showError('There is no item in the Offer.')
      return;
    }
    if (this.filterSPRDatatoDeletewithOrder(this.offerItemSPR).length > 0) {
      this.notificationService.showError('There must be one open SPR item in the Offer.')
      return;
    }

    // if (this.filterSPRDatatoDeletewithOrder(this.offerItemStd).length > 0) {
    //   this.notificationService.showError('There must be one open SPR item in the Offer.')
    //   return;
    // }

    let isAllItemValid: boolean = true;
    this.offerItemStd.forEach(element => {
      if (element.isexpire && element.isDelete == 0)
        isAllItemValid = false;
    });

    if (!isAllItemValid) {
      this.notificationService.showError('There is an expire item(s) in the offer.');
      return;
    }

    // this.otherForm.asmapprovecomment.setValidators(Validators.required);
    // this.otherForm.asmapprovecomment.updateValueAndValidity();
    this.isRecommend = issubmit;
    this.clonesubmitted = true;
    this.UpdateFieldValidators(this.isRecommend);

    // this.offerItemStd.find
    // moment().add

    if (this.checkFormforValid(issubmit)) {
      let isArticleValidityError: boolean = false;
      let articleValidUptoDate = moment().add(this.authService.OfferValidupto(), 'd').format('YYYY-MM-DD');
      this.offerItemStd.forEach(element => {
        if (new Date(articleValidUptoDate) > new Date(element.validto)) {
          isArticleValidityError = true;
        }
      });

      this.offerInformationForm.offersValidto.setValue(moment().add(this.authService.OfferValidupto(), 'd').format('YYYY-MM-DD'));

      if (isArticleValidityError) {
        this.openArticleValidityModel();
      } else {
        this.onSubmit();
      }
    } else {
      return;
    }

  }

  onGenerateOfferPDFClick(offertype: string) {
    let filename = 'offer_' + this.offerID + '_' + offertype + '.pdf';
    // let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/offerpdf/' + filename;
    FileSaver.saveAs(this.offerdata.pdfurl, filename);
  }

  async onSubmit() {
    // this.submitted = true;



    // let offervalidfromdate = this.offerInformationForm.offersValidfrom.value.split('/');
    // offervalidfromdate = offervalidfromdate[2] + '-' + offervalidfromdate[1] + '-' + offervalidfromdate[0];

    // let offervalidtodate = this.offerInformationForm.offersValidto.value.split('/');
    // offervalidtodate = offervalidtodate[2] + '-' + offervalidtodate[1] + '-' + offervalidtodate[0];

    let selectedcontactid;
    var ele = document.getElementsByTagName('input');
    for (let i = 0; i < ele.length; i++) {
      if (ele[i].type == "radio") {
        if (ele[i].checked) {
          selectedcontactid = Number(ele[i].value);
        }
      }
    }

    if (!selectedcontactid && this.isRecommend) {
      this.notificationService.showError('Customer contact is required.');
      return;
    }

    this.offerDeletedItem.forEach(element => {
      var oldfiles = element.files.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element2 => {
        element.documents.push({ id: element2 });
      });
      element.files = [];

      element.importby = element.importby ? element.importby : '';

      if (!element.itemreqdeliverydate)
        element.itemreqdeliverydate = this.offerInformationForm.offerreqdeliverydate.value ? this.offerInformationForm.offerreqdeliverydate.value.split('/').reverse().join('-') : "0000-00-00";
      else
        element.itemreqdeliverydate = element.itemreqdeliverydate.split('/').reverse().join('-');

      element.lengthandfactor.forEach(lengthfactor => {
        if (!lengthfactor.lengthreqdeliverydate)
          lengthfactor.lengthreqdeliverydate = element.itemreqdeliverydate;
        else
          lengthfactor.lengthreqdeliverydate = lengthfactor.lengthreqdeliverydate.split('/').reverse().join('-');
      });
    });

    this.offerItemSPR = this.offerItemSPR.filter(x => x.isDelete == 0);
    this.offerItemSPR.forEach(spritem => {
      if (!spritem.itemreqdeliverydate)
        spritem.itemreqdeliverydate = this.offerInformationForm.offerreqdeliverydate.value ? this.offerInformationForm.offerreqdeliverydate.value.split('/').reverse().join('-') : "0000-00-00";
      else
        spritem.itemreqdeliverydate = spritem.itemreqdeliverydate.split('/').reverse().join('-');

      spritem.sprlengthandfactor.forEach(lengthfactor => {
        if (!lengthfactor.sprlengthreqdeliverydate)
          lengthfactor.sprlengthreqdeliverydate = spritem.itemreqdeliverydate;
        else
          lengthfactor.sprlengthreqdeliverydate = lengthfactor.sprlengthreqdeliverydate.split('/').reverse().join('-');
      });
    });

    this.offerItemSPRdeletedata.forEach(spritem => {
      if (!spritem.itemreqdeliverydate)
        spritem.itemreqdeliverydate = this.offerInformationForm.offerreqdeliverydate.value ? this.offerInformationForm.offerreqdeliverydate.value.split('/').reverse().join('-') : "0000-00-00";
      else
        spritem.itemreqdeliverydate = spritem.itemreqdeliverydate.split('/').reverse().join('-');

      spritem.sprlengthandfactor.forEach(lengthfactor => {
        if (!lengthfactor.sprlengthreqdeliverydate)
          lengthfactor.sprlengthreqdeliverydate = spritem.itemreqdeliverydate;
        else
          lengthfactor.sprlengthreqdeliverydate = lengthfactor.sprlengthreqdeliverydate.split('/').reverse().join('-');
      });
    });

    let offerHeader = {
      opportunityid: this.oppoData.id,
      vertical: this.offerInformationForm.vertical.value,
      segment: this.offerInformationForm.segment.value,
      offervalidfrom: this.offerInformationForm.offersValidfrom.value.split('/').reverse().join('-'),
      offervalidto: this.offerInformationForm.offersValidto.value.split('/').reverse().join('-'),
      CurrencyType: this.offerInformationForm.currencyType.value,
      OfferType: this.offerInformationForm.offerType.value,
      SoldToParty: this.oppoData.customerid,
      ShipToParty: this.oppoData.sapid ? this.isOfferInderect ? this.offerInformationForm.shiptopartyType.value : this.oppoData.sapid ? this.oppoData.sapid : '' : '',
      Incoterm: this.offerInformationForm.incoterms.value,
      fromlocation: this.isShowFromToLocation ? this.offerInformationForm.fromlocation.value : '',
      tolocation: this.isShowFromToLocation ? this.offerInformationForm.tolocation.value : '',
      contactId: selectedcontactid ? selectedcontactid : 0,
      DealerCommissionPer: this.offerInformationForm.offerType.value == 2 ? Number(this.offerInformationForm.delearcommission.value) : 0,
      headerleveldiscount: Number(this.offerInformationForm.headerleveldiscount.value),
      freightcharges: this.currencycode == 'USD' ? Number(this.itemsForm.freightcharges.value) * this.USDrate : this.currencycode == 'EUR' ? Number(this.itemsForm.freightcharges.value) * this.EURrate : Number(this.itemsForm.freightcharges.value),
      dealer: this.offerInformationForm.offerType.value == 2 && this.offerInformationForm.dealers.value ? this.offerInformationForm.dealers.value : '',
      nacecode: this.offerInformationForm.nacecode.value ? this.offerInformationForm.nacecode.value : '',
      businessmodel: this.offerInformationForm.businessmodel.value ? this.offerInformationForm.businessmodel.value : '',
      comment: this.isRecommend ? " - [" + this.authService.getCurrentUser().fullname + " - " + this.authService.getCurrentUser().role_code + "] - [Approve] - " + this.otherForm.asmapprovecomment.value : '',
      offerreqdeliverydate: this.offerInformationForm.offerreqdeliverydate.value ? this.offerInformationForm.offerreqdeliverydate.value.split('/').reverse().join('-') : "0000-00-00",
      OfferFiles: []
    }

    if (this.isRefrenceOffer) {
      this.offerItemStd.forEach(element => {
        element.itemId = 0;
        element.sprform_status = element.sprform_status ? element.sprform_status : SPRFORMSTATUS.pending;

        element.lengthandfactor.forEach(element2 => {
          element2.id = 0;
        });
      });

      this.offerItemSPR.forEach(element => {
        element.spritemId = 0;
        element.customerpartno = element.customerpartno ? element.customerpartno : '';
        element.sprform_status = element.sprform_status ? element.sprform_status : SPRFORMSTATUS.pending;
        element.sprlengthandfactor.forEach(element2 => {
          element2.id = 0;
        });
      });

      this.offerItemSPRdeletedata.forEach(element => {
        element.spritemId = 0;

        element.sprlengthandfactor.forEach(element2 => {
          element2.id = 0;
        });
      });

      this.specialtextdata.forEach(element => {
        element.id = 0;
      });
    }

    let _qtyerror: boolean = false;
    let _isAllItemValid: boolean = true;

    this.offerItemStd.forEach(element => {
      // if (element.uom.toUpperCase() == "PC" && this.isRecommend) {
      // if (Number(element.quantity) < Number(element.moq)) {
      //   _qtyerror = true;
      // }
      // }
      // else if (element.uom.toUpperCase() == "M" && this.isRecommend) {
      //   if (Number(element.quantity) < Number(element.moq) && element.lengthandfactor.filter(x => x.isother == 1).length > 0) {
      //     _qtyerror = true;
      //   }
      // }

      element.importby = element.importby ? element.importby : '';

      if (!element.itemType)
        _isAllItemValid = false;

      if (!element.itemreqdeliverydate)
        element.itemreqdeliverydate = this.offerInformationForm.offerreqdeliverydate.value ? this.offerInformationForm.offerreqdeliverydate.value.split('/').reverse().join('-') : "0000-00-00";
      else
        element.itemreqdeliverydate = element.itemreqdeliverydate.split('/').reverse().join('-');

      element.lengthandfactor.forEach(lengthfactor => {
        if (!lengthfactor.lengthreqdeliverydate)
          lengthfactor.lengthreqdeliverydate = element.itemreqdeliverydate;
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

    let saveModel = {
      offerId: this.isAdd ? 0 : this.offerID,
      isrecommendforprocess: this.isRecommend == true ? 1 : 0,
      isRevalidation: this.isRevalidation == true ? 1 : 0,
      isChangeOfferValidity: this.isChangeOfferValidity == true ? 1 : 0,
      approvalcomment: this.isRecommend ? this.otherForm.asmapprovecomment.value : '',
      refofferid: this.isRefrenceOffer ? this.offerID : 0,
      oppoid: this.oppoData.opportunity_id,
      offervalue: this.totalnetvalue,
      offerHeader: offerHeader,
      offerItems: this.offerDeletedItem.concat(this.offerItemStd),
      spritems: this.offerItemSPRdeletedata.concat(this.offerItemSPR),
      paymentterm: this.termsandConditionForm.paymentterms.value ? this.termsandConditionForm.paymentterms.value : '',
      deliveryleadtime: this.termsandConditionForm.deliveryleadtime.value ? this.termsandConditionForm.deliveryleadtime.value : '',
      specialterms: this.specialtextdata.concat(this.specialtextdeletedata),
      reasonforclone: this.isRefrenceOffer ? this.offerInformationForm.reasonforclone.value : '',
      sendtoPE: this.sendtoPE == true ? 1 : 0
    };

    if (this.offerItemStd.length > 0)
      await this.fileUpload(this.offerItemStd);
    if (this.offerItemSPR.length > 0)
      await this.SPRfileUpload(this.offerItemSPR);
    if (this.OfferFiles.length > 0)
      await this.OfferFileUpload(saveModel.offerHeader);
    this.createOffer(saveModel);
  }

  checkFormforValid(issubmit: boolean) {
    this.submitted = issubmit;
    this.acc.expandAll();
    if (this.OfferInformationForm.invalid || this.OtherForm.invalid || this.TermsandConditionForm.invalid) {
      return false;
    }

    return true;
  }

  async fileUpload(items: any) {
    var type: string = '';

    for (const item of items) {
      if (this.isEdit) {
        var oldfiles = item.files.filter(x => x.id).map(y => y.id);
        oldfiles.forEach(element => {
          item.documents.push({ id: element });
        });

        item.files = item.files.filter(x => !x.id);
      } else if (this.isRefrenceOffer) {
        var oldfiles = item.files.filter(x => x.id).map(y => y.id);
        oldfiles.forEach(element => {
          item.documents.push({ id: element });
        });

        item.files = item.files.filter(x => !x.id);
      }

      if (item.files && item.files.length > 0) {
        type = item.itemType == 'STD' ? 'offers/stditem' : 'TRD' ? 'offers/trditem' : 'offers/spritem';
        await this.offersService.upload(item.files, type).then(
          response => {
            if (response) {
              response.resultfiles.forEach(element => {
                item.documents.push({ id: element.id });
              });
            }
          }, error => {
            this.notificationService.showError(error.error.error.message);
            return;
          });
      }
    }
  }

  async SPRfileUpload(items: any) {
    var type: string = '';

    for (const item of items) {
      if (this.isEdit) {
        var oldfiles = item.files.filter(x => x.id).map(y => y.id);
        oldfiles.forEach(element => {
          item.sprdocuments.push({ id: element });
        });
        item.files = item.files.filter(x => !x.id);
      } else if (this.isRefrenceOffer) {
        var oldfiles = item.files.filter(x => x.id).map(y => y.id);
        oldfiles.forEach(element => {
          item.sprdocuments.push({ id: element });
        });

        item.files = item.files.filter(x => !x.id);
      }

      if (item.files && item.files.length > 0) {
        type = 'offers/spritem';
        await this.offersService.upload(item.files, type).then(
          response => {
            if (response) {
              response.resultfiles.forEach(element => {
                item.sprdocuments.push({ id: element.id });
              });
            }
          }, error => {
            this.notificationService.showError(error.error.error.message);
            return;
          });
      }
    }
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

  createOffer(saveModel: any) {
    this.offersService.CreateOffer(saveModel).subscribe(
      async response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.message) {
            this.notificationService.showSuccess(response.responsedata.message);
          } else {
            if (saveModel.offerId == 0)
              this.notificationService.showSuccess('Offer Created Successfully');
            else
              this.notificationService.showSuccess('Offer Updated Successfully');
          }

          this.router.navigateByUrl('/offers/list');
        }
      },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  generateOfferPDF() {
    this.offersService.generateofferpdf(this.offerID).subscribe(
      response => {
        if (response) {
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  saveSPRItem(SPRSaveModel) {
    this.offersService.savespritem(SPRSaveModel).subscribe(
      response => {
        if (response && SPRSaveModel.offerid == 0)
          this.notificationService.showSuccess('Offer Created Successfully');
        else
          this.notificationService.showSuccess('Offer Updated Successfully');

        this.router.navigateByUrl('/offers/list');
      }, error => {
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

  removeFile(index: number) {
    this.files = Array.from(this.files)
    this.files.splice(index, 1);
  }

  removeSPRFile(index: number) {
    this.SPRFiles = Array.from(this.SPRFiles)
    this.SPRFiles.splice(index, 1);
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

    if (this.stdItemForm.itemreqdeliverydate.value) {
      this.lengthreqdeliveryDate = this.convertDate(this.stdItemForm.itemreqdeliverydate.value);
      this.lengthandFactorForm.lengthreqdeliverydate.setValue(this.stdItemForm.itemreqdeliverydate.value);
    } else {
      this.lengthreqdeliveryDate = null;
      this.lengthandFactorForm.lengthreqdeliverydate.setValue(null);
    }

    this.resetError(true);
    this.modalRef = this.modalService.open(AddLengthandFactor, { size: 'md' });
  }

  openAddQuantity(AddQuantity) {
    this.lengthandFactorForm.itemLength.setValue(null);
    this.lengthandFactorForm.itemFactor.setValue(null);
    this.lengthandFactorForm.lfqty.setValue(null);
    this.lengthandFactorForm.otherLength.setValue(null);
    this.submitted = false;
    this.isShowOtherLength = false;

    if (this.stdItemForm.itemreqdeliverydate.value) {
      this.lengthreqdeliveryDate = this.convertDate(this.stdItemForm.itemreqdeliverydate.value);
      this.lengthandFactorForm.lengthreqdeliverydate.setValue(this.stdItemForm.itemreqdeliverydate.value);
    } else {
      this.lengthreqdeliveryDate = null;
      this.lengthandFactorForm.lengthreqdeliverydate.setValue(null);
    }

    this.resetError(true);
    this.modalRef = this.modalService.open(AddQuantity, { size: 'md' });
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

    let quantity = this.isShowOtherLength ? Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value) : Number(this.lengthandFactorForm.itemLength.value) * Number(this.lengthandFactorForm.itemFactor.value);
    // validate UOM == M, for quantity must be in multiply with MDQ
    if ((Number(quantity) % Number(this.stdItemForm.ItemMDQ.value)) != 0) {
      this.setError(`Quantity must be in multiples of MDQ ${Number(this.stdItemForm.ItemMDQ.value)}`, true);
      // this.notificationService.showError(`Quantity must be in multiples of MDQ ${Number(this.stdItemForm.ItemMDQ.value)}`);
      return;
    }

    // Validate req dlv date
    if (Config.ExcelDateToJSDate(this.lengthandFactorForm.lengthreqdeliverydate.value.split("/").reverse().join("-"), '-').date < moment().format('YYYY-MM-DD')) {
      this.notificationService.showError(`Req. Dlv. Date must be greated than today date.`);
      return;
    }

    let lfdata = {
      id: 0,
      length: this.isShowOtherLength ? Number(this.lengthandFactorForm.otherLength.value) : Number(this.lengthandFactorForm.itemLength.value),
      factor: Number(this.lengthandFactorForm.itemFactor.value),
      qty: this.isShowOtherLength ? Number(this.lengthandFactorForm.otherLength.value) * Number(this.lengthandFactorForm.itemFactor.value) : Number(this.lengthandFactorForm.itemLength.value) * Number(this.lengthandFactorForm.itemFactor.value),
      isDelete: 0,
      cuttingcharges: 0,
      isother: this.isShowOtherLength ? 1 : 0,
      lengthreqdeliverydate: this.lengthandFactorForm.lengthreqdeliverydate.value
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
      totalQuantity += parseInt(item.quantity ? item.quantity : item.qty);
    });
    this.stdItemForm.stdItemQty.setValue(totalQuantity);
    this.onItemQtyChange();
    this.addQuantity = {
      id: 0,
      quantity: null,
      reqdeliverydate: null
    };
    this.modalRef.close();

  }
  closeQuantity() {
    this.addQuantity = {
      id: 0,
      quantity: null,
      reqdeliverydate: null
    };
    this.modalRef.close();
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

  onquantityRemove(index: number) {
    this.quantityData.splice(index, 1)
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
      // this.notificationService.showError('Length must be less than ' + maxallowlength);
      this.setError('Length must be less than ' + maxallowlength, true);
      return;
    } else {
      this.resetError(true);
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

    let _tempUnitNetPrice: any = (Number(this.stdItemForm.stdItemPrice.value) - ((Number(this.stdItemForm.stdItemPrice.value) * Number(this.stdItemForm.itemDiscount.value) / 100)));
    // if (this.isExportOrder) {
    //   _tempUnitNetPrice = _tempUnitNetPrice - Number(this.stdItemForm.stdItemexpsurcharge.value);
    // }

    _tempUnitNetPrice = _tempUnitNetPrice.toFixed(2)
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
      // this.itemErrorMessage = 'Quantity must be greater than 0';
      this.setError('Quantity must be greater than 0');
      return;
    }
    if (this.stdItemForm.stdItemUOM.value.toUpperCase() == 'PC') {
      if ((Number(this.stdItemForm.stdItemQty.value) % Number(this.stdItemForm.stdItemPCLength.value)) != 0) {
        this.isItemReady = false;
        // this.itemErrorMessage = `Quantity must be in multiples of ${this.stdItemForm.stdItemPCLength.value}`;
        this.setError('Quantity must be greater than 0');
        return;
      } else {
        this.isItemReady = true;
        // this.itemErrorMessage = null;
        this.resetError();
      }
    } else if (this.stdItemForm.stdItemUOM.value.toUpperCase() == 'M') {
      if ((Number(this.stdItemForm.stdItemQty.value) % Number(this.stdItemForm.ItemMDQ.value)) != 0) {
        this.isItemReady = false;
        // this.itemErrorMessage = `Quantity must be in multiples of ${this.stdItemForm.ItemMDQ.value}`;
        this.setError(`Quantity must be in multiples of ${this.stdItemForm.stdItemPCLength.value}`);
        return;
      } else {
        this.isItemReady = true;
        // this.itemErrorMessage = null;
        this.resetError();
      }
    }

    if ((this.offerInformationForm.fromlocation.value.length > 0 && !this.offerInformationForm.fromlocation.value.toUpperCase().includes('INDIA')) && (this.offerInformationForm.incoterms.value == 'EXW' || this.offerInformationForm.incoterms.value == 'CFR' || this.offerInformationForm.incoterms.value == 'CIF' || this.offerInformationForm.incoterms.value == 'FOB')) {
      producttype = 'TRD';
    } else {
      producttype = 'STD';
    }

    if (this.itemType != 'SPR') {
      this.productmasterService.searchproductalp(this.articleNo, producttype, 'INR', Number(this.stdItemForm.stdItemQty.value), [], true, false).then(
        response => {
          if (response.data && response.data.statusCode == 200) {
            this.exp_surcharge = response.data.data.exp_surcharge;

            if (this.isExportOrder && this.exp_surcharge === -1) {
              this.isItemReady = false;
              this.itemType = null;
              this.exp_surcharge = null;
              // this.itemErrorMessage = `The article doesn't have CU Index. It's required for export orders.`;
              this.setError(`The article doesn't have CU Index. It's required for export orders.`);
              this.stdItemForm.stdItemType.setValue(response.data.data.itemtype == 'STD' ? 'MFG' : response.data.data.itemtype);
              this.stdItemForm.ItemMOQ.setValue(response.data.data.moq);
              this.stdItemForm.stdItemPrice.setValue(null);
              this.stdItemForm.stdItemexpsurcharge.setValue(null);
              this.stdItemForm.itemunitnetprice.setValue(null);
              this.itemValidTo = response.data.data.alpvalidto;
              // this.articleValidity = response.data.data.articleValidity;
              this.stdItemForm.itemtotal.setValue(null);
            }
            else {
              this.itemType = response.data.data.itemtype;
              this.exp_surcharge = response.data.data.exp_surcharge;
              this.isItemReady = true;

              this.stdItemForm.stdItemType.setValue(response.data.data.itemtype == 'STD' ? 'MFG' : response.data.data.itemtype);
              this.stdItemForm.ItemMOQ.setValue(response.data.data.moq);
              this.stdItemForm.stdItemPrice.setValue(response.data.data.price);
              this.stdItemForm.stdItemexpsurcharge.setValue(response.data.data.exp_surcharge);
              this.itemValidTo = response.data.data.alpvalidto;

              if (Number(this.stdItemForm.itemDiscount.value) && Number(this.stdItemForm.itemDiscount.value) > 0)
                this.stdItemForm.itemunitnetprice.setValue((Number(this.stdItemForm.stdItemPrice.value) - ((Number(this.stdItemForm.stdItemPrice.value) * Number(this.stdItemForm.itemDiscount.value) / 100))).toFixed(2));
              else
                this.stdItemForm.itemunitnetprice.setValue(response.data.data.price);

              // if (this.isExportOrder) {
              //   this.stdItemForm.itemunitnetprice.setValue(Number(this.stdItemForm.itemunitnetprice.value) - Number(this.stdItemForm.stdItemexpsurcharge.value))
              // }

              this.stdItemForm.itemtotal.setValue(this.calculateTotalinItemPopupByUnitPrice(Number(this.stdItemForm.itemunitnetprice.value), Number(this.stdItemForm.stdItemQty.value)));
              this.itemlevelcuttingcharges = 0;

              this.LengthandFactordata.forEach(element => {
                if (element.isDelete == 0 && element.isother == 1) {
                  element.cuttingcharges = this.itemType == 'STD' || this.itemType == 'SPR' ? Number((Number(element.factor) * Number(this.stdcuttingchargesfinal)).toFixed(2)) : Number((Number(element.factor) * Number(this.trdcuttingchargesfinal)).toFixed(2))
                  this.itemlevelcuttingcharges += Number(element.cuttingcharges);
                }
              });
            }

          } else if (response.data && response.data.statusCode == 400) {
            this.isItemReady = false;
            this.itemType = null;
            this.exp_surcharge = null;
            // this.itemErrorMessage = response.data.errormessage;
            this.setError(response.data.errormessage);
            this.stdItemForm.stdItemType.setValue(response.data.data.itemtype == 'STD' ? 'MFG' : response.data.data.itemtype);
            this.stdItemForm.ItemMOQ.setValue(response.data.data.moq);
            this.stdItemForm.stdItemPrice.setValue(response.data.data.price);
            this.stdItemForm.stdItemexpsurcharge.setValue(response.data.data.exp_surcharge);
            this.stdItemForm.itemunitnetprice.setValue(response.data.data.price);
            this.itemValidTo = response.data.data.alpvalidto;
            // this.articleValidity = response.data.data.articleValidity;
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
      // this.itemErrorMessage = 'Unit Net Price should not be less than 0';
      this.setError('Unit Net Price should not be less than 0');
      return;
    } else if (!this.isItemReady) {
      return;
    } else {
      this.isItemReady = true;
      // this.itemErrorMessage = null;
      this.resetError();
    }

    // (List Price - Unit Net Price) * 100 / List Price
    let _tempDiscount;


    _tempDiscount = ((Number(this.stdItemForm.stdItemPrice.value) - Number(this.stdItemForm.itemunitnetprice.value)) * 100 / Number(this.stdItemForm.stdItemPrice.value)).toFixed(2);

    // if (this.isExportOrder) {
    //   _tempDiscount = (Number(100) - ((Number(this.stdItemForm.itemunitnetprice.value) + Number(this.stdItemForm.stdItemexpsurcharge.value)) * 100 / Number(this.stdItemForm.stdItemPrice.value))).toFixed(2); // ((Number(this.stdItemForm.stdItemPrice.value) - Number(this.stdItemForm.itemunitnetprice.value) + Number(this.stdItemForm.stdItemexpsurcharge.value)) * 100 / Number(this.stdItemForm.stdItemPrice.value)).toFixed(2);
    // }

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

  savepovalidation() {
    this.submitted = true;

    this.managePOForm.ponumber.setValue(this.managePOForm.ponumber.value.trim());

    if (this.ManagePOForm.invalid)
      return false;

    if (this.pofiles.length == 0) {
      this.notificationService.showError('Please attach PO file.');
      return false;
    }

    return true;
  }

  saveapproveddatasheetsvalidation() {
    let isSPRValidate: boolean = false;
    let SPRItemsForDataSheets = this.filterforSPRItems(this.offerItemStd);

    if (this.DataSheets.length == 0) {
      SPRItemsForDataSheets.forEach(element => {
        if (!element.spritemdatasheets) {
          isSPRValidate = true;
        }
      });

      if (isSPRValidate) {
        this.notificationService.showError('Please attached data sheets along with article.');
        return false;
      }
    }

    return true;
  }

  async onManagePOSaveClick(issubmit: number) {
    if (issubmit == 0) {
      if (!this.savepovalidation()) {
        return;
      }
    } else {
      if (!this.savepovalidation()) {
        return;
      }

      if (!this.saveapproveddatasheetsvalidation()) {
        return;
      }
    }

    let SPRItemsForDataSheets = this.filterforSPRItems(this.offerItemStd);

    let podate = this.managePOForm.podate.value.split('/');
    podate = podate[2] + '-' + podate[1] + '-' + podate[0];


    SPRItemsForDataSheets = SPRItemsForDataSheets.map(item => {
      return {
        articleno: item.articleNo,
        spritemdatasheets: item.spritemdatasheets,
        approveddatasheets: []
      };
    });

    let savemodel = {
      issubmitted: issubmit,
      offerid: this.offerID,
      ponumber: this.managePOForm.ponumber.value,
      podate: podate,
      attachmentid: '',
      offerdatasheets: this.DataSheets,
      offerdatasheetsid: [],
      spritemsdatasheets: SPRItemsForDataSheets
    }

    if (this.pofiles.length > 0)
      await this.UploadManagePOFile(savemodel);
    if (this.DataSheets.length > 0)
      await this.UploadDataSheets(savemodel);
    if (SPRItemsForDataSheets && SPRItemsForDataSheets.length > 0)
      await this.UploadSPRItemsDataSheets(savemodel)

    delete savemodel.offerdatasheets;
    savemodel.spritemsdatasheets.forEach(element => {
      delete element.spritemdatasheets;
    });

    this.SaveManagePO(savemodel);
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

  async UploadDataSheets(offerdatasheetsmodel: any) {
    var type: string = '';

    if (this.isEdit) {
      var oldfiles = offerdatasheetsmodel.offerdatasheets.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        offerdatasheetsmodel.offerdatasheetsid.push({ id: element });
      });

      offerdatasheetsmodel.offerdatasheets = offerdatasheetsmodel.offerdatasheets.filter(x => !x.id);
    }

    if (offerdatasheetsmodel.offerdatasheets && offerdatasheetsmodel.offerdatasheets.length > 0) {
      type = 'offers/datasheets';
      await this.offersService.upload(offerdatasheetsmodel.offerdatasheets, type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              offerdatasheetsmodel.offerdatasheetsid.push({ id: element.id });
            });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  async UploadSPRItemsDataSheets(offerdatasheetsmodel: any) {
    var type: string = '';

    for (const item of offerdatasheetsmodel.spritemsdatasheets) {
      if (item.spritemdatasheets && item.spritemdatasheets.length > 0) {
        if (this.isEdit) {
          var oldfiles = item.spritemdatasheets.filter(x => x.id).map(y => y.id);
          oldfiles.forEach(element => {
            item.approveddatasheets.push({ id: element });
          });

          item.spritemdatasheets = item.spritemdatasheets.filter(x => !x.id);
        }

        if (item.spritemdatasheets && item.spritemdatasheets.length > 0) {
          type = 'offers/spritemsdatasheets';
          await this.offersService.upload(item.spritemdatasheets, type).then(
            response => {
              if (response) {
                response.resultfiles.forEach(element => {
                  item.approveddatasheets.push({ id: element.id });
                });
              }
            }, error => {
              this.notificationService.showError(error.error.error.message);
              return;
            });
        }
      }
    }
  }

  SaveManagePO(savemodel: any) {
    this.offersService.savePO(savemodel).subscribe(
      response => {
        if (response) {
          this.notificationService.showSuccess('Attach approved data sheets & Upload PO added successfully.');
          this.router.navigateByUrl('/offers/list');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onInitiateSOSaveSubmitClick(isso: any) {
    this.isInitiateSOChecked = isso;
    this.onInitiateSOSaveClick();
  }

  onInitiateSOSaveClick() {
    this.submitted = true;

    if (this.InitiateSOForm.invalid)
      return false;

    let initiateSOSaveModel = {
      "offerid": this.offerID,
      "isInitiateSO": this.isInitiateSOChecked ? 1 : 0,
      "initiatecomments": this.initiateSOForm.initiatecomments.value,
      // "oppoid": this.oppoData.opportunity_id,
      // "offervalue": this.totalnetvalue - (this.totalnetvalue * this.DealerCommisionPer / 100)
    }

    this.offersService.saveInitiateSO(initiateSOSaveModel).subscribe(
      response => {
        if (response) {
          this.notificationService.showSuccess('Initiated SO successfully.');
          this.router.navigateByUrl('/offers/list');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onAdditionalFieldsSaveDraftClick(isso: any) {
    this.isCreateSOChecked = isso;
    this.onAdditionalFieldsSaveClick();
  }

  onAdditionalFieldsSaveSubmitClick(isso: any) {
    this.isCreateSOChecked = isso;
    this.onAdditionalFieldsSaveClick();
  }

  onAdditionalFieldsSaveClick() {
    this.submitted = true;
    let isRefreshRequired: boolean = false;

    if (this.AdditionalFieldsForm.invalid)
      return;

    // let itemset = [];
    // let sodata: {};

    if (this.isCreateSOChecked) {
      this.offerItemStd.forEach(element => {
        if (!element.sapid) {
          this.isSOError = true;
          isRefreshRequired = true;
          this.soerror += `SAPID does not available for ` + element.articleNo + ` material number.` + '\n';
        }
      });

      if (isRefreshRequired) {
        return;
      }

    }

    this.itemAdditionalFieldsList.forEach(element => {
      if (!element.meansoftransport)
        element.meansoftransport = '';
      if (!element.packingtype)
        element.packingtype = '';
      if (!element.planningblock)
        element.planningblock = '';
      if (!element.freightzfro)
        element.freightzfro = 0;
      if (!element.freightzfrk)
        element.freightzfrk = 0;
      if (!element.cuttingcharges)
        element.cuttingcharges = 0;
      if (!element.inspectioncharges)
        element.inspectioncharges = 0;
      if (!element.packingcharges)
        element.packingcharges = 0;
    });

    let additionalfieldsmodel = {
      offerid: this.offerID,
      offervalue: this.totalnetvalue,
      OfferType: this.offerdata.OfferType,
      opportunityid: this.oppoData.opportunity_id,
      OfferStatus: this.offerdata.Status,
      additionalfielddata: {
        additionalfieldid: this.additionalfieldId ? this.additionalfieldId : 0,
        offerid: this.offerID,
        iscreatesochecked: this.isCreateSOChecked,
        soldtoparty: this.additionalFieldsForm.soldtoparty.value,
        soldtopartyname: this.additionalFieldsForm.soldtopartyname.value,
        soldstreet1: this.additionalFieldsForm.soldstreet1.value,
        soldstreet2: this.additionalFieldsForm.soldstreet2.value,
        solddistrict: this.additionalFieldsForm.solddistrict.value,
        soldcity: this.additionalFieldsForm.soldcity.value,
        soldpostalcode: this.additionalFieldsForm.soldpostalcode.value,
        soldregion: this.additionalFieldsForm.soldregion.value,
        shiptoparty: this.additionalFieldsForm.shiptoparty.value,
        shiptopartyname: this.additionalFieldsForm.shiptopartyname.value,
        shipstreet1: this.additionalFieldsForm.shipstreet1.value,
        shipstreet2: this.additionalFieldsForm.shipstreet2.value,
        shipdistrict: this.additionalFieldsForm.shipdistrict.value,
        shipcity: this.additionalFieldsForm.shipcity.value,
        shippostalcode: this.additionalFieldsForm.shippostalcode.value,
        shipregion: this.additionalFieldsForm.shipregion.value,
        ordertype: this.additionalFieldsForm.ordertype.value,
        salesorg: this.additionalFieldsForm.salesorg.value,
        distchannel: this.additionalFieldsForm.distchannel.value,
        division: this.additionalFieldsForm.division.value,
        deliveryblock: this.additionalFieldsForm.deliveryblock.value,
        completedlv: this.completedlvChecked,
        pricingdate: this.additionalFieldsForm.pricingdate.value.split('/').reverse().join('-'),
        customerrequireddeliverydate: this.additionalFieldsForm.customerrequireddeliverydate.value ? this.additionalFieldsForm.customerrequireddeliverydate.value.split('/').reverse().join('-') : "0000-00-00",
        specialprocessingid: this.additionalFieldsForm.specialprocessingid.value,
        firstdate: this.additionalFieldsForm.firstdate.value ? this.additionalFieldsForm.firstdate.value.split('/').reverse().join('-') : null,
        requirementtype: this.additionalFieldsForm.requirementtype.value,
        meansoftransport: this.additionalFieldsForm.meansoftransport.value,
        alternatetaxclassification1: this.additionalFieldsForm.alternatetaxclassification1.value,
        alternatetaxclassification3: this.additionalFieldsForm.alternatetaxclassification3.value,
        alternatetaxclassification4: this.additionalFieldsForm.alternatetaxclassification4.value,
        freetextbox: this.additionalFieldsForm.freetextbox.value ? this.additionalFieldsForm.freetextbox.value : 0,
        freightzfro: this.additionalFieldsForm.freightzfro.value ? this.additionalFieldsForm.freightzfro.value : 0,
        freightzfrk: this.additionalFieldsForm.freightzfrk.value ? this.additionalFieldsForm.freightzfrk.value : 0,
        cuttingcharges: this.additionalFieldsForm.cuttingcharges.value ? this.additionalFieldsForm.cuttingcharges.value : 0,
        inspectioncharges: this.additionalFieldsForm.inspectioncharges.value ? this.additionalFieldsForm.inspectioncharges.value : 0,
        packingcharges: this.additionalFieldsForm.packingcharges.value ? this.additionalFieldsForm.packingcharges.value : 0,
        modeoftransportforforeigntrade: this.additionalFieldsForm.modeoftransportforforeigntrade.value,
        portoflanding: this.additionalFieldsForm.portoflanding.value,
        portofdischarge: this.additionalFieldsForm.portofdischarge.value,
        citydescription: this.additionalFieldsForm.citydescription.value,
        countryname: this.additionalFieldsForm.countryname.value,
        countrykey: this.additionalFieldsForm.countrykey.value,
        insuranceby: this.additionalFieldsForm.insuranceby.value,
        exportscheme: this.additionalFieldsForm.exportscheme.value,
        adcode: this.additionalFieldsForm.adcode.value,
        afpodate: this.additionalFieldsForm.afpodate.value.split('/').reverse().join('-'),
        nacecode: this.additionalFieldsForm.nacecode.value ? this.additionalFieldsForm.nacecode.value : '',
        description: this.additionalFieldsForm.nacedescription.value ? this.additionalFieldsForm.nacedescription.value : '',
        level: this.additionalFieldsForm.nacelevel.value ? this.additionalFieldsForm.nacelevel.value : null,
        model: this.additionalFieldsForm.nacemodel.value ? this.additionalFieldsForm.nacemodel.value : '',
        businessmodel: this.additionalFieldsForm.businessmodel.value ? this.additionalFieldsForm.businessmodel.value : '',
      },
      // sodata: sodata,
      itemList: this.itemAdditionalFieldsList
    }
    // console.log('Create SO payload', additionalfieldsmodel);
    this.offersService.saveAdditionalFields(additionalfieldsmodel).subscribe(
      response => {
        if (response && (response.data.statusCode == 200 || response.data.statusCode == 201)) {
          this.notificationService.showSuccess(response.data.message);
          this.router.navigateByUrl('/offers/list');
        } else if (response && (response.data.statusCode == 400 || response.data.statusCode == 401)) {
          this.submitted = false;
          this.isSOError = true;
          this.soerror = response.data.message;
          this.notificationService.showError('SAP Error..');
          this.getAdditionalFieldsData();
        }
      }, error => {
        this.submitted = false;
        this.isSOError = true;
        this.soerror = error.error.error.message;
        this.getAdditionalFieldsData();
      });
  }

  openSPRItemMoal(SPRItemContent, index) {
    if (index != undefined) {
      this.submitted = false;
      var data = this.filterSPRData(this.offerItemSPR)[index];
      this._oldSPRItemData = Object.assign({}, data);;
      this._oldSPRItemData.sprlengthandfactor = { ...data.sprlengthandfactor };
      this.sprItemForm.sprItemDesc.setValue(data.description);
      this.sprItemDescription = data.description;
      this.SPRFiles = data.files;
      this.spritemid = data.spritemId;
      this.SPRItemSequenceId = data.itemSeqId;
      this.SPRItemArticleNo = data.articleno;
      this.spritemindex = index;
      this.SPRStatus = data.status;
      this.SPRShowStatus = data.showstatus;
      this.SPRActionRequired = data.actionrequired;
      this.SPRLengthandFactordata = data.sprlengthandfactor;
      this.SPRFormStatus = data.sprform_status;
      this.SPRFormFields = data.sprform_fields;
      this.sprItemForm.sprItemQty.setValue(data.sprquantity);
      this.sprItemForm.seqno.setValue(data.seqno);
      this.sprItemForm.customerpartno.setValue(data.customerpartno);

      if (data.itemreqdeliverydate) {
        this.spritemreqdeliveryDate = this.convertDate(data.itemreqdeliverydate);
        this.sprItemForm.itemreqdeliverydate.setValue(data.itemreqdeliverydate);
      } else if (this.offerInformationForm.offerreqdeliverydate.value) {
        this.spritemreqdeliveryDate = this.convertDate(this.offerInformationForm.offerreqdeliverydate.value);
        this.sprItemForm.itemreqdeliverydate.setValue(this.offerInformationForm.offerreqdeliverydate.value);
      } else {
        this.spritemreqdeliveryDate = null;
        this.sprItemForm.itemreqdeliverydate.setValue(null);
      }

      // this.modalService.open(SPRItemContent, { size: 'lg' }).result.then((result) => {
      //   this.closeResult = `Closed with: ${result}`;
      // }, (reason) => {
      //   this.sprItemForm.sprItemDesc.setValue(null);
      //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      // });
    } else {
      this.sprItemForm.sprItemDesc.setValue(null);
      this.sprItemDescription = null;
      this.SPRFiles = [];
      this.spritemid = 0;
      this.submitted = false;
      this.SPRItemSequenceId = null;
      this.SPRItemArticleNo = null;
      this.spritemindex = null;
      this.SPRStatus = 0;
      this.SPRShowStatus = null;
      this.SPRFormStatus = SPRFORMSTATUS.pending;
      this.SPRFormFields = null;
      this.SPRActionRequired = null;
      this.SPRLengthandFactordata = [];
      this.sprItemForm.sprItemQty.setValue(null);
      this.sprItemForm.seqno.setValue(null);
      this.sprItemForm.customerpartno.setValue(null);

      if (this.offerInformationForm.offerreqdeliverydate.value) {
        this.spritemreqdeliveryDate = this.convertDate(this.offerInformationForm.offerreqdeliverydate.value);
        this.sprItemForm.itemreqdeliverydate.setValue(this.offerInformationForm.offerreqdeliverydate.value);
      } else {
        this.spritemreqdeliveryDate = null;
        this.sprItemForm.itemreqdeliverydate.setValue(null);
      }
    }

    this.modalService.open(SPRItemContent, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.sprItemForm.sprItemDesc.setValue(null);
      this.sprItemDescription = null;
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openAddLengthandFactorSPR(AddLengthandFactorSPR) {
    this.sprLengthandFactorForm.sprlength.setValue(null);
    this.sprLengthandFactorForm.sprFactor.setValue(null);
    this.sprLengthandFactorForm.sprlfqty.setValue(null);
    this.submitted = false;

    if (this.offerInformationForm.offerreqdeliverydate.value) {
      this.sprlengthreqdeliveryDate = this.convertDate(this.offerInformationForm.offerreqdeliverydate.value);
      this.sprLengthandFactorForm.sprlengthreqdeliverydate.setValue(this.offerInformationForm.offerreqdeliverydate.value);
    } else {
      this.sprlengthreqdeliveryDate = null;
      this.sprLengthandFactorForm.sprlengthreqdeliverydate.setValue(null);
    }

    this.modalRef = this.modalService.open(AddLengthandFactorSPR, { size: 'md' });
  }

  onSPRLengthandFactorSave() {
    this.submitted = true;
    if (this.SPRLengthandFactorForm.invalid)
      return;

    let sprlfdata = {
      id: 0,
      length: Number(this.sprLengthandFactorForm.sprlength.value),
      factor: Number(this.sprLengthandFactorForm.sprFactor.value),
      qty: Number(this.sprLengthandFactorForm.sprlength.value) * Number(this.sprLengthandFactorForm.sprFactor.value),
      isDelete: 0,
      sprlengthreqdeliverydate: this.sprLengthandFactorForm.sprlengthreqdeliverydate.value
    }
    this.SPRLengthandFactordata.push(sprlfdata);

    // let SPRfinalQty = 0;
    // if (this.SPRLengthandFactordata && this.SPRLengthandFactordata.length > 0) {
    //   this.SPRLengthandFactordata.forEach(element => {
    //     if (element.isDelete == 0)
    //       SPRfinalQty += Number(element.qty);
    //   });
    // }
    // this.sprItemForm.sprItemQty.setValue(SPRfinalQty);

    this.calculateSPRItemQuantity();

    this.sprLengthandFactorForm.sprlength.setValue([]);
    this.sprLengthandFactorForm.sprFactor.setValue(null);
    this.sprLengthandFactorForm.sprlfqty.setValue(null);
    this.submitted = false;

    this.modalRef.close();
  }

  onSPRLengthChange(event: any) {
    if (event) {
      let sprlandfqty = Number(event.target.value) * Number(this.sprLengthandFactorForm.sprFactor.value);
      this.sprLengthandFactorForm.sprlfqty.setValue(sprlandfqty);
    } else {
      this.sprLengthandFactorForm.sprlength.setValue(null);
      this.sprLengthandFactorForm.sprFactor.setValue(null);
      this.sprLengthandFactorForm.sprlfqty.setValue(null);
    }
  }

  onSPRfactorchange(event: any) {
    if (event) {
      let sprlandfqty = Number(this.sprLengthandFactorForm.sprlength.value) * Number(event.target.value);
      this.sprLengthandFactorForm.sprlfqty.setValue(sprlandfqty);
    } else {
      this.sprLengthandFactorForm.sprlength.setValue(null);
      this.sprLengthandFactorForm.sprFactor.setValue(null);
      this.sprLengthandFactorForm.sprlfqty.setValue(null);
    }
  }

  onSPRLengthandFactorRemove(index: number) {
    if (this.isAdd) {
      this.SPRLengthandFactordata.splice(index, 1);
    } else if (this.isEdit) {
      if (this.SPRLengthandFactordata[index].id > 0) {
        this.SPRLengthandFactordata[index].isDelete = 1;
        this.SPRLengthandFactordataDelete.push(this.SPRLengthandFactordata[index]);
        this.SPRLengthandFactordata.splice(index, 1);
      } else
        this.SPRLengthandFactordata.splice(index, 1);
    }

    this.calculateSPRItemQuantity();
    // let finalQty = 0;
    // if (this.SPRLengthandFactordata && this.SPRLengthandFactordata.length > 0) {
    //   this.SPRLengthandFactordata.forEach(element => {
    //     if (element.isDelete == 0)
    //       finalQty += Number(element.qty);
    //   });
    //   this.sprItemForm.sprItemQty.setValue(finalQty);
    // } else {
    //   this.sprItemForm.sprItemQty.setValue(null);
    // }
  }

  calculateSPRItemQuantity() {
    let finalQty = 0;
    if (this.SPRLengthandFactordata && this.SPRLengthandFactordata.length > 0) {
      this.SPRLengthandFactordata.forEach(element => {
        if (element.isDelete == 0)
          finalQty += Number(element.qty);
      });
      this.sprItemForm.sprItemQty.setValue(finalQty);
    } else {
      this.sprItemForm.sprItemQty.setValue(null);
    }
  }

  onSPRItemSave() {
    this.submitted = true;

    if (this.SPRItemForm.invalid)
      return;

    let SPRItemModel = {
      spritemId: this.isAdd ? 0 : this.spritemid,
      itemSeqId: this.SPRItemSequenceId > 0 ? this.SPRItemSequenceId : this.getSeqID(this.offerItemSPR),
      seqno: this.sprItemForm.seqno.value ? this.sprItemForm.seqno.value : this.getSeqNo(),
      description: this.sprItemForm.sprItemDesc.value,
      files: this.SPRFiles,
      sprdocuments: [],
      isDelete: 0,
      status: this.SPRStatus ? this.SPRStatus : 0,
      showstatus: this.SPRShowStatus ? this.SPRShowStatus : 'Open',
      actionrequired: this.SPRActionRequired ? this.SPRActionRequired : 'Complete the datasheet, and send to PE action.',
      sprform_status: this.SPRFormStatus ? this.SPRFormStatus : SPRFORMSTATUS.pending,
      articleno: this.SPRItemArticleNo ? this.SPRItemArticleNo : this.getArticleNo(),
      sprlengthandfactor: this.SPRLengthandFactordata.concat(this.SPRLengthandFactordataDelete),
      sprquantity: this.sprItemForm.sprItemQty.value,
      customerpartno: this.sprItemForm.customerpartno.value,
      sprform_fields: this.SPRFormFields,
      itemreqdeliverydate: this.sprItemForm.itemreqdeliverydate.value
    }

    this.offerItemSPR = this.offerItemSPR.filter(x => x.itemSeqId != SPRItemModel.itemSeqId);

    if (this.SPRItemSequenceId > 0)
      this.offerItemSPR.splice(this.spritemindex, 0, SPRItemModel);
    else
      this.offerItemSPR.push(SPRItemModel);

    this.sprItemForm.sprItemDesc.setValue(null);
    this.SPRFiles = [];

    if (this.offerItemSPR.length > 0) {
      this.sprItem = true;
      this.submitted = false;
      this.modalService.dismissAll("");
      this.ShowSendtoPEButton = true;
      this.ShowSubmitforApprovalButton = false;
    } else {
      this.sprItem = false;
      this.ShowSendtoPEButton = false;
      this.ShowSubmitforApprovalButton = true;
    }
  }

  onSPRItemCancel() {
    let finalQty = 0;

    if (this._oldSPRItemData) {
      if (this.SPRLengthandFactordata && this.SPRLengthandFactordata.length > 0) {
        this.SPRLengthandFactordata.forEach(element => {
          if (element.isDelete == 0)
            finalQty += Number(element.qty);
        });
      } else {
        finalQty = Number(this._oldSPRItemData.sprquantity)
      }

      let SPRItemModel = {
        spritemId: this.isAdd ? 0 : this.spritemid,
        itemSeqId: this.SPRItemSequenceId > 0 ? this.SPRItemSequenceId : this.getSeqID(this.offerItemSPR),
        seqno: this._oldSPRItemData.seqno,
        description: this._oldSPRItemData.description,
        files: this._oldSPRItemData.files,
        sprdocuments: [],
        isDelete: this._oldSPRItemData.isDelete,
        status: this._oldSPRItemData.status,
        showstatus: this._oldSPRItemData.showstatus,
        actionrequired: this._oldSPRItemData.actionrequired,
        articleno: this._oldSPRItemData.articleno,
        sprlengthandfactor: this.SPRLengthandFactordata.concat(this.SPRLengthandFactordataDelete),
        sprquantity: finalQty,
        customerpartno: this._oldSPRItemData.customerpartno,
        sprform_status: this._oldSPRItemData.sprform_status,
        sprform_fields: this._oldSPRItemData.sprform_fields,
        itemreqdeliverydate: this._oldSPRItemData.itemreqdeliverydate
      }

      this.offerItemSPR = this.offerItemSPR.filter(x => x.itemSeqId != SPRItemModel.itemSeqId);

      if (this.SPRItemSequenceId > 0)
        this.offerItemSPR.splice(this.spritemindex, 0, SPRItemModel);
      else
        this.offerItemSPR.push(SPRItemModel);

      this.sprItemForm.sprItemDesc.setValue(null);
      this.SPRFiles = [];
    }

    if (this.offerItemSPR.length > 0) {
      this.sprItem = true;
      this.submitted = false;
    } else {
      this.sprItem = false;
    }
    this.modalService.dismissAll("");
  }

  getArticleNo() {
    let tempArr = this.offerItemSPRdeletedata.concat(this.offerItemSPR.concat(this.offerItemStd.filter(x => x.itemType == 'SPR')).concat(this.offerDeletedItem.filter(y => y.itemType == 'SPR')));

    let max: number = 0;
    let artno = '';
    for (let i = 0; i < tempArr.length; i++) {
      if (tempArr[i].articleno)
        artno = tempArr[i].articleno.split('-')[1];
      else if (tempArr[i].articleNo)
        artno = tempArr[i].articleNo.split('-')[1];
      if (Number(artno) > Number(max)) {
        max = Number(artno);
      }
    }
    max += 1;
    return this.lappoppoid + '-' + max;
  }

  onSPRItemDelete(event: any) {
    if (this.isAdd) {
      this.offerItemSPR = this.offerItemSPR.filter(x => x.articleno != event.model.articleno);
    } else if (this.isEdit) {
      if (event.model.id > 0) {
        this.offerItemSPR.find(x => x.spritemId == event.model.id).isDelete = 1;
        this.offerItemSPRdeletedata.push(this.offerItemSPR.find(x => x.spritemId == event.model.id));
        this.offerItemSPR = this.offerItemSPR.filter(x => x.articleno != event.model.articleno && x.spritemId != event.model.id);
      } else
        this.offerItemSPR = this.offerItemSPR.filter(x => x.articleno != event.model.articleno);
    }

    // if (event.model.id > 0) {
    //   this.offerItemSPR[event.model.index].isDelete = 1
    //   this.offerItemSPRdeletedata.push(this.offerItemSPR[event.model.index]);
    //   this.offerItemSPR.splice(event.model.index, 1);
    // } else {
    //   this.offerItemSPR.splice(event.model.index, 1);
    // }

    if (this.offerItemSPR.length > 0)
      this.sprItem = true;
    else
      this.sprItem = false;

    if (this.offerItemSPRdeletedata.length > 0)
      this.deletedSPRItem = true;
    else
      this.deletedSPRItem = false;

    this.modalService.dismissAll('delete');
    this.CheckForSubmitButtonText();
  }

  SPRfileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateItemsFile(event.target.files, 'SPR')) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.SPRFiles.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
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
      this.readExcel(ImportForEnum.stditem);
    }
  }

  downloadImportItemSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.importitem;
    FileSaver.saveAs(url, SampleEnum.importitem);
  }

  private readExcel(importfor: ImportForEnum) {
    let readFile = new FileReader();
    if (importfor == ImportForEnum.stditem) {
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
    } else if (importfor == ImportForEnum.spritem) {
      readFile.onload = (e) => {
        let storeSPRData: any = readFile.result;
        var data = new Uint8Array(storeSPRData);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        this.worksheet = workbook.Sheets[first_sheet_name];
      }
      readFile.readAsArrayBuffer(this.ImportSPRItemsfileUploaded);
    } else if (importfor == ImportForEnum.sprform) {
      readFile.onload = (e) => {
        let storeSPRData: any = readFile.result;
        var data = new Uint8Array(storeSPRData);
        var arr = new Array();
        for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
        var bstr = arr.join("");
        var workbook = XLSX.read(bstr, { type: "binary" });
        var first_sheet_name = workbook.SheetNames[0];
        this.worksheet = workbook.Sheets[first_sheet_name];
      }
      readFile.readAsArrayBuffer(this.ImportSPRFormfileUploaded);
    }

  }

  ValidateImportItemFile(importfor: ImportForEnum) {
    if (this.ImportItemFiles && importfor == ImportForEnum.stditem) {
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
    } else if (this.ImportSPRItemFiles && importfor == ImportForEnum.spritem) {
      this.importspritemjsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false, defval: null });
      let data = []
      for (let key in this.importspritemjsonData[0]) {
        if (data.length != Config.masterfilesheaders.importspritem.length)
          data.push(key.trim());
      }
      this.importspritemheaderList = data;

      if (JSON.stringify(this.importspritemheaderList).toUpperCase() != JSON.stringify(Config.masterfilesheaders.importspritem).toUpperCase()) {
        this.notificationService.showError('Incorrect Template used. Please download correct template before importing.');
        return false;
      } else
        return true;
    } else if (this.ImportSPRFormFiles && importfor == ImportForEnum.sprform) {
      this.importsprformjsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false, defval: null });
      let data = []
      for (let key in this.importsprformjsonData[0]) {
        if (data.length != Config.masterfilesheaders.importsprform.length)
          data.push(key.trim());
      }
      this.importsprformheaderList = data;

      if (JSON.stringify(this.importsprformheaderList).toUpperCase() != JSON.stringify(Config.masterfilesheaders.importsprform).toUpperCase()) {
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
            this.importitemjsonData[i][importitemheader[6]] = (this.importitemjsonData[i][importitemheader[6]].includes("|") ? this.importitemjsonData[i][importitemheader[6]] : Math.round(+ this.importitemjsonData[i][importitemheader[6]])) + '|' + Math.round(+ this.importitemjsonData[i + 1][importitemheader[6]]);
            this.importitemjsonData[i][importitemheader[8]] = (this.importitemjsonData[i][importitemheader[8]] ? this.importitemjsonData[i][importitemheader[8]] : this.offerInformationForm.offerreqdeliverydate.value.split("/").reverse().join("/")) + '|' + (this.importitemjsonData[i + 1][importitemheader[8]] ? this.importitemjsonData[i + 1][importitemheader[8]] : this.offerInformationForm.offerreqdeliverydate.value.split("/").reverse().join("/"));
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
      } else if (this.importitemjsonData[i][importitemheader[7]] && this.importitemjsonData[i][importitemheader[7]].length > 35) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Customer Part no can not be more than 35 char.';
      } else if (!this.importitemjsonData[i][importitemheader[8]] && !this.offerInformationForm.offerreqdeliverydate.value) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Req Dlv Date is required.';
      }
      // else if (this.importitemjsonData[i][importitemheader[8]] && Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[8]], '-').date < moment().format('YYYY-MM-DD')) {
      //   this.importitemjsonData[i].rowStatus = false;
      //   this.importitemjsonData[i].Remarks = 'Req Dlv Date must be greater than today date.';
      // }
      else if (this.offerItemStd && this.offerItemStd.length > 0) {
        let existItemCheck = null;
        existItemCheck = this.offerItemStd.filter(z => z.articleNo == this.importitemjsonData[i][importitemheader[1]] && z.isDelete == 0);
        if (existItemCheck && existItemCheck.length > 0) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Item already added in the list.`;
        }
      }

      if (!this.importitemjsonData[i][importitemheader[8]] && this.offerInformationForm.offerreqdeliverydate.value) {
        this.importitemjsonData[i][importitemheader[8]] = this.offerInformationForm.offerreqdeliverydate.value.split("/").reverse().join("/");
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
    // let _articles = this.importitemjsonData.filter(x => x.rowStatus !== false).map(x => x['ARTICLE NO']).toString();
    // if (_articles && _articles.length > 0)
    //   await this.onStockSearch(true, _articles);

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
              if (_itemsearcheddata.uom.toUpperCase() == 'M' && this.importitemjsonData[i].rowStatus == undefined) {
                _itemsearcheddata.length = _itemsearcheddata.length + '|' + 'Other';

                let _templength = this.importitemjsonData[i][importitemheader[5]].split('|');
                let _tempfactor = this.importitemjsonData[i][importitemheader[6]].split('|');
                let _tempreqdlvdate = this.importitemjsonData[i][importitemheader[8]].split('|');
                let isOtherLength: boolean = false;

                let _tempActuallength = _itemsearcheddata.length.split('|');
                for (let j = 0; j < _templength.length && j < _tempfactor.length; j++) {
                  isOtherLength = !_tempActuallength.includes(_templength[j]);

                  if (_itemsearcheddata.uom.toUpperCase() == 'M' && this.importitemjsonData[i].rowStatus == undefined) {

                    let _tempArr = {
                      id: 0,
                      length: _templength[j],
                      factor: _tempfactor[j] ? Math.round(+_tempfactor[j]) : 1,
                      qty: Number(_templength[j]) * (_tempfactor[j] ? Math.round(+_tempfactor[j]) : 1),
                      isDelete: 0,
                      cuttingcharges: 0,
                      isother: isOtherLength ? 1 : 0,
                      lengthreqdeliverydate: _tempreqdlvdate[j] && Config.dateisGreaterThanEqualtoTodayDate(_tempreqdlvdate[j]) ? Config.ExcelDateToJSDate(_tempreqdlvdate[j], '/').date.split('/').reverse().join('/') : ""
                    }
                    _templengthandfactordata.push(_tempArr);
                  }
                }
              }

              this.importitemjsonData[i].articleNo = _itemsearcheddata.articleno;
              this.importitemjsonData[i].description = _itemsearcheddata.description;
              this.importitemjsonData[i].uom = _itemsearcheddata.uom;
              this.importitemjsonData[i].lengthandfactor = _templengthandfactordata;
              this.importitemjsonData[i].sapid = _itemsearcheddata.sapid;
              this.importitemjsonData[i].msq = _itemsearcheddata.msq;
              this.importitemjsonData[i].length = _itemsearcheddata.length;
              this.importitemjsonData[i].mdq = _itemsearcheddata.mdq;

              let _tempALPdata = this.importitemjsonData.find(x => x.articleNo == _itemsearcheddata.articleno);

              if (_tempALPdata.uom.toUpperCase() == 'M') {
                // calculate quantity for UOM == M
                this.importitemjsonData[i].quantity = 0;

                _tempALPdata.lengthandfactor.forEach(element => {
                  this.importitemjsonData[i].quantity += +element.qty;
                });
              } else if (_tempALPdata.uom.toUpperCase() == 'PC' && _itemsearcheddata.length) {
                this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];
                this.importitemjsonData[i].pclength = _itemsearcheddata.length.split('|')[0];
              } else if (_tempALPdata.uom.toUpperCase() == 'PC' && !_itemsearcheddata.length) {
                this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];
                this.importitemjsonData[i].pclength = 1;
              }

              // validate UOM == M, for quantity must be in multiply with MDQ
              if (_tempALPdata.uom.toUpperCase() == 'M' && (Number(this.importitemjsonData[i].quantity) % Number(_itemsearcheddata.mdq)) != 0) {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].Remarks = `Quantity must be in multiples of ${_itemsearcheddata.mdq}`;
              }

              if (this.importitemjsonData[i].rowStatus == undefined) {
                //call api to get alp
                await this.productmasterService.searchproductalp(_itemsearcheddata.articleno, _producttype, 'INR', this.importitemjsonData[i].quantity, [], true, false).then(
                  response => {
                    if (response.data && response.data.statusCode == 200) {

                      // find max req dlv date to set item req dlv date
                      let itemRequiredDeliveryDate = this.importitemjsonData[i][importitemheader[8]].split('|')[0] && Config.dateisGreaterThanEqualtoTodayDate(this.importitemjsonData[i][importitemheader[8]].split('|')[0]) ? Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[8]].split('|')[0], '/').date : "";
                      if (_tempALPdata.lengthandfactor.length > 0) {

                        let dates = _tempALPdata.lengthandfactor.map(x => x.lengthreqdeliverydate);

                        if (dates.filter(x => x).length > 0) {
                          let maxDate = Math.max.apply(Math, dates.map(x => new Date(x.split("/").reverse().join()).getTime()).map(function (o) { return o; }))
                          itemRequiredDeliveryDate = moment(new Date(maxDate)).format("YYYY/MM/DD");
                        }
                      }

                      this.importitemjsonData[i].SrNo = i + 1;
                      this.importitemjsonData[i].seqno = this.importitemjsonData[i][importitemheader[0]];
                      // this.importitemjsonData[i].articleNo = _itemsearcheddata.articleno;
                      // this.importitemjsonData[i].description = _itemsearcheddata.description;
                      this.importitemjsonData[i].itemType = response.data.data.itemtype;
                      // this.importitemjsonData[i].sapid = _itemsearcheddata.sapid;
                      // this.importitemjsonData[i].msq = _itemsearcheddata.msq;
                      // this.importitemjsonData[i].moq = response.data.data.moq;
                      this.importitemjsonData[i].moq = response.data.data.moq;
                      // this.importitemjsonData[i].uom = _itemsearcheddata.uom;
                      this.importitemjsonData[i].price = Number(response.data.data.price);
                      // this.importitemjsonData[i].discountPer = this.importitemjsonData[i][importitemheader[4]];
                      // this.importitemjsonData[i].length = _itemsearcheddata.length;
                      this.importitemjsonData[i].factor = this.importitemjsonData[i][importitemheader[6]];
                      // this.importitemjsonData[i].lengthandfactor = _templengthandfactordata;
                      this.importitemjsonData[i].customerpartno = this.importitemjsonData[i][importitemheader[7]];
                      this.importitemjsonData[i].itemreqdeliverydate = itemRequiredDeliveryDate;
                      this.importitemjsonData[i].importby = this.importitemjsonData[i][importitemheader[9]];
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
                      let _tempitemlevelcuttingcharges = 0;
                      _tempALPdata.lengthandfactor.forEach(element => {
                        if (element.isDelete == 0 && element.isother == 1) {
                          element.cuttingcharges = response.data.data.itemtype == 'STD' ? Number(element.factor) * Number(this.stdcuttingchargesfinal) : Number(element.factor) * Number(this.trdcuttingchargesfinal)
                          _tempitemlevelcuttingcharges += Number(element.cuttingcharges);
                        }
                      });
                      _tempALPdata.cuttingcharges = _tempitemlevelcuttingcharges;

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

                      // if (Number(this.importitemjsonData[i].quantity) < Number(response.data.data.moq)) {
                      //   this.importitemjsonData[i].rowStatus = false;
                      //   this.importitemjsonData[i].Remarks = `Quantity must be greater than or equal to MOQ ` + Number(response.data.data.moq) + `.`;
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
    if (this.ValidateImportItemFile(ImportForEnum.stditem)) {
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
          importby: element.importby,
          price: Number(element.price),
          unitprice: Number(element.unitprice),
          discountPer: Number(element.discountPer),
          netvalue: this.calculateTotalinItemPopupByUnitPrice(element.unitprice, element.quantity),
          catalogLink: '',
          isDelete: 0,
          length: element.length,
          pclength: element.pclength,
          lengthandfactor: element.lengthandfactor,
          cuttingcharges: element.cuttingcharges,
          files: [],
          filerefid: 0,
          documents: [],
          GrossMargin: 0,
          RMCGrossMargin: 0,
          TargetGrossMargin: 0,
          itemreqdeliverydate: element.itemreqdeliverydate ? element.itemreqdeliverydate.split('/').reverse().join('/') : ''
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

  downloadImportSPRItemSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.importspritem;
    FileSaver.saveAs(url, SampleEnum.importspritem);
  }

  openImportSPRItemsModal() {
    this.ImportSPRItemFiles = null;
    this.submitted = false;
    this.modalService.open(this.ImportSPRItems, { size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  ImportSPRItemsfileChangeListener(event: any) {
    var validExts = new Array(".xlsx", ".xls");
    var fileExt = event.target.files[0].name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.notificationService.showError("Invalid file selected, valid files are of " + validExts.toString() + " types.");
      return false;
    } else {
      this.ImportSPRItemsfileUploaded = event.target.files[0];
      this.ImportSPRItemFiles = event.target.files[0];
      this.readExcel(ImportForEnum.spritem);
    }
  }

  async onImportSPRItemSave() {
    if (this.ValidateImportItemFile(ImportForEnum.spritem)) {
      await this.ValidateImportSPRItemFileData();

      if (this.offerItemSPR.length > 0)
        this.sprItem = true;
      else
        this.sprItem = false;

      this.modalService.dismissAll();
      this.CheckForSubmitButtonText();
    }
  }

  async ValidateImportSPRItemFileData() {
    let importspritemheader = Config.masterfilesheaders.importspritem;

    //grouping of quantity/length/factor based on description
    for (let i = 0; i < this.importspritemjsonData.length; i++) {
      if (i + 1 < this.importspritemjsonData.length) {
        if (this.importspritemjsonData[i][importspritemheader[1]].replace(/\s/g, '').replace(/[^A-Za-z0-9]/g, "").toUpperCase() == this.importspritemjsonData[i + 1][importspritemheader[1]].replace(/\s/g, '').replace(/[^A-Za-z0-9]/g, "").toUpperCase()) {
          this.importspritemjsonData[i][importspritemheader[5]] = Number(this.importspritemjsonData[i][importspritemheader[5]]) + Number(this.importspritemjsonData[i + 1][importspritemheader[5]]);

          if (this.importspritemjsonData[i][importspritemheader[3]] && this.importspritemjsonData[i + 1][importspritemheader[3]] && this.importspritemjsonData[i][importspritemheader[4]] && this.importspritemjsonData[i + 1][importspritemheader[4]]) {
            this.importspritemjsonData[i][importspritemheader[3]] = this.importspritemjsonData[i][importspritemheader[3]] + '|' + this.importspritemjsonData[i + 1][importspritemheader[3]];
            this.importspritemjsonData[i][importspritemheader[4]] = (this.importspritemjsonData[i][importspritemheader[4]].includes("|") ? this.importspritemjsonData[i][importspritemheader[4]] : Math.round(+ this.importspritemjsonData[i][importspritemheader[4]])) + '|' + Math.round(+ this.importspritemjsonData[i + 1][importspritemheader[4]]);
            this.importspritemjsonData[i][importspritemheader[6]] =
              (this.importspritemjsonData[i][importspritemheader[6]]
                ? this.importspritemjsonData[i][importspritemheader[6]]
                : this.offerInformationForm.offerreqdeliverydate.value ? this.offerInformationForm.offerreqdeliverydate.value.split("/").reverse().join("/") : "")
              + '|' +
              (this.importspritemjsonData[i + 1][importspritemheader[6]]
                ? this.importspritemjsonData[i + 1][importspritemheader[6]]
                : this.offerInformationForm.offerreqdeliverydate.value ? this.offerInformationForm.offerreqdeliverydate.value.split("/").reverse().join("/") : "");
          }

          this.importspritemjsonData.splice(i + 1, 1);
          if (i + 1 != this.importspritemjsonData.length)
            i--;
        }
      }
    }

    for (let index = 0; index < this.importspritemjsonData.length; index++) {
      if (this.importspritemjsonData[index][importspritemheader[2]] && this.importspritemjsonData[index][importspritemheader[2]].length > 35) {
        continue;
      }

      var _templengthandfactordata = [];
      let _tempquantity = 0;
      _tempquantity = this.importspritemjsonData[index][importspritemheader[5]];

      if (this.importspritemjsonData[index][importspritemheader[3]] && this.importspritemjsonData[index][importspritemheader[4]]) {
        let _templength = this.importspritemjsonData[index][importspritemheader[3]].split('|');
        let _tempfactor = this.importspritemjsonData[index][importspritemheader[4]].split('|');
        let _tempreqdlvdate = this.importspritemjsonData[index][importspritemheader[6]] ? this.importspritemjsonData[index][importspritemheader[6]].split('|') : "";

        _tempquantity = 0;
        for (let i = 0; i < _templength.length && i < _tempfactor.length; i++) {
          let sprlfdata = {
            id: 0,
            length: Number(_templength[i]),
            factor: _tempfactor[i] ? Math.round(+_tempfactor[i]) : 1,
            qty: Number(_templength[i]) * (_tempfactor[i] ? Math.round(+_tempfactor[i]) : 1),
            isDelete: 0,
            sprlengthreqdeliverydate: _tempreqdlvdate[i] && Config.dateisGreaterThanEqualtoTodayDate(_tempreqdlvdate[i]) ? Config.ExcelDateToJSDate(_tempreqdlvdate[i], '/').date.split('/').reverse().join('/') : ""
          }

          _templengthandfactordata.push(sprlfdata);
          _tempquantity += Number(sprlfdata.qty);
        }
      }

      // find max req dlv date to set item req dlv date
      let itemRequiredDeliveryDate = this.importspritemjsonData[index][importspritemheader[6]] ? Config.ExcelDateToJSDate(this.importspritemjsonData[index][importspritemheader[6]].split('|')[0], '/').date : "";
      if (_templengthandfactordata.length > 0) {

        let dates = _templengthandfactordata.map(x => x.sprlengthreqdeliverydate);

        if (dates.filter(x => x).length > 0) {
          let maxDate = Math.max.apply(Math, dates.map(x => new Date(x.split("/").reverse().join()).getTime()).map(function (o) { return o; }))
          itemRequiredDeliveryDate = moment(new Date(maxDate)).format("YYYY/MM/DD");
        }
      }

      let SPRItemModel = {
        spritemId: 0,
        itemSeqId: this.getSeqID(this.offerItemSPR),
        seqno: this.getSeqNo(),
        description: this.importspritemjsonData[index][importspritemheader[1]],
        files: [],
        sprdocuments: [],
        isDelete: 0,
        status: 0,
        showstatus: 'Open',
        actionrequired: 'Complete the datasheet, and send to PE action.',
        sprform_status: SPRFORMSTATUS.pending,
        articleno: this.getArticleNo(),
        sprlengthandfactor: _templengthandfactordata,
        sprquantity: _tempquantity,//this.importspritemjsonData[index][importspritemheader[5]],
        customerpartno: this.importspritemjsonData[index][importspritemheader[2]],
        sprform_fields: null,
        itemreqdeliverydate: itemRequiredDeliveryDate && Config.dateisGreaterThanEqualtoTodayDate(itemRequiredDeliveryDate) ? itemRequiredDeliveryDate.split('/').reverse().join('/') : null //this.importspritemjsonData[index][importspritemheader[6]] ? Config.ExcelDateToJSDate(this.importspritemjsonData[index][importspritemheader[6]], '/').date.split('/').reverse().join('/') : ""
      }

      this.offerItemSPR.push(SPRItemModel);
    }


    // this.importspritemjsonData.forEach(element => {
    //   if (element[importspritemheader[3]] && element[importspritemheader[3]].includes('|') && element[importspritemheader[4]] && element[importspritemheader[4]].includes('|')) {
    //     let _templength = element[importspritemheader[3]].split('|');
    //     let _tempfactor = element[importspritemheader[4]].split('|');

    //     let sprlfdata = {
    //       id: 0,
    //       length: Number(element[importspritemheader[3]]),
    //       factor: Number(element[importspritemheader[4]]),
    //       qty: Number(element[importspritemheader[3]]) * Number(element[importspritemheader[4]]),
    //       isDelete: 0
    //     }
    //   }
    // });

    // this.importspritemjsonData.forEach(element => {
    //   let sprlfdata = {
    //     id: 0,
    //     length: Number(element[importspritemheader[3]]),
    //     factor: Number(element[importspritemheader[4]]),
    //     qty: Number(element[importspritemheader[3]]) * Number(element[importspritemheader[4]]),
    //     isDelete: 0
    //   }

    //   let SPRItemModel = {
    //     spritemId: 0,
    //     itemSeqId: this.getSeqID(this.offerItemSPR),
    //     seqno: this.getSeqNo(),
    //     description: element[importspritemheader[1]],
    //     files: [],
    //     sprdocuments: [],
    //     isDelete: 0,
    //     status: 0,
    //     showstatus: 'Open',
    //     actionrequired: '',
    //     articleno: this.getArticleNo(),
    //     sprlengthandfactor: sprlfdata.qty > 0 ? [sprlfdata] : [],
    //     sprquantity: sprlfdata.qty > 0 ? sprlfdata.qty : element[importspritemheader[5]],
    //     customerpartno: element[importspritemheader[2]]
    //   }

    //   this.offerItemSPR.push(SPRItemModel);
    // });
  }

  removeImportSPRItemFile() {
    this.ImportSPRItemsfileUploaded = null;
    this.ImportSPRItemFiles = null;
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

  OpenSPRItemDeletePopup(index: number, id: number, articleno: string) {
    this.deleteConfirModel.index = index;
    this.deleteConfirModel.id = id;
    this.deleteConfirModel.articleno = articleno;
    this.modalService.open(this.spritemdeletemodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  toggleCompleteDlv(event: any) {
    this.completedlvChecked = event.target.checked;
    this.additionalFieldsForm.completedlv.setValue(this.completedlvChecked);
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
      srno: 0, //this.offerapprovaldata.find(x => x.userid == this.userid).srno,
      opportunityid: this.oppoData.opportunity_id,
      comment: "[" + this.offerNo + "]" + " - [" + this.authService.getCurrentUser().fullname + " - " + this.authService.getCurrentUser().role_code + "] - [Approve] - " + this.approveForm.approvereason.value
    }

    if (this.offerdata.Status < 50) {
      approvalmodel.srno = this.offerapprovaldata.find(x => x.userid == this.userid).srno;
      this.onOfferApproveReject(approvalmodel);
    }
    else
      this.onFMOfferApproveReject(approvalmodel);
  }

  onOfferRejectClick() {
    this.submitted = false;
    this.rejectForm.rejectreason.setValue(null);
    this.RejectReason = null;

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
      srno: 0, //this.offerapprovaldata.find(x => x.userid == this.userid).srno,
      opportunityid: this.oppoData.opportunity_id,
      comment: "[" + this.offerNo + "]" + " - [" + this.authService.getCurrentUser().fullname + " - " + this.authService.getCurrentUser().role_code + "] - [Reject] - " + this.approveForm.approvereason.value
    }

    if (this.offerdata.Status < 50) {
      approvalmodel.srno = this.offerapprovaldata.find(x => x.userid == this.userid).srno;
      this.onOfferApproveReject(approvalmodel);
    }
    else
      this.onFMOfferApproveReject(approvalmodel);
  }

  onOfferApproveReject(approvalmodel: any) {
    this.offersService.saveapprovaldata(approvalmodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.modalService.dismissAll();

          if (approvalmodel.status == 50)
            this.notificationService.showSuccess(response.responsedata.message);
          else if (approvalmodel.status == 30)
            this.notificationService.showSuccess(response.responsedata.message);

          this.router.navigateByUrl('/offers/list');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  // Customer Approval
  //---------------------

  onCustomerApproveReject(approvalmodel: any) {
    this.offersService.savecustomerapproval(approvalmodel).subscribe(
      response => {

        this.modalService.dismissAll();


        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.router.navigateByUrl('/offers/list');
        } else if (response.responsedata && (response.responsedata.statusCode == 400 || response.responsedata.statusCode == 500)) {
          //this.notificationService.showError(response.responsedata.message);
          this.notificationService.showError('SAP Error...');
          this.isSOError = true;
          this.soerror = 'SAP Error... Please contact the authorized personnel for assistance.';
          this.customerapproval = 1;
        }


      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onOfferCustomerApproveClick() {
    this.submitted = false;
    this.approveForm.approvereason.setValue(null);
    this.ApproveReason = null;

    this.modalService.open(this.customerapprovemodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onOfferCustomerRejectClick() {
    this.submitted = false;
    this.rejectForm.rejectreason.setValue(null);
    this.RejectReason = null;

    this.modalService.open(this.customerrejectmodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onCustomerApprovedClick() {
    this.submitted = true;

    if (this.ApproveForm.invalid)
      return;

    var approvalmodel = {
      offerid: this.offerID,
      status: 'Approved',
      message: this.approveForm.approvereason.value
    }

    this.onCustomerApproveReject(approvalmodel);

  }

  onCustomerRejectClick() {
    this.submitted = true;

    if (this.RejectForm.invalid)
      return;

    var datamodel = {
      offerid: this.offerID,
      status: 'Amendment',
      message: this.rejectForm.rejectreason.value
    }

    this.onCustomerApproveReject(datamodel);
  }

  onReGenerateSOClick() {
    const data = {
      offerid: this.offerdata.offerid
    }

    this.offersService.regenerateso(data).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.router.navigateByUrl('/offers/list');
        } else if (response.responsedata && (response.responsedata.statusCode == 400 || response.responsedata.statusCode == 500)) {
          this.notificationService.showError(response.responsedata.message);
          this.isSOError = true;
          this.soerror = response.responsedata.message;
        }

      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }


  //----------------------

  onFMOfferApproveReject(approvalmodel: any) {
    this.offersService.SaveFMApprovalData(approvalmodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.modalService.dismissAll();

          if (approvalmodel.status == 50)
            this.notificationService.showSuccess(response.responsedata.message);
          else if (approvalmodel.status == 30)
            this.notificationService.showSuccess(response.responsedata.message);

          this.router.navigateByUrl('/offers/list');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onProductFinderClick() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.productfinder;
    FileSaver.saveAs(url, SampleEnum.productfinder);
  }

  onProductCatalogueClick() {
    window.open(Config.productcatalogue.url);
  }

  onContactSearch() {
    if (this.accountContactDetail.contactsearch.value)
      this.searchedcontactdetail = this.contactdetail.filter(x => (x.name.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase()) || x.department.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase()) || x.designation.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase()) || x.mobile.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase()) || x.email.toLowerCase().includes(this.accountContactDetail.contactsearch.value.toLowerCase())));
    else
      this.searchedcontactdetail = this.contactdetail;
  }

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

  OcActionListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateOCFiles(event.target.files)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.filesidlist.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  OfferFileRemove(index: number) {
    this.OfferFiles.splice(index, 1);
  }

  OCACtionFileRemove(index: number) {
    this.filesidlist.splice(index, 1);
  }

  async onSaveOcactionfiles() {

    let offerHeader = {
      offerId: this.offerID,
      file_for: 15,
      filesidlist: []
    }

    //console.log(offerHeader)
    if (this.filesidlist.length > 0)
      await this.OcActionUpload(offerHeader);
    this.savefiles(offerHeader);



  }

  async OcActionUpload(offerHeader: any) {
    var type: string = '';

    var oldfiles = this.filesidlist.filter(x => x.id).map(y => y.id);
    oldfiles.forEach(element => {
      offerHeader.filesidlist.push({ id: element });
    });

    this.filesidlist = this.filesidlist.filter(x => !x.id);

    if (this.filesidlist && this.filesidlist.length > 0) {
      type = 'ocaction';
      console.log(this.filesidlist)
      await this.OcactionService.upload(this.filesidlist, type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              offerHeader.filesidlist.push({ id: element.id });
            });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  savefiles(saveModel: any) {
    this.OcactionService.savefilesinfo(saveModel).subscribe(
      async (response: any) => {
        if (response && response.responsedata && response.responsedata.statusCode === 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.router.navigate(['/offers/list']);
        }
      },
      error => {
        this.notificationService.showError("Error inserting File");
      }
    );
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

  ValidateOCFiles(files: any) {
    if (files.length > this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }

    if (this.filesidlist.length == this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }

    if (this.filesidlist.length + files.length > this.filesperitem) {
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

  onDeletedSPRItemView(DeletedSPRItemContent, index) {
    var data = this.offerItemSPRdeletedata[index];
    this.deletedSPRItemForm.delsprItemDesc.setValue(data.description);
    this.DeletedSPRFiles = data.files;
    this.DeletedSPRLengthandFactordata = data.sprlengthandfactor;
    this.deletedSPRItemForm.delsprItemQty.setValue(data.sprquantity);
    this.deletedSPRItemForm.delcustomerpartno.setValue(data.customerpartno);
    this.deletedSPRItemForm.delseqno.setValue(data.seqno);

    this.modalService.open(DeletedSPRItemContent, { size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.deletedSPRItemForm.delsprItemDesc.setValue(null);
      this.deletedSPRItemForm.delsprItemQty.setValue(null);
      this.deletedSPRItemForm.delcustomerpartno.setValue(null);
      this.deletedSPRItemForm.delseqno.setValue(null);
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
    this.stdItemForm.stdItemType.setValue(null);
    this.stdItemForm.stdItemUOM.setValue(null);
    this.stdItemForm.stdItemPCLength.setValue(null);
    this.stdItemForm.stdItemMOQ.setValue(null);
    this.stdItemForm.ItemMOQ.setValue(null);
    this.stdItemForm.ItemMDQ.setValue(null);
    this.qtydisable = false;
    this.lengthandfactorbtndisable = true;
    this.showpclength = false;
    this.itemLengthList = [];
    this.stdItemForm.enquiredquantity.setValue(null);
    this.stdItemForm.stdItemQty.setValue(null);
    this.stdItemForm.stdItemPrice.setValue(null);
    this.stdItemForm.stdItemexpsurcharge.setValue(null);
    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.seqno.setValue(null);
    this.quantityData = [];
    this.addQuantity.reqdeliverydate = null;
    this.addQuantity.quantity = null;

    if (Number(this.offerInformationForm.headerleveldiscount.value) > 0)
      this.stdItemForm.itemDiscount.setValue(Number(this.offerInformationForm.headerleveldiscount.value));
    else
      this.stdItemForm.itemDiscount.setValue(null);

    this.stdItemForm.itemunitnetprice.setValue(null);
    this.stdItemForm.stdItemCatalog.setValue(null);
    this.stdItemForm.customerpartno.setValue(null);
    this.stdItemForm.importby.setValue(null);
    this.stdItemForm.itemtotal.setValue(null);
    this.ItemCatalogue = null;
    this.LengthandFactordata = [];
    this.isItemReady = true;
    // this.itemErrorMessage = null;
    this.submitted = false;
    this.resetError();
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
      this.isShowFromToLocation = false;
      this.offerInformationForm.fromlocation.clearValidators();
      this.offerInformationForm.tolocation.clearValidators();
    }
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
    let _Id: number = this.isAdd && this.isRefrenceOffer ? 0 : this.offerID;

    this.offersService.getcuttingcharges(_Id, this.offerInformationForm.fromlocation.value, this.offerInformationForm.tolocation.value).subscribe(
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

  openItemAdditionalFieldsModal(index: number) {
    this.submitted = false;
    var data = this.itemAdditionalFieldsList[index];
    this.itemAdditionalFieldsId = data.id;
    this.itemAdditionalFieldsIndex = index;
    this.itemAdditionalFieldsSeqId = data.itemSeqId;
    this.itemAdditionalFieldsOfferid = data.offerid;
    this.itemAdditionalFieldsitemid = data.offeritemid;
    this.itemAdditionalFieldsForm.iafItemno.setValue(data.itemno);
    this.itemAdditionalFieldsForm.iafArticleno.setValue(data.articleno);
    this.itemAdditionalFieldsForm.iafQuantity.setValue(data.quantity);
    this.itemAdditionalFieldsForm.iafunitprice.setValue(data.unitprice);
    this.itemAdditionalFieldsForm.overdelvtolerance.setValue(data.overdelvtolerance);
    this.itemAdditionalFieldsForm.underdelvtolerance.setValue(data.underdelvtolerance);

    if (data.packingtype)
      this.itemAdditionalFieldsForm.packingmaterialtype.setValue(data.packingtype);
    else
      this.itemAdditionalFieldsForm.packingmaterialtype.setValue([]);

    this.itemAdditionalFieldsForm.freightzfro.setValue(data.freightzfro);
    this.itemAdditionalFieldsForm.freightzfrk.setValue(data.freightzfrk);
    this.itemAdditionalFieldsForm.cuttingcharges.setValue(data.cuttingcharges);
    this.itemAdditionalFieldsForm.inspectioncharges.setValue(data.inspectioncharges);
    if (data.meansoftransport)
      this.itemAdditionalFieldsForm.meansoftransport.setValue(data.meansoftransport);
    else
      this.itemAdditionalFieldsForm.meansoftransport.setValue([]);
    if (data.planningblock)
      this.itemAdditionalFieldsForm.planningblock.setValue(data.planningblock);
    else
      this.itemAdditionalFieldsForm.planningblock.setValue([]);
    this.itemAdditionalFieldsForm.packingcharges.setValue(data.packingcharges);

    if (data.reqdeliverydate) {
      this.reqdeliveryDate = this.convertDate(this.datePipe.transform(data.reqdeliverydate, this.dateformate));
      this.itemAdditionalFieldsForm.reqdeliverydate.setValue(this.datePipe.transform(data.reqdeliverydate, this.dateformate));
    } else {
      this.itemAdditionalFieldsForm.reqdeliverydate.setValue(this.todayDate);
    }
    this.modalService.open(this.ItemAdditionalFieldsModel, { size: 'md' });
  }

  onItemAdditionalFieldsSaveClick() {
    this.submitted = true;

    if (this.ItemAdditionalFieldsForm.invalid)
      return;

    let ItemAdditionalFieldModel = {
      itemSeqId: this.itemAdditionalFieldsSeqId,
      itemno: this.itemAdditionalFieldsForm.iafItemno.value,
      articleno: this.itemAdditionalFieldsForm.iafArticleno.value,
      unitprice: this.itemAdditionalFieldsForm.iafunitprice.value,
      quantity: this.itemAdditionalFieldsForm.iafQuantity.value,
      id: this.itemAdditionalFieldsId,
      offerid: this.itemAdditionalFieldsOfferid,
      offeritemid: this.itemAdditionalFieldsitemid,
      overdelvtolerance: this.itemAdditionalFieldsForm.overdelvtolerance.value,
      underdelvtolerance: this.itemAdditionalFieldsForm.underdelvtolerance.value,
      reqdeliverydate: this.itemAdditionalFieldsForm.reqdeliverydate.value.split('/').reverse().join('-'),
      packingtype: this.itemAdditionalFieldsForm.packingmaterialtype.value,
      meansoftransport: this.itemAdditionalFieldsForm.meansoftransport.value,
      freightzfro: this.itemAdditionalFieldsForm.freightzfro.value,
      freightzfrk: this.itemAdditionalFieldsForm.freightzfrk.value,
      cuttingcharges: this.itemAdditionalFieldsForm.cuttingcharges.value,
      inspectioncharges: this.itemAdditionalFieldsForm.inspectioncharges.value,
      packingcharges: this.itemAdditionalFieldsForm.packingcharges.value,
      planningblock: this.itemAdditionalFieldsForm.planningblock.value
    }

    this.itemAdditionalFieldsList = this.itemAdditionalFieldsList.filter(x => x.itemSeqId != ItemAdditionalFieldModel.itemSeqId);
    this.itemAdditionalFieldsList.splice(this.itemAdditionalFieldsIndex, 0, ItemAdditionalFieldModel);

    this.itemAdditionalFieldsIndex = null;
    this.itemAdditionalFieldsOfferid = null;
    this.itemAdditionalFieldsitemid = null;
    this.itemAdditionalFieldsId = null;
    this.itemAdditionalFieldsSeqId = null;
    this.submitted = false;
    this.modalService.dismissAll();
  }

  onItemAdditionalFieldsCancelClick() {
    if (this.submitted)
      this.submitted = false;

    this.modalService.dismissAll();
  }

  onSoldtoPartySearch() {
    this.offersService.getSoldtoPartySearch().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.soldtopartySearchList = response.responsedata.data;
        else
          this.soldtopartySearchList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSoldtoPartySearchChange(event: any) {
    if (event) {
      this.offersService.getSoldtoPartyDetail(this.additionalFieldsForm.soldtoparty.value).subscribe(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.additionalFieldsForm.soldtopartyname.setValue(response.responsedata.data[0].name1);
            this.additionalFieldsForm.soldtopartygstin.setValue(response.responsedata.data[0].gstin);
            this.additionalFieldsForm.soldstreet1.setValue(response.responsedata.data[0].housenumber);
            this.additionalFieldsForm.soldstreet2.setValue(null);
            this.additionalFieldsForm.solddistrict.setValue(response.responsedata.data[0].district);
            this.additionalFieldsForm.soldcity.setValue(response.responsedata.data[0].city);
            this.additionalFieldsForm.soldpostalcode.setValue(response.responsedata.data[0].postalcode);
            this.additionalFieldsForm.soldregion.setValue(response.responsedata.data[0].region);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });

      this.additionalFieldsForm.shiptoparty.setValue(null);
      this.offersService.getShiptoPartySearch(this.additionalFieldsForm.soldtoparty.value).subscribe(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200)
            this.shiptopartySearchList = response.responsedata.data;
          else
            this.shiptopartySearchList = [];
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.additionalFieldsForm.soldtopartyname.setValue(null);
      this.additionalFieldsForm.soldtopartygstin.setValue(null);
      this.additionalFieldsForm.soldstreet1.setValue(null);
      this.additionalFieldsForm.soldstreet2.setValue(null);
      this.additionalFieldsForm.solddistrict.setValue(null);
      this.additionalFieldsForm.soldcity.setValue(null);
      this.additionalFieldsForm.soldpostalcode.setValue(null);
      this.additionalFieldsForm.soldregion.setValue(null);
      this.additionalFieldsForm.shiptoparty.setValue(null);
      this.shiptopartySearchList = [];
      this.additionalFieldsForm.shiptopartyname.setValue(null);
      this.additionalFieldsForm.shipstreet1.setValue(null);
      this.additionalFieldsForm.shipstreet2.setValue(null);
      this.additionalFieldsForm.shipdistrict.setValue(null);
      this.additionalFieldsForm.shipcity.setValue(null);
      this.additionalFieldsForm.shippostalcode.setValue(null);
      this.additionalFieldsForm.shipregion.setValue(null);
    }
  }

  onShiptoPartySearchChange(event: any) {
    if (event) {
      if (this.additionalFieldsForm.soldtoparty.value && this.additionalFieldsForm.soldtoparty.value.length > 0 && this.additionalFieldsForm.shiptoparty.value && this.additionalFieldsForm.shiptoparty.value.length > 0) {
        this.offersService.getShiptoPartyDetail(this.additionalFieldsForm.soldtoparty.value, this.additionalFieldsForm.shiptoparty.value).subscribe(
          response => {
            if (response.responsedata && response.responsedata.statusCode == 200) {
              this.additionalFieldsForm.shiptopartyname.setValue(response.responsedata.data[0].name1);
              this.additionalFieldsForm.shipstreet1.setValue(response.responsedata.data[0].housenumber);
              this.additionalFieldsForm.shipstreet2.setValue(null);
              this.additionalFieldsForm.shipdistrict.setValue(response.responsedata.data[0].district);
              this.additionalFieldsForm.shipcity.setValue(response.responsedata.data[0].city);
              this.additionalFieldsForm.shippostalcode.setValue(response.responsedata.data[0].postalcode);
              this.additionalFieldsForm.shipregion.setValue(response.responsedata.data[0].region);
            }
          }, error => {
            this.notificationService.showError(error.error.error.message);
          });
      }
    } else {
      this.additionalFieldsForm.shiptopartyname.setValue(null);
      this.additionalFieldsForm.shipstreet1.setValue(null);
      this.additionalFieldsForm.shipstreet2.setValue(null);
      this.additionalFieldsForm.shipdistrict.setValue(null);
      this.additionalFieldsForm.shipcity.setValue(null);
      this.additionalFieldsForm.shippostalcode.setValue(null);
      this.additionalFieldsForm.shipregion.setValue(null);
    }
  }

  converttocurrencywithsurcharge(value: any, surcharge: number) {
    return this.converttocurrency((value - surcharge) * 1000);
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

  finddiscountper(discountPer: any, decimal: number): any {
    if (decimal === -1) {
      return (Number(discountPer) + ((100 - Number(discountPer)) * this.DealerCommisionPer / 100));
    }
    else {
      return (Number(discountPer) + ((100 - Number(discountPer)) * this.DealerCommisionPer / 100)).toFixed(decimal);
    }
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

  filterforSPRItems(data: any) {
    return data.filter(x => x.isDelete == 0 && x.itemType.toUpperCase() == 'SPR');
  }

  attachDataSheetFileChangeListener(event: any): void {
    if (event.target.files) {
      this.DataSheetFiles = [];
      this.DataSheetFiles = this.filterforSPRItems(this.offerItemStd)[event.target.id].spritemdatasheets ? this.filterforSPRItems(this.offerItemStd)[event.target.id].approveddatasheets : [];;
      if (this.ValidateItemsFile(event.target.files, 'IDataSheet')) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.DataSheetFiles.push(event.target.files[i]);
        }
        this.filterforSPRItems(this.offerItemStd)[event.target.id].spritemdatasheets = this.DataSheetFiles;
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  DataSheetsFileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateItemsFile(event.target.files, 'GDataSheet')) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.DataSheets.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  removeattachedDataSheetFile(itemindex: number, fileindex: number) {
    this.DataSheetFiles = [];
    this.DataSheetFiles = this.filterforSPRItems(this.offerItemStd)[itemindex].spritemdatasheets;
    this.DataSheetFiles = Array.from(this.DataSheetFiles)
    this.DataSheetFiles.splice(fileindex, 1);
    this.filterforSPRItems(this.offerItemStd)[itemindex].spritemdatasheets = this.DataSheetFiles;
  }

  removeDataSheetsFile(index: number) {
    this.DataSheets = Array.from(this.DataSheets)
    this.DataSheets.splice(index, 1);
  }

  onsendEmailClick() {
    location.href = "mailto:veron@gmail.com?subject=hello&body=fggf";
    // window.open('mailto:someone@somewhere.com?Subject=hello','email');
  }

  getAssigntoList() {
    this.offersService.getAssignToList().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.AssignToList = response.responsedata.data;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  openAssigneeModal() {
    if (this.offerdata.assignto)
      this.assigneeForm.assignto.setValue(this.offerdata.assignto);
    else
      this.assigneeForm.assignto.setValue([]);

    this.modalService.open(this.AssigneeModel, { size: 'sm' });
  }

  onAssignToSaveClick() {
    let assigntosavemodel = {
      offerid: this.offerID,
      assignto: this.assigneeForm.assignto.value
    }

    this.offersService.saveassignto(assigntosavemodel).subscribe(
      response => {
        if (response) {
          this.modalService.dismissAll();
          this.notificationService.showSuccess('Assign To saved successfully.');
          if (assigntosavemodel.assignto) {
            this.offerdata.assignto = assigntosavemodel.assignto;
            this.additionalFieldsForm.assignto.setValue(this.AssignToList.find(x => x.userid == assigntosavemodel.assignto).description);
          } else {
            this.offerdata.assignto = null;
            this.additionalFieldsForm.assignto.setValue(null);
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  assigntomeClick() {
    this.assigneeForm.assignto.setValue(this.userid);
    this.onAssignToSaveClick();
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

  onSOnoSaveClick() {
    this.submitted = true;

    if (this.SOnoForm.invalid)
      return;

    this.offersService.SaveSOno(this.offerID, this.sonoForm.sono.value).subscribe(
      response => {
        this.notificationService.showSuccess('SO no updated successfully.');
        this.router.navigate(['/offers/list']);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onCPOSubmitClick() {
    this.submitted = true;

    if (this.CPOValidatorForm.invalid)
      return;

    let cpomodel = {
      offerid: this.offerID,
      comment: this.cpoValidatorForm.cpocomments.value,
      isfmapprovalreq: this.isFMApprovalReq
    }

    this.CPOSubmitAPI(cpomodel);
  }

  CPOSubmitAPI(cpomodel: any) {
    this.offersService.CPOSubmit(cpomodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.router.navigate(['/offers/list']);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  isValidMOQ(item: any) {
    return Config.isValidMOQ(item);
  }

  private UpdateFieldValidators(issubmit: boolean) {
    if (issubmit) {
      this.offerInformationForm.offersValidfrom.setValidators(Validators.required);
      this.offerInformationForm.offersValidto.setValidators(Validators.required);
      this.offerInformationForm.vertical.setValidators(Validators.required);
      this.offerInformationForm.segment.setValidators(Validators.required);
      this.offerInformationForm.incoterms.setValidators(Validators.required);
      this.offerInformationForm.nacecode.setValidators(Validators.required);
      this.termsandConditionForm.paymentterms.setValidators(Validators.required);
      this.otherForm.asmapprovecomment.setValidators(Validators.required);
      this.offerInformationForm.offerreqdeliverydate.setValidators(Validators.required);
    } else {
      this.offerInformationForm.offersValidfrom.clearValidators();
      this.offerInformationForm.offersValidto.clearValidators();
      this.offerInformationForm.vertical.clearValidators();
      this.offerInformationForm.segment.clearValidators();
      this.offerInformationForm.incoterms.clearValidators();
      this.offerInformationForm.nacecode.clearValidators();
      this.termsandConditionForm.paymentterms.clearValidators();
      this.otherForm.asmapprovecomment.clearValidators();
      this.offerInformationForm.offerreqdeliverydate.clearValidators();
    }

    this.offerInformationForm.offersValidfrom.updateValueAndValidity();
    this.offerInformationForm.offersValidto.updateValueAndValidity();
    this.offerInformationForm.vertical.updateValueAndValidity();
    this.offerInformationForm.segment.updateValueAndValidity();
    this.offerInformationForm.incoterms.updateValueAndValidity();
    this.offerInformationForm.nacecode.updateValueAndValidity();
    this.termsandConditionForm.paymentterms.updateValueAndValidity();
    this.otherForm.asmapprovecomment.updateValueAndValidity();
    this.offerInformationForm.offerreqdeliverydate.updateValueAndValidity();
  }

  GetDealersList() {
    let element = (document.getElementById('ngSelectDealers') as HTMLInputElement);
    if (element.value && element.value.length >= 3) {
      this.GetDealersListAPI(element.value);
    }
  }

  GetDealersListAPI(dealer: string) {
    this.customerService.getdealerslist(dealer).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.DealersList = response.responsedata.data;
        }
      }, error => {
        this.DealersList = [];
        this.notificationService.showError(error.error.error.message);
      });
  }

  // async onStockSearch(isimport: boolean, articles: any) {
  //   if (isimport) {
  //     this.importitemsstockdata = null;
  //     await this.stockorderService.StockAvailability(articles, isimport, true).then(
  //       response => {
  //         if (response.responsedata && response.responsedata.statusCode == 200) {
  //           this.importitemsstockdata = response.responsedata.data;
  //         } else if (response.responsedata && response.responsedata.statusCode == 400) {
  //           this.notificationService.showError(response.responsedata.message);
  //         }
  //       }, error => {
  //         this.notificationService.showError(error.error.error.message);
  //       });
  //   }
  // }

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
    if (event)
      this.GetNacecodeDetail(event.code, 1);
    else
      this.additionalFieldsForm.nacecode.setValue(this.additionalFieldData.ompnacecode ? this.additionalFieldData.ompnacecode.trim() : null);
  }

  GetNacecodeDetail(nacecode: string, calledfrom: number) {
    this.opportunitiesService.getNaceDetail(nacecode).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (calledfrom == 0) {
            this.offerInformationForm.nacelevel.setValue(response.responsedata.data.level);
            this.offerInformationForm.nacemodel.setValue(response.responsedata.data.model);
          } else if (calledfrom == 1) {
            this.additionalFieldsForm.nacedescription.setValue(response.responsedata.data.description);
            this.additionalFieldsForm.nacelevel.setValue(response.responsedata.data.level);
            this.additionalFieldsForm.nacemodel.setValue(response.responsedata.data.model);
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onBusinessModelChange(event: any) {
    if (!event)
      this.additionalFieldsForm.businessmodel.setValue(this.additionalFieldData.ompbusinessmodel);
  }

  openArticleValidityModel() {
    let articleValidUptoDate = moment().add(this.authService.OfferValidupto(), 'd').format('YYYY-MM-DD');
    let _expireItems: any[] = [];
    this.offerItemStd.forEach(element => {
      if (new Date(element.validto) < new Date(articleValidUptoDate)) {
        _expireItems.push(element);
      }
    });

    this.articleValidityModel.items = _expireItems;
    let mindata = _expireItems.reduce((a, b) => (new Date(a.validto) > new Date(b.validto) ? b : a));
    this.articleValidityModel.mindata = this.datePipe.transform(mindata.validto, this.dateformate);
    this.articleValidityModel.showRevalidationBtn = _expireItems.filter(X => X.itemType == 'SPR').length > 0 ? true : false;
    this.modalService.open(this.ArticleValidityModel, { size: 'lg', scrollable: true });
  }

  onYesClickforValidity() {
    this.modalService.dismissAll();
    // if (this.offerItemStd.filter(X => X.itemType != 'SPR').length > 0) {
    //   this.notificationService.showInfo('Kindly contact PE team to extend the article validity.');
    //   return;
    // } else {
    this.isChangeOfferValidity = true;
    this.offerInformationForm.offersValidto.setValue(this.articleValidityModel.mindata);
    // this.newOfferValidity = this.articleValidityModel.mindata;
    this.onSubmit();
    // }
  }

  onValidityModelCancelClick() {
    this.modalService.dismissAll();
  }

  onNoClickforValidity() {
    let _expireItems: any[] = [];
    let articleValidUptoDate = moment().add(this.authService.OfferValidupto(), 'd').format('YYYY-MM-DD');
    this.offerItemStd.forEach(element => {
      if (new Date(element.validto) < new Date(articleValidUptoDate)) {
        _expireItems.push(element);
      }
    });

    if (_expireItems.filter(X => X.itemType != 'SPR').length > 0) {
      this.modalService.dismissAll();
      this.notificationService.showInfo(this.revalidationErrorMsg);
      return;
    } else {
      this.modalService.dismissAll();
      this.isRecommend = false;
      this.isRevalidation = true;
      this.clonesubmitted = true;
      this.onSubmit();
    }
    // this.notificationService.showInfo('Kindly contact PE team to extend the article validity.');
    // this.modalService.dismissAll();
    // return;
  }

  // onCancelClick() {
  //   this.modalService.dismissAll();
  // }

  CheckForSubmitButtonText() {
    // this.SubmitButtonText = "Submit for Approval";
    this.ShowSubmitforApprovalButton = true;
    this.ShowSubmitforRevalidationButton = false;
    this.ShowSendtoPEButton = false;

    this.offerItemStd.forEach(element => {
      if (element.isexpire && element.isDelete == 0 && element.itemType == 'SPR') {
        this.ShowSubmitforApprovalButton = false;
        this.ShowSubmitforRevalidationButton = true;
        this.ShowSendtoPEButton = false;
        return true;
      }
      // else if (element.isDelete == 0 && element.itemType == 'SPR' && element.sprform_status == SPRFORMSTATUS.pending) {
      //   this.ShowSendtoPEButton = true;
      //   this.ShowSubmitforApprovalButton = false;
      //   this.ShowSubmitforRevalidationButton = false;
      //   return;
      // }
    });

    this.offerItemSPR.forEach(element => {
      if (element.isDelete == 0 && (element.sprform_status == SPRFORMSTATUS.pending || element.status <= 30)) {
        this.ShowSendtoPEButton = true;
        this.ShowSubmitforApprovalButton = false;
        this.ShowSubmitforRevalidationButton = false;
        return;
      }
    });

    if (this.filterSPRDatatoDeletewithOrder(this.offerItemSPR).length > 0) {
      this.ShowSendtoPEButton = true;
      this.ShowSubmitforApprovalButton = false;
      this.ShowSubmitforRevalidationButton = false;
    }
  }

  onSubmitforRevalidationClick() {
    this.isRecommend = false;
    this.clonesubmitted = true;
    this.isRevalidation = true;
    this.submitted = false;
    this.UpdateFieldValidators(this.isRecommend);
    if (this.checkFormforValid(false))
      this.onSubmit();
  }

  openDataSheet(item: any, index: number, isReadOnlyForm: boolean = false, isDpTxtVisible: boolean = false) {
    this.articleNo = item.articleno ? item.articleno : item.articleNo;
    this.description = item.description;
    this.isReadOnlyForm = isReadOnlyForm;
    this.dataSheetrecordIndex = index;
    // this.dataSheetObj = item.sprform_fields === null || item.sprform_fields === undefined ? undefined : JSON.parse(atob(item.sprform_fields));
    this.dataSheetObj = (item.sprform_fields && item.sprform_fields !== undefined && item.sprform_fields.length > 5) ? JSON.parse(atob(item.sprform_fields)) : undefined;

    this.isDpTxtVisible = isDpTxtVisible;
    this.modalService.open(this.SPRInformationModel, { size: 'lg', scrollable: true, backdrop: 'static' });
  }

  openDataSheetWithSPR(item: any, index: number, isReadOnlyForm: boolean = false) {
    this.selectedSPRDataSheetArticleNo = item.articleno;
    this.isDpTxtVisible = true;
    this.isSaveBtnDisplay = item.sprform_status === 10 ? true : false;
    this.openDataSheet(item, index, isReadOnlyForm, true);
  }

  isSavedOrSubmitted(event: any) {
    let dataSheetrecordIndex = this.offerItemSPR.findIndex((ele) => ele.articleno === this.selectedSPRDataSheetArticleNo);
    if (dataSheetrecordIndex !== -1) {
      this.offerItemSPR[dataSheetrecordIndex].sprform_fields = btoa(JSON.stringify(event.sprform_fields));
      this.offerItemSPR[dataSheetrecordIndex].sprform_status = event.sprform_status;
      if (event.sprform_status == SPRFORMSTATUS.pending) {
        this.ShowSendtoPEButton = true;
        this.ShowSubmitforApprovalButton = false;
      }
    }
  }
  ngOnDestroy() {
    this.storageService.removeValue(StorageKey.sprFormJsonData);
  }

  onImportSPRForm() {
    this.ImportSPRFormFiles = null;
    this.submitted = false;
    this.modalService.open(this.ImportSPRForms, { size: 'md' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  downloadImportSPRFormSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.importsprform;
    FileSaver.saveAs(url, SampleEnum.importsprform);
  }

  removeImportSPRFormFile() {
    this.ImportSPRFormfileUploaded = null;
    this.ImportSPRFormFiles = null;
  }

  ImportSPRFormfileChangeListener(event: any) {
    var validExts = new Array(".xlsx", ".xls");
    var fileExt = event.target.files[0].name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.notificationService.showError("Invalid file selected, valid files are of " + validExts.toString() + " types.");
      return false;
    } else {
      this.ImportSPRFormfileUploaded = event.target.files[0];
      this.ImportSPRFormFiles = event.target.files[0];
      this.readExcel(ImportForEnum.sprform);
    }
  }

  async onImportSPRFormSave() {
    if (this.ValidateImportItemFile(ImportForEnum.sprform)) {
      await this.ValidateImportSPRFormFileData();

      this.importSPRFormStatus = this.importsprformjsonData;

      this.modalService.open(this.ImportSPRFormsStatus, { size: 'lg' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  async ValidateImportSPRFormFileData() {
    let importsprformheader = Config.masterfilesheaders.importsprform;

    //import data validation for required field
    for (let i = 0; i < this.importsprformjsonData.length; i++) {
      this.importsprformjsonData[i].rowStatus = true;
      this.importsprformjsonData[i].ItemRemarks = '';

      if (!this.importsprformjsonData[i][importsprformheader[0]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = `${importsprformheader[0]} is required.`;
      } else if (!this.offerItemSPR.find(x => x.articleno == this.importsprformjsonData[i][importsprformheader[0]])) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = `${importsprformheader[0]} not exist.`;
      }

      if (!this.importsprformjsonData[i][importsprformheader[1]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[1]} is required.` : `${importsprformheader[1]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[2]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[2]} is required.` : `${importsprformheader[2]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[4]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[4]} is required.` : `${importsprformheader[4]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[5]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[5]} is required.` : `${importsprformheader[5]} is required.`;
      }
      if (isNaN(this.importsprformjsonData[i][importsprformheader[5]])) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[5]} must be numeric.` : `${importsprformheader[5]} must be numeric.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[6]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[6]} is required.` : `${importsprformheader[6]} is required.`;
      }
      if (isNaN(this.importsprformjsonData[i][importsprformheader[6]])) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[6]} must be numeric.` : `${importsprformheader[6]} must be numeric.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[7]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[7]} is required.` : `${importsprformheader[7]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[8]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[8]} is required.` : `${importsprformheader[8]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[9]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[9]} is required.` : `${importsprformheader[9]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[10]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[10]} is required.` : `${importsprformheader[10]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[11]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[11]} is required.` : `${importsprformheader[11]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[12]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[12]} is required.` : `${importsprformheader[12]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[13]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[13]} is required.` : `${importsprformheader[13]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[14]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[14]} is required.` : `${importsprformheader[14]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[15]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[15]} is required.` : `${importsprformheader[15]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[16]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[16]} is required.` : `${importsprformheader[16]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[17]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[17]} is required.` : `${importsprformheader[17]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[18]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[18]} is required.` : `${importsprformheader[18]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[19]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[19]} is required.` : `${importsprformheader[19]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[20]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[20]} is required.` : `${importsprformheader[20]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[21]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[21]} is required.` : `${importsprformheader[21]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[22]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[22]} is required.` : `${importsprformheader[22]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[23]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[23]} is required.` : `${importsprformheader[23]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[24]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[24]} is required.` : `${importsprformheader[24]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[25]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[25]} is required.` : `${importsprformheader[25]} is required.`;
      }
      if (!this.importsprformjsonData[i][importsprformheader[27]]) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[27]} is required.` : `${importsprformheader[27]} is required.`;
      }
      if (isNaN(this.importsprformjsonData[i][importsprformheader[29]])) {
        this.importsprformjsonData[i].rowStatus = false;
        this.importsprformjsonData[i].ItemRemarks = this.importsprformjsonData[i].ItemRemarks ? this.importsprformjsonData[i].ItemRemarks + ` | ${importsprformheader[29]} must be numeric.` : `${importsprformheader[29]} must be numeric.`;
      }
    }
  }

  onProceedtoSaveSPRForm() {
    let importsprformheader = Config.masterfilesheaders.importsprform;
    let importsprformsaveheader = Config.masterfilesheaders.importsprformsave;
    let sprformdata = Object.assign([], this.importSPRFormStatus);

    // sprformdata.forEach(element => {
    //   Object.keys(element).forEach(e => element[e] = (element[e] != null && element[e] != undefined) ? element[e].replace(/[^\x00-\x7F]/g, '') : element[e]);  
    // });
    sprformdata.forEach(item => {
      for (const key in item) {
        if ((typeof item[key] === 'string' || item[key] instanceof String) && item[key] != null && item[key] != undefined) {
          item[key] = item[key].replace(/[^\x00-\x7F]/g, '');
        }
      }
    });

    this.importSPRFormStatus = this.importSPRFormStatus.map(item => {
      return {
        [importsprformsaveheader[0]]: item[importsprformheader[0]],
        [importsprformsaveheader[1]]: item[importsprformheader[1]],
        [importsprformsaveheader[2]]: item[importsprformheader[2]],
        [importsprformsaveheader[3]]: item[importsprformheader[3]],
        [importsprformsaveheader[4]]: item[importsprformheader[4]],
        [importsprformsaveheader[5]]: item[importsprformheader[5]],
        [importsprformsaveheader[6]]: item[importsprformheader[6]],
        [importsprformsaveheader[7]]: item[importsprformheader[7]],
        [importsprformsaveheader[8]]: item[importsprformheader[8]],
        [importsprformsaveheader[9]]: item[importsprformheader[9]],
        [importsprformsaveheader[10]]: item[importsprformheader[10]],
        [importsprformsaveheader[11]]: item[importsprformheader[11]],
        [importsprformsaveheader[12]]: item[importsprformheader[12]],
        [importsprformsaveheader[13]]: item[importsprformheader[13]],
        [importsprformsaveheader[14]]: item[importsprformheader[14]],
        [importsprformsaveheader[15]]: item[importsprformheader[15]],
        [importsprformsaveheader[16]]: item[importsprformheader[16]],
        [importsprformsaveheader[17]]: item[importsprformheader[17]],
        [importsprformsaveheader[18]]: item[importsprformheader[18]],
        [importsprformsaveheader[19]]: item[importsprformheader[19]],
        [importsprformsaveheader[20]]: item[importsprformheader[20]],
        [importsprformsaveheader[21]]: item[importsprformheader[21]],
        [importsprformsaveheader[22]]: item[importsprformheader[22]],
        [importsprformsaveheader[23]]: item[importsprformheader[23]],
        [importsprformsaveheader[24]]: item[importsprformheader[24]],
        [importsprformsaveheader[25]]: item[importsprformheader[25]],
        [importsprformsaveheader[26]]: item[importsprformheader[26]],
        [importsprformsaveheader[27]]: item[importsprformheader[27]],
        [importsprformsaveheader[28]]: item[importsprformheader[28]],
        [importsprformsaveheader[29]]: item[importsprformheader[29]],
        [importsprformsaveheader[30]]: item[importsprformheader[30]],
        [importsprformsaveheader[31]]: item['ItemRemarks']
      };
    });

    sprformdata.forEach((element, index) => {

      let SPRItemData = this.offerItemSPR.find(x => x.articleno == sprformdata[index][importsprformheader[0]]);
      if (SPRItemData) {
        let _formdata = this.importSPRFormStatus.find(x => x.articleno == SPRItemData.articleno);

        SPRItemData.sprform_status = !_formdata[importsprformsaveheader[31]] ? SPRFORMSTATUS.completed : SPRFORMSTATUS.pending;

        delete _formdata[importsprformsaveheader[0]];
        delete _formdata[importsprformsaveheader[31]];

        SPRItemData.sprform_fields = btoa(JSON.stringify(_formdata));
      }
    });

    this.modalService.dismissAll();
  }

  onExportSPRForm() {
    let importSPRFormheader = Config.masterfilesheaders.importsprform;

    this.exportSPRItems = this.offerItemSPR.map(item => {

      let SPRFormData = item.sprform_fields && item.sprform_fields != "null" ? JSON.parse(atob(item.sprform_fields)) : null;

      return {
        [importSPRFormheader[0]]: item.articleno,
        [importSPRFormheader[1]]: SPRFormData ? SPRFormData.voltgrade : "",
        [importSPRFormheader[2]]: SPRFormData ? SPRFormData.refstandard : "",
        [importSPRFormheader[3]]: SPRFormData ? SPRFormData.ratedtemp : "",
        [importSPRFormheader[4]]: SPRFormData ? SPRFormData.construction : "",
        [importSPRFormheader[5]]: SPRFormData ? SPRFormData.reqcores : "",
        [importSPRFormheader[6]]: SPRFormData ? SPRFormData.crosssec : "",
        [importSPRFormheader[7]]: SPRFormData ? SPRFormData.conducttype : "",
        [importSPRFormheader[8]]: SPRFormData ? SPRFormData.conductlass : "",
        [importSPRFormheader[9]]: SPRFormData ? SPRFormData.insulatiomat : "",
        [importSPRFormheader[10]]: SPRFormData ? SPRFormData.corecolour : "",
        [importSPRFormheader[11]]: SPRFormData ? SPRFormData.indishieldtype : "",
        [importSPRFormheader[12]]: SPRFormData ? SPRFormData.thickofshield : "",
        [importSPRFormheader[13]]: SPRFormData ? SPRFormData.drainwiresize : "",
        [importSPRFormheader[14]]: SPRFormData ? SPRFormData.ovshitype : "",
        [importSPRFormheader[15]]: SPRFormData ? SPRFormData.thickshield : "",
        [importSPRFormheader[16]]: SPRFormData ? SPRFormData.overalldrainwiresize : "",
        [importSPRFormheader[17]]: SPRFormData ? SPRFormData.innersheath1mat : "",
        [importSPRFormheader[18]]: SPRFormData ? SPRFormData.colofinnsheal : "",
        [importSPRFormheader[19]]: SPRFormData ? SPRFormData.protection1 : "",
        [importSPRFormheader[20]]: SPRFormData ? SPRFormData.innersheal2mat : "",
        [importSPRFormheader[21]]: SPRFormData ? SPRFormData.colofinnshe : "",
        [importSPRFormheader[22]]: SPRFormData ? SPRFormData.protection2 : "",
        [importSPRFormheader[23]]: SPRFormData ? SPRFormData.outshemat : "",
        [importSPRFormheader[24]]: SPRFormData ? SPRFormData.colofoutershe : "",
        [importSPRFormheader[25]]: SPRFormData ? SPRFormData.otherprop : "",
        [importSPRFormheader[26]]: SPRFormData ? SPRFormData.ripcord : "",
        [importSPRFormheader[27]]: SPRFormData ? SPRFormData.packinglen : "",
        [importSPRFormheader[28]]: SPRFormData ? SPRFormData.application : "",
        [importSPRFormheader[29]]: SPRFormData ? SPRFormData.quantity : "",
        [importSPRFormheader[30]]: SPRFormData ? SPRFormData.remarks : "",
      };
    });

    let fileName = 'SPR Form Datasheet - ' + this.createdDate;

    this.appService.exportAsExcelFile(this.exportSPRItems, fileName);
  }

  setError(message: string, subPopup: boolean = false) {
    if (subPopup) {
      this.subErrorMessage = message;
    } else {
      this.errorMessage = message;
    }

    // this.showErrorMessage = true;
  }

  resetError(subPopup: boolean = false) {
    if (!subPopup) {
      // this.showSubErrorMessage = false;
      // this.subErrorMessage = null;
      this.errorMessage = "";
    }
    this.subErrorMessage = "";

    // this.showErrorMessage = false;
  }

  exportOfferItem() {

    let fileName = `OfferItems_${this.offerID}.xlsx`;
    /* table id is passed over here */
    let element = document.getElementById('table-offer-item');
    const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element);

    /* generate workbook and add the worksheet */
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Offer Items');

    /* save to file */
    XLSX.writeFile(wb, fileName);

  }
}
