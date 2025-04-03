import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { StorageService, StorageKey } from '@core/services/common/storage.service';
import { PwaService } from '@core/services/pwa/pwa.service';
import { Platform } from '@angular/cdk/platform';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'app-app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent implements OnInit {
  currentUser: string;
  fullName: string;
  emailid: string;
  dateformatData: any;
  dateString: any;
  @ViewChild('mainHeaderMenu',{static:false}) mainHeaderMenu!: ElementRef<HTMLDivElement>;
  isMenuOpen:boolean= false;

  constructor(
    private authServcie: AuthService,
    private router: Router,
    private storageService: StorageService
  ) { }

  ngOnInit() {
    this.onload();
    this.dateformatData = 'dd/MM/yyyy hh:mm:ss';
    setInterval(x => {
      this.refreshTime();
    }, 1000);
  }

  private onload() {
    this.currentUser = JSON.parse(this.storageService.getValue(StorageKey.currentUser))
    if (this.currentUser != undefined) {
      this.fullName = this.currentUser['fullname'];
      this.emailid = this.currentUser['emailid'];
    }
  }

  onLogout() {
    this.authServcie.logout();
    this.router.navigate(['/login']);
  }

  refreshTime() {
    this.dateString = new Date();
  }

  onMyProfileClick(){
    this.router.navigate(['/userprofile/users/myprofile']);
  }

  toggleProfileMenu(){
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.mainHeaderMenu.nativeElement.classList.add('show');
    } else {
      this.mainHeaderMenu.nativeElement.classList.remove('show');
    }
  }
}
