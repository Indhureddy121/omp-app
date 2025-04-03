import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OffersService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getCount(filter: any, offerstatus: number, offerdetailstatus: number, from: string, to: string, pendingon: number, assignto: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/count?offerstatus=${offerstatus}&offerdetailstatus=${offerdetailstatus}&from=${from}&to=${to}&pendingon=${pendingon}&assignto=${assignto}`, filter);
  }

  getOffersList(data: any, offerstatus: number, offerdetailstatus: number, from: string, to: string, pendingon: number, assignto: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/list?offerstatus=${offerstatus}&offerdetailstatus=${offerdetailstatus}&from=${from}&to=${to}&pendingon=${pendingon}&assignto=${assignto}`, data);
  }

  CreateOffer(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/createoffer`, data);
  }

  getStdItemSearch(materialcode: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/stditemsearch?materialcode=${materialcode}`);
  }

  async upload(fileData: any, type: any): Promise<any> {
    let formData = new FormData();
    //for multiple file
    for (var x = 0; x < fileData.length; x++) {
      formData.append("file", fileData[x]);
    }
    return await this.httpClient.post(`${environment.apiUrl}file_references/upload?type=${type}`, formData).toPromise();
  }

  getOffersDetail(id: number, isclone: boolean): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getofferdetails?id=${id}&isclone=${isclone}`);
  }

  getItems(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getitems?id=${id}`);
  }

  getSPRItem(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getspritems?id=${id}`);
  }

  getPendingOfferList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offer_user_approvals/pendingList`, data);
  }

  getReadyForSoList(data: any, userid: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/getFinalSoList?userid=${userid}`, data);
  }

  getCountforRequireApproval(userid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offer_user_approvals/countpendingoffers?userid=${userid}`);
  }

  getApprovalData(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getapprovaldata?offerId=${offerid}`);
  }

  sendforapproval(offerid: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/sendforapproval`, offerid);
  }

  addOrderStatus(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}order_statuses/create`, data);
  }

  getOfferHistoryCount(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}order_statuses/CountHistoryData`);
  }

  getOfferHistoryList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}order_statuses/offerList`, data);
  }

  updateSapInOffer(data: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}offerlookups/updateSapInOffer`, data);
  }

  getOfferWithStatus(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}order_statuses/getOfferHistoryByOfferId`, data);
  }

  getReadyForSoCount(searchValue: string, userid: number): Observable<any> {
    if (searchValue == "" || searchValue == undefined || searchValue == null) searchValue = " ";
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getreadyforsocount?userid=${userid}&searchValue=${searchValue}`);
  }

  getPOCount(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getpocount?offerid=${offerid}`);
  }

  getPOData(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getpodata?offerid=${offerid}`);
  }

  savePO(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/savepo`, data);
  }

  updatePO(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/updatepo`, data);
  }

  saveOfferTerms(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/saveofferterms`, data);
  }

  getOfferTerms(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getofferterms?offerid=${offerid}`);
  }

  getFMApprovalData(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getfmapprovaldata?offerid=${offerid}`);
  }

  saveInitiateSO(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/saveinitiateso`, data);
  }

  GETInitiateSO(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getinitiateso?offerid=${offerid}`);
  }

  savecustomerapproval(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/savecustomerapproval`, data);
  }
  regenerateso(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/regenerateso`, data);
  }
  getcustomerapproval(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getcustomerapproval?offerid=${offerid}`);
  }

  saveAdditionalFields(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/saveadditionalfields`, data);
  }

  generateofferpdf(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/GeneratePDF?offerId=${offerid}`);
  }

  getAccountContactDetail(id: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getaccountcontact?accountid=${id}`);
  }

  savespritem(spritems: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/savespritems`, spritems);
  }

  getOppoOffersList(oppoid: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/oppoofferslist?oppoid=${oppoid}`);
  }

  async getMSQofItems(itemsarticleno: any): Promise<any> {
    return await this.httpClient.get(`${environment.apiUrl}offerlookups/getmsqofitems?articlenos=${itemsarticleno}`).toPromise();
  }

  saveapprovaldata(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/saveapprovaldata`, data);
  }

  SaveFMApprovalData(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/savefmapprovaldata`, data);
  }

  GETAdditionalFields(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getadditionalfields?offerid=${offerid}`);
  }

  getFromlocation(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getfromlocation`);
  }

  getTolocation(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/gettolocation`);
  }

  getShiptoParty(sapid: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getshiptoparty?sapid=${sapid}`);
  }

  getItemAdditionalFieldsList(offerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getitemadditionalfieldslist?offerid=${offerid}`);
  }

  getcuttingcharges(offerid: number, fromlocation: string, tolocation: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getcuttingcharges?offerid=${offerid}&fromlocation=${fromlocation}&tolocation=${tolocation}`);
  }

  getSoldtoPartySearch(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getsoldtopartysearch`);
  }

  getSoldtoPartyDetail(soldtoparty: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getsoldtopartydetail?soldtoparty=${soldtoparty}`);
  }

  getShiptoPartySearch(value: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getshiptopartysearch?value=${value}`);
  }

  getShiptoPartyDetail(soldtoparty: any, shiptoparty: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getshiptopartydetail?soldtoparty=${soldtoparty}&shiptoparty=${shiptoparty}`);
  }

  saveDataSheets(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/saveDataSheets`, data);
  }

  getDataSheets(offerid: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getDataSheets?offerid=${offerid}`);
  }

  getAssignToList(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/getassigntolist`);
  }

  saveassignto(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/saveassignto`, data);
  }

  SaveSOno(offerid: number, sono: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/savesono?offerid=${offerid}&sono=${sono}`);
  }

  CPOSubmit(cpomodel: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}offerlookups/cposubmit`, cpomodel);
  }

  getSoldtoPartyFilterSearch(sapid: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/soldtoparties?soldtoparty=${sapid}`);
  }

  
}