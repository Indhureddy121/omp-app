import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { BroadcastsService } from '@core/services/broadcast/broadcasts.service';
import { DashboardService } from '@core/services/common/dashboard.service';
import { FilesService } from '@core/services/common/files.service';
import { NotificationService } from '@core/services/common/notification.service';
import { CustomerService } from '@core/services/masters/customer.service';
import { ReportsService } from '@core/services/reports/reports.service';
import * as FileSaver from 'file-saver';
import { OmpusersService } from 'src/app/core/services/masters/ompusers.service';




@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  usertype: number = 0;
  userid: number = 0;
  userrole: string = '';
  BroadcastList: any[] = [];
  approvalrequiredList: any[] = [];
  cpovalidationrequiredList: any[] = [];
  fmapprovalrequiredList: any[] = [];
  LeaveUsersList: any[] = [];
  fileData: any;
  isAdmin: boolean = false; 
  UserOnLeave: boolean = false;
  totalRows: number;
  totalRows1: number;
  searchValue: string = '';
  searchModel = Object();
  ActiveUserCount:number;
  InActiveUserCount:number;
  LockedUser:number;
  ActiveCustomerCount:number;
  InActiveCustomerCount:number;
  CustomerType10: number; 
  CustomerType20: number;
  
  


  constructor(
    private authService: AuthService,
    private broadcastsService: BroadcastsService,
    private filesService: FilesService,
    private dashboardService: DashboardService,
    private router: Router,
    private customerService: CustomerService,
    private reportsService: ReportsService,
    private notificationService: NotificationService,
    private ompusersService: OmpusersService,
  ) { }

  ngOnInit() {
    this.onLoad();
    this.onLoadAdmin();
  }

  private onLoadAdmin(){
    if(this.isAdmin){  
      this.getUserCount(); 
      this.getCustomerCount();
      this.getUserType();    
      this.getCustomerType(); 
      
    }
    
  }


  private onLoad() {
    this.usertype = this.authService.getCurrentUser().usertype;
    this.userid = this.authService.getUserId();
    this.userrole = this.authService.getUserRoleCode();

    if (this.userrole && this.userrole == 'Admin')
      this.isAdmin = true;

    if (this.usertype != 20) {
      this.GetDashboardData();
      this.GetLeaveUsersList();
    } else if (this.usertype == 20) {
      this.GetBroadcasts();
    }
  }
  //to get the total user count
  getUserCount() {
    var screenvalues = this.authService.getScreenValues().User;
    this.searchValue = screenvalues.searchtext;
    this.searchModel.searchtext = this.searchValue;

    this.ompusersService.getCount(this.searchValue).subscribe(
      response => {
        this.totalRows = response.countusers[0].usercount;
        
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  //to get total customer count
  getCustomerCount() {
    var screenvalues = this.authService.getScreenValues().Customer;
    this.searchValue = screenvalues.searchtext;
    this.searchModel.searchtext = this.searchValue;

    
    this.customerService.getCount(this.searchValue).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) 
          this.totalRows1 = response.responsedata.data[0].count;
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }



   

  GetDashboardData() {
    this.dashboardService.GetData().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200) {
          this.approvalrequiredList = response.responsedata.data[0];
          this.cpovalidationrequiredList = response.responsedata.data[1];
          this.fmapprovalrequiredList = response.responsedata.data[2];
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  getCustomerType() {
    this.dashboardService.GetCustomerCount().subscribe(
      response => {
        if (response && response.responsedata.statusCode==200) {
          this.ActiveCustomerCount=response.responsedata.data["activeCustomer"];
          this.InActiveCustomerCount=response.responsedata.data["inactiveCustomer"];;
          this.CustomerType10 = response.responsedata.data["customer10"]; // Set the customer count from the response
          this.CustomerType20 = response.responsedata.data["customer20"];
        }
      },
      error => {
        this.notificationService.showError('Failed to fetch customer');
      }
    );
   }

   getUserType(){
    this.dashboardService.GetUserCount().subscribe(
        response=>{
          if(response && response.responsedata.statusCode==200){
              this.ActiveUserCount=response.responsedata.data["activeUsers"];
              this.InActiveUserCount=response.responsedata.data["inactiveUsers"];
              this.LockedUser=response.responsedata.data["lockeduser"];
          }
        },
        error => {
          this.notificationService.showError('Failed to fetch User');
        }
      );
   }





  redirecttodetail(id: number, type: number) {
    if (type == 10)
      this.router.navigate(['/offers/edit/' + id]);
    else if (type == 20)
      this.router.navigate(['/order/stockorder/edit/' + id]);
    else if (type == 30)
      this.router.navigate(['/order/cpoorder/edit/' + id]);

  }

  GetBroadcasts() {
    this.broadcastsService.GetBroadcast().subscribe(
      response => {
        if (response.broadcasts.broadcastheader && response.broadcasts.broadcastheader.length > 0) {
          this.BroadcastList = response.broadcasts.broadcastheader;
        } else {
          this.BroadcastList = [];
        }
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

  onSFDCRefreshClick() {
    let filtermodel = {};
    this.customerService.getSfdcCustomer(filtermodel).subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.notificationService.showSuccess(response.responsedata.message);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onSAPReportMatrixSyncClick() {
    this.reportsService.syncreportmatrix().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.notificationService.showSuccess(response.responsedata.message);
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  

  GetLeaveUsersList() {
    this.dashboardService.GetLeaveUsersList().subscribe(
      response => {
        if (response.responsedata && response.responsedata.statusCode == 200)
          this.LeaveUsersList = response.responsedata.data;

        if (this.LeaveUsersList && this.LeaveUsersList.length > 0) {
          let _useronleave = this.LeaveUsersList.find(x => x.id == this.userid);

          if (_useronleave)
            this.UserOnLeave = true;
          else
            this.UserOnLeave = false;
        }
      }, error => {
        this.notificationService.showError(error.error.error.message);
      });
  }

  onChangeLeaveSettingClick() {
    this.router.navigate(['/userprofile/users/myprofile']);
  }
}
