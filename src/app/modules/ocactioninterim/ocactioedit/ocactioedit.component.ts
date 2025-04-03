import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from '@core/services/common/notification.service';
import { OcactionService } from '@core/services/ocactioninterim/ocaction.service';
import { OfferStatusEnum } from '@core/enums/offerstatus.enum';
import { FilesService } from 'src/app/core/services/common/files.service';
import * as FileSaver from 'file-saver';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { error } from 'console';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ocactioedit',
  templateUrl: './ocactioedit.component.html',
  styleUrls: ['./ocactioedit.component.css']
})
export class OcactioeditComponent implements OnInit {

  offerID: number = 0;
  offerdata: any = {};
  offerNo: string = '';
  offerInactiveText: string = '';
  isView: boolean = false;
  offerApprovalStatus: any;
  oppoData: any;
  OfferFiles: any[] = [];
  filesidlist: any[] = [];
  fileData: any;
  filesperitem: number;
  filesize: number;
  ItemsForm: FormGroup;

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


  constructor(
    private activatedRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private OCService: OcactionService,
    private filesService: FilesService,
    private formBuilder: FormBuilder,
  ) {

    this.ItemsForm = this.formBuilder.group({
      items: this.formBuilder.array([this.createItem()]),
      freightcharges: ['']
    });
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(parms => {
      this.offerID = parms['id'];
    });

    this.onload()

  }

  get itemsForm() { return this.ItemsForm.controls }

  onload() {
    this.getOffersDetail(this.offerID, false);
  }

  getOffersDetail(id: number, isclone: boolean) {
    this.OCService.getOffersDetail(id, isclone).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          if (response.responsedata.data.offer[0]) {
            this.offerdata = response.responsedata.data.offer[0];
            this.oppoData = response.responsedata.data.offer_opportunity[0];
            this.offerNo = this.offerdata.offerno;
            this.offerInactiveText = this.offerdata.IsActive != 1 ? '[Inactive]' : '';
            this.isView = true
            this.OfferFiles = response.responsedata.data.offer_docs;
            this.filesidlist = response.responsedata.data.offer_oc_docs;
          }
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }



  OfferFileRemove(index: number) {
    this.filesidlist.splice(index, 1);
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


  OfferfileChangeListener(event: any): void {
    if (event.target.files) {
      if (this.ValidateOfferFiles(event.target.files)) {
        for (let i = 0; i < event.target.files.length; i++) {
          this.filesidlist.push(event.target.files[i]);
        }
      }
    } else {
      this.notificationService.showError('Please import valid file.');
    }
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


  async onSave() {

    let offerHeader = {
      offerId: this.offerID,
      file_for: 13,
      filesidlist: []
    }

    if (this.filesidlist.length > 0)
      await this.OfferFileUpload(offerHeader);
    this.savefiles(offerHeader);

  }


  async OfferFileUpload(offerHeader: any) {
    var type: string = '';

    var oldfiles = this.filesidlist.filter(x => x.id).map(y => y.id);
    oldfiles.forEach(element => {
      offerHeader.filesidlist.push({ id: element });
    });

    this.filesidlist = this.filesidlist.filter(x => !x.id);

    if (this.filesidlist && this.filesidlist.length > 0) {
      type = 'ocaction';
      await this.OCService.upload(this.filesidlist, type).then(
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
    this.OCService.savefilesinfo(saveModel).subscribe(
      async (response: any) => {
        if (response && response.responsedata && response.responsedata.statusCode === 200) {
          this.notificationService.showSuccess(response.responsedata.message);
          this.router.navigate(['/ocactioninterim/list']);
        }
      },
      error => {
        this.notificationService.showError("Error inserting File");
      }
    );
  }

  oncancelClick() {
    this.router.navigate(['/ocactioninterim/list']);
  }


}
