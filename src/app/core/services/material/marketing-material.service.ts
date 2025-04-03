import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MarketingMaterialService {

  constructor(private httpClient: HttpClient) { }

  upload(fileData: any, type: any): Observable<any> {
    let formData = new FormData();
    //for multiple file
    for (var x = 0; x < fileData.length; x++) {
      formData.append("file", fileData[x]);
    }
    return this.httpClient.post(`${environment.apiUrl}file_references/upload?type=${type}`, formData);
  }

  create(data: any): Observable<any> {
    console.log("DATA",data);
    return this.httpClient.post(`${environment.apiUrl}marketingMaterials`, data);
  }

  update(data: any,id:number): Observable<any> {
    return this.httpClient.patch(`${environment.apiUrl}marketingMaterials/${id}`, data);
  }

  listMarketingMaterials(data:any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}marketingMaterials/listmarketingmaterial`, data);
  }
  deleteMarketingMaterial(id:number): Observable<any>{
    return this.httpClient.delete(`${environment.apiUrl}marketingMaterials/${id}`);
  }
  deleteFileReferences(id:number): Observable<any>{
    return this.httpClient.delete(`${environment.apiUrl}file_references/${id}`);
  }
}
