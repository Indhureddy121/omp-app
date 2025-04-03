import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoqService {

  constructor(private httpClient: HttpClient) { }

  getMoqList(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}moqmasters/moqList`, filter);
  }

  importMoq(value: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}moqmasters/importMoq`, value);
  }


}
