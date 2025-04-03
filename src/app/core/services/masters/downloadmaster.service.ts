import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DownloadmasterService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getDownloadMasterList(type:number,filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}downloadmasters/list?type=${type}`,filter);
  }

  getDownloadMasterCount(type): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}downloadmasters/Count?logType=${type}`);
  }

  updateStatus(data: any): Observable<any> {

    return this.httpClient.put(`${environment.apiUrl}downloadmasters/updateStatus`, data)

  }

  getDownloadCount(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}downloadmasters/DownloadCount`, filter);
  }
}
