import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdditionalchargesService {
  constructor(
    private httpClient: HttpClient
  ) { }

  getCount(searchValue: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}additionalcharges/Count?searchValue=${searchValue}`);
  }

  getaclist(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}additionalcharges/list`, filter);
  }

  deleteadditionalcharges(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}additionalcharges/delete?id=${id}`);
  }

  getDetail(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}additionalcharges/detail?id=${id}`);
  }

  saveadditionalcharges(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}additionalcharges/saveadditionalcharges`, data);
  }

  DefaultDataSave(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}additionalcharges/savedefaultadditionalcharges`, data);
  }

  getDefaultData(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}additionalcharges/defaultdata`);
  }
}