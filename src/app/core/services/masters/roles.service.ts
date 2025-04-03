import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllRolesList(type: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}userroles/rolelist?ischannelpartner=${type}`);
  }

  getAllConfigRolesList(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}userroles/getallconfigroles`);
  }

  getRolesList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}userroles/list`, data);
  }

  GetRoleById(data: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}userroles/${data}`);
  }
  // create(data: any): Observable<any> {
  //   console.log("DATA",data);
  //   return this.httpClient.post(`${environment.apiUrl}userroles`, data);
  // }

  // update(data: any,id:number): Observable<any> {
  //   return this.httpClient.patch(`${environment.apiUrl}userroles/${id}`, data);
  // }
  SaveRole(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}userroles/saverole`, data);
  }

  getCount(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}userroles/countrole`, data);
  }

  getSfdcUsers(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}userroles/fetchsalesforce`, data);
  }
}
