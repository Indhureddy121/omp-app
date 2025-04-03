import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RateContractsStatus } from '@core/enums/rate-contracts.enum';
import { AuthService } from '@core/services/auth/auth.service';
import { FilesService } from '@core/services/common/files.service';
import { SharedService } from '@core/services/common/shared.service';
import { StorageKey, StorageService } from '@core/services/common/storage.service';
import { OffersService } from '@core/services/offers/offers.service';
import { RatecontractsService } from '@core/services/ratecontracts/ratecontracts.service';
import { StockorderService } from '@core/services/stockorder/stockorder.service';
import { ModalDismissReasons, NgbAccordion, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import * as FileSaver from 'file-saver';
import { Config } from 'src/app/core/configs/config';
import { OpportunitiesService } from '@core/services/opportunities/opportunities.service';
import { OmpusersService } from '@core/services/masters/ompusers.service';
import { CustomerService } from '@core/services/masters/customer.service';
import { ApprovalStatusEnum } from '@core/enums/approvalstatus.enum';
import { environment } from 'src/environments/environment';
import { SampleEnum } from '@core/enums/sample.enum';
import * as XLSX from 'xlsx';
import { ProductmasterService } from '@core/services/masters/productmaster.service';
import { PagerService } from '@shared/directives';
import { RatecontractService } from '@core/services/masters/ratecontract.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { NotificationService } from '@core/services/common/notification.service';
import { AppService } from 'src/app/app.service';
import { LookupService } from '@core/services/common/lookup.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-manageratecontracts',
  templateUrl: './manageratecontracts.component.html',
  styleUrls: ['./manageratecontracts.component.css']
})
export class ManageratecontractsComponent implements OnInit {

  isEditOrView: boolean = false;
  @ViewChild('acc', { static: true }) acc: NgbAccordion;
  basicRateContractForm: FormGroup;
  contractInformationForm: FormGroup;
  ItemAmendmentForm: FormGroup;
  soldtopartySearchList: any[] = [];
  shiptopartySearchList: any[] = [];
  contractForList: any[] = [
    { code: 10, description: 'Direct' },
    { code: 20, description: 'Indirect' }];
  priceBasedonList: any[] = [
    { code: 10, description: 'LME' },
    { code: 20, description: 'Fixed' },
    { code: 30, description: 'ALP' },
    { code: 40, description: 'LCP(Cash Settlement)' },
  ];
  rcTypeList: any[] = [
    { code: 10, description: 'Price' },
    { code: 20, description: 'Quantity' }];
  submitted: boolean = false;
  todayDate: string;
  todayMinDate: { year: number; month: number; day: number; };
  futureDate: string;
  offervalidfromDate: { year: number; month: number; day: number; };
  offervalidtoDate: { year: number; month: number; day: number; };
  offerValidMaxdate: any;
  offerValidMindate: any;
  EmployeeResponsibleList: any[] = [];
  TermsAndConditionValue: string;
  ItemsForm: FormGroup;
  ItemForm: FormGroup;
  isAdd: boolean = false;
  isEdit: boolean = false;
  isView: boolean = false;
  isRefrenceOffer: boolean = false;
  rateContractID: number;
  itemid: number;
  items: FormArray;
  itemSequenceId: number = 0;
  contarctItemStd: any[] = [];
  ShowSubmitforRevalidationButton: boolean = false;
  ShowSubmitforApprovalButton: boolean = true;
  offerDeletedItem: any[] = [];
  deletedItem: boolean = true;
  OtherForm: FormGroup;
  @ViewChild('offerapprovemodel', { static: false }) offerapprovemodel: any;
  @ViewChild('offerrejectmodel', { static: false }) offerrejectmodel: any;
  ApproveForm: FormGroup;
  RejectForm: FormGroup;
  ImportItemsForm: FormGroup;
  ApproveReason: string;
  RejectReason: string;
  dateformate: string;
  contractInformationData: any = {};
  isSoldtoPartyCompleted: boolean = true;
  rcStatus: number = 0;

  approvalData: any[] = [];
  currentUser: any;
  moment = moment;
  @ViewChild("addRateContractPoup", { static: false }) addRateContractPoup;
  @ViewChild('itemDeleteallmodel', { static: false }) itemDeleteallmodel: any;
  deleteConfirModel = Object();
  @ViewChild('itemdeletemodel', { static: false }) itemdeletemodel: any;
  @ViewChild('ImportItems', { static: false }) ImportItems: any;
  @ViewChild('ItemStatusModal', { static: false }) ItemStatusModal: any;
  @ViewChild('ItemAmendmentModal', { static: false }) ItemAmendmentModal: any;
  @ViewChild('ProductSearchModel', { static: false }) ProductSearchModel: any;
  @ViewChild('ItemAmendmentCommentmodal', { static: false }) ItemAmendmentCommentmodal: any;
  isTypeEditable: boolean = true;
  isEditMode: boolean = false;
  selectedItemIndex: any;
  approvalStatus: any;
  rateContarctsFiles: any[] = [];
  rateContarctsAnnexureFiles: any[] = [];
  fileData: any;
  filesperitem: number;
  filesize: number;
  rateContarctsFilesIds: any[] = [];
  rateContarctsAnnexureFilesIds: any[] = [];
  rcType: number;
  rcPriceBasedOn: number;
  isShowItemMargin: boolean = false;
  isShowItemRMCGrossMargin: boolean = false;
  isShowOverallMargin: boolean = false;
  isShowOverallRGroupMargin: boolean = false;
  SOComment: string = "";
  userRole: string = "";
  isOrderIndirect: boolean = false;
  AccountsList: any[] = [];
  SelectedEndCustomerId: string = "";
  SelectedEndCustomer: string = "";
  OwnersList: any[] = [];
  CustomerData: any;
  CustomerDataFetched: boolean = false;
  requiredError: boolean = false;
  requiredErrorText: string = "";
  OwnerData: any;
  ImportItemFiles: any;
  ImportItemsfileUploaded: any;
  closeResult: string;
  importItemStatus: any[] = [];
  importitemjsonData: any[] = [];
  importitemheaderList: string[];
  worksheet: XLSX.WorkSheet;
  RCValidity: any;
  isAdmin: boolean = false;
  isOwner: boolean = false;
  isOMT: boolean = false;
  productmasterlist: any[] = [];
  articleno: string = "";
  modalRef: any;
  searchValue: string = '';
  AmendmentItems: any[] = [];
  itemforEdit: boolean = false;
  amendmentItemSequenceId: number = 0;
  amendmentItemIndex: number = 0;
  ItemAmendmentComment: String = "";
  AmendmentItemData: any[] = [];
  amendmentItemId: number = 0;
  inProgressAmendmentData: any;
  showAddItemAmendmentButton: boolean = false;
  RateContractFiles: any[] = [];
  ReasonforClone: string;
  verticals: any[] = [];
  segments: any[] = [];
  filteredSegments: any[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private offersService: OffersService,
    public formatter: NgbDateParserFormatter,
    private sharedService: SharedService,
    private stockorderService: StockorderService,
    private modalService: NgbModal,
    private rateContractsService: RatecontractsService,
    private datePipe: DatePipe,
    private authService: AuthService,
    private storageService: StorageService,
    private filesService: FilesService,
    private opportunitiesService: OpportunitiesService,
    private usersService: OmpusersService,
    private customerService: CustomerService,
    private productmasterService: ProductmasterService,
    private pagerService: PagerService,
    private ratecontractService: RatecontractService,
    private notificationService: NotificationService,
    private appService: AppService,
    private lookupService: LookupService,
  ) { }

  ngOnInit() {
    // this.isEditOrView = true;
    this.userRole = this.authService.getUserRoleCode();
    this.allFormLoad();
    this.loadPageMode();
    this.contractInformationData.status = 0;
  }

  private onLoad() {
    this.todayDate = moment().format('DD/MM/YYYY');
    this.todayMinDate = this.sharedService.convertDate(this.todayDate);
    this.futureDate = moment().add(30, 'd').format('DD/MM/YYYY');
    this.offervalidfromDate = this.sharedService.convertDate(this.todayDate);
    this.offervalidtoDate = this.sharedService.convertDate(this.futureDate);
    // this.offerValidMaxdate = this.offervalidtoDate;
    this.offerValidMindate = this.offervalidfromDate;
    this.contractInformationForm.controls['validfrom'].patchValue(this.todayDate);
    this.contractInformationForm.controls['validto'].patchValue(this.futureDate);
  }

  loadPageMode() {
    this.filesperitem = Config.getItemsFile.NumberofFiles + 1;
    this.filesize = Config.getItemsFile.filesize;
    this.currentUser = JSON.parse(this.storageService.getValue(StorageKey.currentUser))
    this.dateformate = this.authService.getDateFormat();
    let currentUrl = this.router.url;
    let id: string = '';

    this.isAdmin = this.userRole == 'Admin';
    this.isOMT = this.userRole == 'OM_Admin' || this.userRole == 'OMT';

    this.activatedRoute.params.subscribe(parms => {
      this.rateContractID = parms['id'];
    });
    this.getLookupDatas();

    if (currentUrl.includes('add') && !currentUrl.includes('refrencecontract')) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      // this.managePageSection(0, 1);
      this.onLoad();
      // this.onSoldtoPartySearch();

      this.rateContractID = 0;
      // this.getOpportunityData(id);
      // this.getcuttingcharges();
      this.getOwners();
    }
    else if (currentUrl.includes('edit')) {
      this.isAdd = false;
      this.isEdit = true;
      this.isView = false;
      this.getRateContractsDetail(this.rateContractID, false);
    }
    else if (currentUrl.includes('view')) {
      this.isAdd = false;
      this.isEdit = false;
      this.isView = true;
      // this.getcuttingcharges();
      this.getRateContractsDetail(this.rateContractID, false);
    }
    else if (currentUrl.includes('add') && currentUrl.includes('refrencecontract')) {
      this.isAdd = true;
      this.isEdit = false;
      this.isView = false;
      this.isRefrenceOffer = true;
      this.onLoad();
      // this.managePageSection(0, 1);
      // this.getcuttingcharges();
      this.getRateContractsDetail(this.rateContractID, true);
    }

