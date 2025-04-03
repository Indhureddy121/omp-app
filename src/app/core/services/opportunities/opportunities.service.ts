import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OpportunitiesService {

  constructor(private httpClient: HttpClient) { }

  getopportunitylist(data: any): Observable<any> {
    // return this.httpClient.post(`${environment.apiUrl}opportunities/list`, data);
    return this.httpClient.post(`${environment.apiUrl}opportunities/opportunitieslist`, data);
  }

  getCount(filter: any): Observable<any> {
    // if (searchValue == "" || searchValue == undefined || searchValue == null) searchValue = " ";
    return this.httpClient.post(`${environment.apiUrl}opportunities/Count`, filter);
  }

  getDetail(id: string): Observable<any> {
    // return this.httpClient.get(`${environment.apiUrl}opportunities/getDetail?id=${id}`);
    return this.httpClient.get(`${environment.apiUrl}opportunities/opportunitydetail?id=${id}`);
  }

  getSfdcOpportunities(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}opportunities/sfdcopp`, data);
  }

  // getOpportunityDetail(id: string): Observable<any> {
  //   return this.httpClient.get(`${environment.apiUrl}opportunities/getOpportunityDetail?id=${id}`);
  // }

  getNacecodeList(): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}opportunities/nacecodelist`);
  }

  getNaceDetail(nacecode: string): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}opportunities/nacedetail?nacecode=${nacecode}`);
  }

  getOpportunityListbyCustomerId(customerid: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}opportunities/opportunitylist?customerid=${customerid}`);
  }
}
