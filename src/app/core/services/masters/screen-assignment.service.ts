import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScreenAssignmentService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getAllScreensList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}screenDetails/listscreens`, data);
  }

  assignScreens(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}screenroleMappings/assignscreens`, data);
  }
}
