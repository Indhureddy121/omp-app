import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CostmastertrdService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCostMasterCount(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}costmastertrds/getCostMasterTRDCount`, filter);
  }

  getRMCostmasterList(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}costmastertrds/trdcostList`, filter);
  }

  importcostmaster(filename: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}costmastertrds/importtrdcostmaster?filename=${encodeURIComponent(filename)}`);
  }

  deletecostmaster(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}costmastertrds/deletecostmaster?id=${id}`);
  }

  getCostMasterData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}costmastertrds/getcostmasterdata?id=${id}`);
  }

  savecostmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}costmastertrds/savecostmaster`, data);
  }

  initiateExportCostMaster(data:any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}costmastertrds/initiateexportcostmaster`, data);
  }

  getLappCostSet(data:any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}costmastertrds/getlappcostset`, data);
  }

  saveompmanagecostmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}costmastertrds/updatecostmaster_nonsap`, data);
  }
}
