import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApprovalmatrixService {

  constructor(private httpClient: HttpClient) { }

  create(data: any): Observable<any> {
    // console.log("DATA", data);
    // return this.httpClient.post(`${environment.apiUrl}approvalMatrices`, data);
    return this.httpClient.post(`${environment.apiUrl}approvalMatrices/createapprovalmatrix`, data);
  }
  // update(data: any, id: number): Observable<any> {
  //   return this.httpClient.patch(`${environment.apiUrl}approvalMatrices/${id}`, data);
  // }
  update(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}approvalMatrices/updateapprovalmatrix`, data);
  }

  getRegionList(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}regions/list`);
  }
  getApprovalMatrixList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}approvalMatrices/listapprovalmatrix`, data);
  }
  getCount(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}approvalMatrices/countapprovalmatrix`, data);
  }
  getApprovalMatrixById(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}approvalMatrices/${id}`);
  }
  deleteApprovalMatrix(id: number): Observable<any> {
    return this.httpClient.delete(`${environment.apiUrl}approvalMatrices/${id}`);
  }
}
