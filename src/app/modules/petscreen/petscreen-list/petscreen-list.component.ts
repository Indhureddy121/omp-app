import { DatePipe } from '@angular/common';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Config } from '@core/configs/config';
import { SampleEnum } from '@core/enums/sample.enum';
import { AuthService } from '@core/services/auth/auth.service';
import { AlertService } from '@core/services/common/alert.service';
import { SharedService } from '@core/services/common/shared.service';
import { StorageKey, StorageService } from '@core/services/common/storage.service';
import { CustomerService } from '@core/services/masters/customer.service';
import { PetService } from '@core/services/masters/pet.service';
import { ModalDismissReasons, NgbDateParserFormatter, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PagerService } from '@shared/directives';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { AppService } from 'src/app/app.service';
import { StandarditemService } from 'src/app/core/services/masters/standarditem.service';
import { environment } from 'src/environments/environment';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-petscreen-list',
  templateUrl: './petscreen-list.component.html',
  styleUrls: ['./petscreen-list.component.scss']
})
export class PetscreenListComponent implements OnInit {

  PETMasterForm: FormGroup;
  importmodel: FormGroup;

  userid: number;
  createdDate: any;
  sortDirection: string = 'ASC';
  searchValue: string = '';
  sortField: any;
  petmasterlist: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 10;
  totalRows: number;
  pager: any = {};
  closeResult: string;
  fileData: any;
  fileUploaded: any;
  file: any;
  storeData: any;
  worksheet: XLSX.WorkSheet;
  jsonData: any[];
  importData: any[];
  importItemDetail: any[];
  type: string = 'petmaster';
  filename: string;
  isShowDownload: boolean = false;
  headerList: string[];
  savedResult: any;
  exportdatalist: any[] = [];
  submitted: boolean = false;
  @ViewChild('DeleteConfirmationModal', { static: false }) DeleteConfirmationModal: any;
  @ViewChild('AddEditItemModal', { static: false }) AddEditItemModal: any;
  deleteConfirmModel = Object();
  searchModel = Object();
  petmasterId: number;
  dateFormate: any;
  validfromDate: any;
  soDate: { year: number; month: number; day: number };
  todayDate: string;
  @Input() isAcccessible: boolean = false;
  todayMinDate: { year: number; month: number; day: number };
  emailPattern = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  DealersList: any[] = [];
  Dealer: string;
  isDealer: boolean = false;
  petType: number = 0;
  petTypes: any[] = [
    { code: 0, description: "All" },
    { code: 10, description: "Offer" },
    { code: 20, description: "CPO" },
    { code: 30, description: "Manual" }
  ];

  constructor(
    private pagerServcie: PagerService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    private modalService: NgbModal,
    private standarditemService: StandarditemService,
    private petmasterService: PetService,
    private datePipe: DatePipe,
    private sharedService: SharedService,
    public formatter: NgbDateParserFormatter,
    private customerService: CustomerService,
    private storageService: StorageService
  ) { }

  get petMasterForm() { return this.PETMasterForm.controls }

  ngOnInit() {
    this.onLoad();
    this.todayDate = moment().format('DD/MM/YYYY');
    this.todayMinDate = this.sharedService.convertDate(this.todayDate);
    this.dateFormate = this.authService.getDateFormat();

    const data = JSON.parse(this.storageService.getValue(StorageKey.currentUser));
        this.isDealer = data.isdealer; //data.role_code === 'Admin' || data.ischannelpartner === 1;
  }

  onLoad() {
    this.userid = this.authService.getUserId();
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.onBuildForm();
    this.getCount();
  }

