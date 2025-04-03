import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PeactionService } from '@core/services/peaction/peaction.service';
import { NgbDateParserFormatter, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { FilesService } from 'src/app/core/services/common/files.service';
import * as FileSaver from 'file-saver';
import { AuthService } from '@core/services/auth/auth.service';
import { Config } from 'src/app/core/configs/config';
import { OffersService } from '@core/services/offers/offers.service';
import { OpportunitiesService } from '@core/services/opportunities/opportunities.service';
import { SPRItemStatusEnum } from '@core/enums/spritemstatus.enum';
import * as sprformData from '../../../shared/components/spr-information-popup/./spr-information.json';
import { StorageKey, StorageService } from '@core/services/common/storage.service';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-peaction',
  templateUrl: './peaction.component.html',
  styleUrls: ['./peaction.component.css']
})

export class PeactionComponent implements OnInit {

  RequirementForm: FormGroup;
  PEActionForm: FormGroup;
  CommentsForm: FormGroup;
  SAPModalForm: FormGroup;
  RejectForm: FormGroup;
  AssigneeForm: FormGroup;

  submitted = false;
  isEdit = false;
  isView = false;
  isAdd = true;
  peData: any;
  dateformate: string;
  format: string;
  currentDate: Date;
  peid: any;
  todayMinDate: { year: number; month: number; day: number };
  validfromDate: { year: number; month: number; day: number };
  validtoDate: { year: number; month: number; day: number };
  currencyTypeList: any[] = [
    { code: 'INR', description: 'INR' },
    { code: 'USD', description: 'Doller' },
    { code: 'EUR', description: 'Euro' }];
  industrystdtextList: any[] = [];
  pgList: any[] = [];
  phList: any[] = [];
  iscomplete: boolean = false;
  // ValidMindate: any;
  // ValidMaxdate: { year: number; month: number; day: number };
  todayDate: string;
  futureDate: string;
  CommentsFiles: any[] = [];
  PEFiles: any[] = [];
  fileData: any;
  peSection: number = 0;
  commentSection: number = 0;
  type: string = 'PEAction';
  closeResult: string;
  commentdata: any[] = [];
  isComment: boolean = false;
  // requirementdocs: any[] = [];
  filesperitem: number;
  filesize: number;
  PEComment: string;
  cmtsubmitted: boolean = false;
  sapExist: boolean = false;
  UOMList: any[] = [
    { code: 'M', description: 'M' },
    { code: 'PC', description: 'PC' }];
  SPRlengthandfactordata: any[] = [];
  offerdatasheets: any[] = [];
  itemdatasheets: any[] = [];
  oppoData: any;
  isExportOrder: boolean = false;
  RejectReason: string;
  RemarksValue: string;
  AssignToList: any[] = [];
  itemTypeList: any[] = [
    { code: 'STD', description: 'MFG' },
    { code: 'TRD', description: 'TRD' }];
  userrole: string;
  canAssign: boolean = false;
  labtextList: any[] = [];
  labtextArr = [{ code: 'BANGALORE', description: 'BANGALORE' },
  { code: 'BHOPAL', description: 'BHOPAL' },
  { code: 'TRADING', description: 'TRADING' },
  { code: 'OUTSOURCING', description: 'OUTSOURCING' }];
  PrimaryPlantList: any[] = [
    { code: '8250', description: '8250' },
    { code: '8400', description: '8400' },
    { code: '8210', description: '8210' }];

