import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PeactionService {

  constructor(private httpClient: HttpClient) { }

  getCount(searchValue, status: string, itemstatus: string, assignto: number, vertical: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/peactioncount?searchValue=${searchValue}&status=${status}&itemstatus=${itemstatus}&assignto=${assignto}&vertical=${vertical}`)
  }

  getPEList(data: any, status: string, itemstatus: string, assignto: number, vertical: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/peactionlist?status=${status}&itemstatus=${itemstatus}&assignto=${assignto}&vertical=${vertical}`, data);
  }

  getPEDetail(id: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/getPEdata?id=${id}`);
  }

  getPGList(industrystdtext: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/pglist?industrystdtext=${industrystdtext}`);
  }

  getPHList(industrystdtext: string, pg: string): Promise<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/phlist?industrystdtext=${industrystdtext}&pg=${pg}`).toPromise();
  }

  ValidateOfferNo(offerno: string): Promise<any> {
    return this.httpClient.get(`${environment.apiUrl}offerlookups/validateofferno?offerno=${offerno}`).toPromise();
  }

  ValidateSPRItemStatus(offerno: string, articleno: string): Promise<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/validatespritemstatus?offerno=${offerno}&articleno=${articleno}`).toPromise();
  }

  getAssignToList(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/getassigntolist`);
  }

  UpdatePEAction(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/updatepeaction`, data);
  }

  SaveComments(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/savecomment`, data);
  }

  async upload(fileData: any, type: any): Promise<any> {
    let formData = new FormData();
    //for multiple file
    for (var x = 0; x < fileData.length; x++) {
      formData.append("file", fileData[x]);
    }
    return await this.httpClient.post(`${environment.apiUrl}file_references/upload?type=${type}`, formData).toPromise();
  }

  GetComments(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/getcomments?peid=${id}`);
  }

  addSapId(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/addSAPId`, data);
  }

  rejectitem(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/rejectitem`, data);
  }

  saveassignto(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/saveassignto`, data);
  }

  UpdateImportPEdata(importpedata: any, iscompleted: number, from: number): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/updateimportpedata?iscompleted=${iscompleted}&from=${from}`, importpedata);
  }

  exportspritems(filter: any, exportfor: number, fromdate: string, todate: string, opportunityid: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/exportspritems?opportunityid=${opportunityid}&exportfor=${exportfor}&fromdate=${fromdate}&todate=${todate}`, filter);
  }

  ValidatePGandPH(industrystdtext: string, pg: string, ph: string): Promise<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/validatepgandph?industrystdtext=${industrystdtext}&pg=${pg}&ph=${ph}`).toPromise();
  }

  GetIndustryStdText(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/getindustrystdtext`);
  }

  GetAllArticlesbyOfferId(offerid: number): Promise<any> {
    return this.httpClient.get(`${environment.apiUrl}peproducts/getallarticlesbyofferid?offerid=${offerid}`).toPromise();
  }

  SaveOfferArticleDoc(offerarticlelist): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/saveofferarticledocs`, offerarticlelist);
  }

  savesprformfield(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}peproducts/savesprformfield`, data);
  }
}