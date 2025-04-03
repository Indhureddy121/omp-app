import { Component, OnInit } from '@angular/core';
import { PagerService } from '@shared/directives';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { StandarditemService } from '@core/services/masters/standarditem.service';
import { AuthService } from '@core/services/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { StatusData, RateContractRecords, CSVRecord } from '@module/masters/CSV';
import { RatecontractService } from '@core/services/masters/ratecontract.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import * as moment from 'moment';
import { SampleEnum } from '@core/enums/sample.enum';
import { FilesService } from '@core/services/common/files.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-importratecontract',
  templateUrl: './importratecontract.component.html',
  styleUrls: ['./importratecontract.component.css']
})
export class ImportratecontractComponent implements OnInit {

  isShowDownload: boolean;
  closeResult: string;
  statusData: any[];
  linkDisable: boolean = true;
  importmodel: FormGroup;
  csvRecord: any;
  csvRecords: any[];
  pageNumber = 1;
  pageSize = 10;
  sortField = '';
  sortDirection = 'DESC';
  totalRows: number;
  pager: any = {};
  searchValue: string = '';
  importData: any;
  currentUser: any;
  stditmList: any[] = [];
  StandardItemDetail: any;
  file_name: any;
  file: any;
  dateformatdata: any;
  type = 'rateContract'
  sampleData: any
  rateContractList: any[] = [];
  headerList = ['contract_code', 'client_code', 'item_code', 'contract_type', 'description', 'min_qty', 'price']
  ItemDetail: any;
  fileUploaded: any;
  storeData: any;
  worksheet: any;
  jsonData: any;
  fileData: any;
  headerFields: any[];
  createdDate: any;
  currentDate: Date;

  constructor(
    private pagerServcie: PagerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private ratecontractService: RatecontractService,
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe,
    private fileservice: FilesService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }
  private onLoad() {
    this.onBuildForm();
    this.headerFields = []
    this.getCount(this.searchValue);
    this.sampleData = [
      {

        "contract_code": "CT123",
        "client_code": "CLT123",
        "item_code": "ITM001",
        "contract_type": "TYP1",
        "description": "Type 1",
        "min_qty": 300,
        "price": 5000,
      },
      {
        "contract_code": "CT002",
        "client_code": "CLT0001",
        "item_code": "ITM002",
        "contract_type": "TYP2",
        "description": "Type 2",
        "min_qty": 300,
        "price": 5000,
      }
    ]

  }
  private onBuildForm() {
    this.currentDate = new Date(Date.now());
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");

    this.dateformatdata = this.authService.getDateFormat()
    this.currentUser = this.authService.getUserId()
    this.importmodel = this.formBuilder.group({
      importFile: null
    });
  }

