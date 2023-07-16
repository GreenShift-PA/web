import { Component, Input, Output, EventEmitter ,OnInit} from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-detail-task',
  templateUrl: './detail-task.component.html',
  styleUrls: ['./detail-task.component.css']
})
export class DetailTaskComponent {
  constructor(private task:TaskService,private toastr:ToastrService) {}
  @Input() modalOpen: boolean=false;
  @Input() description:string=""; 
  @Input() id:string="";
  @Output() closeModal = new EventEmitter<void>();

  user: any = {
    todo_id:this.id,
    description: this.description,
  };

  close() {
    this.closeModal.emit();
  }

  sendForReview(){
    this.user.todo_id=this.id;
  }


  updateModal() {
    this.user.todo_id=this.id;
    this.task.updateTaskById(this.user).subscribe(
      (response) => {
        // Handle the response if needed
        console.log('Task updated successfully');

        this.toastr.success("User information updated successfully.","",{
          timeOut: 1000,
        });
        setTimeout(() => {
          location.reload();
        }, 1000);

      },
      (error) => {
        // Handle the error if needed
        console.error('Error updating task:', error);
        this.toastr.error('Error updating task:');

      }
    );
    
  }
  
}
