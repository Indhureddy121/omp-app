import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private toastrService: ToastrService
  ) { }

  showSuccess(message: string): void {
    this.toastrService.success(message);
  }

  showWarning(message: string): void {
    this.toastrService.warning(message);
  }

  showError(message: string): void {
    this.toastrService.error(message);
  }

  showInfo(message: string): void {
    this.toastrService.info(message);
  }

  showDefault(message: string): void {
    this.toastrService.show(message);
  }
}