  @ViewChild('spritemrejectmodel', { static: false }) spritemrejectmodel: any;
  @ViewChild('AssigneeModel', { static: false }) AssigneeModel: any;
  @ViewChild('SPRInformationModel', { static: false }) SPRInformationModel: any;
  dataSheetObj: any;
  articleNo: any;
  description: any;
  spFormFieldObj: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private datePipe: DatePipe,
    private activatedRoute: ActivatedRoute,
    private peactionService: PeactionService,
    public formatter: NgbDateParserFormatter,
    private filesService: FilesService,
    private modalService: NgbModal,
    private authService: AuthService,
    private offersService: OffersService,
    private opportunitiesService: OpportunitiesService,
    private storageService: StorageService,
    private notificationService: NotificationService
  ) { }

  get requirementForm() { return this.RequirementForm.controls; }
  get peActionForm() { return this.PEActionForm.controls; }
  get commentsForm() { return this.CommentsForm.controls; }
  get sapModalForm() { return this.SAPModalForm.controls; }
  get rejectForm() { return this.RejectForm.controls; }
  get assigneeForm() { return this.AssigneeForm.controls; }

  ngOnInit() {
    this.storageService.setValue(StorageKey.sprFormJsonData, JSON.stringify((sprformData as any).default));
    this.activatedRoute.params.subscribe(parms => {
      this.peid = parms['id'];
    });
    this.onLoad();
  }

  private onLoad() {
    this.dateformate = this.authService.getDateFormat();
    this.format = this.authService.getDateFormat();
    this.userrole = this.authService.getUserRoleCode();

    if (this.userrole == 'Admin' || this.userrole == 'PE_Admin' || this.userrole == 'PE_Cable Design Team' || this.userrole == 'PE_Product Master' || this.userrole == 'PE_TRD_MFG') {
      this.canAssign = true;
    }

    this.currentDate = new Date(Date.now());
    this.todayDate = moment().format("DD/MM/YYYY");
    this.futureDate = moment().add(30, 'd').format("DD/MM/YYYY");
    this.filesperitem = Config.getItemsFile.NumberofFiles + 1;
    this.filesize = Config.getItemsFile.filesize;
    this.todayMinDate = this.convertDate(this.todayDate);
    this.validfromDate = this.convertDate(this.todayDate);
    this.validtoDate = this.convertDate(this.futureDate);
    // this.ValidMaxdate = this.validtoDate;
    // this.ValidMindate = this.validfromDate;
    this.loadPageMode();
    this.onbuildForm();
    this.GetIndustryStdText();
    // this.getpglist();
    this.getAssigntoList();
  }

  private loadPageMode() {
    let currentUrl = this.router.url;

    if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
      this.getDetaildata();
    } else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
      this.isAdd = false;
      this.getDetaildata();
    }
  }

  private onbuildForm() {
    this.PEActionForm = this.formBuilder.group({
      description: [''],
      customerpartno: [''],
      itemtype: [''],
      primaryplant: [null],
      currency: [''],
      uom: [null],
      length: [''],
      pg: [null],
      ph: [null],
      ph2: [null],
      ph6: [null],
      industrystdtext: [null],
      labtext: [''],
      copperweightorindex: [''],
      copperindex: [''],
      baseprice: [''],
      copperbasecost: [''],
      otherrmc: [''],
      overheads: [''],
      fixedoverheads: [''],
      standardcost: [''],
      alp: [''],
      msq: [''],
      moq: [''],
      mdq: [''],
      owf: [''],
      validfrom: [''],
      validto: [''],
      iscomplete: [null],
      remarks: [''],
      itemstatus: [''],
      itemrejectreason: [''],
      calccost: [''],
      calcalp: [''],
      calrmcccost: ['']
    });

    this.RequirementForm = this.formBuilder.group({
      offerno: [null],
      articleno: [null],
      reqdescription: [null],
      reqquanity: [null],
      sapno: [null],
      reqattachment: [null],
      assignto: [[]],
      sprDetailedDescription: [null]
    });

    this.CommentsForm = this.formBuilder.group({
      comments: [null, [Validators.required]]
    });

    this.SAPModalForm = this.formBuilder.group({
      newSapId: [null, [Validators.required]]
    });

    this.RejectForm = this.formBuilder.group({
      rejectreason: ['', Validators.required]
    });

    this.AssigneeForm = this.formBuilder.group({
      assignto: [[]],
      isassigntoallitem: ['']
    });
  }

  setItemStatus(status: number) {
    let showstatus: string = '';
    if (status == 0)
      showstatus = SPRItemStatusEnum.zero;
    else if (status == 10)
      showstatus = SPRItemStatusEnum.ten;
    else if (status == 14)
      showstatus = SPRItemStatusEnum.fourteen;
    else if (status == 20)
      showstatus = SPRItemStatusEnum.twenty;
    else if (status == 30)
      showstatus = SPRItemStatusEnum.thirty;
    else if (status == 40)
      showstatus = SPRItemStatusEnum.fourty;
    else if (status == 50)
      showstatus = SPRItemStatusEnum.fifty;

    return showstatus;
  }

  GetIndustryStdText() {
    this.peactionService.GetIndustryStdText().subscribe(
      response => {
        if (response) {
          this.industrystdtextList = response.industrystdtext;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getpglist(industrystdtext: string) {
    this.peactionService.getPGList(industrystdtext).subscribe(
      response => {
        if (response) {
          this.pgList = response.pglist;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getphlist(pg) {
    this.peactionService.getPHList(this.peActionForm.industrystdtext.value, pg).then(
      response => {
        if (response) {
          this.phList = response.phlist;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getAssigntoList() {
    this.peactionService.getAssignToList().subscribe(
      response => {
        if (response) {
          this.AssignToList = response.assigntolist;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  private getOpportunityData() {
    this.opportunitiesService.getDetail(this.peData.oppoid).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.oppoData = response.responsedata.data[0];
          this.isExportOrder = this.oppoData.op_vertical.toLowerCase().includes('export') && this.oppoData.op_segment.toLowerCase().includes('lapp');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onIndustryStdTextchange(event: any) {
    if (event) {
      this.getpglist(event.industrystdtext);
    } else {
      this.pgList = [];
      this.phList = [];
      this.peActionForm.pg.setValue(null);
      this.peActionForm.ph.setValue(null);
    }
  }

  onPGchange(event: any) {
    if (event) {
      this.getphlist(event.pg);
    } else {
      this.phList = [];
      this.peActionForm.ph.setValue(null);
    }
  }

  onOffValidFromDateSelection(date) {
    // this.ValidMindate = date;
    let offerValidFromdate = new Date(date.year, date.month - 1, date.day).toString();
    // let maxdate = moment(offerValidFromdate).add(30, 'd').format("YYYY-MM-DD");
    // this.ValidMaxdate = this.convertDate(maxdate);
    offerValidFromdate = this.datePipe.transform(offerValidFromdate, this.dateformate);
    this.peActionForm.validfrom.setValue(offerValidFromdate);

    if (new Date(this.peActionForm.validfrom.value.split('/').reverse().join('-')) > new Date(this.peActionForm.validto.value.split('/').reverse().join('-'))) {
      this.validtoDate = this.convertDate(offerValidFromdate);
      this.peActionForm.validto.setValue(offerValidFromdate);
    }
  }

  onOffValidToDateSelection(date) {
    let offerValidTodate = new Date(date.year, date.month - 1, date.day).toString();
    offerValidTodate = this.datePipe.transform(offerValidTodate, this.dateformate);
    this.peActionForm.validto.setValue(offerValidTodate);
  }

  private getDetaildata() {
    this.peactionService.getPEDetail(this.peid).subscribe(
      response => {
        if (response.pedata && response.pedata.sprdata.length > 0) {
          this.peData = response.pedata.sprdata[0];
          this.setData(this.peData);
          this.GetComment();
          this.getDataSheets();
          this.getOpportunityData();
          this.description = this.peData.description;
          this.articleNo = this.peData.articleno;
          this.dataSheetObj = this.peData.sprform_fields === null || this.peData.sprform_fields === undefined ? undefined : JSON.parse(atob(this.peData.sprform_fields));
          this.spFormFieldObj = btoa(JSON.stringify(this.dataSheetObj));

          if (this.peData.sprform_fields) {
            let SPRDetailed = Config.ObjecttoString(this.peData.sprform_fields, "|");
            this.requirementForm.sprDetailedDescription.setValue(SPRDetailed);
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  // toString = obj => Object.entries(obj).map(([k, v]) => `${k}: ${v}`).join(', ');

  private setData(data: any) {
    this.requirementForm.offerno.setValue(data.offernumber);
    this.requirementForm.articleno.setValue(data.articleno);
    this.requirementForm.reqdescription.setValue(data.description);
    this.requirementForm.reqquanity.setValue(data.quantity);
    if (data.assignto)
      this.requirementForm.assignto.setValue(data.fullname);
    else
      this.requirementForm.assignto.setValue(null);

    this.SPRlengthandfactordata = data.lengthandfactor;

    if (data.sapid != null && data.sapid != 0) {
      this.sapExist = true;
      this.requirementForm.sapno.setValue(data.sapid);
    } else {
      this.sapExist = false;
      this.requirementForm.sapno.setValue(null);
    }
    this.peActionForm.description.setValue(data.description);
    this.peActionForm.customerpartno.setValue(data.customerpartno);
    this.peActionForm.primaryplant.setValue(data.primaryplant ? data.primaryplant : null);
    this.peActionForm.currency.setValue(data.currency ? data.currency : 'INR');
    this.peActionForm.itemtype.setValue(data.itemtype ? data.itemtype : null);
    this.peActionForm.uom.setValue(data.uom ? data.uom : null);
    this.onUOMChange();
    this.peActionForm.length.setValue(data.length);

    if (data.industry_std_text) {
      this.peActionForm.industrystdtext.setValue(data.industry_std_text);
      this.getpglist(data.industry_std_text);
    } else
      this.peActionForm.industrystdtext.setValue(null);

    if (data.pg) {
      this.peActionForm.pg.setValue(data.pg);
      this.getphlist(data.pg);
    } else
      this.peActionForm.pg.setValue(null);

    this.peActionForm.ph.setValue(data.ph ? data.ph : null);
    this.peActionForm.ph2.setValue(data.phtwo);
    this.peActionForm.ph6.setValue(data.phsix);

    if (data.lab_text && !this.labtextList.find(x => x.code == data.lab_text) && data.lab_text != '')
      this.labtextArr.push({ code: data.lab_text, description: data.lab_text });

    this.labtextList = this.labtextArr;
    this.peActionForm.labtext.setValue(data.lab_text ? data.lab_text : null);
    this.peActionForm.copperweightorindex.setValue(data.copperweight);
    this.peActionForm.copperindex.setValue(data.copperindex);
    this.peActionForm.baseprice.setValue(data.baseprice);
    this.peActionForm.copperbasecost.setValue(data.copper_base_cost);
    this.peActionForm.otherrmc.setValue(data.other_rmc);
    this.peActionForm.overheads.setValue(data.overheads);
    this.peActionForm.fixedoverheads.setValue(data.fixedoverheads);
    this.peActionForm.standardcost.setValue(data.standardcost);
    this.peActionForm.alp.setValue(data.alp);
    this.peActionForm.msq.setValue(data.msq);
    this.peActionForm.moq.setValue(data.moq);
    this.peActionForm.mdq.setValue(data.mdq);
    this.peActionForm.owf.setValue(data.owf === '' || data.owf == null ? 3 : data.owf == 0 ? 0 : data.owf * 100);

    if (data.validfrom && data.validfrom != '0000-00-00') {
      this.peActionForm.validfrom.setValue(this.datePipe.transform(data.validfrom, this.dateformate));
      this.validfromDate = this.convertDate(this.datePipe.transform(data.validfrom, this.dateformate));
    } else {
      this.peActionForm.validfrom.setValue(this.todayDate);
    }

    if (data.validto && data.validto != '0000-00-00') {
      this.peActionForm.validto.setValue(this.datePipe.transform(data.validto, this.dateformate));
      this.validtoDate = this.convertDate(this.datePipe.transform(data.validto, this.dateformate));
    } else {
      this.peActionForm.validto.setValue(this.futureDate);
    }

    this.peActionForm.remarks.setValue(data.remarks);
    this.RemarksValue = data.remarks;
    this.PEFiles = data.files ? data.files : [];

    this.managePageSection(data.status, data.IsActive);

    if (this.peSection != 2) {
      this.peActionForm.itemtype.disable();
      this.peActionForm.currency.disable();
      this.peActionForm.primaryplant.disable();
      this.peActionForm.industrystdtext.disable();
      this.peActionForm.pg.disable();
      this.peActionForm.ph.disable();
      this.peActionForm.uom.disable();
      this.peActionForm.validfrom.disable();
      this.peActionForm.validto.disable();
      this.peActionForm.labtext.disable();
    }

    this.peActionForm.calccost.setValue(data.finalcost_c);
    this.peActionForm.calcalp.setValue(data.alp_c);
    this.peActionForm.calrmcccost.setValue(data.rmc_cost);
    this.peActionForm.itemstatus.setValue(this.setItemStatus(data.status));
    this.peActionForm.itemrejectreason.setValue(data.rejectreason);
  }

  managePageSection(status: number, isactive: number) {
    this.peSection = 0;
    this.commentSection = 0;

    if (isactive == 1) {
      if (status < 40 && status != 20) {
        this.peSection = 2;
      }
    } else {
      this.peSection = 1;
    }
  }

  isEditSection(section: string) {
    let isEdit: boolean = false;

    if (section == 'peSection')
      isEdit = this.peSection == 2 ? true : false;

    return isEdit;
  }

  convertDate(date) {
    const year = Number(date.split('/')[2]);
    const month = Number(date.split('/')[1]);
    const day = Number(date.split('/')[0]);
    let newdate = { year: year, month: month, day: day };
    return newdate;
    // const year = Number(this.datePipe.transform(date, 'yyyy'));
    // const month = Number(this.datePipe.transform(date, 'MM'));
    // const day = Number(this.datePipe.transform(date, 'dd'));
    // let newdate = { day: day, month: month, year: year };
    // return newdate;
  }

  onSaveDraftClick(iscomplete: any) {
    this.iscomplete = iscomplete;
    this.updateValidators();
    this.saveClicked();
  }

  onSaveSubmitClick(iscomplete: any) {
    this.iscomplete = iscomplete;
    this.updateValidators();
    this.saveClicked();
  }

  onUOMChange() {
    if (this.peActionForm.uom.value == 'M')
      this.peActionForm.length.setValidators(Validators.required);
    else
      this.peActionForm.length.clearValidators();

    this.peActionForm.length.updateValueAndValidity();
  }

  updateValidators() {
    if (this.iscomplete) {
      this.peActionForm.description.setValidators(Validators.required);
      this.peActionForm.length.setValidators(Validators.required);
      // this.peActionForm.customerpartno.setValidators(Validators.required);
      this.peActionForm.primaryplant.setValidators(Validators.required);
      this.peActionForm.itemtype.setValidators(Validators.required);
      this.peActionForm.currency.setValidators(Validators.required);
      this.peActionForm.uom.setValidators(Validators.required);
      this.peActionForm.industrystdtext.setValidators(Validators.required);
      this.peActionForm.pg.setValidators(Validators.required);
      this.peActionForm.ph.setValidators(Validators.required);
      // this.peActionForm.copperweightorindex.setValidators(Validators.required);
      // this.peActionForm.copperindex.setValidators(Validators.required);
      // this.peActionForm.baseprice.setValidators(Validators.required);
      // this.peActionForm.copperbasecost.setValidators(Validators.required);
      this.peActionForm.msq.setValidators(Validators.required);
      this.peActionForm.moq.setValidators(Validators.required);
      this.peActionForm.mdq.setValidators(Validators.required);
      this.peActionForm.validfrom.setValidators(Validators.required);
      this.peActionForm.validto.setValidators(Validators.required);
    } else {
      this.peActionForm.description.clearValidators();
      this.peActionForm.length.clearValidators();
      // this.peActionForm.customerpartno.clearValidators();
      this.peActionForm.primaryplant.clearValidators();
      this.peActionForm.itemtype.clearValidators();
      this.peActionForm.currency.clearValidators();
      this.peActionForm.uom.clearValidators();
      this.peActionForm.industrystdtext.clearValidators();
      this.peActionForm.pg.clearValidators();
      this.peActionForm.ph.clearValidators();
      // this.peActionForm.copperweightorindex.clearValidators();
      // this.peActionForm.copperindex.clearValidators();
      // this.peActionForm.baseprice.clearValidators();
      // this.peActionForm.copperbasecost.clearValidators();
      this.peActionForm.msq.clearValidators();
      this.peActionForm.moq.clearValidators();
      this.peActionForm.mdq.clearValidators();
      this.peActionForm.validfrom.clearValidators();
      this.peActionForm.validto.clearValidators();
    }

    this.peActionForm.description.updateValueAndValidity();
    this.peActionForm.length.updateValueAndValidity();
    // this.peActionForm.customerpartno.updateValueAndValidity();
    this.peActionForm.primaryplant.updateValueAndValidity();
    this.peActionForm.itemtype.updateValueAndValidity();
    this.peActionForm.currency.updateValueAndValidity();
    this.peActionForm.uom.updateValueAndValidity();
    this.peActionForm.industrystdtext.updateValueAndValidity();
    this.peActionForm.pg.updateValueAndValidity();
    this.peActionForm.ph.updateValueAndValidity();
    // this.peActionForm.copperweightorindex.updateValueAndValidity();
    // this.peActionForm.copperindex.updateValueAndValidity();
    // this.peActionForm.baseprice.updateValueAndValidity();
    // this.peActionForm.copperbasecost.updateValueAndValidity();
    this.peActionForm.msq.updateValueAndValidity();
    this.peActionForm.moq.updateValueAndValidity();
    this.peActionForm.mdq.updateValueAndValidity();
    this.peActionForm.validfrom.updateValueAndValidity();
    this.peActionForm.validto.updateValueAndValidity();
  }

  cancelClicked() {
    this.router.navigateByUrl('/peaction/list');
  }

  onEditClick() {
    let id = 0;
    this.activatedRoute.params.subscribe(parms => {
      id = parms['id'];
    });
    this.router.navigate(['/peaction/edit/' + id]);
  }

  CommentsfileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateCommentFiles(event.target.files)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.CommentsFiles.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  ValidateCommentFiles(files: any) {
    if (files.length > this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }


    if (this.CommentsFiles.length == this.filesperitem || this.CommentsFiles.length + files.length > this.filesperitem) {
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

  ValidatePEFiles(files: any) {
    if (files.length > this.filesperitem) {
      this.notificationService.showError(`You are only allowed to upload a maximum of ` + this.filesperitem + ` files`);
      return false;
    }

    if (this.PEFiles.length == this.filesperitem || this.PEFiles.length + files.length > this.filesperitem) {
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
    this.CommentsFiles = Array.from(this.CommentsFiles)
    this.CommentsFiles.splice(index, 1);
  }

  removePEFile(index: number) {
    this.PEFiles = Array.from(this.PEFiles)
    this.PEFiles.splice(index, 1);
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

  openCommentModal(CommentModal) {
    this.commentsForm.comments.setValue(null);
    this.PEComment = null;
    this.CommentsFiles = [];
    this.cmtsubmitted = false;
    this.modalService.open(CommentModal, { size: 'md' }).result.then((result) => {
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

  async onCommentSaveClick() {
    this.cmtsubmitted = true;

    if (this.CommentsForm.invalid)
      return;

    let commentsavemodel = {
      id: this.peid,
      offerid: this.peData.offerid,
      comment: this.commentsForm.comments.value,
      files: this.CommentsFiles,
      documents: []
    }

    await this.fileUpload(commentsavemodel);
    this.saveComments(commentsavemodel);
  }

  async fileUpload(commentsavemodel: any) {
    if (commentsavemodel.files && commentsavemodel.files.length > 0) {
      await this.peactionService.upload(commentsavemodel.files, this.type).then(
        response => {
          if (response) {
            response.resultfiles.forEach(element => {
              commentsavemodel.documents.push({ id: element.id });
            });
          }
        }, error => {
          this.notificationService.showError(error.error.error.message);
          return;
        });
    }
  }

  saveComments(commentsavemodel: any) {
    this.peactionService.SaveComments(commentsavemodel).subscribe(
      response => {
        if (response && response.comment) {
          this.notificationService.showSuccess('Comments saved successfully.');
          this.modalService.dismissAll();
          this.GetComment();
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  GetComment() {
    this.peactionService.GetComments(this.peid).subscribe(
      response => {
        if (response.comments && response.comments.commentdata.length > 0) {
          this.commentdata = response.comments.commentdata;
          this.isComment = true;
        } else {
          this.isComment = false;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getDataSheets() {
    this.offersService.getDataSheets(this.peData.offerid).subscribe(
      response => {
        this.offerdatasheets = response.data.getOfferDataSheets;
        this.itemdatasheets = response.data.getSPRItemsDataSheets.filter(x => x.spritemid == this.peData.id);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  PEfileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidatePEFiles(event.target.files)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.PEFiles.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
  }

  onCommentCancelClick() {
    this.commentsForm.comments.setValue(null);
    this.CommentsFiles = [];
  }

  saveClicked() {
    this.onSubmit();
  }

  async onSubmit() {
    this.submitted = true;

    if (this.PEActionForm.invalid)
      return;
    if (this.iscomplete && (Number(this.peActionForm.msq.value) <= 0 || Number(this.peActionForm.moq.value) <= 0 || +this.peActionForm.mdq.value <= 0))
      return;

    if (this.peActionForm.validto.value.split('/').reverse().join('/') < this.todayDate.split('/').reverse().join('/')) {
      this.notificationService.showError('Valid To must be greater than today date.');
      return;
    }

    if (this.peActionForm.validfrom.value.split('/').reverse().join('/') >= this.peActionForm.validto.value.split('/').reverse().join('/')) {
      this.notificationService.showError('Valid From date must be less than Valid To date.');
      return;
    }

    if (this.iscomplete) {

      if (this.isExportOrder && (this.peActionForm.copperindex.value ? this.peActionForm.copperindex.value : 0) === 0) {
        this.notificationService.showError('CU Index is required for the export order.');
        return;
      }

      let isstdcostavailable = false;
      let istrdcostavailable = false;
      if (this.peActionForm.standardcost.value && this.peActionForm.standardcost.value > 0) {
        isstdcostavailable = true;
      }

      if (this.peActionForm.copperweightorindex.value && this.peActionForm.copperbasecost.value && this.peActionForm.overheads.value) {
        istrdcostavailable = true;
      }

      if (!isstdcostavailable && !istrdcostavailable) {
        this.notificationService.showError('Either standard cost or other cost imformation is required.');
        return;
      }
    }

    let savemodel = [{
      id: Number(this.peid),
      offerid: this.peData.offerid,
      // sapno: this.requirementForm.sapno.value ? this.requirementForm.sapno.value : '',
      DESCRIPTION: this.peActionForm.description.value ? this.peActionForm.description.value : '',
      CUSTOMERPARTNO: this.peActionForm.customerpartno.value ? this.peActionForm.customerpartno.value : '',
      ITEMTYPE: this.peActionForm.itemtype.value ? this.peActionForm.itemtype.value : '',
      PRIMARYPLANT: this.peActionForm.primaryplant.value ? this.peActionForm.primaryplant.value : '',
      CURRENCY: this.peActionForm.currency.value ? this.peActionForm.currency.value : '',
      UOM: this.peActionForm.uom.value ? this.peActionForm.uom.value : '',
      LENGTH: this.peActionForm.length.value ? this.peActionForm.length.value : '',
      PG: this.peActionForm.pg.value ? this.peActionForm.pg.value : '',
      PH: this.peActionForm.ph.value ? this.peActionForm.ph.value : '',
      PHTWO: this.peActionForm.ph2.value ? this.peActionForm.ph2.value : '',
      PHSIX: this.peActionForm.ph6.value ? this.peActionForm.ph6.value : '',
      INDUSTRYSTDTEXT: this.peActionForm.industrystdtext.value ? this.peActionForm.industrystdtext.value : '',
      LABTEXT: this.peActionForm.labtext.value ? this.peActionForm.labtext.value : '',
      COPPERWEIGHT: this.peActionForm.copperweightorindex.value ? this.peActionForm.copperweightorindex.value : 0,
      COPPERINDEX: this.peActionForm.copperindex.value ? this.peActionForm.copperindex.value : 0,
      BASEPRICE: this.peActionForm.baseprice.value ? this.peActionForm.baseprice.value : 0,
      COPPERBASECOST: this.peActionForm.copperbasecost.value ? this.peActionForm.copperbasecost.value : 0,
      OTHERRMC: this.peActionForm.otherrmc.value ? this.peActionForm.otherrmc.value : 0,
      VARIABLEOH: this.peActionForm.overheads.value ? this.peActionForm.overheads.value : 0,
      FIXEDOH: this.peActionForm.fixedoverheads.value ? this.peActionForm.fixedoverheads.value : 0,
      STANDARDCOST: this.peActionForm.standardcost.value ? this.peActionForm.standardcost.value : 0,
      ALP: this.peActionForm.alp.value ? this.peActionForm.alp.value : 0,
      MSQ: this.peActionForm.msq.value ? this.peActionForm.msq.value : 0,
      MOQ: this.peActionForm.moq.value ? this.peActionForm.moq.value : 1,
      MDQ: this.peActionForm.mdq.value ? this.peActionForm.mdq.value : 1,
      OWF: this.peActionForm.owf.value ? this.peActionForm.owf.value : 0,
      VALIDFROM: this.peActionForm.validfrom.value,
      VALIDTO: this.peActionForm.validto.value,
      REMARKS: this.peActionForm.remarks.value ? this.peActionForm.remarks.value : '',
      files: this.PEFiles,
      documents: [],
      // sprform_fields: this.spFormFieldObj
    }]

    await this.PEfileUpload(savemodel);
    this.UpdatePE(savemodel);
  }

  async PEfileUpload(savemodel: any) {
    if (savemodel[0].files && savemodel[0].files.length > 0) {

      var oldfiles = savemodel[0].files.filter(x => x.id).map(y => y.id);
      oldfiles.forEach(element => {
        savemodel[0].documents.push({ id: element });
      });
      savemodel[0].files = savemodel[0].files.filter(x => !x.id);

      if (savemodel[0].files && savemodel[0].files.length > 0) {
        await this.peactionService.upload(savemodel[0].files, this.type).then(
          response => {
            if (response) {
              response.resultfiles.forEach(element => {
                savemodel[0].documents.push({ id: element.id });
              });
            }
          }, error => {
            this.notificationService.showError(error.error.error.message);
            return;
          });
      }
    }
  }

  UpdatePE(savemodel: any) {
    let iscompleted = this.iscomplete ? 1 : 0;
    this.peactionService.UpdateImportPEdata(savemodel, iscompleted, 20).subscribe(
      response => {
        if (response) {
          this.notificationService.showSuccess('PE Action updated successfully.');
          this.router.navigateByUrl('/peaction/list');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
    // this.peactionService.UpdatePEAction(savemodel).subscribe(
    //   response => {
    //     if (response) {
    //       this.notificationService.showSuccess('PE Action updated successfully.');
    //       this.router.navigateByUrl('/peaction/list');
    //     }
    //   }, error => {
    //     this.notificationService.showError(error.error.error.message);
    //   });
  }

  open(content) {
    if (this.sapExist) {
      this.requirementForm.sapno.setValue(this.peData.sapid);
      this.sapModalForm.newSapId.setValue(this.peData.sapid);
    }
    else {
      this.requirementForm.sapno.setValue(null);
      this.sapModalForm.newSapId.setValue(null);
    }

    this.modalService.open(content, { size: 'sm' }).result.then((result) => { }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSaveSApID() {
    this.submitted = true;

    if (this.SAPModalForm.invalid)
      return;

    let sapData = {
      spritemid: this.peid,
      // articleno: this.requirementForm.articleno.value,
      sapid: this.sapModalForm.newSapId.value
      // offerno: this.peData.offernumber,
      // offerid: this.peData.offerid
    }
    this.addSAPId(sapData);
  }

  private addSAPId(data: any) {
    this.peactionService.addSapId(data).subscribe(
      response => {
        if (response) {
          this.modalService.dismissAll();
          this.notificationService.showSuccess('SAP Id added successfully.');
          this.router.navigate(['/peaction/list']);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onItemRejectClick() {
    this.rejectForm.rejectreason.setValue(null);
    this.submitted = false;
    this.modalService.open(this.spritemrejectmodel, { centered: true, size: 'md', backdrop: 'static' });
  }

  onRejectClick() {
    this.submitted = true;

    if (this.RejectForm.invalid)
      return;

    var itemrejectmodel = {
      spritemid: this.peid,
      articleno: this.peData.articleno,
      offerid: this.peData.offerid,
      status: 20,
      reason: this.rejectForm.rejectreason.value
    }

    this.peactionService.rejectitem(itemrejectmodel).subscribe(
      response => {
        if (response) {
          this.modalService.dismissAll();
          this.notificationService.showSuccess('Item reject successfully.');
          this.router.navigateByUrl('/peaction/list');
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  openAssigneeModal() {
    this.peactionService.getAssignToList().subscribe(
      response => {
        this.AssignToList = response.assigntolist;

        if (this.peData.assignto)
          this.assigneeForm.assignto.setValue(this.peData.assignto);
        else
          this.assigneeForm.assignto.setValue([]);

        this.assigneeForm.isassigntoallitem.setValue(null);
        this.modalService.open(this.AssigneeModel, { size: 'sm' });
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onAssignToSaveClick() {
    let assigntosavemodel = {
      peid: this.peid,
      assignto: this.assigneeForm.assignto.value,
      isassigntoallitem: this.assigneeForm.isassigntoallitem.value,
      offerid: this.peData.offerid
    }

    this.peactionService.saveassignto(assigntosavemodel).subscribe(
      response => {
        if (response) {
          this.modalService.dismissAll();
          this.notificationService.showSuccess('Assign To saved successfully.');
          if (assigntosavemodel.assignto) {
            this.peData.assignto = assigntosavemodel.assignto;
            this.requirementForm.assignto.setValue(this.AssignToList.find(x => x.userid == assigntosavemodel.assignto).description);
          } else {
            this.peData.assignto = null;
            this.requirementForm.assignto.setValue(null);
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  openDataSheet() {
    if (typeof this.peData.sprform_fields === 'object')
      this.peData.sprform_fields = this.dataSheetObj;
    else
      this.dataSheetObj = this.peData.sprform_fields === null || this.peData.sprform_fields === undefined ? undefined : JSON.parse(atob(this.peData.sprform_fields));

    this.modalService.open(this.SPRInformationModel, { size: 'lg', scrollable: true });
  }

  isSavedOrSubmitted(event) {
    this.peData.sprform_fields = event.sprform_fields;
    this.spFormFieldObj = btoa(JSON.stringify(event.sprform_fields));
    this.dataSheetObj = event.sprform_fields;

    if (event.submit)
      this.submitSPRFormField(event);
  }

  submitSPRFormField(sprform: any) {
    sprform.id = this.peid;
    sprform.sprform_fields = btoa(JSON.stringify(sprform.sprform_fields))

    this.peactionService.savesprformfield(sprform).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.notificationService.showSuccess(response.responsedata.message);

          let SPRDetailed = Config.ObjecttoString(sprform.sprform_fields, "|");
          this.requirementForm.sprDetailedDescription.setValue(SPRDetailed);
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  ngOnDestroy() {
    this.storageService.removeValue(StorageKey.sprFormJsonData);
  }
}