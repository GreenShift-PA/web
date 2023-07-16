import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-suggest-task',
  templateUrl: './suggest-task.component.html',
  styleUrls: ['./suggest-task.component.css']
})
export class SuggestTaskComponent {
  @Input() modalOpen: boolean=false;
  @Output() closeModal = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }
}
