import { Pipe, PipeTransform } from '@angular/core';
import { StorageKey, StorageService } from '@core/services/common/storage.service';

@Pipe({
  name: 'petscreenbtn'
})
export class PetscreenbtnPipe implements PipeTransform {

  constructor(private storageService: StorageService) { }

  transform(person: any, args?: any): any {
    const data = JSON.parse(this.storageService.getValue(StorageKey.currentUser));
    return data.role_code === 'Admin' || data.ischannelpartner === 1 ? false : true;
  }

}
