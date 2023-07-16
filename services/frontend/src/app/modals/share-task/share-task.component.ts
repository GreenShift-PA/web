import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-share-task',
  templateUrl: './share-task.component.html',
  styleUrls: ['./share-task.component.css']
})
export class ShareTaskComponent {
  @Input() modalOpen: boolean=false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
