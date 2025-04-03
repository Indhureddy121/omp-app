import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { PagerService } from 'src/app/core/services/common/pager.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ImportCopperIndexService } from '@core/services/masters/import-copper-index.service';
import { CSVRecord, StatusData } from '@module/masters/CSV';
import { AuthService } from '@core/services/auth/auth.service';
import { AppService } from 'src/app/app.service';
import { DatePipe } from '@angular/common';
import { timestamp } from 'rxjs/operators';
import { IfStmt } from '@angular/compiler';
import { Router } from '@angular/router';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { NotificationService } from '@core/services/common/notification.service';


@Component({
  selector: 'app-importcopperindex',
  templateUrl: './importcopperindex.component.html',
  styleUrls: ['./importcopperindex.component.css']
})

// @ViewChild('fileInput') ElementRef;
// @ViewChild('addbutton') addButtonRef: ElementRef;
export class ImportcopperindexComponent implements OnInit {
  parsedCsv: string[][];
  sampleData = [
    {

      "Material_No": "ITM001",
      "Description": "item 1",
      "Copper_Index": 222.33
    },
    {

      "Material_No": "ITM002",
      "Description": "item 2",
      "Copper_Index": 24
    }
  ]


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
  indexList: any[] = [];

  importData: any[];
  headerList: string[];
  currentDate: string;
  isShowDownload: boolean = false;
  historyList: any;
  file: any;
  itemDetail: any[];
  file_name: any;
  currentUser: any;
  exportData: any;
  type = "CopperIndex"
  csvContent: any;
  fileUploaded: any;

  storeData: any;
  worksheet: XLSX.WorkSheet;
  jsonData: unknown[];

  constructor(
    private pagerServcie: PagerService,
    private modalService: NgbModal,
    private formBuilder: FormBuilder,
    private router: Router,
    private importCopperIndexService: ImportCopperIndexService,
    private authService: AuthService,
    private appService: AppService,
    private datePipe: DatePipe,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.onBuildForm();
    this.getCount(this.searchValue);
    this.headerList = ['Material_No', 'Description', 'Copper_Index']
  }


