import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Utils } from '@core/helper/utils';
import { debounce, map, first } from 'rxjs/operators';
import { Observable, timer, fromEvent, merge } from 'rxjs';
import { Router } from '@angular/router';
import { StorageKey, StorageService } from '@core/services/common/storage.service';
import * as moment from 'moment';

@Component({
  selector: 'app-list-sub-header',
  templateUrl: './app-list-sub-header.component.html',
  styleUrls: ['./app-list-sub-header.component.css']
})
export class AppListSubHeaderComponent implements OnInit, OnChanges {

  @Input() isAuthorize: boolean;
  @Input() isCancel: boolean;
  @Input() isDownload: boolean;
  @Input() isAdd: boolean;
  @Input() isExport: boolean;
  @Input() isExporttoPDF: boolean;
  @Input() isUpload: boolean;
  @Input() isHistory: boolean;
  @Input() isSearch: boolean;
  @Input() isRefresh: boolean;
  @Input() isSAPRefresh: boolean;
  @Input() isSFDCRefresh: boolean;


  @Output() cancelClicked = new EventEmitter();
  @Output() authorizeClicked = new EventEmitter();
  @Output() downloadClicked = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Output() editClicked = new EventEmitter();
  @Output() exportClicked = new EventEmitter();
  @Output() exporttopdfClicked = new EventEmitter();
  @Output() uploadClicked = new EventEmitter();
  @Output() historyClicked = new EventEmitter();
  @Output() searchClicked = new EventEmitter();
  @Output() refreshClicked = new EventEmitter();
  @Output() saprefreshClicked = new EventEmitter();
  @Output() sfdcrefreshClicked = new EventEmitter();

  @Input() isAuthorizeDisable: boolean;
  @Input() isCancelDisable: boolean;
  @Input() isAddDisable: boolean;
  @Input() isExportDisable: boolean;
  @Input() isExporttoPDFDisable: boolean;
  @Input() isUploadDisable: boolean;
  @Input() isHistoryDisable: boolean;
  @Input() isSearchDisable: boolean;
  @Input() isRefreshDisable: boolean;
  @Input() isSAPRefreshDisable: boolean;
  @Input() isSFDCRefreshDisable: boolean;
  @Input() isResetFilterDisable:boolean;

  @Input() isDownloadDisable: boolean;
  commonResourceModel: any = {};

  defaultAllScreenValues={
    Offers: {
      searchtext: "",
      offerstatus: 1,
      offerdetailstatus: 0,
      from:  moment(new Date()).format('DD/MM/YYYY'),
      to: moment(new Date()).format('DD/MM/YYYY'),
      pendingon: -1,
      assignto: ""
  }
};

defaultMenuData=[
  {screen_url:'/offers/list',screen_name:'Offers'}
];
  

  // @ViewChild('addbutton') addButtonRef: ElementRef;


  constructor() { }

  ngOnInit() {
    this.loadResoruce();
  }

  ngOnChanges(change: SimpleChanges): void {
    if (change.isAuthorizeDisable !== undefined) {
      this.isAuthorizeDisable = change.isAuthorizeDisable.currentValue;
    }
  }

  loadResoruce() {

  }

  onAuthorizeClick() {
    this.authorizeClicked.emit();
  }

  onAddClick() {
    this.addClicked.emit();
  }
  onEditClick() {
    this.editClicked.emit();
  }
  onExportClick() {
    this.exportClicked.emit();
  }

  onExporttoPDFClick() {
    this.exporttopdfClicked.emit();
  }

  onCancelClick() {
    this.cancelClicked.emit();
  }

  onDownloadClick() {
    this.downloadClicked.emit();
  }
  onUploadClick() {
    this.uploadClicked.emit();
  }

  onHistoryClick() {
    this.historyClicked.emit();
  }

  onSearchClick() {
    this.searchClicked.emit();
  }

  onRefreshClick() {
    this.refreshClicked.emit();
  }

  onSAPRefreshClick() {
    this.saprefreshClicked.emit();
  }

  onSFDCRefreshClick() {
    this.sfdcrefreshClicked.emit();
  }
}
