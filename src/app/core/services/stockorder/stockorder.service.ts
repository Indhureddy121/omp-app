import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StockorderService {

  constructor(
    private httpClient: HttpClient
  ) { }

  OrdersCount(filter: any, offerstatus: number, offerdetailstatus: number, pendingon: number, OrderType: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/orderscount?offerstatus=${offerstatus}&offerdetailstatus=${offerdetailstatus}&pendingon=${pendingon}&OrderType=${OrderType}`, filter);
  }

  OrdersList(data: any, offerstatus: number, offerdetailstatus: number, pendingon: number, OrderType: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/orderslist?offerstatus=${offerstatus}&offerdetailstatus=${offerdetailstatus}&pendingon=${pendingon}&OrderType=${OrderType}`, data);
  }

  CreateOrder(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/createorder`, data);
  }

  OrderDetails(id: number, isclone: boolean): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/orderdetails?id=${id}&isclone=${isclone}`);
  }

  SaveItemAdditionalFields(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/saveitemadditionalfields?offerid=${offerid}`);
  }

  CreateSAPOrder(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/createsaporder?offerid=${offerid}`);
  }

  saveapprovaldata(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/saveapprovaldata`, data);
  }

  SoldtoPartyList(sapid: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/soldtopartylist?sapid=${sapid}`);
  }

  SoldtoPartyDetail(soldtoparty: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/soldtopartydetail?soldtoparty=${soldtoparty}`);
  }

  ShiptoPartyList(soldtoparty: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/shiptopartylist?soldtoparty=${soldtoparty}`);
  }

  ShiptoPartyDetail(soldtoparty: string, shiptoparty: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/shiptopartydetail?soldtoparty=${soldtoparty}&shiptoparty=${shiptoparty}`);
  }

  StockAvailability(articles: any, isimport: boolean, isgrouping: boolean): Promise<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/checkstockavailability?articles=${articles}&isimport=${isimport}&isgrouping=${isgrouping}`).toPromise();
  }

  GetEmployeeResponsibleList(soldtoparty: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/employeeresponsible?soldtoparty=${soldtoparty}`);
  }

  SavePO(podata: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/savepo`, podata);
  }

  SaveSOno(offerid: number, sono: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/savesono?offerid=${offerid}&sono=${sono}`);
  }

  SaveCPOValidator(cpovalidatormodel): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/savecpovalidator`, cpovalidatormodel);
  }

  GetAccountsList(account: string, ownerid: string, accountid:string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/getaccountlist?account=${account}&ownerid=${ownerid}&accountid=${accountid}`);
  }

  getFMApprovalData(orderid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/getfmapprovaldata?orderid=${orderid}`);
  }

  RefreshAccountsList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}customers/sfdcaccountpartners`, data);
  }

  SaveFMApprovalData(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/savefmapprovaldata`, data);
  }

  savecuttingcharges(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/savecuttingcharges`, data);
  }

  SaveNacecodeDetail(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}stockorders/savenacecodedetail`, data);
  }

  getApprovalData(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}stockorders/getapprovaldata?offerId=${offerid}`);
  }
}
