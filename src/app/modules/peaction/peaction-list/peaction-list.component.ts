import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PagerService } from '@shared/directives';
import { PeactionService } from '@core/services/peaction/peaction.service';
import { AuthService } from '@core/services/auth/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDismissReasons, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SPRItemStatusEnum } from 'src/app/core/enums/spritemstatus.enum';
import * as XLSX from 'xlsx';
import { Config } from '@core/configs/config';
import { environment } from 'src/environments/environment';
import { SampleEnum } from '@core/enums/sample.enum';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { LookupService } from '@core/services/common/lookup.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-peaction-list',
  templateUrl: './peaction-list.component.html',
  styleUrls: ['./peaction-list.component.css']
})
export class PeactionListComponent implements OnInit {

  FilterForm: FormGroup;
  AssigneeForm: FormGroup;
  ImportItemsForm: FormGroup;
  ExportItemsForm: FormGroup;

  pelist: any[] = [];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  dateformate: any;
  searchModel = Object();
  submitted: boolean = false;
  closeResult: string;
  peid: number;
  offerid: number;
  @ViewChild('AssigneeModel', { static: false }) AssigneeModel: any;
  @ViewChild('ImportSPRItemModal', { static: false }) ImportSPRItemModal: any;
  @ViewChild('ExportSPRItemModal', { static: false }) ExportSPRItemModal: any;
  @ViewChild('ItemStatusModal', { static: false }) ItemStatusModal: any;
  @ViewChild('OfferArticlesModal', { static: false }) OfferArticlesModal: any;
  itemtatusList: any[] = [];
  itemSPRStatusList: any[] = [];
  AssigntoList: any[] = [];
  FilterAssignToList: any[] = [];
  userrole: string;
  userid: number;
  worksheet: XLSX.WorkSheet;
  fileUploaded: any;
  file: any;
  storeData: any;
  jsonData: any[];
  importData: any[];
  headerList: string[];
  ImportItemsfileUploaded: any;
  ImportItemFiles: any;
  importitemjsonData: any[] = [];
  importItemStatus: any[] = [];
  dwnldforImport: boolean = true;
  dwnldforReport: boolean = false;
  dwnldbyOpportunityId: boolean = false;
  dwnldfilteredData: boolean = false;
  exportdatalist: any[] = [];
  createdDate: any;
  validfromDate: { year: number; month: number; day: number };
  validtoDate: { year: number; month: number; day: number };
  startOfMonth: any;
  endOfMonth: any;
  ValidMaxdate: any;
  ValidMindate: any;
  OfferArticleList: any[] = [];
  type: string = 'PEAction';
  canAssign: boolean = false;
  VerticalsList: any[] = [];

  constructor(
    private router: Router,
    private peactionservice: PeactionService,
    private pagerService: PagerService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private modalService: NgbModal,
    private appService: AppService,
    private datePipe: DatePipe,
    public formatter: NgbDateParserFormatter,
    private peactionService: PeactionService,
    private lookupService: LookupService,
    private notificationService: NotificationService
  ) { }

  get filterForm() { return this.FilterForm.controls; }
  get assigneeForm() { return this.AssigneeForm.controls; }
  get exportItemsForm() { return this.ExportItemsForm.controls; }

  ngOnInit() {
    this.itemtatusList = Config.StatusList;
    this.onbuildForm();
    this.onLoad();
  }

  onbuildForm() {
    this.FilterForm = this.formBuilder.group({
      itemStatus: [1],
      itemSPRStatus: [10],
      itemAssigneTo: [[]],
      vertical: ["All"]
    });

    this.AssigneeForm = this.formBuilder.group({
      assignto: [0],
      isassigntoallitem: [null]
    });

    this.ImportItemsForm = this.formBuilder.group({
      importFile: [null]
    });

    this.ExportItemsForm = this.formBuilder.group({
      exportoption: [null],
      opportunityid: [null],
      validfrom: [''],
      validto: ['']
    });

  }

  private onLoad() {
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.dateformate = this.authService.getDateFormat();
    this.userrole = this.authService.getUserRoleCode();

    if (this.userrole == 'Admin' || this.userrole == 'PE_Admin' || this.userrole == 'PE_Cable Design Team' || this.userrole == 'PE_Product Master' || this.userrole == 'PE_TRD_MFG') {
      this.canAssign = true;
    }

    this.userid = this.authService.getUserId();

    this.startOfMonth = moment().startOf('month').format('DD/MM/YYYY');
    this.endOfMonth = moment().endOf('month').format('DD/MM/YYYY');

    this.validfromDate = this.convertDate(this.startOfMonth);
    this.validtoDate = this.convertDate(this.endOfMonth);
    this.ValidMaxdate = this.validtoDate;
    this.ValidMindate = this.validfromDate;

    this.itemSPRStatusList = [
      { code: 0, description: SPRItemStatusEnum.zero },
      { code: 10, description: SPRItemStatusEnum.ten },
      { code: 12, description: SPRItemStatusEnum.twelve },
      { code: 14, description: SPRItemStatusEnum.fourteen },
      { code: 20, description: SPRItemStatusEnum.twenty },
      { code: 30, description: SPRItemStatusEnum.thirty },
      { code: 40, description: SPRItemStatusEnum.fourty },
      { code: 50, description: SPRItemStatusEnum.fifty }];

    this.getCount();
    this.getAssigntoList();
    this.getVerticals();
  }

