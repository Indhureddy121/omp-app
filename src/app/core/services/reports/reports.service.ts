import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getsalesgrowthbyphdata(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/getsalesgrowthbyph`, filter);
  }

  createpdf(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/createpdf`);
  }

  getsalesgrowthbysegmentdata(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/getsalesgrowthbysegment`, filter);
  }

  getproductwiseenquirytrendyoydata(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/getproductwiseenquirytrendyoy`, filter);
  }

  gettimemeasurementRFOCPOtoSO(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/gettimemeasurementRFOCPOtoSO`, filter);
  }

  gettimemeasurementnewtoapproved(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/gettimemeasurementnewtoapproved`, filter);
  }

  getsprofferstat(financialyear: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/getsprofferstat?financialyear=${financialyear}`);
  }

  getsprarticlecreationtat(financialyear: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/getsprarticlecreationtat?financialyear=${financialyear}`);
  }

  getopenopportunityanalysis(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/getopenopportunityanalysis`, filter);
  }

  getclosedopportunityanalysis(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/getclosedopportunityanalysis`, filter);
  }

  getopenorder(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/openorder`, filter);
  }

  getinvoicelist(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/invoicelist`, filter);
  }

  getcustomeroutstandingheader(customer: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/customeroutstandingheader?customer=${customer}`);
  }

  getcustomeroutstandingitemdetail(customer: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/customeroutstandingitemdetail?customer=${customer}`);
  }

  syncreportmatrix(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/syncreportmatrix`);
  }

  getbusinessscorecard(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/businessscorecard`, data);
  }

  orderdashboard(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/orderdashboard`, data);
  }

  gettatreportdata(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/tatreport`, data);
  }

  getofferapprovedrecordsdata(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/getofferapprovedrecordsdata`, data);
  }

  getstdsprarticlescountdata(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/getstdsprarticlescountdata`, data);
  }

  articlecostrepost(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/articlecostrepost`, data);
  }

  articlePrice(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/articleprice`, data);
  }

  // salesorderpdf(sonumber: number): Observable<any> {
  //   return this.httpClient.get(`${environment.apiUrl}reports/salesorderpdf?sonumber=${sonumber}`);
  // }

  // Invoicepdf(ordernumber: number): Observable<any> {
  //   return this.httpClient.get(`${environment.apiUrl}reports/invoicepdf?ordernumber=${ordernumber}`);
  // }

  salesorderpdf(sonumber: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/salespdf?sonumber=${sonumber}`, { responseType: 'blob' });
  }

  Invoicepdf(ordernumber: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}reports/invoicepdf?ordernumber=${ordernumber}`, { responseType: 'blob' });
  }

  sap_order_dashboard(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}reports/saporderdashboard`, filter);
  }
}
