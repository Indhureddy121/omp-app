import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges, HostListener, ElementRef, ViewChild } from '@angular/core';
import { first } from 'rxjs/operators';
import { Utils } from '@core/helper/utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-sub-header',
  templateUrl: './app-sub-header.component.html',
  styleUrls: ['./app-sub-header.component.css']
})
export class AppSubHeaderComponent implements OnInit, OnChanges {


  commonResourceModel: any = {};
  currIndex: number = 0;

  // Button inputs
  @Input() popupId;
  @Input() popupBreadCrumb;
  @Input() isPrint: boolean;
  @Input() isUpload: boolean;
  @Input() isSave: boolean;
  @Input() isCancel: boolean;
  @Input() isEdit: boolean;
  @Input() isReset: boolean;
  @Input() isPagging: boolean;
  @Input() isAdd: boolean;
  @Input() list: any[] = null;
  @Input() currentItem: number = 0;
  @Input() isShortClose: boolean;
  @Input() isAuthorize: boolean;
  @Input() isUnAuthorize: boolean;
  @Input() isView: boolean;
  @Input() isDelete: boolean;
  @Input() isReport: boolean;
  @Input() isCopy: boolean;
  @Input() isPDF: boolean;
  @Input() isCreateOffer: boolean;
  @Input() isCreateOrder: boolean;
  @Input() isBack: boolean;
  @Input() isOfferApprove: boolean;
  @Input() isOfferReject: boolean;
  @Input() isSendForApproval: boolean;
  @Input() isReview: boolean;

  // Button inputs for disable
  @Input() isPrintDisable: boolean;
  @Input() isUploadDisable: boolean;
  @Input() isSaveDisable: boolean;
  @Input() isAddDisable: boolean;
  @Input() isEditDisable: boolean;
  @Input() isCancelDisable: boolean;
  @Input() isResetDisable: boolean;
  @Input() isShortCloseDisable: boolean;
  @Input() isAuthorizeDisable: boolean;
  @Input() isUnAuthorizeDisable: boolean;
  @Input() isViewDisable: boolean;
  @Input() isDeleteDisable: boolean;
  @Input() isReportDisable: boolean;
  @Input() isCopyDisable: boolean;
  @Input() isPDFDisable: boolean;
  @Input() isOfferApproveDisable: boolean;
  @Input() isOfferRejectDisable: boolean;
  @Input() isSendForApprovalDisable: boolean;
  @Input() isReviewDisable: boolean;


  // Button output events
  @Output() saveClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();
  @Output() editClicked = new EventEmitter();
  @Output() resetClicked = new EventEmitter();
  @Output() printClicked = new EventEmitter();
  @Output() uploadClicked = new EventEmitter();
  @Output() shortCloseClicked = new EventEmitter();
  @Output() viewitem: EventEmitter<Object> = new EventEmitter();
  @Output() addClicked = new EventEmitter();
  @Output() authorizeClicked = new EventEmitter();
  @Output() unAuthorizeClicked = new EventEmitter();
  @Output() viewClicked = new EventEmitter();
  @Output() deleteClicked = new EventEmitter();
  @Output() reportClicked = new EventEmitter();
  @Output() copyClicked = new EventEmitter();

  // @Output() approvedClicked = new EventEmitter();

  @Output() createOfferClicked = new EventEmitter();
  @Output() createOrderClicked = new EventEmitter();
  @Output() backClicked = new EventEmitter();
  @Output() generatePDFClicked = new EventEmitter();
  @Output() offerApproveClicked = new EventEmitter();
  @Output() offerRejectClicked = new EventEmitter();
  @Output() sendforApprovalClicked = new EventEmitter();
  @Output() reviewClicked = new EventEmitter();


