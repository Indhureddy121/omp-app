import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LookupService {

  constructor(private httpClient: HttpClient) { }
  //{"lookup_type":"city,state"}
  getLookupdata(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}lookups/list`, data);
  }

  getLookupdatawithFullName(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}lookups/listwithfullname`, data);
  }
}
