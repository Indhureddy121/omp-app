import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-article-validity',
  templateUrl: './article-validity.component.html',
  styleUrls: ['./article-validity.component.css']
})
export class ArticleValidityComponent implements OnInit {

  Items: any[] = [];
  dateFormate: string;

  @Input()
  model: any;

  @Output()
  onYes = new EventEmitter();
  @Output()
  onNo = new EventEmitter();
  @Output()
  onCancel = new EventEmitter();

  boxtitle: any;
  // deleteText: any;
  // messageText: any;
  minDate: any;
  isRevalidationBtnVisible: boolean = false;
  // isChangevalidityBtnVisible: boolean = true;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.dateFormate = this.authService.getDateFormat();
    this.boxtitle = 'Offer Validity Confirmation';
    this.Items = this.model.items;
    this.minDate = this.model.mindata;
    // if (new Date(this.model.mindata.split("/").reverse().join("-")) < new Date())
    //   this.isChangevalidityBtnVisible = false;

    this.isRevalidationBtnVisible = this.model.showRevalidationBtn;

    //   this.messageText = `The article(s) minimum validity ${this.model.mindata} will be apply for the offer. Do you want to continue?
    //   Yes:
    //   This offer validity update to ${this.model.mindata}.
    // No:
    //   For MFG/TRD articles - kindly contact PE team to extend the validity and then create a clone.
    //   For SPR articles - It will send for the Re-validation.`;
  }

  onDelete() {
    this.onYes.emit({
      model: true
    });
  }

  onClose() {
    this.onNo.emit({
      model: false
    });
  }

  onCancelModal() {
    this.onCancel.emit({
      model: false,
      modalClose: true
    });
  }
}
