import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TaskResponse, TaskService } from 'src/app/services/task.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  @Input() modalOpen: boolean=false;
  @Input() verifiedTasks:any=[];
  @Output() closeModal = new EventEmitter<void>();
  taskId:string="";
  constructor(private taskService:TaskService,private toastr:ToastrService,private http: HttpClient, private token: TokenService) {}
  

  close() {
    this.closeModal.emit();
  }

  addToMyTasks(taskId: string) {
    const token = this.token.getItemWithExpiry("token");
    
    if (token) {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      
      this.http.post<TaskResponse>(`http://localhost:3000/todo/default?todo_id=${taskId}`, null, { headers })
        .subscribe(
          (response) => {
            console.log(response);
            this.toastr.success("Task added successfully.", "", {
              timeOut: 1000,
            });
            setTimeout(() => {
              location.reload();
            }, 1000);
          },
          (error) => {
            console.error(error);
            this.toastr.warning("Something went wrong");
          }
        );
    } else {
      throw new Error("Token not found in local storage");
    }
  }
  
  
}
