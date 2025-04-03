import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HsnmasterService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getHSNMasterCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}hsnmasters/Count?searchValue=${searchValue}`);
  }

  importhsnmaster(filename: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}hsnmasters/importhsnmaster?filename=${encodeURIComponent(filename)}`);
  }

  getHSNMasterList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}hsnmasters/gethsnmasterlist`, data);
  }

  deletehsnmaster(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}hsnmasters/deletehsnmaster?id=${id}`);
  }

  getHSNMasterData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}hsnmasters/gethsnmasterdata?id=${id}`);
  }

  savehsnmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}hsnmasters/savehsnmaster`, data);
  }

  initiateExportHsnMaster(data:any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}hsnmasters/initiateexporthsnmaster`, data);
  }
}