    // this.getOwners();
  }

  get contractInformationFieldsForm() { return this.contractInformationForm.controls }
  get itemsForm() { return this.ItemsForm.controls }
  get itemForm() { return this.ItemForm.controls }
  get otherForm() { return this.OtherForm.controls }
  get approveForm() { return this.ApproveForm.controls }
  get rejectForm() { return this.RejectForm.controls }
  public get rateContractsStatus() { return RateContractsStatus };
  get importItemsForm() { return this.ImportItemsForm.controls }
  get itemAmendmentForm() { return this.ItemAmendmentForm.controls }

  onOffValidFromDateSelection(date) {
    this.offerValidMindate = date;
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();

    if (this.contractInformationFieldsForm.rcpricebasedon.value !== 30) { // if not ALP
      let maxdate = moment(offerValidFromdate).add(3, 'M').format('DD/MM/YYYY');
      this.offerValidMaxdate = this.sharedService.convertDate(maxdate);
    } else {
      this.offerValidMaxdate = null;
    }

    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateformate);
    this.contractInformationFieldsForm.validfrom.setValue(offerValidFromdate);

    if (new Date(this.contractInformationFieldsForm.validfrom.value.split('/').reverse().join('-')) > new Date(this.contractInformationFieldsForm.validto.value.split('/').reverse().join('-'))) {
      this.offervalidtoDate = this.sharedService.convertDate(offerValidFromdate);
      this.contractInformationFieldsForm.validto.setValue(offerValidFromdate);
    }
  }

  onOffValidToDateSelection(date) {
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateformate);
    this.contractInformationFieldsForm.validto.setValue(offerValidTodate);
  }

  GetEmployeeResponsibleList(soldtoparty: string) {
    this.ratecontractService.GetEmployeeResponsibleList(soldtoparty, this.contractInformationFieldsForm.rcfor.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.EmployeeResponsibleList = response.responsedata.data;
          if (this.isEdit || this.isView || this.isRefrenceOffer) {
            const employeeresponsible = this.contractInformationData.status < 20 && this.contractInformationData.employeeresponsible ? this.contractInformationData.employeeresponsible.toString() : this.contractInformationData.employeeresponsible + " - " + this.contractInformationData.employeeresponsiblename;
            this.contractInformationFieldsForm.employeeresponsible.setValue(employeeresponsible);
          }
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSoldtoPartySearch() {
    let element = (document.getElementById('ngSelectSoldtoParty') as HTMLInputElement);
    if (element.value && element.value.length >= 3 && this.contractInformationFieldsForm.rcfor.value) {
      this.getSoldtoPartyList(element.value);
    } else if (!this.contractInformationFieldsForm.rcfor.value) {
      this.notificationService.showInfo("Please select the Contract For.");
    }
  }

  getSoldtoPartyList(sapid: string) {
    this.customerService.getSoldtoPartyFilterSearchwithCustomerType(sapid, this.contractInformationFieldsForm.rcfor.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.soldtopartySearchList = response.responsedata.data;
          // const currentUrl = this.router.url;

          if ((this.isView || this.isEdit || this.isRefrenceOffer) && this.isSoldtoPartyCompleted) {
            this.onShipToPartySearch();
            this.isSoldtoPartyCompleted = false;

            if (!this.isOrderIndirect)
              this.getNaceCodebySAPId(this.contractInformationFieldsForm.soldtoparty.value);
          }
        } else
          this.soldtopartySearchList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onsoldtoSearchChange(event) {
    this.contractInformationFieldsForm.shiptoparty.setValue(null);
    this.contractInformationFieldsForm.employeeresponsible.setValue(null);
    this.shiptopartySearchList = [];
    if (event) {
      this.onShipToPartySearch();

      if (this.contractInformationData.status < 20)
        this.GetEmployeeResponsibleList(this.contractInformationFieldsForm.soldtoparty.value);

      this.getCustomerbySAPId(event.kunnr);
      this.getNaceCodebySAPId(event.kunnr);
    } else {
      this.resetNaceCode();
    }
  }
  onShipToPartySearch() {
    this.customerService.getShiptoPartyFilterSearchwithCustomerType(this.contractInformationFieldsForm.soldtoparty.value, this.contractInformationFieldsForm.rcfor.value).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.shiptopartySearchList = response.responsedata.data;

          if (this.isEdit || this.isView || this.isRefrenceOffer) {
            const shipToPARTY = this.contractInformationData.shiptoparty === null || this.contractInformationData.shiptoparty === undefined ? null : this.contractInformationData.shiptoparty.toString();
            this.contractInformationFieldsForm.shiptoparty.setValue(shipToPARTY);

            if (this.contractInformationData.status < 20)
              this.GetEmployeeResponsibleList(this.contractInformationFieldsForm.soldtoparty.value);
          }
        }
        else
          this.shiptopartySearchList = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  allFormLoad() {
    this.basicRateContractForm = this.formBuilder.group({
      rcnumber: [0],
      rcnumbertext: [''],
      ver: [''],
      actionrequired: [''],
      status: ['']
    });
    this.contractInformationForm = this.formBuilder.group({
      soldtoparty: [null, [Validators.required]],
      shiptoparty: [null, [Validators.required]],
      rcfor: [10, [Validators.required]],
      rctype: [null, [Validators.required]],
      validfrom: [''],
      validto: [''],
      employeeresponsible: [null],
      employeeresponsiblename: [null],
      terms: [''],
      annexure: [''],
      refrcid: [0],
      isrecommendforprocess: [0],
      ratecontractid: [0],
      dealercommission: [null],
      rcpricebasedon: [null, [Validators.required]],
      account: [null],
      nacecode: [null],
      nacelevel: [null],
      businessmodel: [null],
      owner: [null, [Validators.required]],
      reasonforclone: [null],
      vertical: [null],
      segment: [null]
    });
    this.OtherForm = this.formBuilder.group({
      approvalcomment: [""]
    })
    this.ItemsForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()]),
      freightcharges: ['']
    });
    this.RejectForm = this.formBuilder.group({
      rejectreason: [null, [Validators.required]]
    });

    this.ApproveForm = this.formBuilder.group({
      approvereason: [null, [Validators.required]]
    });
    this.ItemForm = this.formBuilder.group({
      searchValue: [''],
      articleno: ['', [Validators.required]],
      stdItemName: [''],
      articledesc: [null],
      itemtype: [''],
      uom: [''],
      stdItemPCLength: [''],
      enquiredquantity: [''],
      stdItemMOQ: [''],
      ItemMOQ: [''],
      price: [null],
      // stdItemCatalog: [''],
      quantity: [null, [Validators.required]],
      unitprice: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      customerpartno: [''],
      itemtotal: [''],
      seqno: [''],
      unique_doc_number: ['', [Validators.required]],
      validfrom: [null, [Validators.required]],
      validto: [null, [Validators.required]]
    });

    this.ItemAmendmentForm = this.formBuilder.group({
      articleno: [null],
      // articledesc: [null],
      quantity: [null],
      quantityused: [null],
      quantityremaining: [null],
      amendmentquantity: [null, [Validators.required]],
      isdelete: [0]
    });
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      articleno: '',
      stdItemName: '',
      itemtype: '',
      uom: '',
      stdItemPCLength: '',
      stdItemMOQ: '',
      ItemMOQ: '',
      price: '',
      lengthandfactor: '',
      quantity: '',
      unitprice: '',
      enquiredquantity: '',
      stdItemCatalog: '',
      itemsDocuments: '',
      seqno: '',
      unique_doc_number: '',
      customerpartno: '',
      discount: '',
      validfrom: "",
      validto: ""
    });
  }

  oncancelClick() {
    this.redirecttoList();
  }

  redirecttoList() {
    this.router.navigate(['/ratecontracts/list']);
  }

  onEditClick() {
    let id: string = '';
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/ratecontracts/edit/' + id]);
  }

  openLg(content1, index) {
    this.rcType = this.contractInformationForm.controls['rctype'].value;
    this.rcPriceBasedOn = this.contractInformationFieldsForm.rcpricebasedon.value;
    if ((this.rcType === 0 || this.rcType === undefined || this.rcType === null) || (!this.rcPriceBasedOn)) {
      this.notificationService.showInfo('Choose the types and Price based on value.');
      return;
    }

    this.isEditMode = false;
    this.selectedItemIndex = index;
    this.itemSequenceId = 0;
    this.ItemForm.reset();

    this.itemForm.validfrom.setValue(this.contractInformationFieldsForm.validfrom.value);
    this.itemForm.validto.setValue(this.contractInformationFieldsForm.validto.value);

    this.RCValidity = {
      validfrom: this.contractInformationFieldsForm.validfrom.value,
      validto: this.contractInformationFieldsForm.validto.value
    }

    this.modalService.open(content1, { size: 'lg' }).result.then((result) => {
    }, (reason) => {
      // this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  async onItemSaveClick() {
    let itemModel = {
      id: this.isAdd || !this.itemid ? 0 : this.itemid,
      itemSeqId: this.itemSequenceId > 0 ? this.itemSequenceId : this.getSeqID(this.contarctItemStd),
      seqno: this.itemForm.seqno.value > 0 ? this.itemForm.seqno.value : this.getSeqNo(),
      articleno: this.itemForm.articleno.value ? this.itemForm.articleno.value : '',
      articledesc: this.itemForm.articledesc.value ? this.itemForm.articledesc.value : '',
      itemtype: this.itemForm.itemtype.value.toUpperCase() == 'MFG' ? 'STD' : this.itemForm.itemtype.value,
      uom: this.itemForm.uom.value,
      isdelete: 0,
      quantity: Number(this.itemForm.quantity.value),
      discount: Number(this.itemForm.discount.value),
      price: Number(this.itemForm.price.value),
      cost: 0,
      customerpartno: this.itemForm.customerpartno.value ? this.itemForm.customerpartno.value : '',
      unitprice: Number(this.itemForm.unitprice.value),
      unique_doc_number: this.itemForm.unique_doc_number.value,
      validfrom: this.itemForm.validfrom.value.split("/").reverse().join("/"),
      validto: this.itemForm.validto.value.split("/").reverse().join("/")
    };

    this.items = this.ItemsForm.get('items') as FormArray;
    this.items.push(this.createItem());

    this.contarctItemStd = this.contarctItemStd.filter(x => x.itemSeqId != itemModel.itemSeqId);

    if (this.itemSequenceId > 0)
      this.contarctItemStd.splice(this.selectedItemIndex, 0, itemModel);
    else
      this.contarctItemStd.push(itemModel);

    this.isEdit = false;
    this.selectedItemIndex = null;

    if (this.contarctItemStd.length > 0) {
      this.submitted = false;
      this.modalService.dismissAll("");
      this.isTypeEditable = false;
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
    let _Arr = this.contarctItemStd.filter(x => x.isdelete == 0).concat(this.offerDeletedItem);
    let maxseq = 0;
    for (let i = 0; i < _Arr.length; i++) {
      if (Number(_Arr[i].seqno) > Number(maxseq)) {
        maxseq = Number(_Arr[i].seqno);
      }
    }
    return (Number(maxseq) / 10 + 1) * 10;
  }

  filterDatatoDeletewithOrder(data: any) {
    return data.filter(x => x.isdelete == 0).sort((a, b) => Number(a.seqno) - Number(b.seqno));
  }

  onSaveasDraftClick() {
    this.submitted = true;
    this.UpdateFieldValidators(false);

    if (this.contractInformationForm.invalid || this.OtherForm.invalid)
      return;

    this.onSubmit();
  }

  private UpdateFieldValidators(issubmit: boolean) {
    if (issubmit) {
      this.contractInformationFieldsForm.terms.setValidators(Validators.required);
      this.contractInformationFieldsForm.rcpricebasedon.setValidators(Validators.required);
      this.otherForm.approvalcomment.setValidators(Validators.required);
      this.contractInformationFieldsForm.employeeresponsible.setValidators(Validators.required);
      this.contractInformationFieldsForm.vertical.setValidators(Validators.required);
      this.contractInformationFieldsForm.segment.setValidators(Validators.required);
    } else {
      this.contractInformationFieldsForm.terms.clearValidators();
      this.contractInformationFieldsForm.rcpricebasedon.clearValidators();
      this.otherForm.approvalcomment.clearValidators();
      this.contractInformationFieldsForm.employeeresponsible.clearValidators();
      this.contractInformationFieldsForm.vertical.clearValidators();
      this.contractInformationFieldsForm.segment.clearValidators();
    }

    this.contractInformationFieldsForm.terms.updateValueAndValidity();
    this.contractInformationFieldsForm.rcpricebasedon.updateValueAndValidity();
    this.otherForm.approvalcomment.updateValueAndValidity();
    this.contractInformationFieldsForm.employeeresponsible.updateValueAndValidity();
    this.contractInformationFieldsForm.vertical.updateValueAndValidity();
    this.contractInformationFieldsForm.segment.updateValueAndValidity();
  }

  async onSubmit() {

    if (this.isRefrenceOffer) {
      this.contarctItemStd.forEach(element => {
        element.id = 0;
      });
    }

    let basicRateContractForm = this.basicRateContractForm.value;
    delete basicRateContractForm['actionrequired'];
    delete basicRateContractForm['status'];
    let contractInformationForm = this.contractInformationForm.getRawValue();
    contractInformationForm.validfrom = contractInformationForm.validfrom.split('/').reverse().join('-');
    contractInformationForm.validto = contractInformationForm.validto.split('/').reverse().join('-');
    this.contarctItemStd = this.contarctItemStd.filter(ele => ele.isDeleted !== 1 || ele.id !== 0);

    this.EmployeeResponsibleList.forEach(element => {
      if (this.contractInformationFieldsForm.employeeresponsible.value == element.Empno)
        contractInformationForm.employeeresponsiblename = element.Empname;
    });

    const formObj = Object.assign(basicRateContractForm, contractInformationForm, { rcitems: this.contarctItemStd },
      { approvalcomment: this.otherForm.approvalcomment.value }, { rcfiles: [] });

    if (this.RateContractFiles.length > 0)
      await this.OfferFileUpload(formObj.rcfiles);

    this.rateContractsService.saveRcDetails(formObj).subscribe((response: any) => {
      if (response.responsedata && response.responsedata.statusCode == 200)
        this.redirecttoList();
      else if (response.responsedata && response.responsedata.statusCode == 400)
        this.notificationService.showError(response.responsedata.message);
    }, error => {
      this.notificationService.showError(error.error.error.message);
    })
  }

  async OfferFileUpload(rcfiles: any) {
    var type: string = '';

    if (this.isEditOrView) {
      var oldfiles = this.RateContractFiles.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        rcfiles.push({ id: element });
      });
      this.RateContractFiles = this.RateContractFiles.filter(x => !x.id);
    } else if (this.isRefrenceOffer) {
      var oldfiles = this.RateContractFiles.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        rcfiles.push({ id: element });
      });

      this.RateContractFiles = this.RateContractFiles.filter(x => !x.id);
    }

    if (this.RateContractFiles && this.RateContractFiles.length > 0) {
      type = 'ratecontracts/rcdoc';
      await this.offersService.upload(this.RateContractFiles, type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              rcfiles.push({ id: element.id });
            });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  onDeletedItemView(item, index) {
  }

  onOfferApproveClick() {
    this.submitted = false;
    this.approveForm.approvereason.setValue(null);
    this.ApproveReason = null;

    this.modalService.open(this.offerapprovemodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onOfferRejectClick() {
    this.submitted = false;
    this.rejectForm.rejectreason.setValue(null);
    this.RejectReason = null;

    this.modalService.open(this.offerrejectmodel, { centered: true, size: 'md', backdrop: 'static' });
  }
  saveApprovalData(data) {
    this.rateContractsService.saveApprovalData(data).subscribe((response: any) => {
      this.modalService.dismissAll();
      this.getApprovalData();
      this.redirecttoList();
    }, error => {
      this.notificationService.showError(error.error.error.message);
    });
  }

  onApprovedRejectedClick(status, event) {
    const model = {
      rcid: this.rateContractID,
      status: status,
      reason: event.value
    }
    this.saveApprovalData(model);
  }

  getRateContractsDetail(id: number, isclone: boolean) {
    this.rateContractsService.getRcDetails(id, isclone).subscribe((response: any) => {
      if (response.responsedata) {
        this.contractInformationData = response.responsedata.data.rcheader;
        this.RateContractFiles = response.responsedata.data.rcdocs;

        if (isclone) {
          this.contractInformationData.status = 0;
        }

        this.rcStatus = this.contractInformationData.status;

        this.getCustomerbySAPId(this.contractInformationData.soldtoparty);

        this.basicRateContractForm.patchValue({
          rcnumber: this.contractInformationData.rcnumber,
          status: this.contractInformationData.status_text,
          actionrequired: this.contractInformationData.actionrequired,
          rcnumbertext: this.contractInformationData.rcnumbertext,
          ver: this.contractInformationData.ver
        });

        this.contarctItemStd = response.responsedata.data.rcitems;

        this.isShowOverallRGroupMargin = response.responsedata.data.uiinfo.ShowTotalRMCGrossMargin;
        this.isShowOverallMargin = response.responsedata.data.uiinfo.ShowTotalGrossMargin;

        this.isShowItemMargin = response.responsedata.data.uiinfo.ShowItemMargin;
        this.isShowItemRMCGrossMargin = response.responsedata.data.uiinfo.ShowItemRMCGrossMargin;

        this.isTypeEditable = this.contarctItemStd.length > 0 ? false : true;
        this.offerDeletedItem = response.responsedata.data.rcdeleteditems;
        this.contarctItemStd = this.contarctItemStd.concat(this.offerDeletedItem);
        this.offervalidfromDate = this.sharedService.convertDate(this.datePipe.transform(this.contractInformationData.validfrom, this.dateformate));
        this.offervalidtoDate = this.sharedService.convertDate(this.datePipe.transform(this.contractInformationData.validto, this.dateformate));
        this.contractInformationForm.patchValue({
          soldtoparty: this.contractInformationData.soldtoparty.toString(),
          shiptoparty: this.contractInformationData.shiptoparty,
          rctype: this.contractInformationData.rctype > 0 ? this.contractInformationData.rctype : null,
          annexure: this.contractInformationData.annexure,
          ratecontractid: isclone ? 0 : this.contractInformationData.id,
          rcfor: this.contractInformationData.rcfor > 0 ? this.contractInformationData.rcfor : null,
          rcpricebasedon: this.contractInformationData.rcpricebasedon > 0 ? this.contractInformationData.rcpricebasedon : null,
          employeeresponsible: this.contractInformationData.status < 20 && this.contractInformationData.employeeresponsible ? this.contractInformationData.employeeresponsible : this.contractInformationData.employeeresponsible + " - " + this.contractInformationData.employeeresponsiblename,
          employeeresponsiblename: this.contractInformationData.employeeresponsiblename ? this.contractInformationData.employeeresponsiblename : null,
          terms: this.contractInformationData.terms,
          validfrom: moment(this.contractInformationData.validfrom).format('DD/MM/YYYY'),
          validto: moment(this.contractInformationData.validto).format('DD/MM/YYYY'),
          refrcid: isclone ? id : 0,
          owner: +this.contractInformationData.owner,
          account: this.contractInformationData.account ? this.contractInformationData.account : null,
          vertical: this.contractInformationData.vertical ? this.contractInformationData.vertical : null,
          segment: this.contractInformationData.segment ? this.contractInformationData.segment : null,
        });

        if (this.contractInformationData.vertical && !this.filteredSegments.length)
          this.onVerticalChange(this.contractInformationFieldsForm.vertical.value);

        if (isclone) {
          this.offervalidfromDate = this.sharedService.convertDate(this.todayDate);
          this.contractInformationFieldsForm.validfrom.setValue(this.todayDate);

          if (this.contractInformationData.rcpricebasedon && this.contractInformationData.rcpricebasedon != 40) {
            this.setContractValidMaxDate();

            this.offervalidtoDate = this.sharedService.convertDate(this.futureDate);
            this.contractInformationFieldsForm.validto.setValue(this.futureDate);
          } else {
            this.offerValidMaxdate = null;
            this.offervalidtoDate = this.sharedService.convertDate(this.futureDate);
            this.contractInformationFieldsForm.validto.setValue(this.futureDate);
          }

          this.offerValidMindate = this.offervalidfromDate;

          this.contarctItemStd.forEach(element => {
            element.validfrom = this.todayDate.split("/").reverse().join("/");
            element.validto = this.futureDate.split("/").reverse().join("/");
          });

        } else {
          this.offervalidfromDate = this.sharedService.convertDate(this.changeDateFormat(this.contractInformationData.validfrom));
          this.contractInformationFieldsForm.validfrom.setValue(this.changeDateFormat(this.contractInformationData.validfrom));
          this.offervalidtoDate = this.sharedService.convertDate(this.changeDateFormat(this.contractInformationData.validto));
          this.contractInformationFieldsForm.validto.setValue(this.changeDateFormat(this.contractInformationData.validto));

          let _futureDate = moment(this.contractInformationData.validfrom).add(this.authService.OfferValidupto(), 'd').format('DD/MM/YYYY');
          this.offerValidMaxdate = this.sharedService.convertDate(_futureDate);
        }

        if (this.contractInformationData.rcfor == 20) {
          this.isOrderIndirect = true;
          let dealercommission = this.contractInformationData.dealercommission ? (this.contractInformationData.dealercommission * 100).toFixed(2) : 0;
          this.contractInformationFieldsForm.dealercommission.setValue(dealercommission);
        }

        if (this.isRefrenceOffer) {
          this.rcStatus = 0;
          // this.offerdata.Status = 0;
          // this.offerdata.IsActive = 1;

          this.contractInformationFieldsForm.reasonforclone.setValue(null);
          this.ReasonforClone = '';
          this.contractInformationFieldsForm.reasonforclone.setValidators(Validators.required);
          this.contractInformationFieldsForm.reasonforclone.updateValueAndValidity();
        } else if (this.contractInformationData.refrcid) {
          this.contractInformationFieldsForm.reasonforclone.setValue(this.contractInformationData.reasonforclone);
          this.ReasonforClone = this.contractInformationData.reasonforclone;
        }

        let i = 0;
        this.contarctItemStd.map((ele) => {
          i += 1;
          ele.itemSeqId = i;
          ele.validfrom = moment(ele.validfrom).format('YYYY-MM-DD');
          ele.validto = moment(ele.validto).format('YYYY-MM-DD');
          return ele;
        });
        this.rcType = this.contractInformationForm.controls['rctype'].value;
        this.getSoldtoPartyList(this.contractInformationFieldsForm.soldtoparty.value);
        if(this.contractInformationData.account!="")
          this.getNaceCodebySFDCId(this.contractInformationData.account.trim());
        this.getApprovalData();
        this.GetAttchmentData();
        this.getOwners();

        if (this.contractInformationData.status == 80)
          this.SOComment = this.contractInformationData.reviewcomment;

        this.isEditOrView = isclone ? false : true;
        this.isOwner = this.currentUser.id == +this.contractInformationData.owner;

        if (this.contractInformationData.status >= 80) {
          this.getRCItems();
          this.getAmendmentItem();
        }
      }
    },
      error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getApprovalData() {
    this.rateContractsService.getApprovalDetails(this.rateContractID).subscribe((response: any) => {
      if (response.responsedata.data) {
        this.approvalData = response.responsedata.data;
        if (this.approvalData && this.approvalData.length > 0) {
          const data = this.approvalData.find(ele => ele.userid === this.currentUser.id);
          this.approvalStatus = data ? data.status : null;
          this.setApprovaldatastatus(this.approvalData);
        }
      }
    }, error => {
      this.notificationService.showError(error.error.error.message);
    });
  }

  submitForApprovalRateContract() {
    this.submitted = true;
    this.UpdateFieldValidators(true);

    if (this.contractInformationForm.invalid || this.OtherForm.invalid)
      return;

    if (!this.CustomerData) {
      this.notificationService.showError('Customer is not available in SFDC.');
      return;
    }

    const data = this.contarctItemStd.filter((ele) => ele.isdelete === 0);
    if (data.length === 0) {
      this.notificationService.showInfo('Add at least one item');
      return;
    }

    if ((this.contractInformationFieldsForm.rcpricebasedon.value === 10 || this.contractInformationFieldsForm.rcpricebasedon.value === 40) && !this.RateContractFiles.length) {
      this.notificationService.showError('Attachment required.');
      return;
    }

    this.contractInformationForm.controls['isrecommendforprocess'].patchValue(1);
    this.onSubmit();
  }

  itemEdit(content1, index) {
    const data = this.filterDatatoDeletewithOrder(this.contarctItemStd)[index];
    this.itemForm.articleno.patchValue(data.articleno);
    this.itemForm.articledesc.patchValue(data.articledesc);
    this.itemForm.seqno.patchValue(data.seqno);
    this.itemForm.customerpartno.patchValue(data.customerpartno);
    this.itemForm.price.patchValue(data.price);
    this.itemForm.discount.patchValue(data.discount);
    this.itemForm.unique_doc_number.patchValue(data.unique_doc_number);
    this.itemForm.quantity.patchValue(data.quantity);
    this.itemForm.unitprice.patchValue(data.unitprice);
    this.itemForm.validfrom.patchValue(this.changeDateFormat(data.validfrom));
    this.itemForm.validto.patchValue(this.changeDateFormat(data.validto));
    this.itemForm.itemtype.patchValue(data.itemtype.toUpperCase() == 'STD' ? 'MFG' : data.itemtype);
    this.itemForm.uom.patchValue(data.uom);
    this.isEditMode = true;
    this.selectedItemIndex = index;
    this.itemSequenceId = data.itemSeqId;
    this.itemid = data.id;

    this.RCValidity = {
      validfrom: this.contractInformationFieldsForm.validfrom.value,
      validto: this.contractInformationFieldsForm.validto.value
    }

    const modalRef = this.modalService.open(content1, { size: 'lg' });
  }

  OpenDeleteAllPopup() {
    this.modalService.open(this.itemDeleteallmodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onDeleteAllClick() {
    this.contarctItemStd.map(ele => {
      ele.isdelete = 1;
      return ele;
    });
    this.isTypeEditable = true;
    this.modalService.dismissAll('delete');
  }

  OpenItemDeletePopup(index: number, id: number, articleno: string, deletefrom: number) {
    this.deleteConfirModel.index = index;
    this.deleteConfirModel.id = id;
    this.deleteConfirModel.articleno = articleno;
    this.deleteConfirModel.deletefrom = deletefrom;
    this.modalService.open(this.itemdeletemodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onItemDelete() {
    if (this.deleteConfirModel.deletefrom == 10) {
      const data = this.contarctItemStd[this.deleteConfirModel.index];
      this.contarctItemStd[this.deleteConfirModel.index].isdelete = 1;
      this.isTypeEditable = this.contarctItemStd.length > 0 ? false : true;
    } else if (this.deleteConfirModel.deletefrom == 20) {
      let data = this.filtredDeletedData(this.AmendmentItems)[this.deleteConfirModel.index]

      if (data.id > 0)
        data.isdelete = 1;
      else
        this.AmendmentItems = this.AmendmentItems.filter(item => item != data);
    }

    this.modalService.dismissAll('delete');
  }

  filtredDeletedItemData() {
    return this.contarctItemStd.filter((ele) => ele.isdelete == 1).sort((a, b) => Number(a.seqno) - Number(b.seqno));
  }

  showDeleteAllBtn() {
    const data = this.contarctItemStd.filter((ele) => ele.isdelete !== 1).sort((a, b) => Number(a.seqno) - Number(b.seqno));
    return data === undefined || data.length === 0 ? false : true;
  }

  isDeletedDataVisible() {
    const data = this.contarctItemStd.filter((ele) => ele.isdelete === 1).sort((a, b) => Number(a.seqno) - Number(b.seqno));
    return data === undefined || data.length === 0 ? false : true;
  }

  filtredDeletedData(data: any) {
    if (data)
      return data.filter((ele) => ele.isdelete == 0);
  }

  isShowSection(section: string) {
    switch (section) {
      case 'headersection':
        return true;
      case 'approvedandrejectedby':
        return this.rcStatus >= 20 ? true : false;
      case 'attachments':
        return this.rcStatus >= 50 ? true : false;
      case 'initiateso':
        return this.rcStatus >= 70 ? true : false;
      case 'amendment':
        return this.rcStatus >= 80 ? true : false;
    }
  }

  isEditSection(section: string) {
    if (this.router.url.includes('view')) {
      return false;
    }
    switch (section) {
      case 'headersection':
        return this.rcStatus < 20 ? true : false;
      // return (this.rcStatus > 20 || !this.router.url.includes('add')) || this.router.url.includes('view') ? false : true;
      case 'approvedandrejectedby':
        return this.rcStatus >= 20 && this.rcStatus <= 50 ? true : false;
      case 'attachments':
        return this.rcStatus >= 50 && this.rcStatus < 70 && (this.isAdmin || this.isOwner || this.isOMT) ? true : false;
      case 'initiateso':
        return this.rcStatus < 80 && this.isOMT ? true : false;
      case 'amendment':
        return this.rcStatus >= 80 && this.contractInformationData.isactive && this.rcType == 20 && (this.isAdmin || this.isOMT || this.isOwner) ? true : false;
    }
  }

  GetAttchmentData() {
    if (this.rcStatus >= 50) {
      this.rateContractsService.getAttchmentData(this.rateContractID).subscribe(
        (response: any) => {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.rateContarctsFiles = response.responsedata.data.filter(x => x.doctype == 10);
            this.rateContarctsAnnexureFiles = response.responsedata.data.filter(x => x.doctype == 20);
          } else if (response.responsedata && response.responsedata.statusCode == 400) {
            this.notificationService.showError(response.responsedata.message);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    }
  }

  async rateContarctFileUpload() {
    var type: string = '';

    this.rateContarctsFiles.map(ele => {
      if (ele.id) {
        this.rateContarctsFilesIds.push({ id: ele.id });
      }
    });
    const rateContarctsFiles = this.rateContarctsFiles.filter(x => !x.id);
    if (rateContarctsFiles && rateContarctsFiles.length > 0) {
      type = 'ratecontracts/agreement';
      await this.offersService.upload(rateContarctsFiles, type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              this.rateContarctsFilesIds.push({ id: element.id });
            });
            const uploadObj = {
              ratecontractid: this.rateContractID,
              fileIds: this.rateContarctsFilesIds,
              doctype: 10
            };
            this.saveDocuments(uploadObj, false, false);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  async rateContarctAnnexureFileUpload(submit: boolean) {
    var type: string = '';

    this.rateContarctsAnnexureFiles.map(ele => {
      if (ele.id) {
        this.rateContarctsAnnexureFilesIds.push({ id: ele.id });
      }
    });
    const rateContarctsAnnexureFiles = this.rateContarctsAnnexureFiles.filter(x => !x.id);
    if (rateContarctsAnnexureFiles && rateContarctsAnnexureFiles.length > 0) {
      type = 'ratecontracts/annexure';
      await this.offersService.upload(rateContarctsAnnexureFiles, type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              this.rateContarctsAnnexureFilesIds.push({ id: element.id });
            });
            const uploadObj = {
              ratecontractid: this.rateContractID,
              fileIds: this.rateContarctsAnnexureFilesIds,
              doctype: 20
            };
            this.saveDocuments(uploadObj, true, submit);
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    } else if (submit) {
      this.onDocumentSubmit();
    } else {
      this.redirecttoList();
    }
  }

  saveDocuments(data: any, redirect: boolean, submit: boolean) {
    this.rateContractsService.saveAttchementData(data).subscribe(
      (response: any) => {
        if (response.data.statusCode == 200 && redirect && !submit) {
          this.redirecttoList();
        } else if (response.data.statusCode == 200 && redirect && submit) {
          this.onDocumentSubmit();
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
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

  RateContractfileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateOfferFiles(event.target.files, 10)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.rateContarctsFiles.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
    event.target.value = "";
  }

  RateContractAnnexurefileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateOfferFiles(event.target.files, 20)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.rateContarctsAnnexureFiles.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
    event.target.value = "";
  }

  ValidateOfferFiles(files: any, from: number) {
    if (files.length > this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }

    if (from == 0) {
      if (this.RateContractFiles.length == this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }

      if (this.RateContractFiles.length + files.length > this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }
    } else if (from == 10) {
      if (this.rateContarctsFiles.length == this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }

      if (this.rateContarctsFiles.length + files.length > this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }
    } else if (from == 20) {
      if (this.rateContarctsAnnexureFiles.length == this.filesperitem) {
        this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
        return false;
      }

      if (this.rateContarctsAnnexureFiles.length + files.length > this.filesperitem) {
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

  async FileUpload(submit: boolean) {
    if (!this.rateContarctsFiles.length || !this.rateContarctsAnnexureFiles.length) {
      this.requiredError = true;
      this.requiredErrorText = "required";
      return false;
    }

    if (this.rateContarctsFiles.length)
      await this.rateContarctFileUpload();
    if (this.rateContarctsAnnexureFiles.length)
      await this.rateContarctAnnexureFileUpload(submit);
  }

  onDocumentSubmit() {
    this.rateContractsService.documentSubmit(this.rateContractID).subscribe(
      (response: any) => {
        if (response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.redirecttoList();
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onActiveRC() {
    this.submitted = true;
    if (!this.SOComment || !this.SOComment.length) {
      return;
    }

    let data = {
      rcId: this.rateContractID,
      comment: this.SOComment
    }
    this.rateContractsService.activeRC(data).subscribe(
      (response: any) => {
        if (response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.redirecttoList();
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  OfferFileRemove(index: number, from: number) {
    if (from == 0) {
      this.RateContractFiles.splice(index, 1);
    } else if (from == 10) {
      const data = this.rateContarctsFiles[index];
      this.rateContarctsFiles.splice(index, 1);
      if (data.id && this.rateContarctsFilesIds.length !== 0) {
        this.rateContarctsFilesIds = this.rateContarctsFilesIds.filter((ele) => ele.id !== data.id);
      }
    } else if (from == 20) {
      const data = this.rateContarctsAnnexureFiles[index];
      this.rateContarctsAnnexureFiles.splice(index, 1);
      if (data.id && this.rateContarctsAnnexureFilesIds.length !== 0) {
        this.rateContarctsAnnexureFilesIds = this.rateContarctsAnnexureFilesIds.filter((ele) => ele.id !== data.id);
      }
    }
  }

  onContractforChange(event: any) {
    if (event && event.code == 20) {
      this.isOrderIndirect = true;
      this.contractInformationFieldsForm.dealercommission.setValidators(Validators.required);
      this.contractInformationFieldsForm.account.setValidators(Validators.required);
    } else {
      this.isOrderIndirect = false;
      this.contractInformationFieldsForm.dealercommission.clearValidators();
      this.contractInformationFieldsForm.account.clearValidators();
    }
    this.contractInformationFieldsForm.dealercommission.updateValueAndValidity();
    this.contractInformationFieldsForm.account.updateValueAndValidity();


    this.contractInformationFieldsForm.soldtoparty.setValue(null);
    this.contractInformationFieldsForm.shiptoparty.setValue(null);
    this.soldtopartySearchList = [];
    this.shiptopartySearchList = [];
    this.resetNaceCode();
  }

  GetAccountListDropdown() {
    let element = (document.getElementById('ngSelectAccountId') as HTMLInputElement);
    if (element.value && element.value.length >= 3) {
      this.GetAccountsList(element.value);
    }
  }

  GetAccountsList(account: string) {
    if (this.CustomerData && this.CustomerData.sfdcid) {
      this.stockorderService.GetAccountsList(account, this.OwnerData ? this.OwnerData.userid : "", this.CustomerData ? this.CustomerData.sfdcid : "").subscribe(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200)
            this.AccountsList = response.responsedata.data;
          else
            this.AccountsList = [];
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    }
  }

  onRefreshAccountPartners() {
    this.stockorderService.RefreshAccountsList({ dealerId: this.CustomerData ? this.CustomerData.sfdcid : "" }).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onCustomerChange(event: any) {
    if (event) {
      if (event.sfdcid && event.nacecode) {
        this.getNaceCodebySFDCIdandNacecode(event.sfdcid.trim(), event.nacecode.trim());
      } else {
        this.resetNaceCode();
        this.notificationService.showInfo("End customer nacecode cannot able to fetch because SAP Id is not available.");
      }

      this.SelectedEndCustomerId = event.sfdcid;
      this.SelectedEndCustomer = event.customername;
    } else {
      this.SelectedEndCustomerId = "";
      this.SelectedEndCustomer = "";
      this.resetNaceCode();
    }
  }

  getNaceCodebySFDCIdandNacecode(sfdcid: string, nacecode: string) {
    this.customerService.getNaceCodebySFDCIdandNacecode(sfdcid, nacecode).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data && response.responsedata.data.length) {
            this.contractInformationFieldsForm.nacecode.setValue(response.responsedata.data[0].code.trim()+" - "+response.responsedata.data[0].description.trim() );
            this.contractInformationFieldsForm.nacelevel.setValue(response.responsedata.data[0].level);
            this.contractInformationFieldsForm.businessmodel.setValue(response.responsedata.data[0].businessmodel);
          } else {
            this.notificationService.showInfo("Nacecode detail is not available.");
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getNaceCodebySFDCId(sfdcid: string) {
    this.customerService.getNaceCodebySFDCId(sfdcid).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data && response.responsedata.data.length) {
            this.contractInformationFieldsForm.nacecode.setValue(response.responsedata.data[0].code.trim()+" - "+response.responsedata.data[0].description.trim());
            this.contractInformationFieldsForm.nacelevel.setValue(response.responsedata.data[0].level);
            this.contractInformationFieldsForm.businessmodel.setValue(response.responsedata.data[0].businessmodel);
          } else {
            this.notificationService.showInfo("Nacecode detail is not available.");
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetNacecodeDetail(nacecode: string) {
    this.opportunitiesService.getNaceDetail(nacecode).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.contractInformationFieldsForm.nacecode.setValue(response.responsedata.data.code.trim());
          this.contractInformationFieldsForm.nacelevel.setValue(response.responsedata.data.level);
          this.contractInformationFieldsForm.businessmodel.setValue(response.responsedata.data.businessmodel);
        } else {
          this.notificationService.showInfo("Nacecode detail is not available.");
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  resetNaceCode() {
    this.contractInformationFieldsForm.nacecode.setValue(null);
    this.contractInformationFieldsForm.nacelevel.setValue(null);
    this.contractInformationFieldsForm.businessmodel.setValue(null);
  }

  getOwners() {
    this.usersService.getSalesTeam().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.OwnersList = response.responsedata.data;

          if (this.isAdd && !this.isRefrenceOffer) {
            let _userExist = this.OwnersList.find(u => u.id == this.currentUser.id);
            if (_userExist) {
              this.OwnerData = _userExist;
              this.contractInformationFieldsForm.owner.disable();
              this.contractInformationFieldsForm.owner.setValue(+_userExist.id);
            }
          } else {
            let _userExist = this.OwnersList.find(u => u.id == +this.contractInformationData.owner);
            this.OwnerData = _userExist;
            if (this.currentUser.id === +this.contractInformationData.owner)
              this.contractInformationFieldsForm.owner.disable();

            if (this.isOrderIndirect && !this.AccountsList.length)
              this.GetAccountsList(this.contractInformationData.account)
          }

        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onOwnerChange(owner: any) {
    if (owner)
      this.OwnerData = owner;
  }

  getNaceCodebySAPId(sapid: string) {
    this.customerService.getNacecodebySapId(sapid).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data.length) {
          let _nacedata = response.responsedata.data[0];
          if (_nacedata) {
            this.contractInformationFieldsForm.nacecode.setValue(_nacedata.code.trim() + " - " + _nacedata.description);
            this.contractInformationFieldsForm.nacelevel.setValue(_nacedata.level);
            this.contractInformationFieldsForm.businessmodel.setValue(_nacedata.businessmodel);
          }
        } else {
          this.notificationService.showInfo("Nacecode detail is not available.");
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getCustomerbySAPId(sapid: string) {
    this.customerService.getCustomerbySapId(sapid).subscribe(
      response => {
        this.CustomerDataFetched = true;
        if (response.responsedata && response.responsedata.statusCode == 200 && response.responsedata.data.length) {
          this.CustomerData = response.responsedata.data[0];

          if (this.isAdd)
            this.contractInformationFieldsForm.businessmodel.setValue(this.CustomerData.businessmodel);

          if (!this.isAdd && this.isOrderIndirect && !this.AccountsList.length)
            this.GetAccountsList(this.contractInformationData.account)
        } else {
          this.CustomerData = null;
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

  openImportItemsModal() {
    this.rcType = this.contractInformationForm.controls['rctype'].value;
    this.rcPriceBasedOn = this.contractInformationFieldsForm.rcpricebasedon.value;
    if ((this.rcType === 0 || this.rcType === undefined || this.rcType === null) || (!this.rcPriceBasedOn)) {
      this.notificationService.showInfo('Choose the types and Price based on value.');
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

  getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  downloadImportItemSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.rcimportitem;
    FileSaver.saveAs(url, SampleEnum.rcimportitem);
  }

  removeImportItemFile() {
    this.ImportItemFiles = null;
    this.ImportItemsfileUploaded = null;
  }

  private readExcel() {
    let readFile = new FileReader();
    let storeData;

    readFile.onload = (e) => {
      storeData = readFile.result;
      var data = new Uint8Array(storeData);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      this.worksheet = workbook.Sheets[first_sheet_name];
    }
    readFile.readAsArrayBuffer(this.ImportItemsfileUploaded);
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
      this.readExcel();
    }
  }

  async onImportItemSave() {
    if (this.ValidateImportItemFile()) {
      await this.ValidateImportItemFileData();
      this.importItemStatus = this.importitemjsonData;

      this.modalService.open(this.ItemStatusModal, { size: 'lg' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  ValidateImportItemFile() {
    if (this.ImportItemFiles) {
      this.importitemjsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false, defval: null });
      let data = []
      for (let key in this.importitemjsonData[0]) {
        if (data.length != Config.masterfilesheaders.rcimportitem.length)
          data.push(key.trim());
      }
      this.importitemheaderList = data;

      if (JSON.stringify(this.importitemheaderList).toUpperCase() != JSON.stringify(Config.masterfilesheaders.rcimportitem).toUpperCase()) {
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
    var importitemheader = Config.masterfilesheaders.rcimportitem;
    //sort array of object by article no
    this.importitemjsonData.sort(function (a, b) {
      if (a[importitemheader[1]])
        return a[importitemheader[1]].localeCompare(b[importitemheader[1]]);
    })

    //grouping of quantity
    for (let i = 0; i < this.importitemjsonData.length; i++) {
      if (i + 1 < this.importitemjsonData.length) {
        if (this.importitemjsonData[i][importitemheader[1]] == this.importitemjsonData[i + 1][importitemheader[1]]) {
          this.importitemjsonData[i][importitemheader[2]] = Number(this.importitemjsonData[i][importitemheader[2]]) + Number(this.importitemjsonData[i + 1][importitemheader[2]]);

          this.importitemjsonData.splice(i + 1, 1);
          if (i + 1 != this.importitemjsonData.length)
            i--;
        }
      }
    }

    //article no/qty/unit price/exist validation
    for (let i = 0; i < this.importitemjsonData.length; i++) {
      if (this.importitemjsonData[i][importitemheader[6]] && this.importitemjsonData[i][importitemheader[6]].includes("/"))
        this.importitemjsonData[i][importitemheader[6]] = this.importitemjsonData[i][importitemheader[6]].split("/").join("-");

      if (this.importitemjsonData[i][importitemheader[7]] && this.importitemjsonData[i][importitemheader[7]].includes("/"))
        this.importitemjsonData[i][importitemheader[7]] = this.importitemjsonData[i][importitemheader[7]].split("/").join("-");

      if (!this.importitemjsonData[i][importitemheader[1]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Article no is required';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[2]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Quantity must be numeric';
      } else if (Number(this.importitemjsonData[i][importitemheader[2]]) <= 0) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Quantity must be greater than 0';
      } else if (this.importitemjsonData[i][importitemheader[4]] > 100) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Discount can not be more than 100.';
      } else if (!this.importitemjsonData[i][importitemheader[3]] && !this.importitemjsonData[i][importitemheader[4]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Either unit price or discount is required.';
      } else if (!this.importitemjsonData[i][importitemheader[5]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].Remarks = 'Unique Doc Number is required.';
      } else if (this.contarctItemStd && this.contarctItemStd.length > 0) {
        let existItemCheck = null;
        existItemCheck = this.contarctItemStd.filter(z => z.articleno == this.importitemjsonData[i][importitemheader[1]] && z.isdelete == 0);
        if (existItemCheck && existItemCheck.length > 0) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Item already added in the list.`;
        }
      }

      if (!this.importitemjsonData[i][importitemheader[6]] || !this.importitemjsonData[i][importitemheader[7]]) {
        this.importitemjsonData[i][importitemheader[6]] = null;
        this.importitemjsonData[i][importitemheader[7]] = null;
      } else {
        if (!(Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[6]], '-').date >= this.contractInformationFieldsForm.validfrom.value.split("/").reverse().join("-"))) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Valid From must be greater than ${this.contractInformationFieldsForm.validfrom.value} date.`;
        } else if (!(Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[7]], '-').date <= this.contractInformationFieldsForm.validto.value.split("/").reverse().join("-"))) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Valid To must be less than ${this.contractInformationFieldsForm.validto.value} date.`;
        } else if (Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[6]], '-').date > Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[7]], '-').date) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = 'Valid From must be less than Valid To date.';
        }
      }

      this.importitemjsonData[i].SrNo = i + 1;
      this.importitemjsonData[i].articleno = this.importitemjsonData[i][importitemheader[1]];
      this.importitemjsonData[i].unique_doc_number = this.importitemjsonData[i][importitemheader[5]] ? this.importitemjsonData[i][importitemheader[5]] : "";

      if (this.importitemjsonData[i][importitemheader[6]] && Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[6]], '-').valid)
        this.importitemjsonData[i].validfrom = Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[6]], '-').date;
      else
        this.importitemjsonData[i].validfrom = this.contractInformationFieldsForm.validfrom.value.split("/").reverse().join("-");

      if (this.importitemjsonData[i][importitemheader[7]] && Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[7]], '-').valid)
        this.importitemjsonData[i].validto = Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[7]], '-').date;
      else
        this.importitemjsonData[i].validto = this.contractInformationFieldsForm.validto.value.split("/").reverse().join("-");

      if (this.importitemjsonData[i][importitemheader[3]]) {
        this.importitemjsonData[i][importitemheader[3]] = Number(this.importitemjsonData[i][importitemheader[3]].trim().replace(/,/g, ''));
        if (isNaN(this.importitemjsonData[i][importitemheader[3]])) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].Remarks = `Unit price must be numeric.`;
        }
      }
    }

    //call api for item searched
    for (let i = 0; i < this.importitemjsonData.length; i++) {
      if (this.importitemjsonData[i].rowStatus == undefined) {
        await this.productmasterService.getItemSearched(this.importitemjsonData[i][importitemheader[1]]).then(
          async response => {
            if (response.item && response.item.length > 0) {
              let _itemsearcheddata = response.item[0];

              this.importitemjsonData[i].articleno = _itemsearcheddata.articleno;
              this.importitemjsonData[i].description = _itemsearcheddata.description;
              this.importitemjsonData[i].uom = _itemsearcheddata.uom;

              let _tempALPdata = this.importitemjsonData.find(x => x.articleno == _itemsearcheddata.articleno);

              if (this.importitemjsonData[i].rowStatus == undefined) {
                //call api to get alp
                await this.productmasterService.searchproductalpforrc(_itemsearcheddata.articleno, 'STD', 'INR').then(
                  response => {
                    if (response.data && response.data.statusCode == 200) {

                      this.importitemjsonData[i].SrNo = i + 1;
                      this.importitemjsonData[i].seqno = this.importitemjsonData[i][importitemheader[0]];

                      this.importitemjsonData[i].itemType = response.data.data.itemtype;
                      this.importitemjsonData[i].moq = response.data.data.moq;
                      this.importitemjsonData[i].price = Number(response.data.data.price);

                      this.importitemjsonData[i].customerpartno = '';
                      this.importitemjsonData[i].rowStatus = true;
                      this.importitemjsonData[i].Remarks = null;

                      if (this.rcType == 10) { // Price Based RC
                        this.importitemjsonData[i].quantity = 1;
                      } else if (this.rcType == 20) { // Quantity based RC 
                        this.importitemjsonData[i].quantity = this.importitemjsonData[i][importitemheader[2]];
                      }

                      if (this.importitemjsonData[i][importitemheader[3]]) {
                        _tempALPdata.unitprice = this.importitemjsonData[i][importitemheader[3]];
                        _tempALPdata.discount = ((Number(response.data.data.price) - Number(this.importitemjsonData[i][importitemheader[3]])) * 100 / Number(response.data.data.price)).toFixed(2);
                      } else if (!this.importitemjsonData[i][importitemheader[3]] && this.importitemjsonData[i][importitemheader[4]]) {
                        _tempALPdata.discount = this.importitemjsonData[i][importitemheader[4]];
                        _tempALPdata.unitprice = (Number(response.data.data.price) - ((Number(response.data.data.price) * Number(this.importitemjsonData[i][importitemheader[4]]) / 100))).toFixed(2);
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

  onProceedtoAddItem() {
    this.importItemStatus.forEach(element => {

      if (element.rowStatus == true) {
        let itemModel = {
          id: 0,
          itemSeqId: this.getSeqID(this.contarctItemStd),
          seqno: element.seqno ? element.seqno : this.getSeqNo(),
          articleno: element.articleno,
          articledesc: element.description,
          itemtype: element.itemType,
          uom: element.uom,
          isdelete: 0,
          quantity: Number(element.quantity),
          discount: Number(element.discount),
          price: Number(element.price),
          customerpartno: '', //element.customerpartno,
          unitprice: Number(element.unitprice),
          unique_doc_number: element.unique_doc_number,
          validfrom: Config.ExcelDateToJSDate(element.validfrom, "/").date,
          validto: Config.ExcelDateToJSDate(element.validto, "/").date,
        }

        this.items = this.ItemsForm.get('items') as FormArray;
        this.items.push(this.createItem());

        this.contarctItemStd.push(itemModel);
      }
    });

    this.modalService.dismissAll();
  }

  getRCItems() {
    this.ratecontractService.getRCItems(this.rateContractID).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.productmasterlist = response.responsedata.data;
        if (response.responsedata && response.responsedata.statusCode == 400)
          this.notificationService.showError(response.responsedata.message);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onItemAmendment(index: number) {
    this.submitted = false;

    if (index != undefined) {
      let data = this.filtredDeletedData(this.AmendmentItems)[index];

      this.itemforEdit = true;
      this.amendmentItemId = data.id;
      this.amendmentItemIndex = index;
      this.articleno = data.articleno;
      this.amendmentItemSequenceId = data.itemSeqId;

      this.itemAmendmentForm.articleno.setValue(data.articleno);
      // this.itemAmendmentForm.articledesc.setValue(data.articledesc);
      this.itemAmendmentForm.quantity.setValue(data.quantity);
      this.itemAmendmentForm.quantityused.setValue(data.quantityused);
      this.itemAmendmentForm.quantityremaining.setValue(data.quantityremaining);
      this.itemAmendmentForm.amendmentquantity.setValue(data.amendmentquantity);
    } else {
      this.onSelectProductClearClick();
    }

    this.modalService.open(this.ItemAmendmentModal, { centered: true, size: 'lg', backdrop: 'static' });
  }

  onAmendmentItemSave() {
    this.submitted = true;
    if (this.ItemAmendmentForm.invalid)
      return;

    this.modalService.dismissAll("");

    let data = {
      id: this.amendmentItemId > 0 ? this.amendmentItemId : 0,
      itemSeqId: this.amendmentItemSequenceId > 0 ? this.amendmentItemSequenceId : this.getSeqID(this.AmendmentItems),
      articleno: this.itemAmendmentForm.articleno.value,
      // articledesc: this.itemAmendmentForm.articledesc.value,
      quantity: this.itemAmendmentForm.quantity.value,
      quantityused: this.itemAmendmentForm.quantityused.value,
      quantityremaining: this.itemAmendmentForm.quantityremaining.value,
      amendmentquantity: this.itemAmendmentForm.amendmentquantity.value,
      isdelete: 0
    }

    this.AmendmentItems = this.AmendmentItems.filter(x => x.itemSeqId != data.itemSeqId);

    if (this.itemSequenceId > 0)
      this.AmendmentItems.splice(this.amendmentItemIndex, 0, data);
    else
      this.AmendmentItems.push(data);

    let currentdata = this.AmendmentItemData.find(x => x.status == 10)
    currentdata.items = currentdata.items.filter(x => x.itemSeqId != data.itemSeqId);
    currentdata.items.push(data);
  }

  onSearchProductClick() {
    if (!this.productmasterlist.length) {

      this.ratecontractService.getRCItems(this.rateContractID).subscribe(
        response => {
          if (response.responsedata && response.responsedata.statusCode == 200) {
            this.productmasterlist = response.responsedata.data;

            this.modalRef = this.modalService.open(this.ProductSearchModel, { size: 'lg' });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    } else {
      this.modalRef = this.modalService.open(this.ProductSearchModel, { size: 'lg' });
    }
  }

  onSelectProductClearClick() {
    this.itemforEdit = false;
    this.articleno = null;
    this.amendmentItemId = 0;
    this.amendmentItemIndex = 0;
    this.amendmentItemSequenceId = 0;
    this.itemAmendmentForm.articleno.setValue(null);
    // this.itemAmendmentForm.articledesc.setValue(null);
    this.itemAmendmentForm.quantity.setValue(null);
    this.itemAmendmentForm.quantityused.setValue(null);
    this.itemAmendmentForm.quantityremaining.setValue(null);
    this.itemAmendmentForm.amendmentquantity.setValue(null);
  }

  onSelectProductClick(article: any) {
    if (this.modalRef)
      this.modalRef.close();

    if (this.filtredDeletedData(this.AmendmentItems).filter(i => i.articleno == article).length > 0) {
      this.notificationService.showError("Article already added for amendment.");
      return;
    } else if (this.productmasterlist.findIndex(item => item.articleno == article) == -1) {
      this.notificationService.showError("Article not found.");
      return;
    }

    let articledata = this.filtredDeletedData(this.productmasterlist).find(i => i.articleno == article);

    this.itemforEdit = true;
    this.articleno = articledata.articleno;

    this.itemAmendmentForm.articleno.setValue(articledata.articleno);
    // this.itemAmendmentForm.articledesc.setValue(articledata.articledesc);
    this.itemAmendmentForm.quantity.setValue(articledata.quantity);
    this.itemAmendmentForm.quantityused.setValue(articledata.qtyused);
    this.itemAmendmentForm.quantityremaining.setValue(articledata.qtyremaining);
  }

  onItemSearch(event: any) {
    this.onSelectProductClick(event.searchValue);
  }

  onItemAmendmentSave(approve: boolean) {
    if (this.modalService)
      this.modalService.dismissAll("");

    this.submitted = true;

    if (approve && !this.ItemAmendmentComment.length)
      return;

    if (!this.AmendmentItems.length) {
      this.notificationService.showError("Add Items to amendment quantity.");
      return;
    }

    let model = {
      id: this.inProgressAmendmentData ? this.inProgressAmendmentData.id : 0,
      rcid: this.rateContractID,
      status: approve ? 80 : 10,
      comment: this.ItemAmendmentComment,
      active: approve ? 1 : 0,
      items: this.AmendmentItems
    };

    this.ratecontractService.saveItemAmendment(model).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.redirecttoList();
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onItemAmendmentApprove() {
    if (!this.AmendmentItems.length) {
      this.notificationService.showError("Add Items to amendment quantity.");
      return;
    }

    this.submitted = false;
    this.ItemAmendmentComment = "";
    this.modalService.open(this.ItemAmendmentCommentmodal);
  }

  getAmendmentItem() {
    this.ratecontractService.getAmendmentItems(this.rateContractID).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.AmendmentItemData = response.responsedata.data;
          this.inProgressAmendmentData = this.AmendmentItemData.find(x => x.status == 10);

          this.showAddItemAmendmentButton = this.inProgressAmendmentData ? false : true;

          this.AmendmentItems = this.inProgressAmendmentData ? this.inProgressAmendmentData.items : [];
        } else if (response.responsedata && response.responsedata.statusCode == 400) {
          this.notificationService.showError(response.responsedata.message);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onAmendmentItemClick() {
    if (this.inProgressAmendmentData) {
      this.notificationService.showError("Item amendment already in progress.");
      return;
    }

    this.AmendmentItemData.push({ status: 10, items: [] });
    this.inProgressAmendmentData = { items: [] }
  }

  onPriceBasedonChange(event: any) {
    if (event && event.code !== 30) { // if not ALP
      let maxdate = moment(this.contractInformationFieldsForm.validfrom.value.split('/').reverse().join('-')).add(3, 'M').format('DD/MM/YYYY');
      this.offerValidMaxdate = this.sharedService.convertDate(maxdate);

      if (new Date(this.contractInformationFieldsForm.validto.value.split('/').reverse().join('-')) > new Date(maxdate.split('/').reverse().join('-'))) {
        this.offervalidtoDate = this.sharedService.convertDate(maxdate);
        this.contractInformationFieldsForm.validto.setValue(maxdate);
      }
    } else
      this.offerValidMaxdate = null;
  }

  checkisTypeEditable() {
    if ((this.isAdd && this.contarctItemStd.filter(i => !i.isdelete).length) || this.isEdit)
      return false;
    else
      return true;
  }

  isLMEBased() {
    if (this.contractInformationFieldsForm.rcpricebasedon.value && this.contractInformationFieldsForm.rcpricebasedon.value !== 30)
      return false;

    return true;
  }

  isALPBased() {
    if (this.contractInformationFieldsForm.rcpricebasedon.value && this.contractInformationFieldsForm.rcpricebasedon.value === 30)
      return false;

    return true;
  }

  changeDateFormat(date: any) {
    return this.datePipe.transform(date, this.dateformate);
  }

  OfferfileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateOfferFiles(event.target.files, 0)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.RateContractFiles.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  setContractValidMaxDate() {
    let maxdate = moment(this.contractInformationFieldsForm.validfrom.value.split('/').reverse().join('-')).add(3, 'M').format('DD/MM/YYYY');
    this.offerValidMaxdate = this.sharedService.convertDate(maxdate);
  }

  onExportItemPDF() {
    let itemData = this.filterDatatoDeletewithOrder(this.contarctItemStd);
    let rcType = this.rcTypeList.find(rctype => rctype.code == this.contractInformationData.rctype).description;
    let rcPriceBasedon = this.priceBasedonList.find(price => price.code == this.contractInformationData.rcpricebasedon).description;
    let rcFor = this.contractForList.find(rcfor => rcfor.code == this.contractInformationData.rcfor).description;

    let customer = "", dealercommission = "";
    if (this.contractInformationData.rcfor === 20) {
      customer = this.AccountsList.find(customer => customer.sfdcid == this.contractInformationFieldsForm.account.value).customerfullname;
      dealercommission = this.contractInformationFieldsForm.dealercommission.value;
    }

    let owner = this.OwnersList.find(owner => owner.id == this.contractInformationFieldsForm.owner.value).fullname;
    let soldtoparty = this.soldtopartySearchList.find(soldto => soldto.kunnr == this.contractInformationFieldsForm.soldtoparty.value).fullname;
    let shiptoparty = this.shiptopartySearchList.find(shipto => shipto.partner == this.contractInformationFieldsForm.shiptoparty.value).fullname;

    let docDefinition = {
      header: '',
      pageSize: 'A4',
      pageOrientation: 'portrait',//'landscape',
      content: [
        { text: 'Rate Contract', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['25%', '25%', '25%', '25%'],
            body: [
              [{ text: `RC Number: ${this.contractInformationData.rcnumbertext}    Ver: ${this.contractInformationData.ver}` }, { text: `Types: ${rcType}` }, { text: `Price Based On: ${rcPriceBasedon}` }, { text: `Contract For: ${rcFor}` }],
              [{ text: `Sold to Party: ${soldtoparty}`, colSpan: 2 }, {}, { text: `Ship to Party: ${shiptoparty}`, colSpan: 2 }, {}],
              [{ text: `Owner: ${owner}`, colSpan: 2 }, {}, { text: `Employee Responsible: ${shiptoparty}`, colSpan: 2 }, {}],
              [{ text: `Customer: ${customer}`, colSpan: 2 }, {}, { text: `Dealer Margin(%): ${dealercommission}`, colSpan: 2 }, {}]
            ]
          },
          layout: {
            hLineWidth: function (i, node) {
              return 0;
            },
            vLineWidth: function (i, node) {
              return 0;
            },
            paddingBottom: function (i, node) {
              return 8;
            }
          }
        },
        { text: "RC Items", style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', 'auto', 'auto'],
            body: [
              [{ text: 'Seq No', style: 'tableHeader' }, { text: 'Article No', style: 'tableHeader' }, { text: 'Description', style: 'tableHeader' }, { text: 'Quantity', style: 'tableHeader' }, { text: 'Unit Price', style: 'tableHeader' }, { text: 'Amount', style: 'tableHeader' }],
              ...itemData.map(p => ([p.seqno, p.articleno, p.articledesc, p.quantity, p.unitprice, (p.unitprice * p.quantity).toFixed(2)]))
            ]
          },
          layout: {
            hLineColor: function (i, node) {
              return 'gray';
            },
            vLineColor: function (i, node) {
              return 'gray';
            },
            paddingTop: function (i, node) {
              return 8;
            }
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        },
        subheader: {
          fontSize: 16,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        tableHeader: {
          bold: true,
          fontSize: 8,
          color: 'black',
          fillColor: '#c5c3c3'
        }
      },
      defaultStyle: {
        fontSize: 8,
        width: 100
      }
    };

    pdfMake.createPdf(docDefinition).download(`Ratecontract Item - ${this.contractInformationData.rcnumbertext}.pdf`);
  }

  onExportItemExcel() {
    let listData = this.filterDatatoDeletewithOrder(this.contarctItemStd);

    listData = listData.map(item => {
      return {
        'Seq No': item.seqno,
        'Article No': item.articleno,
        'Description': item.articledesc,
        'Quantity': item.quantity,
        'Unit Price': item.unitprice,
        'Amount': (item.unitprice * item.quantity).toFixed(2)
      };
    });

    let fileName = `Ratecontract Item - ${this.contractInformationData.rcnumbertext}`;

    this.appService.exportAsExcelFile(listData, fileName);
  }

  getLookupDatas() {
    let data = { "lookup_type": "vertical,segment" };

    this.lookupService.getLookupdata(data).subscribe(response => {
      this.verticals = response.lookups.filter(lookup => lookup.lookup_type === "vertical");
      this.segments = response.lookups.filter(lookup => lookup.lookup_type === "segment");

      if (this.contractInformationFieldsForm.vertical.value && !this.filteredSegments.length)
        this.onVerticalChange(this.contractInformationFieldsForm.vertical.value);
    }, error => {
      this.notificationService.showError(error.error.error.message);
    });
  }

  onVerticalChange(vertical: string, verticalChange: boolean = false) {
    if (vertical && vertical.length)
      this.filteredSegments = this.segments.filter(x => x.parent_code == vertical);
    else {
      this.filteredSegments = [];
    }

    if (verticalChange)
      this.contractInformationFieldsForm.segment.setValue(null);
  }
}
