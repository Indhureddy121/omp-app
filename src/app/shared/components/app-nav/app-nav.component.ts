import { Component, ElementRef,HostListener, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-app-nav',
  templateUrl: './app-nav.component.html',
  styleUrls: ['./app-nav.component.css']
})
export class AppNavComponent implements OnInit {
  @ViewChild('mainHeaderMenu',{static:false}) mainHeaderMenu!: ElementRef<HTMLDivElement>;
  menuList: any = [];
  roleId: number;
  masterList: any;
  orderCancellationList: any;
  menuListOrg: any;
  reportsList: any;
  pendingApproval: number;
  isMenuOpen:boolean= false;
  constructor(private authService: AuthService, private eRef: ElementRef) { }

  ngOnInit() {
    this.setMenuItems();
  }

  toggle(){
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.mainHeaderMenu.nativeElement.classList.add('show');
    } else {
      this.mainHeaderMenu.nativeElement.classList.remove('show');
    }
  }

  
  setMenuItems() {
    this.menuListOrg = this.authService.getMenuList();
    this.menuList = this.menuListOrg.filter(obj => obj.screen_name !== 'Masters');
    this.menuList = this.menuList.filter(obj => obj.screen_name !== 'Reports');
    this.menuList = this.menuList.filter(obj => obj.screen_name !== 'Order Cancellation');

    this.reportsList = {
      menus: this.menuListOrg.filter(obj => obj.screen_name == 'Reports')[0].menus,
      isSubmenuOpen:false
    }
    this.orderCancellationList = {
      menus: this.menuListOrg.filter(obj => obj.screen_name == 'Order Cancellation')[0].menus,
      isSubmenuOpen:false
    }
    this.masterList = {
      menus: this.menuListOrg.filter(obj => obj.screen_name == 'Masters')[0].menus,
      isSubmenuOpen:false
    }

    
    // this.masterList = this.menuListOrg.filter(obj => obj.screen_name == 'Masters');
    // this.orderCancellationList = this.menuListOrg.filter(obj => obj.screen_name == 'Order Cancellation');

    this.roleId = this.authService.getUserRoleId();
    // console.log("MENU LIST ::::: ", this.menuList);
    // this.menuList = [	
    //   {
    //     "screen_name": "Dashboard",
    //     "screen_image": "icon-dashboard.svg",
    //     "screen_order": "1",
    //     "screen_url": "/home"
    //   },
    //   {
    //     "screen_name": "Users",
    //     "screen_image": "icon-user.svg",
    //     "screen_order": "2",
    //     "screen_url": "/userprofile/users/list"
    //   },
    //   {
    //     "screen_name": "Customers",
    //     "screen_image": "icon-customers.svg",
    //     "screen_order": "3",
    //     "screen_url": "/customers/list"
    //   },
    //   {
    //     "screen_name": "Opportunities",
    //     "screen_image": "icon-inquiry.svg",
    //     "screen_order": "4",
    //     "screen_url": "/opportunities/list"
    //   },
    //   {
    //     "screen_name": "Offers",
    //     "screen_image": "icon-quotation.svg",
    //     "screen_order": "5",
    //     "screen_url": "/offers/list"
    //   },
    //   {
    //     "screen_name": "Approved Offers",
    //     "screen_image": "icon-quotation.svg",
    //     "screen_order": "6",
    //     "screen_url": "/approvedoffers/list"
    //   },
    //   {
    //     "screen_name": "PE Action",
    //     "screen_image": "icon-pe-action.svg",
    //     "screen_order": "7",
    //     "screen_url": "/peaction/list"
    //   },
    //   {
    //     "screen_name": "Required Approval",
    //     "screen_image": "icon-pending-for-approval.svg",
    //     "screen_order": "8",
    //     "screen_url": ""
    //   },
    //   {
    //     "screen_name": "Masters",
    //     "screen_image": "icon-masters.svg",
    //     "screen_order": "9",
    //     "screen_url": "",
    //     "childs":[
    //           {
    //             "screen_name": "Approval Matrix",
    //             "screen_image": "",
    //             "screen_order": "1",
    //             "screen_url": "/masters/approvalmatrix/list"
    //           },
    //           {
    //             "screen_name": "Price Configuration",
    //             "screen_image": "",
    //             "screen_order": "2",
    //             "screen_url": "/masters/priceconfiguration/add"
    //           },
    //           {
    //             "screen_name": "Additional Charges",
    //             "screen_image": "",
    //             "screen_order": "3",
    //             "screen_url": "/masters/additionalcharges/list"
    //           },
    //           {
    //             "screen_name": "Manage Ports",
    //             "screen_image": "",
    //             "screen_order": "4",
    //             "screen_url": "/masters/ports/list"
    //           },
    //           {
    //             "screen_name": "Manage Roles",
    //             "screen_image": "",
    //             "screen_order": "5",
    //             "screen_url": "/masters/roles/list"
    //           },
    //         ]
    //   }
    // ];
    // console.log("MENU LIST ::::: ",this.menuList);
  }
  getScreenPermissionsById(id: any) {

  }

  @HostListener('document:click', ['$event'])
  onClick(event) {
    if (!this.eRef.nativeElement.contains(event.target)) {
      // Click occurred outside of the menu, close it
      this.isMenuOpen  = false;
      this.mainHeaderMenu.nativeElement.classList.remove('show');
    }
  }

  isSubmenuOpen:boolean=false
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen; // Toggle the menu state
  }
  toggleSubMenu(menuitem: any) {
    if (menuitem.menus && menuitem.menus.length > 0) {
      menuitem.isSubmenuOpen = !menuitem.isSubmenuOpen;
    }
  }

}
