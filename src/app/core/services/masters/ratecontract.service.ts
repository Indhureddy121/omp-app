import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RatecontractService {


  constructor(private httpClient: HttpClient) { }


  getCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ratecontracts/count?searchValue=${searchValue}`);
  }

  getRateContractDetail(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ratecontracts/list`, filter);
  }

  upload(fileData: any, type: any): Observable<any> {
    let formData = new FormData();
    formData.append('file', fileData);
    return this.httpClient.post(`${environment.apiUrl}importhistories/upload?type=${type}`, formData)
  }

  updateRateContract(data: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}ratecontracts/updateData`, data);
  }

  Create(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}importhistories/create`, data)
  }

  updateStatus(data: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}importhistories/updateStatus`, data)
  }

  getHistoryCount(type: string, filter: any = {}): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}importhistories/Count?type=${type}`, filter);
  }

  getHistoryList(type: string, filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}importhistories/list?type=${type}`, filter);
  }
  downloadFile(fileName: any, isStatus, type): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}importhistories/downloadFile/?fileName=${fileName}&isStatusFile=${isStatus}&type=${type}`)
  }

  // getRateContracts(sapid: string): Observable<any> {
  //   return this.httpClient.post(`${environment.apiUrl}ratecontracts/list`, sapid)
  // }

  getRCDetail(id: number, isclone: boolean): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ratecontracts/getrcdetails?id=${id}&isclone=${isclone}`)
  }

  getRCItems(rcId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ratecontracts/getrcitems?rcId=${rcId}`)
  }

  getRCbysoldto(sapid: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ratecontracts/listbysoldto?sapid=${sapid}`)
  }

  saveItemAmendment(model: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ratecontracts/saveitemamendment`, model)
  }

  getAmendmentItems(rcId: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ratecontracts/getamendmentitem?rcid=${rcId}`)
  }

  GetEmployeeResponsibleList(soldtoparty: string, distChnl: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ratecontracts/employeeresponsible?soldtoparty=${soldtoparty}&distChnl=${distChnl}`);
  }
}
