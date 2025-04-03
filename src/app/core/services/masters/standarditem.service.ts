import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StandarditemService {

  constructor(private httpClient: HttpClient) { }

  getCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}standarditems/count?searchValue=${searchValue}`);
  }

  getSTDItemImportList(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}standarditems/list`, filter);
  }

  upload(fileData: any, type: any): Observable<any> {
    let formData = new FormData();
    formData.append('file', fileData);
    return this.httpClient.post(`${environment.apiUrl}importhistories/upload?type=${type}`, formData);
  }

  updateStandardItem(data: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}productmasters/updateALPData`, data);
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
}
