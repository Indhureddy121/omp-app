import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PetService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getPETMasterCount(searchValue: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}petmasters/Count`, searchValue);
  }

  importpetmaster(filename: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}petmasters/importpetmaster?filename=${encodeURIComponent(filename)}`);
  }

  getPETMasterList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}petmasters/getpetmasterlist`, data);
  }

  deletepetmaster(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}petmasters/deletepetmaster?id=${id}`);
  }

  getPETMasterData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}petmasters/getpetmasterdata?id=${id}`);
  }

  savepetmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}petmasters/savepetmaster`, data);
  }
}
