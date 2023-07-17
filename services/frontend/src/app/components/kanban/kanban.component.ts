import { Component,OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import { switchMap } from 'rxjs';
import { TaskService,TaskResponse } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent {

  constructor(private dialog:MatDialog,private task:TaskService, private user:UserService){}
  tasks:any=[];
  
  verifiedTasks:any=[];
  modalOpenFeed = false;
  modalOpenAddTask =false;
  modalOpenSuggestTask =false;
  modalOpenDetailTask =false;
  modalOpenPendingTask =false;
  postLinked:any={};

  post:any={
    title:"",
    description:"",
    like:[],
    comments:[],
    whoValidates:[],
    treeLinked:"",
    creationDate:"",
    image:"",
    userId:"",
  }


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
    
    console.log(this.verifiedTasks)
    console.log(this.tasks)

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
  openModalPendingTask(id: string, description: string) {
    this.description = description;
    this.id = id;
    this.modalOpenPendingTask = true;
    console.log("idTask", id);
  
    this.task.getLinkedPost(id).pipe(
      switchMap(response => {
        console.log(response);
        this.post.title = response.title;
        this.post.description = response.description;
        this.post.like = response.like;
        this.post.creationDate = response.creationDate;
        this.post.userId = response.userId;
  
        return this.user.getUser(this.post.userId);
      })
    ).subscribe(
      (response) => {
        console.log("linked post");
        console.log(response);
        this.post.firstname = response.firstname;
        this.post.lastname = response.lastname;
        this.post.image = response.image;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  closeModalPendingTask() {
    this.modalOpenPendingTask = false;
this.post=  {
  title:"",
  description:"",
  like:[],
  comments:[],
  whoValidates:[],
  treeLinked:"",
  creationDate:"",
  image:"",
  userId:"",
}
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
    this.task.getDefaultTasks().subscribe(
      (response) => {
        this.verifiedTasks = response

      },
      (error) => {
        console.error(error);
      }
    );

    this.task.getMyTasks().subscribe(
      (response) => {
        this.tasks = response
      },
      (error) => {
        console.error(error);
      }
    );

  }

}