  // @ViewChild('cancelbutton') cancelButtonRef: ElementRef;

  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit() {
    this.loadResoruce();
    this.currIndex = this.currentItem;
    if (this.list !== null) {
      this.onViewItems('current');
    }
  }
  ngOnChanges(change: SimpleChanges): void {
    if (change.isAuthorizeDisable !== undefined) {
      this.isAuthorizeDisable = change.isAuthorizeDisable.currentValue;
      this.isUnAuthorizeDisable = change.isUnAuthorizeDisable.currentValue;
    }
  }
  onViewItems(str: string) {

    if (str === 'previous') {
      this.viewitem.emit({
        current: this.onPervious()
      });
    } else if (str === 'next') {
      this.viewitem.emit({
        current: this.onNext()
      });
    } else if (str === 'current') {
      this.viewitem.emit({
        current: this.onCurrent(this.currIndex)
      });
    }

  }

  private onNext() {
    this.currIndex = this.currIndex + 1;
    this.currIndex = this.currIndex % this.list.length;
    return this.list[this.currIndex];
  }

  private onPervious() {
    if (this.currIndex === 0) {
      this.currIndex = this.list.length;
    }
    this.currIndex = this.currIndex - 1;
    return this.list[this.currIndex];
  }

  private onCurrent(cuIndex: number) {
    return this.list[cuIndex];
  }

  disableNextLast(): boolean {
    if (this.list == null) {
      return true;
    } else if ((this.list.length - 1) === this.currIndex) {
      return true;
    } else {
      return false;
    }
  }

  disableFirstPrv(): boolean {
    if (this.currIndex === 0) {
      return true;
    } else {
      return false;
    }
  }


  loadResoruce() {
    // this.resourceService.loadResoruce(ResourceFilePath.common).pipe(first()).subscribe(
    //   response => {
    //     this.commonResourceModel = response;
    //   },
    //   error => {
    //     this.alertService.showError(Utils.formatError(error));
    //   });
  }

  onPrintClick() {
    this.printClicked.emit();
  }

  onUploadClick() {
    this.uploadClicked.emit();
  }

  onSaveClick() {
    this.saveClicked.emit();
  }

  onCancelClick() {
    if (this.popupId) {
      this.activeModal.close();
    } else {
      this.cancelClicked.emit();
    }
  }

  // onApprovedClick() {
  //   this.approvedClicked.emit();
  // }



  onEditClick() {
    this.editClicked.emit();
  }

  onResetClick() {
    this.resetClicked.emit();
  }

  onSetCurrontItem(event) {
    this.viewitem.emit(event);
  }
  onAddClick() {
    this.addClicked.emit();
  }

  onShortClose() {
    this.shortCloseClicked.emit();
  }
  onAuthorizeClick() {
    this.authorizeClicked.emit();
  }
  onUnAuthorizeClick() {
    this.unAuthorizeClicked.emit();
  }
  onViewClick() {
    this.viewClicked.emit();
  }
  onDeleteClick() {
    this.deleteClicked.emit();
  }
  onReportClick() {
    this.reportClicked.emit();
  }
  onCopyClick() {
    this.copyClicked.emit();
  }

  onCreateOfferClick() {
    this.createOfferClicked.emit();
  }

  onCreateOrderClick() {
    this.createOrderClicked.emit();
  }

  onBackClick() {
    this.backClicked.emit();
  }

  onGeneratePDF() {
    this.generatePDFClicked.emit();
  }
  onOfferApprove() {
    this.offerApproveClicked.emit()
  }
  onOfferReject() {
    this.offerRejectClicked.emit()
  }

  onSendForApproval() {
    this.sendforApprovalClicked.emit()
  }

  onReview() {
    this.reviewClicked.emit()
  }
  // @HostListener('window:keydown', ['$event'])
  // onKeyPress($event: KeyboardEvent) {
  //   if (($event.ctrlKey || $event.altKey)) {
  //     this.cancelButtonRef.nativeElement.classList.add('pressed');
  //   }
  //   if (($event.ctrlKey || $event.altKey) && $event.keyCode === 77) {
  //     this.cancelButtonRef.nativeElement.classList.remove('pressed');
  //     this.onCancelClick();
  //   }
  // }

  // @HostListener('window:keyup', ['$event'])
  // onKeyPress1($event: KeyboardEvent) {
  //   this.cancelButtonRef.nativeElement.classList.remove('pressed');
  // }

}
