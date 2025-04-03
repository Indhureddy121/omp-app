import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RmcostmasterService {

  constructor(private httpClient: HttpClient) { }

  getCostMasterCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/getCostMasterCount?searchValue=${searchValue}`);
  }

  getRMCostmasterList(filter: any, type: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/costList?type=${type}`, filter);
  }

  upload(fileData: any, type: any): Observable<any> {
    let formData = new FormData();
    formData.append('file', fileData);
    return this.httpClient.post(`${environment.apiUrl}importhistories/upload?type=${type}`, formData);
  }

  importcostmaster(filename: any, productType: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/importcostmaster?filename=${filename}&producttype=${productType}`);
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

  deletecostmaster(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/deletecostmaster?id=${id}`);
  }

  getCostMasterData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/getcostmasterdata?id=${id}`);
  }

  savecostmaster(data: any, productType: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/savecostmaster?producttype=${productType}`, data);
  }
}

