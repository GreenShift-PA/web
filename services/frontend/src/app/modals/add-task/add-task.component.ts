import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { TaskService } from 'src/app/services/task.service';

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
  constructor(private taskService:TaskService,private toastr:ToastrService) {
  }

  close() {
    this.closeModal.emit();
  }

  addToMyTasks(taskId:string){
    this.taskService.addToMyTasks(taskId).subscribe(
      (response) => {
        console.log(response)
        this.toastr.success("Task added successfully.","",{
          timeOut: 1000,
        });
        setTimeout(() => {
          location.reload();
        }, 1000);
      },(error) => {
              console.error(error);
              this.toastr.warning("Something went wrong");

            }
          );
        }

}
