import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  menuList: any;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let urlfound = false;
    if (this.authService.isLoggedIn()) {
      this.menuList = this.authService.getMenuList();

      if (this.menuList.length > 0) {
        this.menuList.forEach(element => {
          if (element.menus.length > 0) {
            element.menus.forEach(elementinner => {
              if (elementinner.screen_url === state.url) {
                urlfound = true;
              }
            });
          } else {
            if (element.screen_url === state.url) {
              urlfound = true;
            } else if (state.url.split('/').includes('myprofile')) {
              urlfound = true;
            } else {
              if (state.url.split('/').includes(element.screen_url.split('/')[1])) {
                urlfound = true;
              }
            }
          }
        });
        if (urlfound) {
          return true;
        } else {
          this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return false;
        }
      } else {
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
      }
    } else {
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
