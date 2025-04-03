import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImportCopperIndexService {

  constructor(private httpClient: HttpClient) { }

  getCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ImportCopperIndices/Count?searchValue=${searchValue}`);
  }

  getCopperIndexList(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ImportCopperIndices/list`, filter);
  }

  createCooperIndex(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ImportCopperIndices/Create`, data);
  }

  validate(fiels, fieldValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ImportCopperIndices/validate`);
  }

  updateCooperIndex(data: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}ImportCopperIndices/updateData`, data);
  }
  getHistoryList(type: string, filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}importhistories/list?type=${type}`, filter);
  }

  getHistoryCount(type: string, filter: any = {}): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}importhistories/Count?logType=${type}`, filter);
  }

  // upload(data:any):Observable<any>{

  //   return this.httpClient.post(`${environment.apiUrl}containers/importedFiles/upload`,data);

  // }
  upload(fileData: any, type: any): Observable<any> {

    let formData = new FormData();
    formData.append('file', fileData);
    return this.httpClient.post(`${environment.apiUrl}importhistories/upload?type=${type}`, formData)

  }

  updateStatus(data: any): Observable<any> {

    return this.httpClient.put(`${environment.apiUrl}importhistories/updateStatus`, data)

  }

  Create(data: any): Observable<any> {

    return this.httpClient.post(`${environment.apiUrl}importhistories/create`, data)

  }

  downloadFile(fileName: any, isStatus, type): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}importhistories/downloadFile/?fileName=${fileName}&isStatusFile=${isStatus}&type=${type}`)
  }
}
