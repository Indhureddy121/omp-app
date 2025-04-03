import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-itemsearch',
  templateUrl: './itemsearch.component.html',
  styleUrls: ['./itemsearch.component.css']
})
export class ItemsearchComponent implements OnInit {

  searchForm: FormGroup;
  @Output() callBack = new EventEmitter();

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initSearchForm();
  }

  private initSearchForm() {
    this.searchForm = this.formBuilder.group({
      searchValue: [null]
    });
  }

  onSearchSubmit() {
    this.callBack.emit(this.searchForm.value);
  }
}
