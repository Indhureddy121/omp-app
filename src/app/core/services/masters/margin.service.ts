import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarginService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}margins/Count?searchValue=${searchValue}`);
  }

  getMarginList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}margins/getmarginlist`, data);
  }

  importmargin(filename: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}margins/importmargin?filename=${encodeURIComponent(filename)}`);
  }

  deletemargin(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}margins/deletemargin?id=${id}`);
  }

  getMarginData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}margins/getmargindata?id=${id}`);
  }

  savemargin(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}margins/savemargin`, data);
  }
}
