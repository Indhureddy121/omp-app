import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService, StorageKey } from '@core/services/common/storage.service';
import * as moment from 'moment';

@Component({
  selector: 'reset-filter',
  templateUrl: './reset-filter.component.html',
  styleUrls: ['./reset-filter.component.scss']
})
export class ResetFilterComponent implements OnInit {

  @Output() resetClicked = new EventEmitter();
  @Input() isResetFilter: boolean;

  defaultAllScreenValues: any;
  isResetFilterDisable: boolean = false;

  constructor(private router: Router, private storageService: StorageService) { }

  ngOnInit() {
    const data = this.storageService.getValue(StorageKey.allDefaultScreenValues);
    if (!data) {
      const data = this.storageService.getValue(StorageKey.defaultscreenvalues);
      this.storageService.setValue(StorageKey.allDefaultScreenValues, data);
      this.defaultAllScreenValues = JSON.parse(data);
    }
    else {
      const data = this.storageService.getValue(StorageKey.allDefaultScreenValues);
      this.defaultAllScreenValues = JSON.parse(data);
    }
  }

  deleteFilter() {
    const url = this.router.url;

    // here this code getting screenname for the menudata from the local-storage

    const menuData = JSON.parse(this.storageService.getValue(StorageKey.menuData));
    const data = menuData.find((ele) => ele.screen_url === url);

    // end


    // here this code getting screename from the array
    // const data=this.defaultMenuData.find((ele)=>ele.screen_url===url);
    // end

    if (data) {
      let allScreenData = JSON.parse(this.storageService.getValue(StorageKey.defaultscreenvalues));
      const screenName = allScreenData[data.screen_name];
      if (screenName) {
        allScreenData[data.screen_name] = this.defaultAllScreenValues[data.screen_name];
        const finalScreenData = JSON.stringify(allScreenData);
        this.storageService.setValue(StorageKey.defaultscreenvalues, finalScreenData);
        alert('successfully clear the filter');
        this.resetClicked.emit();
      }
    }
  }

}
