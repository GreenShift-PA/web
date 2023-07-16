import { Component } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent {

  constructor(private dialog:MatDialog){}

  modalOpen = false;

  openModal() {
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }
}