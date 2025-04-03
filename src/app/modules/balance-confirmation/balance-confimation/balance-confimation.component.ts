import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-balance-confimation',
  templateUrl: './balance-confimation.component.html',
  styleUrls: ['./balance-confimation.component.css']
})
export class BalanceConfimationComponent implements OnInit {

  searchModel = Object();
  FilterForm: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
