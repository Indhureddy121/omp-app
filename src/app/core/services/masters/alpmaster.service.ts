import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AlpmasterService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getALPMasterCount(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/getALPMasterCount`, filter);
  }

  getALPMasterList(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/alpList`, filter);
  }

  importalpmaster(filename: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/importalpmaster?filename=${encodeURIComponent(filename)}`);
  }

  deletealpmaster(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/deletealpmaster?id=${id}`);
  }

  getalpMasterData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/getalpmasterdata?id=${id}`);
  }

  savealpmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/savealpmaster`, data);
  }

  calculatealp(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/fixedalpcalculate`);
  }

  releasealp(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/fixedalprelease`);
  }

  releasealppdf(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/releasealppdf`);
  }

  releasealpexcel(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/releasealpexcel`);
  }
}
