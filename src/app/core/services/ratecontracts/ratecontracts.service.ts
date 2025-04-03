import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RatecontractsService {

  constructor(private httpClient: HttpClient) { }

  getRateContractsList(filter: any, status: number, rcstatus: number, from: string, to: string, rctype: number, pendingon: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ratecontracts/list?status=${status}&rcstatus=${rcstatus}&from=${from}&to=${to}&rctype=${rctype}&pendingon=${pendingon}`, filter);
  }

  getCount(filter: any, status: number, rcstatus: number, from: string, to: string, rctype: number, pendingon: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ratecontracts/count?status=${status}&rcstatus=${rcstatus}&from=${from}&to=${to}&rctype=${rctype}&pendingon=${pendingon}`, filter);
  }

  getRcDetails(id, isClone = false) {
    return this.httpClient.get(`${environment.apiUrl}/ratecontracts/getrcdetails?id=${id}&isclone=${isClone}`)
  }

  saveRcDetails(data: any) {
    return this.httpClient.post(`${environment.apiUrl}ratecontracts/save`, data);
  }

  getApprovalDetails(id) {
    return this.httpClient.get(`${environment.apiUrl}ratecontracts/getapprovaldata?rcId=${id}`)
  }

  saveApprovalData(data: any) {
    return this.httpClient.post(`${environment.apiUrl}ratecontracts/saveapprovaldata`, data);
  }

  saveAttchementData(data: any) {
    return this.httpClient.post(`${environment.apiUrl}ratecontracts/savedocs`, data);
  }

  getAttchmentData(id) {
    return this.httpClient.get(`${environment.apiUrl}/ratecontracts/getdocs?rcId=${id}`)
  }

  documentSubmit(rcid: number) {
    return this.httpClient.get(`${environment.apiUrl}/ratecontracts/submitdocs?rcId=${rcid}`)
  }

  activeRC(data: object) {
    return this.httpClient.post(`${environment.apiUrl}/ratecontracts/activerc`, data)
  }
}
