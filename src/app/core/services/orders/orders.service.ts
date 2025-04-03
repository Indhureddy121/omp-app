import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCount(filter: object): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}orders/count`, filter);
  }

  getOrdersList(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}orders/list`, filter);
  }

  onrefreshstatus(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}orders/refreshstatus`);
  }

  SODetailStatus(offerid: number, sono: string, type: number, status: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}orders/detailstatus?offerid=${offerid}&sono=${sono}&type=${type}&status=${status}`);
  }
  
  SAPOrders(payload: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}orders/sap-orders`, payload);
  }

  updateOrCreateCancellation(payload: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}orders/update-or-create-cancellation`, payload);
  }

  getAllCancellations(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}orders/get-all-cancellations`);
  }

  getSOCancellationApprovalMatrix(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}orders/get-so-cancellation-approval-matrix`);
  
  }

  pendingCancellationApproval(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}orders/pending-cancellation-approval`);
  }

  cancellationRequestAction(payload: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}orders/cancellation-request-action`, payload);
  }

  fetchApprovalHistory(soNumber: string, itemNumber: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}orders/fetchApprovalHistory?soNumber=${soNumber}&itemNumber=${itemNumber}`);
  }
}
