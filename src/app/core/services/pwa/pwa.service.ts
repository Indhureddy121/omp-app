import { Injectable } from '@angular/core';
import { Platform } from '@angular/cdk/platform';


@Injectable({
  providedIn: 'root'
})
export class PwaService {
  pwaInstallPrompt: any;

  constructor(  private platform: Platform) {}

   public initPwaPrompt() {
    // if (this.platform.ANDROID) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.pwaInstallPrompt = event;
      });
    // }
  }

}
