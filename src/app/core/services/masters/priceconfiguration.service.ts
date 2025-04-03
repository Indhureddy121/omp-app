import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PriceconfigurationService {

  constructor(private httpClient: HttpClient) { }

  savedelprice(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}priceconfigurations/savedelprice`, data);
  }

  getPriceList(filter: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}priceconfigurations/getPriceList?CurrencyCode=${filter}`);
  }

  getConfiguration(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}configurations/getConfiguration`);
  }
}
