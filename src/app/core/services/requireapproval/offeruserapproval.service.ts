import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfferuserapprovalService {

  constructor(private httpClient: HttpClient) { }

  getPendingCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offer_user_approvals/Count?searchValue=${searchValue}`)
  }



  onApproved(data: any): Observable<any> {

    return this.httpClient.post(`${environment.apiUrl}offer_user_approvals/onApproved`, data);
    //customers/getCustomerById?id=2
  }

  onReject(data: any): Observable<any> {

    return this.httpClient.post(`${environment.apiUrl}offer_user_approvals/onReject`, data);
    //customers/getCustomerById?id=2
  }

}



