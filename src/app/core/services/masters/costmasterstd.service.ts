import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostmasterstdService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCostMasterCount(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}costmasterstds/getCostMasterSTDCount`, filter);
  }

  getRMCostmasterList(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}costmasterstds/stdcostList`, filter);
  }

  importcostmaster(filename: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}costmasterstds/importstdcostmaster?filename=${encodeURIComponent(filename)}`);
  }

  deletecostmaster(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}costmasterstds/deletecostmaster?id=${id}`);
  }

  getCostMasterData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}costmasterstds/getcostmasterdata?id=${id}`);
  }

  savecostmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}costmasterstds/savecostmaster`, data);
  }

  initiateExportCostMaster(data:any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}costmasterstds/exportcostmaster`, data);
  }

  getLappCostSet(data:any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}costmasterstds/getlappcostset`, data);
  }

  saveompmanagecostmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}costmasterstds/updatecostmaster_nonsap`, data);
  }
}
