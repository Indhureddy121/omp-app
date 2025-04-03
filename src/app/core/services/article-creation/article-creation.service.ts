import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ArticleCreationService {

  constructor(private httpClient: HttpClient) { }

  count(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}articlecreations/count`, data)
  }

  list(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}articlecreations/list`, data);
  }

  save(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}articlecreations/save`, data);
  }
}
