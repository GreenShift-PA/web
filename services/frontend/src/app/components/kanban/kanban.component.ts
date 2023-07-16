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
  verifiedTasks:any=[];
  modalOpenFeed = false;
  modalOpenAddTask =false;
  modalOpenSuggestTask =false;
  modalOpenDetailTask =false;
  modalOpenPendingTask =false;

  id="";
  description="";
  getDifficultyColor(difficulty: number): string {
    if (difficulty === 1) {
      return '#00bfa5'; // Green color for difficulty 1
    } else if (difficulty === 2) {
      return '#fbbf24'; // Yellow color for difficulty 2
    } else if (difficulty === 3) {
      return '#ef4444'; // Red color for difficulty 3
    } else {
      return ''; // Default color
    }
  }

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
  openModalPendingTask(id:string,description:string) {
    this.description=description;
    this.id=id;
    this.modalOpenPendingTask = true;
  } 
  closeModalPendingTask() {
    this.modalOpenPendingTask = false;
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

      this.task.getVerifiedTasks().subscribe(
        (response) => {
          console.log("verified tasks"+response);
          console.log(response)
        },
        (error) => {
          console.error(error);
        }
      );
  

  }

}
