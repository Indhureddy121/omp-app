import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class OcactionService {

  constructor(
    private httpClient: HttpClient
  ) { }


  // getOCActionCount(searchValue: any): Observable<any> {
  //   return this.httpClient.post(`${environment.apiUrl}ocactions/getcount`, searchValue);
  // }

  getOCActionCount(searchValue): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ocactionlists/Count?searchValue=${searchValue}`);
  }

  getOcActionList(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ocactionlists/ocationlist`, data);
  }

  getOffersDetail(id: number, isclone: boolean): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ocactionlists/getofferdetails?id=${id}&isclone=${isclone}`);
  }

  async upload(fileData: any, type: any): Promise<any> {
    let formData = new FormData();
    //for multiple file
    for (var x = 0; x < fileData.length; x++) {
      formData.append("file", fileData[x]);
    }
    return await this.httpClient.post(`${environment.apiUrl}file_references/upload?type=${type}`, formData).toPromise();
  }

  savefilesinfo(data: any): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}ocactionlists/savefilesinfo`, data);
  }

  getOcActiondetails(id: number, isclone: boolean): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ocactionlists/getOcActiondetails?id=${id}&isclone=${isclone}`);
  }

  getOcFileslist(id: number, isclone: boolean): Observable<any> {
    return this.httpClient.get(`${environment.apiUrl}ocactionlists/getOcFileslist?id=${id}&isclone=${isclone}`);
  }


}