  public getCount(searchValue) {
    this.ratecontractService.getCount(searchValue).subscribe(
      response => {
        this.totalRows = response.count
        this.getData(this.pageSize);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  public getData(pageSize) {
    let skipdata = pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.ratecontractService.getRateContractDetail(filtermodel).subscribe(
      response => {
        this.stditmList = response.standardItemList
        let data = []
        for (let key in this.stditmList[0]) {
          data.push(
            key)
        }
        this.headerList = data
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  setPage(page: number) {
    this.pageNumber = page;
    this.getData(this.pageSize);
  }

  onSearch(response) {
    this.searchValue = ' ';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.getCount(this.searchValue);
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
    this.getData(this.pageSize);
  }

  public getLog() {
    this.router.navigateByUrl('masters/ratecontract/logs');

  }

  public open(content) {
    this.isShowDownload = false
    this.importData = []
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
    this.setPage(1)
  }

  downloadSample() {
    this.fileservice.downloadSample(SampleEnum.rateContract).subscribe(
      response => {
        this.fileData = response.filedata;

        var sliceSize = 512;
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

        const blob = new Blob(byteArrays, { type: 'application/vnd.ms-excel' });
        FileSaver.saveAs(blob, SampleEnum.rateContract);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  public onSave() {
    this.readAsJson()
    if (this.validateFileData()) {
      this.uploadFile(this.file); // onImport
      this.isShowDownload = true;
      this.AddStandardItem()
    }

    //onImport()

    //onsubmit()
  }

  public validateFileData() {
    if (this.importData == undefined) {
      this.notificationService.showError('Please Select Valid File')
      return
    }
    if (this.importData != undefined) {
      if (this.importData.length <= 0) {
        this.notificationService.showError('Please Select Valid File')
        return
      }

    }
    this.ItemDetail = this.importData;

    for (let i = 0; i < this.importData.length; i++) {

      this.importData[i].Remarks = ""
      let str = (this.importData[i].client_code + '-' + this.importData[i].item_code).toString()

      if (this.importData[i].item_code == '') {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Item Code. cannot be blank' : 'Item Code. cannot be blank'
      }

      if (this.importData[i].client_code == '') {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Client Code. cannot be blank' : 'Client Code. cannot be blank'
      }

      if (this.importData[i].contract_code == '') {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Contract Code. cannot be blank' : 'Contract Code. cannot be blank'
      }

      if (this.importData[i].contract_type == '') {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Contract Type. cannot be blank' : 'Contract Type. cannot be blank'
      }

      let unique = this.ItemDetail.filter(e => e.fullDesc == str)

      if (unique.length > 1) {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and There should be unique client code & item code combination ' : 'There should be unique client code & item code combination ';

      }

      let duplicateitemCodeData = this.ItemDetail.filter(e => e.contract_code == this.importData[i].contract_code);


      if (duplicateitemCodeData.length > 1 && this.importData[i].contract_code != "") {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Duplicate Contract Code ' : 'Duplicate Contract Code';
      }
      if (this.numericOnlyZeroNotAllowed(this.importData[i].price)) {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Invalid ALP Price ' : ' Invalid ALP Price '
      }

      if (this.numericOnlyZeroNotAllowed(this.importData[i].min_qty)) {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Invalid Minimum Quantity. ' : ' Invalid Minimum Quantity. '
      }

      if (this.importData[i].min_qty <= 0) {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Minimum Quantity. should be greater than 0 ' : ' Invalid Minimum Quantity. should be greater than 0 '

      }
      if (this.importData[i].status != false) {
        this.importData[i].status = true
        this.importData[i].Remarks = "Success"
      }

      /// date validation
    }

    return true
  }

  public numericOnlyZeroNotAllowed(data: any): any {
    if (data == undefined || data == null) {
      return;
    }
    return (data.toString().match(/^[1-9][0-9]*$/)) ? false : true;
  }


  public onExport(isStatus) {
    this.getData(0)
    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    let fileName = this.type + ' - ' + this.currentDate;

    this.ratecontractService.getRateContractDetail(filtermodel).subscribe(
      response => {
        this.stditmList = response.standardItemList

        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);

        let listData = []
        if (this.stditmList) {
          listData = this.stditmList
          listData.forEach(element => {
            delete element.created_by
            delete element.created_date
            delete element.id
          });
          if (listData) {
            let data = []
            for (let key in listData[0]) {
              data.push(
                key)
            }
            this.headerList = data
          }

        }
        var link = this.appService.downloadFile(listData, fileName, this.headerList);
        link.click();
        document.body.removeChild(link);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });


  }

  // export status or sample file
  public exportfiles(isSample: boolean) {
    let date = this.datePipe.transform(new Date(), 'medium')
    let fileName = 'Status - ' + date;
    var header = this.headerList
    header.push('Remarks')
    var listData = []
    if (this.importData) {
      listData = this.importData
      listData.forEach(element => {
        delete element.created_by
        delete element.created_date
        delete element.id
      });
      if (listData) {
        let data = []
        for (let key in listData[0]) {
          data.push(
            key)
        }
        this.headerList = data

      }
    }
    var link = this.appService.downloadFile(listData, fileName, this.headerList);
    link.click();
    document.body.removeChild(link);
  }


  /// file function
  public fileChangeListener(event: any): void {
    if (this.isCSVFile(event.target.files[0])) {
      this.file = event.target.files[0]
      var input = event.target;
      var reader = new FileReader();
      reader.readAsText(input.files[0]);

      reader.onload = (data) => {
        let csvData = reader.result;
        let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

        let headersRow = this.getHeaderArray(csvRecordsArray);
        this.importData =
          this.getDataRecordsArrayFromCSVFile(csvRecordsArray,
            headersRow.length);
      }
      reader.onerror = function () {
        alert('Unable to read ' + input.files[0]);

      };
      // this.onSubmit(event.target.files[0]);
    } else {
      this.notificationService.showError('Please import valid .csv file.');
      //this.fileReset();
    }
  }

  // check if file is of proper extension
  public isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  //get headersRow
  public getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(',');
    let headerArray = [];


    // if (this.headerList.length != headers.length) {
    //   this.notificationService.showError('header fields are not match, please download sample file')
    //   return
    // }

    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  public getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = []

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).split(',');
      let csvRecord: RateContractRecords = new RateContractRecords();
      if (curruntRecord.length == headerLength) {

        if (curruntRecord[0] != undefined) {
          if (curruntRecord[0].toString() != "" || curruntRecord[1].toString() != "" || curruntRecord[2].toString() || ""
            && curruntRecord[3].toString() != "" && curruntRecord[4].toString() != "" && curruntRecord[5].toString() != ""
            && curruntRecord[6].toString()) {

            csvRecord.contract_code = curruntRecord[0].trim();
            csvRecord.client_code = curruntRecord[1].trim();
            csvRecord.item_code = curruntRecord[2];
            csvRecord.contract_type = curruntRecord[3];
            csvRecord.description = curruntRecord[4];
            csvRecord.min_qty = Number(curruntRecord[5]);
            csvRecord.price = Number(curruntRecord[6]);
            csvRecord.fullDesc = (curruntRecord[1].trim() + '-' + curruntRecord[2].trim()).toString();
            dataArr.push(csvRecord);
          }
        }
        else {
          if (curruntRecord[0].toString() != "" || curruntRecord[1].toString() != "" || curruntRecord[2].toString() || "" && curruntRecord[3].toString() != "" || curruntRecord[3].toString() != "") {

            // csvRecord.Material_No = curruntRecord[1].trim();
            // csvRecord.Description = curruntRecord[2].trim();
            // csvRecord.Copper_Index = Number(curruntRecord[3]);
            // dataArr.push(csvRecord);
          }

        }


      }
    }
    return dataArr;
  }


  uploadedFile(event) {
    if (this.isCSVFile(event.target.files[0])) {
      this.fileUploaded = event.target.files[0];
      this.file = event.target.files[0]
      this.readExcel();
    }
    else {
      this.notificationService.showError("Please select valid file")
    }

  }
  readExcel() {
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
  readAsJson() {
    this.jsonData = XLSX.utils.sheet_to_json(this.worksheet, { raw: false });
    this.importData = this.jsonData
    var datajson = JSON.stringify(this.jsonData);
    // const data: Blob = new Blob([datajson], { type: "application/json" });  
    // FileSaver.saveAs(data, "JsonFile" + new Date().getTime() + '.json');  
  }

  public uploadFile(file) {

    this.ratecontractService.upload(file, this.type).subscribe(
      response => {
        this.file_name = response
        this.AddRateContractLog(this.file_name)


        //this.router.navigateByUrl('/importcopperindex/list');

      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  public onHistory(resultData) {
    let statusRecords: StatusData = new StatusData()
    // this.importData.forEach(element => {

    // });
    statusRecords.StatusDetail = this.importData,
      statusRecords.fileName = this.file_name
    statusRecords.fileId = resultData.id
    statusRecords.type = this.type
    let data = []
    for (let key in statusRecords.StatusDetail[0]) {
      data.push(
        {
          id: key,
          title: key
        });
    }

    statusRecords.HeaderFields = data

    this.ratecontractService.updateStatus(statusRecords).subscribe(
      response => {

        // this.notificationService.showSuccess('')
        // this.router.navigateByUrl('/importcopperindex/Logs');
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  public AddRateContractLog(filename) {

    var name = filename.split('.');

    let logData: any = {
      imported_on: new Date(),
      imported_by: this.currentUser,
      imported_file_path: "uploads/" + this.type + "/" + filename,
      status_file_path: " ",
      status_file_name: " ",
      imported_file_name: filename,
      type: this.type

    }

    this.ratecontractService.Create(logData).subscribe(
      response => {
        var result = response.importhistory

        //this.router.navigateByUrl('/importcopperindex/list');
        this.onHistory(result)
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  public AddStandardItem() {
    let data = [];

    this.importData.forEach(element => {
      if (element.status == true) {
        element.created_by = this.authService.getUserId();
        element.created_date = this.createdDate
        element.valid_from_date = moment(element.valid_from_date).format("YYYY-MM-DD HH:mm:ss");
        element.valid_to_date = moment(element.valid_to_date).format("YYYY-MM-DD HH:mm:ss");
        data.push(element);
      }

    });
    this.ratecontractService.updateRateContract(data).subscribe(
      response => {
        this.notificationService.showSuccess("Imported uccessfully");
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }
}
