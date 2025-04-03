import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbAccordion, NgbPanel, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import * as moment from 'moment';
import { MarketingMaterialService } from '@core/services/material/marketing-material.service';
import { FilesService } from 'src/app/core/services/common/files.service';
import * as FileSaver from 'file-saver';
import { NotificationService } from '@core/services/common/notification.service';

@Component({
  selector: 'app-marketing-list',
  templateUrl: './marketing-list.component.html',
  styleUrls: ['./marketing-list.component.css']
})
export class MarketingListComponent implements OnInit {
  @ViewChild('acc', { static: true }) acc: NgbAccordion;
  marketingMaterialForm: FormGroup;
  isEdit = false;
  isView = false;
  isAdd = true;
  closeResult: string;
  categoryList: any = [
    {"code":"product","category":"Products"},
    {"code":"services","category":"Services"},
    {"code":"spare_parts","category":"Spare Parts"},
    {"code":"collateral","category":"Collateral"},

  ]
  files: any = [];
  createdDate: any;
  submitted: boolean = false;
  productList: any = [];
  servicesList: any = [];
  sparepartsList: any = [];
  collateralsList: any = [];
  fileData: any;
  get f() { return this.marketingMaterialForm.controls; }
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private modalService: NgbModal,
    private marketingMaterialSevice: MarketingMaterialService,
    private filesService: FilesService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.loadPageMode();
    this.onbuildForm();
  }
  private onbuildForm() {
    this.marketingMaterialForm = this.formBuilder.group({
      marketingMaterialCategory: [[], [Validators.required]]
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
  onAddClick(content1){
    this.isEdit = false;
    this.isView = false;
    this.isAdd = true;
    this.f.marketingMaterialCategory.setValue('');
    this.files = [];
    this.modalService.open(content1, { size: 'lg'}).result.then((result) => {
      console.log("RESULT :::: ",result);  
      // this.f.marketingMaterialDocs.setValue(null);
      this.files = [];
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    })
  }
  private loadPageMode() {
    let currentUrl = this.router.url;
    this.createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
    this.getData();
    if (currentUrl.includes('edit')) {
      this.isEdit = true;
      this.isView = false;
      this.isAdd = false;
      //this.getDetaildata();
    }
    else if (currentUrl.includes('view')) {
      this.isView = true;
      this.isEdit = false;
      this.isAdd = false;
      //this.getDetaildata();
    }
  }
  fileChangeListener(event: any): void {
    console.log("Files :::: ", event.target.files);
    if (event.target.files) {
      //this.files = event.target.files;

      for (let i = 0; i < event.target.files.length; i++) {
        console.log(event.target.files[i].name);
        this.files.push(event.target.files[i]);
      }

    } else {
      this.notificationService.showError('Please import valid file.');
    }
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
    console.log("FILES ::: ", index);
    // if(this.files.length > 0){
    //   delete this.files[index];
    // }
    //this.files = [];
    this.files = Array.from(this.files)
    this.files.splice(index, 1);
  }
  onSaveClick(){
    this.submitted = true;
    let counter = 0;
    if(this.marketingMaterialForm.invalid){
      return;
    } else {
      let insertModel = {
        "file_id":"",
        "category_code":this.f.marketingMaterialCategory.value,
        "created_date": this.createdDate
      }
      this.marketingMaterialSevice.upload(this.files,'marketing').subscribe(response => {
        if(response){
          console.log("console response :::: ",response);
          if(response.resultfiles.length > 0){
            response.resultfiles.forEach(element => {
              insertModel.file_id = element.id;
              this.marketingMaterialSevice.create(insertModel).subscribe(responsecreate => {
                counter++;
                console.log("console create :::: ",responsecreate);
                if(counter == response.resultfiles.length){
                  this.submitted = false;
                  this.modalService.dismissAll("");
                  this.notificationService.showSuccess("Marketing material uploaded successfully");
                  this.getData();
                }
              },errorcreate => {
                console.log("console create :::: ",errorcreate);
              })
            });
          }
         
        }
      },error => {
        console.log("console upload failed :::: ",error);
      });
    }
  }
  getData(){
    let filtermodel = "{}";
    this.marketingMaterialSevice.listMarketingMaterials(filtermodel).subscribe(response => {
      if(response){
        this.productList = [];
        this.collateralsList = [];
        this.servicesList = [];
        this.sparepartsList = [];
        //console.log("product response",response.marketingmaterials.filter(catcode => catcode.category_code == "product")[0].filedtls);
        //console.log("collateral response",response.marketingmaterials.filter(catcode => catcode.category_code == "collateral")[0].filedtls);
       // console.log("services response",response.marketingmaterials.filter(catcode => catcode.category_code == "services")[0].filedtls);
       // console.log("spare_parts response",response.marketingmaterials.filter(catcode => catcode.category_code == "spare_parts")[0].filedtls);

        if(response.marketingmaterials.filter(catcode => catcode.category_code == "product").length > 0)
          this.productList = JSON.parse(response.marketingmaterials.filter(catcode => catcode.category_code === "product")[0].filedtls);
        if(response.marketingmaterials.filter(catcode => catcode.category_code == "collateral").length > 0)
          this.collateralsList = JSON.parse(response.marketingmaterials.filter(catcode => catcode.category_code === "collateral")[0].filedtls);
        if(response.marketingmaterials.filter(catcode => catcode.category_code == "services").length > 0)  
          this.servicesList = JSON.parse(response.marketingmaterials.filter(catcode => catcode.category_code === "services")[0].filedtls);
        if(response.marketingmaterials.filter(catcode => catcode.category_code == "spare_parts").length > 0)  
          this.sparepartsList = JSON.parse(response.marketingmaterials.filter(catcode => catcode.category_code === "spare_parts")[0].filedtls);
        console.log("product luist",this.productList);
        // this.servicesList = response.marketingmaterials.filter(catcode => catcode.category_code === "services")[0].filedtls.toJSON();;
        // this.sparepartsList = response.marketingmaterials.filter(catcode => catcode.category_code === "spare_parts")[0].filedtls.toJSON();;
        // this.collateralsList = response.marketingmaterials.filter(catcode => catcode.category_code === "collateral")[0].filedtls.toJSON();;
      }
      
    },error => {

    })
  }
  delMarketingMaterial(id:number,file_id:number){
    this.marketingMaterialSevice.deleteMarketingMaterial(id).subscribe(
      response => {
        console.log("Response",response);
        if(response){
          this.marketingMaterialSevice.deleteFileReferences(file_id).subscribe(responsefr =>{
            if(responsefr){
              this.notificationService.showSuccess("Marketing material deleted successfully");
              this.getData();
            }
          },errref =>{
            console.log("errref",errref);
          })
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
        
      });
  }
  downloadFile(name,id,filetype) {
    this.filesService.download(id).subscribe(
      response => {
        this.fileData = response.pecount
        // let blob = new Blob([this.fileData], { type: 'image/png' });

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
        //var  fileExt = name.split('.')[1]
        // var type = '';
        // if(fileExt === "doc"){
        //   type = 'application/msword'
        // }
        // else if(fileExt == "csv"){
        //   type ='text/csv'
        // }
        // else if(fileExt == "png"){
        //   type ='text/png'
        // }
        // else if(fileExt == "jpg"){
        //   type ='text/jpg'
        // }
        const blob = new Blob(byteArrays, { type: filetype });
        FileSaver.saveAs(blob, name);
        // this.notificationService.showSuccess("Product Updated Successfully");
        // this.router.navigateByUrl('/peaction/list');
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });


  }
}