  private getCount(searchValue) {
    this.importCopperIndexService.getCount(this.searchValue).subscribe(
      response => {
        this.totalRows = response.listCount
        this.getData();
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  uploadedFile(event) {
    this.fileUploaded = event.target.files[0];
    this.file = event.target.files[0]
    this.readExcel();
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

  private getData() {
    let skipdata = this.pageSize * (this.pageNumber - 1);
    let filtermodel = { skip: skipdata, limit: this.pageSize, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.importCopperIndexService.getCopperIndexList(filtermodel).subscribe(
      response => {
        this.indexList = response.indexList
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }



  setPage(page: number) {
    this.pageNumber = page;
    this.getData();
  }

  onSearch(response) {
    this.searchValue = '';
    if (response && response.searchValue) {
      this.searchValue = response.searchValue;
    }
    this.getCount(this.searchValue);
  }

  headerClick(event: any) {
    this.sortField = event.target.id;
    this.pageNumber = 1
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
  // onRowDoubleClick(id: number) {
  //   this.router.navigate(['/masters/additionalcharges/view/' + id]);
  // }


  private onBuildForm() {
    this.currentDate = this.datePipe.transform(new Date(), this.authService.getDateFormat())
    this.currentUser = this.authService.getUserId()
    this.importmodel = this.formBuilder.group({
      importFile: null
    });
  }

  open(content) {
    this.isShowDownload = false
    // this.importData = []
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {

      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }



  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  private isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }
  private getHeaderArray(csvRecordsArr: any) {
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
  private getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    var dataArr = []

    for (let i = 1; i < csvRecordsArray.length; i++) {
      let curruntRecord = (<string>csvRecordsArray[i]).replace('\"', '').split(',');
      let csvRecord: CSVRecord = new CSVRecord();
      if (curruntRecord.length == headerLength) {

        if (curruntRecord[0] != undefined) {
          if (curruntRecord[0].toString() != "" || curruntRecord[1].toString() != "" || curruntRecord[2].toString() || "" && curruntRecord[3].toString() != "") {
            csvRecord.id = Number(curruntRecord[0])
            csvRecord.Material_No = curruntRecord[1].trim();
            csvRecord.Description = curruntRecord[2].trim();
            csvRecord.Copper_Index = Number(curruntRecord[3]);
            dataArr.push(csvRecord);
          }
        }
        else {
          if (curruntRecord[0].toString() != "" || curruntRecord[1].toString() != "" || curruntRecord[2].toString() || "" && curruntRecord[3].toString() != "") {

            csvRecord.Material_No = curruntRecord[1].trim();
            csvRecord.Description = curruntRecord[2].trim();
            csvRecord.Copper_Index = Number(curruntRecord[3]);
            dataArr.push(csvRecord);
          }

        }
      }
    }
    return dataArr;
  }
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






  onFileLoad(fileLoadedEvent) {
    const csvSeparator = ';';
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
    // alert(textFromFileLoaded);

    const txt = textFromFileLoaded;
    const csv = [];
    const lines = txt.split('\n');
    lines.forEach(element => {
      const cols: string[] = element.split(csvSeparator);
      csv.push(cols);
    });
    this.parsedCsv = csv;
  }

  public onSubmit(file) {
    this.itemDetail
    this.importCopperIndexService.upload(file, this.type).subscribe(
      response => {
        this.file_name = response
        this.create(this.file_name)


        //this.router.navigateByUrl('/importcopperindex/list');
        // this.onHistory()
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }
  public create(filename) {

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

    this.importCopperIndexService.Create(logData).subscribe(
      response => {
        var result = response.importhistory

        //this.router.navigateByUrl('/importcopperindex/list');
        this.onHistory(result)
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  public onSave() {
    this.readAsJson()
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
    this.itemDetail = this.importData;

    for (let i = 0; i < this.importData.length; i++) {

      this.importData[i].Remarks = ""

      if (this.importData[i].Material_No == '') {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Item Code cannot be blank' : 'Item Code cannot be blank'
      }

      if (this.numericOnlyZeroNotAllowed(this.importData[i].Copper_Index)) {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Invalid Copper Index ' : ' Invalid Copper Index '
      }

      let duplicateitemCodeData = this.itemDetail.filter(e => e.Material_No == this.importData[i].Material_No);
      if (duplicateitemCodeData.length > 1 && this.importData[i].Material_No != "") {
        this.importData[i].status = false
        this.importData[i].Remarks += this.importData[i].Remarks != "" ? ' and Duplicate item code ' : 'Duplicate item code';
      }
      if (this.importData[i].status != false) {
        this.importData[i].status = true
        this.importData[i].Remarks = "Success"
      }
    }

    this.onImport()
    this.isShowDownload = true;
    this.onSubmit(this.file); //on submit
  }


  public onImport() {
    let data = [];

    this.importData.forEach(element => {
      if (element.status == true) {
        element.created_by = this.authService.getUserId();

        data.push(element);
      }

    });
    this.importCopperIndexService.updateCooperIndex(data).subscribe(
      response => {
        this.notificationService.showSuccess("Imported Successfully");
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private numericOnlyZeroNotAllowed(data: any): any {
    if (data == undefined || data == null) {
      return;
    }
    return (data.toString().match(/^\d{0,5}(\.\d{1,2})?$/)) ? false : true;
  }

  public onExport() {


    let filtermodel = { skip: 0, limit: 0, sortBy: this.sortDirection, searchValue: this.searchValue, sortField: this.sortField }
    this.importCopperIndexService.getCopperIndexList(filtermodel).subscribe(
      response => {
        this.exportData = response.indexList
        this.pager = this.pagerServcie.getPager(this.totalRows, this.pageNumber);
        let fileName = 'Status - ' + this.currentDate;
        var link = this.appService.downloadFile(this.exportData, fileName, this.headerList);
        link.click();
        document.body.removeChild(link);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });


    //new Angular5Csv( this.indexList, 'F:/OMP_DOC/sheet/test.csv',this.options);

  }

  public exportfiles(isSample: boolean) {

    if (isSample) {

      let date = this.datePipe.transform(new Date(), 'medium')
      let fileName = 'Sample - ' + date;
      // this.headerList = ['Material_No', 'Description', 'Copper_Index']

      var link = this.appService.downloadFile(this.sampleData, fileName, this.headerList);
      link.click();
      document.body.removeChild(link);

    }
    else {
      let date = this.datePipe.transform(new Date(), 'medium')
      let fileName = 'Status - ' + date;

      if (this.importData)
        var link = this.appService.downloadFile(this.importData, fileName, this.headerList);
      link.click();
      document.body.removeChild(link);
    }
  }
  public onDismiss() {
    this.isShowDownload = false;
    this.modalService.dismissAll();
    this.importData = []
    this.setPage(1)
  }

  public onHistory(importData) {
    let statusRecords: StatusData = new StatusData()
    statusRecords.type = this.type,
      statusRecords.StatusDetail = this.importData,
      statusRecords.fileName = this.file_name,

      statusRecords.fileId = importData.id

    let data = []

    for (let key in statusRecords.StatusDetail[0]) {
      if (key == 'id' || key == 'status' || key == 'created_by') {

      }
      else {
        data.push(
          {
            id: key,
            title: key
          });
      }

    }

    console.log(data)
    statusRecords.HeaderFields = data

    this.importCopperIndexService.updateStatus(statusRecords).subscribe(
      response => {

        this.notificationService.showSuccess('Imported Successfully')
        // this.router.navigateByUrl('/importcopperindex/Logs');
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });

  }

  public getLog() {
    this.router.navigateByUrl('masters/importcopperindex/logs');
  }

}
