import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';



@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getSfdcCustomer(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}customers/fetchsalesforce`, data);
  }
  getCustomerList(data: any): Observable<any> {

    return this.httpClient.post(`${environment.apiUrl}customers/list`, data);
    //customers/getCustomerById?id=2
  }

  getCustomerById(id: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/getcustomer?id=${id}`);
  }

  addSapId(data: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}customers/addSapId`, data);
  }

  getCustomerAddress(id: any, addtype: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customerAddresses/getCustomerAddress?id=${id}&addtype=${addtype}`);
  }

  getCustomerAddressforOffer(id: any, addtype: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customerAddresses/getCustomerAddressforOffer?id=${id}&addtype=${addtype}`);
  }

  getCount(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}customers/Count`, filter);
  }

  getSAPCustomer(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/fetchsapcustomer`);
  }

  getdealerslist(dealer: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/getdealerslist?name=${dealer}`);
  }

  getcustomersanddealerslist(dealer: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/getcustomersanddealerslist?name=${dealer}`);
  }

  updateCustomerLoginStatus(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}customers/updatecustomerloginstatus`, data);
  }

  updateCustomerLockStatus(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}customers/updatecustomerlockstatus`, data);
  }

  getNacecodebySapId(sapid: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/nacecodebysapid?sapid=${sapid}`);
  }

  getNacecodebySapIdandNaceCode(sapid: string, nacecode: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/nacecodebysapidandnacecode?sapid=${sapid}&nacecode=${nacecode}`);
  }

  getNaceCodebySFDCIdandNacecode(sfdcId: string, nacecode: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/nacecodebysfdcidandnacecode?sfdcid=${sfdcId}&nacecode=${nacecode}`);
  }

  getNaceCodebySFDCId(sfdcId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/nacecodebysfdcid?sfdcid=${sfdcId}`);
  }

  getCustomerbySapId(sapid: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/getcustomerbysapid?sapid=${sapid}`);
  }

  getCustomerbySFDCId(sfdcId: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/getcustomerbysfdcid?sfdcId=${sfdcId}`);
  }

  getSoldtoPartyFilterSearchwithCustomerType(sapid: string, customertype: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/soldtopartiesbycustomertype?soldtoparty=${sapid}&customertype=${customertype}`);
  }

  getShiptoPartyFilterSearchwithCustomerType(sapid: string, customertype: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}customers/shiptopartiesbycustomertype?soldtoparty=${sapid}&customertype=${customertype}`);
  }
}
