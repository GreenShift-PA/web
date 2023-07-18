import { Component,OnInit } from '@angular/core';
import {MatDialog} from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr';
import { switchMap } from 'rxjs';
import { TaskService,TaskResponse } from 'src/app/services/task.service';
import { UserService } from 'src/app/services/user.service';
@Component({
  selector: 'app-kanban',
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css']
})
export class KanbanComponent {

  constructor(private dialog:MatDialog,private task:TaskService, private user:UserService,private toastr:ToastrService){
    this.loadUserRoles();

  }
  roles: any[] = [];

  delete(id:string, event: Event): void {
    event.stopPropagation();
    this.task.deleteTask(id).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success(`Post ${id} deleted successfully.`, "", {
          timeOut: 2000,
        });
        setTimeout(() => {
          location.reload();
        }, 2000);
      },
      (error) => {
        console.error(error);
        this.toastr.error("Failed to delete post. Please try again.");
      }
    );
  }

  private loadUserRoles(): void {
    this.user.getMe().subscribe(
      (response) => {
        console.log(response._id);
        this.roles = response.roles;
        console.log("roles", this.roles);
        console.log("roles", response.roles);
      },
      (error: any) => {
        console.error(error);
      }
    );
  }

  isAdmin(): boolean {
    return this.roles.some((role: any) => role.name === 'admin');
  }
  difficulty:number=1;
  tasks:any=[];
  toReviewTasks:any=[];
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
    image_proof:""
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

        this.post.image_proof= response.image_proof;
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

  acceptTask(taskId: string, event: Event): void {
    event.stopPropagation();

    this.task.acceptTask(taskId).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success("Task successfully accepted","",{
          timeOut: 1000,
        });        
        setTimeout(() => {
          location.reload();
        }, 1000);

      },(error)=>{
        this.toastr.error("Task error, couldn't accept","",{
          timeOut: 1000,
        });
        console.error(error);
      }
    )
  }

  refuseTask(taskId: string, event: Event): void {
    event.stopPropagation();

    this.task.refuseTask(taskId).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success("Task successfully refused","",{
          timeOut: 1000,
        });        
        setTimeout(() => {
          location.reload();
        }, 1000);

      },(error)=>{
        this.toastr.error("Task error, couldn't refus","",{
          timeOut: 1000,
        });
        console.error(error);
      }
    )
  }

  ngOnInit() {

    this.task.getAllReviewTasks().subscribe(
      (response) => {
        this.toReviewTasks = response

      },
      (error) => {
        console.error(error);
      }
    );
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
