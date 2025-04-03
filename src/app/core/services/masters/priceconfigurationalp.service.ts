import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceconfigurationalpService {

  constructor(private httpClient: HttpClient) { }

  savedelprice(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}priceconfigurationalps/savedelprice`, data);
  }

  getPriceList(filter: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}priceconfigurationalps/getPriceList?CurrencyCode=${filter}`);
  }

  getPriceConfiguration(code: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}priceconfigurationalps/getpricebycode?code=${code}`);
  }
}
