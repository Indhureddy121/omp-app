import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor() { }

  convertDate(date) {
    const split = date.includes("/") ? "/" : "-";
    const year = Number(date.split(split)[2]);
    const month = Number(date.split(split)[1]);
    const day = Number(date.split(split)[0]);
    let newdate = { year: year, month: month, day: day };
    return newdate;
  }

}
