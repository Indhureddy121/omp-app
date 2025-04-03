import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FmactionService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCount(searchValue, itemstatus): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}fmactions/fmactioncount?searchValue=${searchValue}&itemstatus=${itemstatus}`)
  }

  getFMActionList(data: any, itemstatus): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}fmactions/fmactionlist?itemstatus=${itemstatus}`, data);
  }

  saveFreight(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}fmactions/savefmaction`, data);
  }
}