  public onBuildForm() {
    this.importmodel = this.formBuilder.group({
      importFile: null
    });

    this.PETMasterForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      gst: [null, [Validators.required, Validators.pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/)]],
      email: [null, [Validators.required, Validators.pattern(this.emailPattern)]],
      phone: [null, [Validators.required]],
      lapparticleno: [null, [Validators.required]],
      qty: [null, [Validators.required]],
      netprice: [null, [Validators.required]],
      date: [null],
      sono: [null, [Validators.required]],
      sodate: [null, [Validators.required]]
    });
  }

  downloadSample() {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/sample/' + SampleEnum.petmaster;
    FileSaver.saveAs(url, SampleEnum.petmaster);
  }

  public getCount() {
    this.searchModel.searchtext = this.searchValue;

    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField, dealer: this.Dealer, petType: this.petType }
    this.petmasterService.getPETMasterCount(filtermodel).subscribe(
      response => {
        if (response) {
          this.totalRows = response.petmaster[0].count;
          if (this.totalRows > 0)
            this.getData(this.pageSize);
          else
            this.petmasterlist = [];
        }
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
  }

  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField, dealer: this.Dealer, petType: this.petType }

    this.petmasterService.getPETMasterList(filtermodel).subscribe(
      response => {
        this.petmasterlist = response.petmaster;
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData(this.pageSize);
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.pageNumber = 1;
    this.getCount();
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    if (this.sortDirection && this.sortDirection === 'DESC')
      this.sortDirection = 'ASC';
    else if (this.sortDirection && this.sortDirection === 'ASC')
      this.sortDirection = 'DESC';

    var table = document.getElementById('table-petmaster');
    var targetTHs = table.querySelectorAll('tr > th');
    for (var i = 0; i < targetTHs.length; i++) {
      var th = targetTHs[i];
      th.className = "";
    }
    document.getElementById(event.target.id).className = this.sortDirection;
    this.pageNumber = 1;
    this.getData(this.pageSize);
  }

  public getLog() {
    this.router.navigateByUrl('/petscreen/logs');
  }

  public open(content) {
    this.isShowDownload = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
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

  public onDismiss() {
    this.isShowDownload = false;
    this.modalService.dismissAll();
  }

  uploadedFile(event) {
    var validExts = new Array(".xlsx", ".xls");
    var fileExt = event.target.files[0].name;
    fileExt = fileExt.substring(fileExt.lastIndexOf('.'));
    if (validExts.indexOf(fileExt) < 0) {
      this.alertService.showError("Invalid file selected, valid files are of " + validExts.toString() + " types.");
      return false;
    }
    else {
      this.fileUploaded = event.target.files[0];
      this.file = event.target.files[0];
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
    readFile.readAsArrayBuffer(this.fileUploaded);
  }

  onSave() {
    if (this.readAsJson()) {
      if (this.validateFileData()) {
        this.uploadFile(this.file);
      }
    }
  }

  readAsJson() {
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: true, defval: null });
    this.importData = this.jsonData;
    let data = []
    for (let key in this.importData[0]) {
      if (data.length != Config.masterfilesheaders.petmaster.length)
        data.push(key.trim());
    }
    this.headerList = data;

    if (JSON.stringify(this.headerList) != JSON.stringify(Config.masterfilesheaders.petmaster)) {
      this.alertService.showError('Incorrect Template used. Please download correct template before importing.');
      return false;
    } else
      return true;
  }

  public validateFileData() {
    if (this.importData == undefined) {
      this.alertService.showError('File contains some invalid data.');
      return;
    } else if (this.importData != undefined) {
      if (this.importData.length <= 0) {
        this.alertService.showError('File contains no data.');
        return;
      }
    }

    return true;
  }

  uploadFile(file: any) {
    this.standarditemService.upload(file, this.type).subscribe(
      response => {
        this.filename = response;
        this.saveData(this.filename.toString());
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
  }

  public exportfiles(file: any) {
    let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/petmaster/logs/' + file;
    FileSaver.saveAs(url, file);
  }

  private saveData(fileresponse: any) {
    this.petmasterService.importpetmaster(fileresponse).subscribe(
      response => {
        if (response) {
          this.savedResult = response.result;
          this.isShowDownload = true;
          let url = environment.apiUrl.substring(0, environment.apiUrl.length - 7) + 'uploads/petmaster/logs/' + this.savedResult.status_file_name;
          FileSaver.saveAs(url, this.savedResult.status_file_name);
          this.alertService.showSuccess("Imported successfully.");
          this.getCount();
        }
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
  }

  public onExport() {
    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField, dealer: this.Dealer }
    this.petmasterService.getPETMasterList(filtermodel).subscribe(
      response => {
        this.exportdatalist = response.petmaster;
        let listData = [];
        if (this.exportdatalist) {
          listData = this.exportdatalist;

          listData.forEach(element => {
            delete element.hsn_lastupdated_by;
            delete element.hsn_lastupdated_date;
            delete element.id;
            delete element.total;
          });
        }

        let petmasterheader = Config.masterfilesheaders.petmaster;

        if (this.isDealer) {
          listData = listData.map(item => {
            return {
              [petmasterheader[0]]: item.customername,
              [petmasterheader[1]]: item.gstno,
              [petmasterheader[2]]: item.email,
              [petmasterheader[3]]: item.phone,
              [petmasterheader[4]]: item.lapparticleno,
              [petmasterheader[5]]: item.quantity,
              [petmasterheader[6]]: item.netprice,
              [petmasterheader[7]]: item.date && !item.date.includes("0000-00-00") ? moment(item.date).format("DD-MMM-YYYY") : '',
              [petmasterheader[8]]: item.sono,
              [petmasterheader[9]]: moment(item.sodate).format("DD-MMM-YYYY")
            };
          });
        } else {
          listData = listData.map(item => {
            return {
              "Dealer": item.dealername,
              [petmasterheader[0]]: item.customername,
              [petmasterheader[1]]: item.gstno,
              [petmasterheader[2]]: item.email,
              [petmasterheader[3]]: item.phone,
              [petmasterheader[4]]: item.lapparticleno,
              [petmasterheader[5]]: item.quantity,
              [petmasterheader[6]]: item.netprice,
              [petmasterheader[7]]: item.date && !item.date.includes("0000-00-00") ? moment(item.date).format("DD-MMM-YYYY") : '',
              [petmasterheader[8]]: item.sono,
              [petmasterheader[9]]: moment(item.sodate).format("DD-MMM-YYYY")
            };
          });
        }

        let fileName = 'PET Master - ' + this.createdDate;
        this.appService.exportAsExcelFile(listData, fileName);
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
  }

  OpenDeletePopup(index: number) {
    this.deleteConfirmModel.index = index;
    this.modalService.open(this.DeleteConfirmationModal, { centered: true, size: 'md', backdrop: 'static' });
  }

  onPETMasterDelete(event) {
    this.petmasterService.deletepetmaster(event.model.index).subscribe(
      response => {
        if (response) {
          this.getCount();
          this.alertService.showSuccess('PET Master deleted successfully.');
          this.modalService.dismissAll('delete');
        }
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
  }

  OpenAddEditPETMasterPopup(id: number) {
    if (id) {
      this.petmasterService.getPETMasterData(id).subscribe(
        response => {
          if (response.data) {
            this.petmasterId = response.data[0].id;
            this.petMasterForm.name.setValue(response.data[0].name);
            this.petMasterForm.gst.setValue(response.data[0].gst);
            this.petMasterForm.email.setValue(response.data[0].email);
            this.petMasterForm.phone.setValue(response.data[0].phone);
            this.petMasterForm.lapparticleno.setValue(response.data[0].lapparticleno);
            this.petMasterForm.qty.setValue(response.data[0].qty);
            this.petMasterForm.netprice.setValue(response.data[0].netprice);

            this.validfromDate = response.data[0].date && !response.data[0].date.includes("0000-00-00") ? this.sharedService.convertDate(this.validateandConvertDatetoFormat(response.data[0].date)) : null;
            this.petMasterForm.date.setValue(this.validfromDate);

            this.soDate = response.data[0].sodate && !response.data[0].sodate.includes("0000-00-00") ? this.sharedService.convertDate(this.validateandConvertDatetoFormat(response.data[0].sodate)) : null;
            this.petMasterForm.sodate.setValue(this.soDate);
            this.petMasterForm.sono.setValue(response.data[0].sono);
          }
        }, error => {
          this.alertService.showError(error.error.error.message);
        });
    } else {
      this.petmasterId = null;
      this.petMasterForm.name.setValue(null);
      this.petMasterForm.gst.setValue(null);
      this.petMasterForm.email.setValue(null);
      this.petMasterForm.phone.setValue(null);
      this.petMasterForm.lapparticleno.setValue(null);
      this.petMasterForm.qty.setValue(null);
      this.petMasterForm.netprice.setValue(null);
      this.validfromDate = null;
      this.petMasterForm.date.setValue(null);
      this.soDate = null;
      this.petMasterForm.sodate.setValue(null);
      this.petMasterForm.sono.setValue(null);
    }

    this.submitted = false;
    this.modalService.open(this.AddEditItemModal, { size: 'lg', backdrop: 'static' });
  }

  onPETMasterSaveClick() {
    this.submitted = true;

    if (this.PETMasterForm.invalid)
      return;

    let petmasterheader = Config.masterfilesheaders.petmaster;
    let petmastersavemodel = [{
      id: this.petmasterId ? this.petmasterId : 0,
      [petmasterheader[0]]: this.petMasterForm.name.value,
      [petmasterheader[1]]: this.petMasterForm.gst.value ? this.petMasterForm.gst.value : 0,
      [petmasterheader[2]]: this.petMasterForm.email.value ? this.petMasterForm.email.value : 0,
      [petmasterheader[3]]: this.petMasterForm.phone.value ? this.petMasterForm.phone.value : 0,
      [petmasterheader[4]]: this.petMasterForm.lapparticleno.value ? this.petMasterForm.lapparticleno.value : 0,
      [petmasterheader[5]]: Number(this.petMasterForm.qty.value) ? this.petMasterForm.qty.value : 0,
      [petmasterheader[6]]: Number(this.petMasterForm.netprice.value) ? this.petMasterForm.netprice.value : 0,
      [petmasterheader[7]]: this.createDateObject(this.petMasterForm.date.value),
      [petmasterheader[8]]: this.petMasterForm.sono.value,
      [petmasterheader[9]]: this.createDateObject(this.petMasterForm.sodate.value)
    }]

    this.petmasterService.savepetmaster(petmastersavemodel).subscribe(
      response => {
        this.getCount();
        this.alertService.showSuccess('PET Master saved successfully.');
        this.modalService.dismissAll();
      }, error => {
        this.alertService.showError(error.error.error.message);
      });
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
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.DealersList = response.responsedata.data;
        else
          this.DealersList = [];
      }, error => {
        this.DealersList = [];
        this.alertService.showError(error.error.error.message);
      });
  }

  onDealerChange() {
    this.getCount();
  }

  onPETTypeChange(event: any) {
    if (!event)
      this.petType = 0;

    this.getCount();
  }

  createDateObject(date) {
    return date ? date.year + "-" + date.month + "-" + date.day : "0000-00-00";
  }

  validateandConvertDatetoFormat(date: any) {
    return date != null && date != undefined && date != "" && !date.includes("0000-00-00") ? this.datePipe.transform(date, this.dateFormate) : null
  }

  displayDateinFormat(date: any) {
    return date != null && date != undefined && date != "" && !date.includes("0000-00-00") ? this.datePipe.transform(date, "dd-MM-yyyy") : null
  }

  getPETType(pettype: number) {
    return this.petTypes.find(pt => pt.code === pettype).description;
  }

  showActionColumn(pettype: number) {
    return pettype === 30 && this.isDealer;
  }
}
