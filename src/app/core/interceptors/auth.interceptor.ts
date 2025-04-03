import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { AuthService } from '@core/services/auth/auth.service';
import { StorageService } from '@core/services/common/storage.service';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private router: Router, private authService: AuthService, private storageService: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    var authToken
    var authToken = this.authService.getAccessToken();
    // var companyData: any = this.storageService.getValue(StorageKey.companyData);
    // companyData = JSON.parse(companyData);
    if (authToken) {
      const clonedReq = req.clone({
        headers: new HttpHeaders({
          // 'Content-Type': 'application/json',
          'access-token': authToken,
          //'CompanyId': companyData ? companyData.id.toString() : ''
        })
      });
      return next.handle(clonedReq).pipe(
        tap(
          succ => { },
          err => {
            if (err.status == 401) {
              this.backToLogin();
            }
          }
        ))
    }
    else {
      // return next.handle(req.clone());
      return next.handle(req.clone()).pipe(
        tap(
          succ => { },
          err => {
            if (err.status == 401) {
              this.backToLogin();
            }
          }
        ))
    }
  }

  private backToLogin() {
   this.authService.logout();
    this.router.navigate(['/login']);
  }
}



