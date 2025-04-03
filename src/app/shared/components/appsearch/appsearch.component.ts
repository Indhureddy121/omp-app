import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-appsearch',
  templateUrl: './appsearch.component.html',
  styleUrls: ['./appsearch.component.css']
})
export class AppsearchComponent implements OnInit {

  searchForm: FormGroup;
  @Input()
  model: any;

  @Output() callBack = new EventEmitter();

  constructor(private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
  ) { }

  get searchform() { return this.searchForm.controls; }

  ngOnInit() {
    this.initSearchForm();
    this.searchform.searchValue.setValue(this.model.searchtext);
    let root: ActivatedRoute = this.activatedRoute.root;


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
