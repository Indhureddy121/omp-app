import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PortService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getPortList(data: any): Observable<any> {

    return this.httpClient.post(`${environment.apiUrl}ports/list`, data);
    //customers/getCustomerById?id=2
  }

  getDetail(portId: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ports/getPortById?id=${portId}`);
  }

  createPortCharges(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ports/create`, data)
  }

  updatePort(data: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}ports/update`, data)
  }

  getCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ports/Count?searchValue=${searchValue}`)
  }

  getAllPorts(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ports/portlist`);
  }
}
