import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StorageService, StorageKey } from '../common/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) { }

  //This functions are used for authentication like username & password
  CheckUserCreditial(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/login`, data);
  }

  getScreenDetails(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}screenDetails/list`);
  }

  ConfigurationbyCode(code: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/getconfigurationbycode?code=${code}`);
  }

  isLoggedIn(): boolean {
    var token = this.storageService.getValue(StorageKey.authToken);
    var currentUser = this.storageService.getValue(StorageKey.currentUser);

    if (token && currentUser)
      return true;
    else
      return false;
  }


  getAccessToken(): any {
    var token = this.storageService.getValue(StorageKey.authToken);
    return token ? token : null;
  }

  logout() {
    localStorage.clear();
  }

  getUserId(): any {
    var id = JSON.parse(this.storageService.getValue(StorageKey.currentUser)).id;
    return id ? id : null;
  }

  getUserSAPId(): any {
    var id = JSON.parse(this.storageService.getValue(StorageKey.currentUser)).userid;
    return id ? id : null;
  }

  getUserName(): any {
    var name = JSON.parse(this.storageService.getValue(StorageKey.currentUser)).fullname;
    return name ? name : null;
  }

  getDateFormat(): any {
    var dateformat = this.storageService.getValue(StorageKey.dateformat) ? this.storageService.getValue(StorageKey.dateformat) : "dd/MM/yyyy";
    return dateformat;
  }

  forgotPassword(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/forgotPassword`, data);
  }

  getMenuList() {
    var menuList = JSON.parse(this.storageService.getValue(StorageKey.menuData));
    return menuList ? menuList : null;
  }

  getUserRoleId(): any {
    var role_id = JSON.parse(this.storageService.getValue(StorageKey.currentUser)).role_id;
    return role_id ? role_id : null;
  }

  getUserRoleCode(): any {
    var code = JSON.parse(this.storageService.getValue(StorageKey.currentUser)).role_code;
    return code ? code : null;
  }

  getScreenValues(): any {
    var screen = JSON.parse(this.storageService.getValue(StorageKey.defaultscreenvalues));
    return screen ? screen : null;
  }

  getCurrentUser(): any {
    var userdata = JSON.parse(this.storageService.getValue(StorageKey.currentUser));
    return userdata ? userdata : null;
  }

  setScreenValues(screenname: string, screenproperty: string, value: any) {
    let screenvalues = (JSON.parse(this.storageService.getValue(StorageKey.defaultscreenvalues)));
    screenvalues[screenname][screenproperty] = value;
    this.storageService.removeValue(StorageKey.defaultscreenvalues);
    this.storageService.setValue(StorageKey.defaultscreenvalues, JSON.stringify(screenvalues));
    return;
  }

  // geCurrentUserData(): any {
  //   var userdata = JSON.parse(this.storageService.getValue(StorageKey.currentUser));
  //   return userdata ? userdata : null;
  // }

  OfferValidupto(): any {
    var offervaliduptodays = this.storageService.getValue(StorageKey.offervalidfromcreation);
    return offervaliduptodays ? offervaliduptodays : 10;
  }

  resetPassword(data:any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}ompusers/resetPassword`, data);
  }
  

}
