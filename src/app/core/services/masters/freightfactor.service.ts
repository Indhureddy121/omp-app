import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FreightfactorService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}freightfactormasters/count?searchValue=${searchValue}`);
  }

  freightfactorlist(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}freightfactormasters/getfflist`, filter);
  }

  importfreightfactordata(filename: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}freightfactormasters/importffdata?filename=${encodeURIComponent(filename)}`);
  }

  deletefreightmaster(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}freightfactormasters/deletefreightmaster?id=${id}`);
  }

  getfreightMasterData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}freightfactormasters/getfreightmasterdata?id=${id}`);
  }

  savefreightmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}freightfactormasters/savefreightmaster`, data);
  }
}
