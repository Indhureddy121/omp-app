import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private httpClient: HttpClient
  ) { }

  GetData(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}dashboards/getdata`);
  }

  GetCustomerCount(): Observable<any>{   
    return this.httpClient.get(`${environment.apiUrl}dashboards/getCustomerCount`);   
  }

  GetUserCount(): Observable<any>{  
    return this.httpClient.get(`${environment.apiUrl}dashboards/getUserCount`);
  }

  GetLeaveUsersList(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}dashboards/onleaveuserslist`);
  }
}
