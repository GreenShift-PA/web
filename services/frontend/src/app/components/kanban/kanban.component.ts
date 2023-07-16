import { Component,OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import { TaskService,TaskResponse } from 'src/app/services/task.service';
@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent {

  constructor(private dialog:MatDialog,private task:TaskService){}
  tasks:any=[];

  modalOpenFeed = false;
  modalOpenAddTask =false;
  modalOpenSuggestTask =false;
  modalOpenDetailTask =false;

  id="";
  description="";
  openModalFeed() {
    this.modalOpenFeed = true;
  }

  closeModalFeed() {
    this.modalOpenFeed = false;
  }

  openModalAddTask() {
    this.modalOpenAddTask = true;
  } 
  closeModalAddTask(){
    this.modalOpenAddTask = false;
  }

  openModalSuggestTask() {
    this.modalOpenSuggestTask = true;
  } 
  closeModalSuggestTask(){
    this.modalOpenSuggestTask = false;
  }
  openModalDetailTask(id:string,description:string) {
    this.description=description;
    this.id=id;
    this.modalOpenDetailTask = true;
  } 
  closeModalDetailTask() {
    this.modalOpenDetailTask = false;
  }
  ngOnInit() {
    this.task.getMyTasks().subscribe(
      (response) => {
        this.tasks = response
        console.log(response);
        console.log(this.tasks);
      },
      (error) => {
        console.error(error);
      }
    );
  }

}
