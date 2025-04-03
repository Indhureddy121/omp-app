import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-confirmation',
  templateUrl: './delete-confirmation.component.html',
  styleUrls: ['./delete-confirmation.component.css']
})
export class DeleteConfirmationComponent implements OnInit {

  @Input()
  model: any;

  @Output()
  ondelete = new EventEmitter();
  @Output()
  onclose = new EventEmitter();

  boxtitle: any;
  deleteText: any;
  messageText: any;

  constructor() { }

  ngOnInit() {
    this.onLoad();
  }

  private onLoad() {
    this.boxtitle = 'Delete';
    this.messageText = 'Do you really want to delete this record?';
    this.deleteText = 'Delete';
  }

  onDelete() {
    this.ondelete.emit({
      model: this.model
    });
  }

  onClose() {
    this.onclose.emit();
  }
}