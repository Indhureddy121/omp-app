import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OmpusersService {

  constructor(private httpClient: HttpClient) { }
  getUsersList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/listusers`, data);
  }
  GetUserById(data: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/getuserdetail?id=${data}`);
  }
  create(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers`, data);
  }
  createRoleMapping(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}userroleMappings`, data);
  }
  createRegionMapping(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}userregionMappings`, data);
  }
  update(data: any, id: number): Observable<any> {
    return this.httpClient.patch(`${environment.apiUrl}ompusers/${id}`, data);
  }
  getRegionList(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}regions/list`);
  }
  getCount(searchvalue: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/countusers?searchValue=${searchvalue}`);
  }
  getSfdcUsers(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/fetchsalesforce`, data);
  }
  getRolesByUserId(userid: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/${userid}/userroles`);
  }
  getRegionsByUserId(userid: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/${userid}/regions`);
  }
  deleteRolesByUserId(userid: any): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}ompusers/${userid}/userroles`);
  }
  deleteRegionsByUserId(userid: any): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}ompusers/${userid}/regions`);
  }
  getManagerList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/managerlist`, data);
  }

  saveuser(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/saveuser`, data);
  }

  changepassword(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/changepassword`, data);
  }

  updateleavestatus(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/updateleavestatus`, data);
  }

  updateUserTogglestatus(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ompusers/updateuserstatus`, data);
  }

  getOwnerList(value: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/getownerlist?value=${value}`);
  }

  getSegmentList(value: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/getsegmentlist?value=${value}`);
  }

  getSalesTeam(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ompusers/salesteam`);
  }

  getDelivery(sonumber:any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/dbordtodeliverynav?sonumber=${sonumber}`);
  }
  getInvoice(sonumber:any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/dbordtoinvoicenav?sonumber=${sonumber}`);
  }

  getSAPData(payload:any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/saporderdashboard`, payload);
  }
}