import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RcOrdersService {

  constructor(
    private httpClient: HttpClient
  ) { }

  Count(filter: any, offerstatus: number, offerdetailstatus: number, from: string, to: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}rcorders/count?offerstatus=${offerstatus}&offerdetailstatus=${offerdetailstatus}&from=${from}&to=${to}`, filter);
  }

  List(filter: any, offerstatus: number, offerdetailstatus: number, from: string, to: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}rcorders/list?offerstatus=${offerstatus}&offerdetailstatus=${offerdetailstatus}&from=${from}&to=${to}`, filter);
  }

  CreateOrder(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}rcorders/save`, data);
  }

  OrderDetails(orderid: number, isclone: boolean): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}rcorders/getrcorderdetail?id=${orderid}&isclone=${isclone}`);
  }

  createSO(orderid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}rcorders/createsaporder?orderId=${orderid}`);
  }

  SaveSOno(orderid: number, sono: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}rcorders/savesono?orderid=${orderid}&sono=${sono}`);
  }

  SavePO(podata: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}rcorders/savepo`, podata);
  }

  CreateSAPOrder(orderid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}rcorders/createsaporder?orderId=${orderid}`);
  }
}
