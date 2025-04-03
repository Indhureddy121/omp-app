import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BroadcastsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  GetCount(data: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}broadcasts/count`, data);
  }

  GetList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}broadcasts/list`, data);
  }

  Save(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}broadcasts/save`, data);
  }

  GetDetail(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}broadcasts/detail?id=${id}`);
  }

  GetBroadcast(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}broadcasts/allbroadcast`);
  }

  Delete(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}broadcasts/delete?id=${id}`);
  }
}
