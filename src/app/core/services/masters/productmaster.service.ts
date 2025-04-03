import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductmasterService {

  constructor(
    private httpClient: HttpClient
  ) { }

  getItemSearched(articleno: string): Promise<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/getitemsearch?articleno=${articleno}`).toPromise();
  }

  importporuductmaster(filename: any): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/importporuductmaster?filename=${encodeURIComponent(filename)}`);
  }

  getProductMasterList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/getproductmasterlist`, data);
  }

  getProductMasterCount(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/getProductMasterCount`, filter);
  }

  getRmCostList(filter: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/rmcostlist`, filter);
  }

  updateRmCostData(data: any): Observable<any> {
    return this.httpClient.put(`${environment.apiUrl}productmasters/updateRmCostData`, data);
  }

  deleteproductmaster(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/deleteproductmaster?id=${id}`);
  }

  getProductMasterData(id: number): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/getproductmasterdata?id=${id}`);
  }

  saveproductmaster(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/saveproductmaster`, data);
  }

  searchproductalp(product: string, producttype: string, currency: string, quantity: number, stockdata: any, MOQcheckRequired: boolean = true, stockCheck: boolean = true): Promise<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/searchproductalp?product=${product}&producttype=${producttype}&currency=${currency}&quantity=${quantity}&MOQcheckRequired=${MOQcheckRequired}&stockCheck=${stockCheck}`, stockdata).toPromise();
  }

  searchproductalpforrc(product: string, producttype: string, currency: string): Promise<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/searchproductalpforrc?product=${product}&producttype=${producttype}&currency=${currency}`).toPromise();
  }

  getProductCountforOffer(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}productmasters/getProductMasterCountforOffer?searchValue=${encodeURIComponent(searchValue)}`);
  }

  getProductListforOffer(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}productmasters/getproductmasterlistforOffer`, data);
  }

  exportProductMaster(data:any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}productmasters/exportproductmaster`, data);
  }

  initiateExportProductMaster(data:any): Observable<any>{
    return this.httpClient.post(`${environment.apiUrl}productmasters/initiateexportproductmaster`, data);
  }
}
