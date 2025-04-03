import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffersimulatorService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCount(filter: any, offerdetailstatus: number, from: string, to: string, pendingon: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offersimulators/count?offerdetailstatus=${offerdetailstatus}&from=${from}&to=${to}&pendingon=${pendingon}`, filter);
  }

  getList(data: any, offerdetailstatus: number, from: string, to: string, pendingon: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offersimulators/list?offerdetailstatus=${offerdetailstatus}&from=${from}&to=${to}&pendingon=${pendingon}`, data);
  }

  getOffersDetail(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offersimulators/getdetails?id=${id}`);
  }

  CreateOffer(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offersimulators/save`, data);
  }
}
