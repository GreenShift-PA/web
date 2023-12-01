import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TaskService } from 'src/app/services/task.service';

@Component({
  selector: 'app-suggest-task',
  templateUrl: './suggest-task.component.html',
  styleUrls: ['./suggest-task.component.css']
})
export class SuggestTaskComponent {
  @Input() modalOpen: boolean=false;
  @Output() closeModal = new EventEmitter<void>();
  @Input() description:string="";
  @Input() difficulty:number=1;
  constructor(private taskService:TaskService, private toastr:ToastrService){}
  close() {
    this.closeModal.emit();
  }


  publishTask(){
    const task={
      title:"my title",
      description:this.description,
      deadline: "2024-03-24T01:19:42.000Z",
      difficulty:this.difficulty
    }
    if (this.description === "") {
      console.error('Error: Empty description');
      this.toastr.warning('You\'re missing a field! Try again');
      return;
    }
    this.taskService.addTaskAdmin(task).subscribe(
      (response) => {
        // Handle the response if needed
        this.toastr.success("Task added successfully.","",{
          timeOut: 1000,
        });
        setTimeout(() => {
          location.reload();
        }, 1000);
        // Reset the comment text after successful submission
        this.closeModal.emit();
      },(error)=>{
        this.toastr.error("Task couldn't be added.","",{
          timeOut: 1000,
        });
        console.log(error);
      }
    )
  }
}