  onOffValidFromDateSelection(date) {
    this.ValidMindate = date;
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    let maxdate = moment(offerValidFromdate).add(30, 'd').format('YYYY-MM-DD');
    this.ValidMaxdate = this.convertDate(maxdate);
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateformate);
    this.exportItemsForm.validfrom.setValue(offerValidFromdate);

    if (new Date(this.exportItemsForm.validfrom.value.split('/').reverse().join('-')) > new Date(this.exportItemsForm.validto.value.split('/').reverse().join('-'))) {
      this.validtoDate = this.convertDate(offerValidFromdate);
      this.exportItemsForm.validto.setValue(offerValidFromdate);
    }
  }

  onOffValidToDateSelection(date) {
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateformate);
    this.exportItemsForm.validto.setValue(offerValidTodate);
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate = { year: year, month: month, day: day };
    return newdate;
  }

  getCount() {
    var screenvalues = this.authService.getScreenValues().PE_Action;
    this.searchValue = screenvalues.searchtext;
    this.searchModel.searchtext = this.searchValue;
    this.filterForm.itemStatus.setValue(screenvalues.itemtatus);
    this.filterForm.itemSPRStatus.setValue(screenvalues.itemSPRStatus);
    if (screenvalues.assignto)
      this.filterForm.itemAssigneTo.setValue(screenvalues.assignto);
    else {
      if (screenvalues.assignto == "" && (this.userrole == 'Admin' || this.userrole == 'PE_Admin'))
        this.filterForm.itemAssigneTo.setValue(0);
      else if (screenvalues.assignto === 0 && (this.userrole == 'Admin' || this.userrole == 'PE_Admin' || this.userrole == 'PE_Cable Design Team'))
        this.filterForm.itemAssigneTo.setValue(0);
      else
        this.filterForm.itemAssigneTo.setValue(this.userid);
    }

    if (screenvalues.pagenumber)
      this.pageNumber = screenvalues.pagenumber;
    else
      this.pageNumber = 1;

    if (screenvalues.vertical)
      this.filterForm.vertical.setValue(screenvalues.vertical);
    else
      this.filterForm.vertical.setValue("All");

    this.peactionservice.getCount(this.searchValue, this.filterForm.itemStatus.value, this.filterForm.itemSPRStatus.value, this.filterForm.itemAssigneTo.value, this.filterForm.vertical.value).subscribe(
      response => {
        this.totalRows = response.peactioncount[0].count;
        if (this.totalRows > 0)
          this.getData();
        else
          this.pelist = [];
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.peactionservice.getPEList(filtermodel, this.filterForm.itemStatus.value, this.filterForm.itemSPRStatus.value, this.filterForm.itemAssigneTo.value, this.filterForm.vertical.value).subscribe(
      response => {
        this.pelist = response.pelist;
        this.setStatus();
        this.DecodeSPRFormData();
        this.pager = this.pagerService.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getAssigntoList() {
    this.peactionservice.getAssignToList().subscribe(
      response => {
        this.FilterAssignToList = response.assigntolist;
        this.FilterAssignToList.splice(0, 0, { userid: -1, description: 'All' }, { userid: 0, description: 'Not Assigned' });
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getVerticals() {
    let data = { "lookup_type": "vertical" };
    this.lookupService.getLookupdata(data).subscribe(
      response => {
        this.VerticalsList = response.lookups;
        this.VerticalsList.splice(0, 0, { code: "All" });
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.AfterFilter(this.pageNumber);
    this.getData();
  }

  setStatus() {
    this.pelist.forEach(element => {
      if (element.status == 10)
        element.showstatus = SPRItemStatusEnum.ten;
      else if (element.status == 14)
        element.showstatus = SPRItemStatusEnum.fourteen;
      else if (element.status == 20)
        element.showstatus = SPRItemStatusEnum.twenty;
      else if (element.status == 30)
        element.showstatus = SPRItemStatusEnum.thirty;
      else if (element.status == 40)
        element.showstatus = SPRItemStatusEnum.fourty;
      else if (element.status == 50)
        element.showstatus = SPRItemStatusEnum.fifty;
    });
  }

  DecodeSPRFormData() {
    this.pelist.forEach(element => {
      if (element.sprform_fields)
        element.sprform_fields = Config.ObjecttoString(element.sprform_fields, "|");
    });
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.authService.setScreenValues('PE_Action', 'searchtext', this.searchValue);
    this.AfterFilter(null);
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-additionalcharges');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData();
  }

  onAddClick() {
    this.router.navigateByUrl('/peaction/add');
  }

  editClicked(id: number) {
    this.router.navigate(['/peaction/edit/' + id]);
  }

  viewClicked(id: number) {
    this.router.navigate(['/peaction/view/' + id]);
  }

  onFilterStatusChange(event: any) {
    if (!event)
      this.filterForm.itemSPRStatus.setValue(0);

    this.authService.setScreenValues('PE_Action', 'itemSPRStatus', this.filterForm.itemSPRStatus.value);
    this.AfterFilter(null);
    this.getCount();
  }

  onFilterItemStatusChange(event: any) {
    if (!event)
      this.filterForm.itemStatus.setValue(1);

    this.authService.setScreenValues('PE_Action', 'itemtatus', this.filterForm.itemStatus.value);
    this.AfterFilter(null);
    this.getCount();
  }

  onFilterFilterAssignToChange(event: any) {
    if (!event)
      this.filterForm.itemAssigneTo.setValue(0);

    this.authService.setScreenValues('PE_Action', 'assignto', this.filterForm.itemAssigneTo.value);
    this.AfterFilter(null);
    this.getCount();
  }

  onVerticalChange(event: any) {
    if (!event)
      this.filterForm.vertical.setValue("All");

    this.authService.setScreenValues('PE_Action', 'vertical', this.filterForm.vertical.value);
    this.AfterFilter(null);
    this.getCount();
  }

  openAssigneeModal(id: number, offerid: number) {
    this.peid = id;
    this.offerid = offerid;

    this.peactionservice.getAssignToList().subscribe(
      response => {
        this.AssigntoList = response.assigntolist;

        let _assignto = this.pelist.find(x => x.id == this.peid).assignto;
        if (_assignto)
          this.assigneeForm.assignto.setValue(this.AssigntoList.find(x => x.description == _assignto).userid);
        else
          this.assigneeForm.assignto.setValue([]);

        this.assigneeForm.isassigntoallitem.setValue(null);
        this.modalService.open(this.AssigneeModel, { size: 'sm' });
      }, error => {
        this.notificationService.showError(error.error.error.message);
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

  onAssignToSaveClick() {
    let assigntosavemodel = {
      peid: this.peid,
      assignto: this.assigneeForm.assignto.value,
      isassigntoallitem: this.assigneeForm.isassigntoallitem.value,
      offerid: this.offerid
    }

    this.peactionservice.saveassignto(assigntosavemodel).subscribe(
      response => {
        if (response) {
          this.peid = null;
          this.offerid = null;
          this.modalService.dismissAll();
          this.notificationService.showSuccess('Assign To saved successfully.');
          this.getCount();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  AfterFilter(pageNumber) {
    if (pageNumber)
      this.pageNumber = pageNumber;
    else
      this.pageNumber = 1;

    this.authService.setScreenValues('PE_Action', 'pagenumber', this.pageNumber);
  }

  downloadImportItemSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.importspritempe;
    FileSaver.saveAs(url, SampleEnum.importspritempe);
  }

  public open() {
    this.ImportItemsfileUploaded = null;
    this.ImportItemFiles = null;
    this.importitemjsonData = null;
    this.modalService.open(this.ImportSPRItemModal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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

  private readExcel() {
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

  async onImportItemSave() {
    this.submitted = true;
    if (this.ImportItemsForm.invalid)
      return;

    if (!this.ImportItemsfileUploaded)
      return;

    if (this.ValidateImportItemFile()) {
      await this.ValidateImportItemFileData();

      this.importitemjsonData.forEach(element => {
        element['CUSTOMER PART NO'] = this.NulltoStringConversion(element['CUSTOMER PART NO']);
        element['ITEM TYPE'] = this.NulltoStringConversion(element['ITEM TYPE']);
        element['PRIMARY PLANT'] = this.NulltoStringConversion(element['PRIMARY PLANT']);
        element['LENGTH'] = this.NulltoStringConversion(element['LENGTH']);
        element['PH TWO'] = this.NulltoStringConversion(element['PH TWO']);
        element['PH SIX'] = this.NulltoStringConversion(element['PH SIX']);
        element['INDUSTRY STD TEXT'] = this.NulltoStringConversion(element['INDUSTRY STD TEXT']);
        element['LAB TEXT'] = this.NulltoStringConversion(element['LAB TEXT']);
        element['REMARKS'] = this.NulltoStringConversion(element['REMARKS']);

        element['VALID FROM'] = element['VALID FROM'] ? element['VALID FROM'].split('-').reverse().join('-') : '';
        element['VALID TO'] = element['VALID TO'] ? element['VALID TO'].split('-').reverse().join('-') : '';

        this.ReplaceKeys(element);
      });

      this.importItemStatus = this.importitemjsonData;

      this.modalService.open(this.ItemStatusModal, { size: 'xl' }).result.then((result) => {
        this.closeResult = `Closed with: ${result}`;
      }, (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
    }
  }

  ValidateImportItemFile() {
    this.importitemjsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: true, defval: null });
    this.importData = this.importitemjsonData;
    let data = []

    for (let key in this.importData[0]) {
      if (data.length != Config.masterfilesheaders.importSPRItemPE.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.importSPRItemPE)) {
      this.notificationService.showError('Incorrect Template used. Please download correct template before importing.');
      return false;
    }

    return true;
  }

  async ValidateImportItemFileData() {
    var importitemheader = Config.masterfilesheaders.importSPRItemPE;

    //import data validation for required field
    for (let i = 0; i < this.importitemjsonData.length; i++) {
      this.importitemjsonData[i].rowStatus = true;
      this.importitemjsonData[i].ItemRemarks = '';

      if (!this.importitemjsonData[i][importitemheader[0]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Offer no is required.';
      } else if (!this.importitemjsonData[i][importitemheader[1]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Article no is required.';
      } else if (!this.importitemjsonData[i][importitemheader[2]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Description is required.';
      }
      // else if (!this.importitemjsonData[i][importitemheader[4]]) {
      //   this.importitemjsonData[i].rowStatus = false;
      //   this.importitemjsonData[i].ItemRemarks = 'Item Type is required';
      // } else if (!['MFG'].includes(this.importitemjsonData[i][importitemheader[4]])) {
      //   this.importitemjsonData[i].rowStatus = false;
      //   this.importitemjsonData[i].ItemRemarks = 'Item Type must be MFG';
      // }

      else if (this.importitemjsonData[i][importitemheader[4]] && !['MFG', 'TRD'].includes(this.importitemjsonData[i][importitemheader[4]].toUpperCase())) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Item Type must be MFG or TRD.';
      } else if (!this.importitemjsonData[i][importitemheader[5]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Primary Plant is required.';
      } else if (!["8250", "8400", "8210", 8250, 8400, 8210].includes(this.importitemjsonData[i][importitemheader[5]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Primary Plant must be 8250, 8400, 8210.';
      }

      // else if (!this.importitemjsonData[i][importitemheader[6]]) {
      //   this.importitemjsonData[i].rowStatus = false;
      //   this.importitemjsonData[i].ItemRemarks = 'Currency is required';
      // } else if (!['INR', 'Doller', 'Euro'].includes(this.importitemjsonData[i][importitemheader[6]])) {
      //   this.importitemjsonData[i].rowStatus = false;
      //   this.importitemjsonData[i].ItemRemarks = 'Currency must be INR, Doller or Euro';
      // } 

      else if (!this.importitemjsonData[i][importitemheader[6]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'UOM is required.';
      } else if (!['M', 'PC'].includes(this.importitemjsonData[i][importitemheader[6]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'UOM must be M or PC.';
      } else if (this.importitemjsonData[i][importitemheader[6]] == 'M' && !this.importitemjsonData[i][importitemheader[7]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Length is required.';
      } else if (this.importitemjsonData[i][importitemheader[6]] == 'M' && !(/^[\d|]*$/g).test(this.importitemjsonData[i][importitemheader[7]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Please enter length in format: 100|200|500.';
      } else if (!this.importitemjsonData[i][importitemheader[8]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Industry STD Text is required.';
      } else if (!this.importitemjsonData[i][importitemheader[9]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'PG is required.';
      } else if (!this.importitemjsonData[i][importitemheader[10]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'PH is required.';
      } else if (this.importitemjsonData[i][importitemheader[13]] && !['BANGALORE', 'BHOPAL', 'TRADING', 'OUTSOURCING'].includes(this.importitemjsonData[i][importitemheader[13]].toUpperCase())) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Lab Text must be BANGALORE, BHOPAL, TRADING, OUTSOURCING.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[14]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Standard Cost must be numeric.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[15]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Copper Weight must be numeric.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[16]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Copper Index must be numeric.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[17]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Base Price must be numeric.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[18]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Copper Base Cost must be numeric.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[19]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Other RMC must be numeric.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[20]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Variable O/H must be numeric.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[21]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Fixed O/H must be numeric.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[22]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'ALP must be numeric.';
      } else if (!this.importitemjsonData[i][importitemheader[23]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MSQ is required.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[23]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MSQ must be numeric.';
      } else if (Number(this.importitemjsonData[i][importitemheader[23]]) <= 0) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MSQ must be greater than 0.';
      } else if (!this.importitemjsonData[i][importitemheader[24]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MOQ is required.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[24]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MOQ must be numeric.';
      } else if (Number(this.importitemjsonData[i][importitemheader[24]]) <= 0) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MOQ must be greater than 0.';
      } else if (!this.importitemjsonData[i][importitemheader[25]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MDQ is required.';
      } else if (isNaN(this.importitemjsonData[i][importitemheader[25]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MDQ must be numeric.';
      } else if (Number(this.importitemjsonData[i][importitemheader[25]]) <= 0) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'MDQ must be greater than 0.';
      } else if (this.importitemjsonData[i][importitemheader[26]] && isNaN(this.importitemjsonData[i][importitemheader[26]])) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'OWF must be numeric.';
      } else if (this.importitemjsonData[i][importitemheader[26]] && this.importitemjsonData[i][importitemheader[26]] > 99.99) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'OWF must be less than 99.99.';
      } else if (!this.importitemjsonData[i][importitemheader[27]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Valid From is required';
      } else if (!this.importitemjsonData[i][importitemheader[28]]) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Valid To is required.';
      } else if (!Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[27]], '-').valid) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Please enter valid date (dd-mm-yyyy) for Valid From.';
      } else if (!Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[28]], '-').valid) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Please enter valid date (dd-mm-yyyy) for Valid To.';
      } else if (Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[28]], '-').date < moment().format('YYYY-MM-DD')) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Valid To must be greater than today date.';
      } else if (Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[27]], '-').date > Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[27]], '-').date) {
        this.importitemjsonData[i].rowStatus = false;
        this.importitemjsonData[i].ItemRemarks = 'Valid From must be less than Valid To date.';
      } else {
        let isstdcostavailable = false;
        let istrdcostavailable = false;
        if (this.importitemjsonData[i][importitemheader[14]] && this.importitemjsonData[i][importitemheader[14]] > 0) {
          isstdcostavailable = true;
        }

        if (this.importitemjsonData[i][importitemheader[15]] && this.importitemjsonData[i][importitemheader[15]] > 0) {
          istrdcostavailable = true;
        }

        if (!isstdcostavailable && !istrdcostavailable) {
          this.importitemjsonData[i].rowStatus = false;
          this.importitemjsonData[i].ItemRemarks = 'Either standard cost or other cost imformation is required.';
        }
      }
    }

    //call api for PH searched
    for (let i = 0; i < this.importitemjsonData.length; i++) {
      if (this.importitemjsonData[i].rowStatus == true) {
        if (Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[27]], '-').valid)
          this.importitemjsonData[i][importitemheader[27]] = Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[27]], '-').date;

        if (Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[28]], '-').valid)
          this.importitemjsonData[i][importitemheader[28]] = Config.ExcelDateToJSDate(this.importitemjsonData[i][importitemheader[28]], '-').date;

        await this.peactionservice.ValidateOfferNo(this.importitemjsonData[i][importitemheader[0]].trim()).then(
          async response => {
            if (response.offerexistdata && response.offerexistdata.length == 0) {
              this.importitemjsonData[i].rowStatus = false;
              this.importitemjsonData[i].ItemRemarks = 'Offer no is not available.';
            }
          });

        if (this.importitemjsonData[i].rowStatus == true) {
          await this.peactionservice.ValidateSPRItemStatus(this.importitemjsonData[i][importitemheader[0]].trim(), this.importitemjsonData[i][importitemheader[1]].trim()).then(
            async response => {
              if (response.spritemdata && response.spritemdata.length > 0) {
                if (response.spritemdata[0].IsActive == 0) {
                  this.importitemjsonData[i].rowStatus = false;
                  this.importitemjsonData[i].ItemRemarks = 'Offer is inactive.';
                } else if (response.spritemdata[0].itemstatus >= 40 || response.spritemdata[0].itemstatus == 20) {
                  this.importitemjsonData[i].rowStatus = false;
                  this.importitemjsonData[i].ItemRemarks = 'Article has already processed.';
                } else {
                  this.importitemjsonData[i].id = response.spritemdata[0].id;
                  this.importitemjsonData[i].offerid = response.spritemdata[0].offerid;
                  this.importitemjsonData[i][importitemheader[4]] = this.importitemjsonData[i][importitemheader[4]].toUpperCase() == 'MFG' ? "STD" : this.importitemjsonData[i][importitemheader[4]].toUpperCase();
                }
              } else {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].ItemRemarks = 'Article no is not available.';
              }
            });
        }

        if (this.importitemjsonData[i].rowStatus == true) {
          await this.peactionservice.ValidatePGandPH(this.importitemjsonData[i][importitemheader[8]].trim(), this.importitemjsonData[i][importitemheader[9]].trim(), this.importitemjsonData[i][importitemheader[10]].trim()).then(
            async response => {
              if (response.pgphdata && response.pgphdata.length > 0 && response.pgphdata[0].count == 0) {
                this.importitemjsonData[i].rowStatus = false;
                this.importitemjsonData[i].ItemRemarks = "Industry STD text, PG and PH doesn't match.";
              }
            });
        }
      }
    }
  }

  onProceedItem(iscompleted: number) {
    this.importItemStatus = this.importItemStatus.filter(x => x.rowStatus == true && x.ItemRemarks == '');

    if (this.importItemStatus && this.importItemStatus.length > 0) {
      this.peactionservice.UpdateImportPEdata(this.importItemStatus, iscompleted, 10).subscribe(
        response => {
          if (response) {
            this.notificationService.showSuccess('Updated successfully.');
            this.getCount();
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
        });
    }
    this.modalService.dismissAll();
  }

  removeImportItemFile() {
    this.ImportItemsfileUploaded = null;
    this.ImportItemFiles = null;
  }

  onExport() {
    this.dwnldforImport = true;
    this.dwnldforReport = false;
    this.dwnldbyOpportunityId = false;
    this.dwnldfilteredData = false;
    this.exportItemsForm.opportunityid.setValue(null);
    this.exportItemsForm.opportunityid.clearValidators();
    this.exportItemsForm.opportunityid.updateValueAndValidity();
    this.submitted = false;

    this.modalService.open(this.ExportSPRItemModal, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onExportOptionChange(event: any) {
    // 0: Download for Import
    // 1: Download for Report
    // 2: Download Items by Opportunity Id
    // 3: Download filtered data with all columns

    if (event.target.value == '0') {
      this.dwnldforImport = true;
      this.dwnldforReport = false;
      this.dwnldbyOpportunityId = false;
      this.dwnldfilteredData = false;
      this.exportItemsForm.opportunityid.clearValidators();
    } else if (event.target.value == '1') {
      this.dwnldforImport = false;
      this.dwnldforReport = true;
      this.dwnldbyOpportunityId = false;
      this.dwnldfilteredData = false;
      this.exportItemsForm.opportunityid.clearValidators();
      this.exportItemsForm.validfrom.setValue(this.startOfMonth);
      this.exportItemsForm.validto.setValue(this.endOfMonth);
    } else if (event.target.value == '2') {
      this.dwnldforImport = false;
      this.dwnldforReport = false;
      this.dwnldbyOpportunityId = true;
      this.dwnldfilteredData = false;
      this.exportItemsForm.opportunityid.setValidators(Validators.required);
    } else if (event.target.value == '3') {
      this.dwnldforImport = false;
      this.dwnldforReport = false;
      this.dwnldbyOpportunityId = false;
      this.dwnldfilteredData = true;
      this.exportItemsForm.opportunityid.clearValidators();
    }
    this.submitted = false;
    this.exportItemsForm.opportunityid.setValue(null);
    this.exportItemsForm.opportunityid.updateValueAndValidity();
  }

  onExportClick() {
    this.submitted = true;

    if (this.ExportItemsForm.invalid)
      return;

    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField, status: this.filterForm.itemStatus.value, itemstatus: this.filterForm.itemSPRStatus.value, assignto: this.filterForm.itemAssigneTo.value }
    let exportfor = this.dwnldforImport == true ? 0 : this.dwnldforReport == true ? 1 : this.dwnldfilteredData == true ? 3 : 2;

    let fromdate = '';
    let todate = '';
    if (exportfor == 1) {
      fromdate = this.exportItemsForm.validfrom.value.split('/').reverse().join('-');
      todate = this.exportItemsForm.validto.value.split('/').reverse().join('-');
    }

    this.peactionservice.exportspritems(filtermodel, exportfor, fromdate, todate, this.exportItemsForm.opportunityid.value).subscribe(
      response => {
        this.exportdatalist = response.spritems;

        if (this.exportdatalist && this.exportdatalist.length == 0) {
          this.notificationService.showError('There is no data to export.');
          return;
        }

        let pelistheader = null;

        if (exportfor == 0) {
          pelistheader = Config.masterfilesheaders.importSPRItemPE;

          this.exportdatalist = this.exportdatalist.map(item => {
            return {
              [pelistheader[0]]: item.offereno,
              [pelistheader[1]]: item.articleno,
              [pelistheader[2]]: item.description,
              [pelistheader[3]]: item.customerpartno,
              [pelistheader[4]]: item.itemtype == 'STD' ? 'MFG' : item.itemtype,
              [pelistheader[5]]: item.primaryplant,
              // [pelistheader[6]]: item.currency,
              [pelistheader[6]]: item.UOM,
              [pelistheader[7]]: item.length,
              [pelistheader[8]]: item.industry_std_text,
              [pelistheader[9]]: item.pg,
              [pelistheader[10]]: item.ph,
              [pelistheader[11]]: item.phtwo,
              [pelistheader[12]]: item.phsix,
              [pelistheader[13]]: item.lab_text,
              [pelistheader[14]]: item.standardcost,
              [pelistheader[15]]: item.copperweight,
              [pelistheader[16]]: item.copperindex,
              [pelistheader[17]]: item.baseprice,
              [pelistheader[18]]: item.copper_base_cost,
              [pelistheader[19]]: item.other_rmc,
              [pelistheader[20]]: item.overheads,
              [pelistheader[21]]: item.fixedoverheads,
              [pelistheader[22]]: item.alp,
              [pelistheader[23]]: item.msq,
              [pelistheader[24]]: item.moq,
              [pelistheader[25]]: item.mdq,
              [pelistheader[26]]: item.owf,
              [pelistheader[27]]: item.validfrom,
              [pelistheader[28]]: item.validto,
              [pelistheader[29]]: item.remarks
            };
          });
        } else if (exportfor == 1 || exportfor == 2) {
          pelistheader = Config.masterfilesheaders.sprreport;

          this.exportdatalist = this.exportdatalist.map(item => {
            return {
              [pelistheader[0]]: item.offerno,
              [pelistheader[1]]: item.opportunity_id,
              [pelistheader[2]]: item.lappopportunityid,
              [pelistheader[3]]: item.opportunity_name,
              [pelistheader[4]]: item.customername,
              [pelistheader[5]]: item.OwnerName,
              [pelistheader[6]]: item.CreatedDate,
              [pelistheader[7]]: item.articleno,
              [pelistheader[8]]: item.description,
              [pelistheader[9]]: item.quantity,
              [pelistheader[10]]: item.sapid,
              [pelistheader[11]]: item.AssignedTo,
              [pelistheader[12]]: item.OfferBy,
              [pelistheader[13]]: item.customerpartno,
              [pelistheader[14]]: item.OfferDate,
              [pelistheader[15]]: item.itemtype,
              [pelistheader[16]]: item.primaryplant,
              [pelistheader[17]]: item.currency,
              [pelistheader[18]]: item.uom,
              [pelistheader[19]]: item.length,
              [pelistheader[20]]: item.industry_std_text,
              [pelistheader[21]]: item.pg,
              [pelistheader[22]]: item.ph,
              [pelistheader[23]]: item.phtwo,
              [pelistheader[24]]: item.phsix,
              [pelistheader[25]]: item.lab_text,
              [pelistheader[26]]: item.standardcost,
              [pelistheader[27]]: item.copperweight,
              [pelistheader[28]]: item.copperindex,
              [pelistheader[29]]: item.baseprice,
              [pelistheader[30]]: item.copper_base_cost,
              [pelistheader[31]]: item.overheads,
              [pelistheader[32]]: item.fixedoverheads,
              [pelistheader[33]]: item.msq,
              [pelistheader[34]]: item.moq,
              [pelistheader[35]]: item.mdq,
              [pelistheader[36]]: item.ValidTo,
              [pelistheader[37]]: item.surcharge_c,
              [pelistheader[38]]: item.copper_current_cost_c,
              [pelistheader[39]]: item.totalrmc_c,
              [pelistheader[40]]: item.standardcost_c,
              [pelistheader[41]]: item.finalcost_c,
              [pelistheader[42]]: item.alp_c,
              [pelistheader[43]]: item.offervalue,
              [pelistheader[44]]: item.remarks,
              [pelistheader[45]]: item.IsOfferActive,
              [pelistheader[46]]: item.IsItemDelete,
              [pelistheader[47]]: item.offeralpdate,
              [pelistheader[48]]: item.sprform_fields && item.sprform_fields != "null" ? Config.ObjecttoString(item.sprform_fields, "|") : ""
            };
          });
        } else if (exportfor == 3) {
          pelistheader = Config.masterfilesheaders.exportFilteredSPRItem;

          this.exportdatalist = this.exportdatalist.map(item => {
            return {
              [pelistheader[0]]: item.offereno,
              [pelistheader[1]]: item.articleno,
              [pelistheader[2]]: item.description,
              [pelistheader[3]]: item.customerpartno,
              [pelistheader[4]]: item.itemtype == 'STD' ? 'MFG' : item.itemtype,
              [pelistheader[5]]: item.primaryplant,
              [pelistheader[6]]: item.currency,
              [pelistheader[7]]: item.UOM,
              [pelistheader[8]]: item.length,
              [pelistheader[9]]: item.industry_std_text,
              [pelistheader[10]]: item.pg,
              [pelistheader[11]]: item.ph,
              [pelistheader[12]]: item.phtwo,
              [pelistheader[13]]: item.phsix,
              [pelistheader[14]]: item.lab_text,
              [pelistheader[15]]: item.standardcost,
              [pelistheader[16]]: item.copperweight,
              [pelistheader[17]]: item.copperindex,
              [pelistheader[18]]: item.baseprice,
              [pelistheader[19]]: item.copper_base_cost,
              [pelistheader[20]]: item.other_rmc,
              [pelistheader[21]]: item.overheads,
              [pelistheader[22]]: item.fixedoverheads,
              [pelistheader[23]]: item.alp,
              [pelistheader[24]]: item.msq,
              [pelistheader[25]]: item.moq,
              [pelistheader[26]]: item.mdq,
              [pelistheader[27]]: item.owf,
              [pelistheader[28]]: item.validfrom,
              [pelistheader[29]]: item.validto,
              [pelistheader[30]]: item.enquirycreateddate,
              [pelistheader[31]]: item.assignto,
              [pelistheader[32]]: item.remarks,
              [pelistheader[33]]: item.offeralpdate,
              [pelistheader[34]]: item.sprform_fields && item.sprform_fields != "null" ? Config.ObjecttoString(item.sprform_fields, "|") : ""
            };
          });
        }

        let fileName = 'SPR Items - ' + this.createdDate;

        this.appService.exportAsExcelFile(this.exportdatalist, fileName);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  // ExcelDateToJSDate(_date) {
  //   if (_date) {
  //     let _returnresult;
  //     if (isNaN(_date)) {
  //       _returnresult = {
  //         valid: true,
  //         date: moment(_date).format('DD-MM-YYYY')
  //       }
  //       _returnresult.datevalidate = new Date(_returnresult.date.split('-').reverse().join('-'));
  //       return _returnresult;
  //     }
  //     else {
  //       _returnresult = {
  //         valid: true,
  //         date: moment(new Date(Math.round((_date - 25569) * 86400 * 1000))).format('DD-MM-YYYY')
  //       }
  //       _returnresult.datevalidate = new Date(_returnresult.date.split('-').reverse().join('-'));
  //       return _returnresult;
  //     }
  //   } else
  //     return { valid: false, date: null };
  // }

  async GetAllArticlesbyOfferId(offerid: number) {
    await this.peactionservice.GetAllArticlesbyOfferId(offerid).then(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.OfferArticleList = response.responsedata.data;
          this.OfferArticleList.forEach(element => {
            element.files = [];
            element.documents = [];
          });
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  async openOfferListModal(offerid: number) {
    await this.GetAllArticlesbyOfferId(offerid);
    this.modalService.open(this.OfferArticlesModal, { ariaLabelledBy: 'modal-basic-title', scrollable: true, size: 'xl' });
  }

  OfferArticleFileChangeListener(event: any, itemid: number) {
    this.OfferArticleList.find(x => x.itemid == itemid).files = event.target.files;
  }

  removeOfferArticleFile(itemid: number) {
    this.OfferArticleList.find(x => x.itemid == itemid).files = [];
  }

  async onOfferArticleSave() {
    await this.PEfileUpload(this.OfferArticleList);
    this.peactionservice.SaveOfferArticleDoc(this.OfferArticleList).subscribe(response => {
      if (response.responsedata && response.responsedata.statusCode == 200) {
        this.notificationService.showSuccess(response.responsedata.message);
        this.modalService.dismissAll();
      }
    }, error => {
      this.notificationService.showError(error.error.error.message);
    });
  }

  async PEfileUpload(OfferArticles: any) {
    for (const item of OfferArticles) {
      if (item.files && item.files.length > 0) {
        await this.peactionService.upload(item.files, this.type).then(
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

  NulltoStringConversion(value) {
    return (value == null || value == undefined) ? "" : value;
  }

  ReplaceKeys(object) {
    Object.keys(object).forEach(function (key) {
      var newKey = key.replace(/\s+/g, '');
      if (object[key] && typeof object[key] === 'object') {
        this.ReplaceKeys(object[key]);
      }
      if (key !== newKey) {
        object[newKey] = object[key];
        delete object[key];
      }
    });
  }
}
