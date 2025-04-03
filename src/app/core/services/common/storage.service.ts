import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class StorageService {

    constructor() { }

    getValue(key: string): string {
        return localStorage.getItem(key);
    }

    setValue(key: string, value: string): void {
        localStorage.setItem(key, value);
    }

    removeValue(key: string): void {
        localStorage.removeItem(key);
    }

}


export class StorageKey {

   // public static currentLanguage = 'currentLanguage';
    public static currentUser = 'currentUser';
    public static authToken = 'authToken';
    // public static companyData = 'companyData';
    // public static locationData = 'locationData';
    // public static financePeriod = 'financePeriod';
    // public static tngConfiguation = 'tngConfiguation';
    // public static sysAttachment = 'sysAttachment';  
    // public static companyModuleFlags = 'companyModuleFlags';
    // public static domesticCurrency = 'domesticCurrency';
    public static dateformat = 'dateformat';
    public static menuData = 'menuData';
    public static defaultscreenvalues = 'defaultscreenvalues';
    public static offervalidfromcreation = 'offervalidfromcreation';
    public static sprFormJsonData = 'sprFormJsonData';
    public static allDefaultScreenValues = 'allDefaultScreenValues';

    
    // public static pendingApproval = 'pendingApproval';
    // public static datetimeformat = 'datetimeformat';
    // public static userLocations = 'userLocations';
    // public static userRights = 'userRights';
}
