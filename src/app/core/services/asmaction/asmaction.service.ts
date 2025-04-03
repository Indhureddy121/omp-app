import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AsmactionService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}asmactions/asmactioncount?searchValue=${searchValue}`)
  }

  getASMActionList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}asmactions/asmactionlist`, data);
  }
}
