import { Component, Input, Output, EventEmitter ,OnInit} from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { PostService } from 'src/app/services/post.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-detail-task',
  templateUrl: './detail-task.component.html',
  styleUrls: ['./detail-task.component.css']
})
export class DetailTaskComponent {
  constructor(private postService: PostService,private userService: UserService,private task:TaskService,private toastr:ToastrService,private http: HttpClient) {}
  @Input() modalOpen: boolean=false;
  @Input() description:string=""; 
  @Input() id:string="";
  @Output() closeModal = new EventEmitter<void>();

  descriptionFeed:string='';
  commentText: string = '';
  
  commentLink: string = '';
  posts:any=[];

  post:any={
    title:"",
    description:"",  
  }

  user: any = {
    todo_id:this.id,
  };

  taskReview:any={
    todo_id:this.id,
    isReviewed:true
  }

  

  close() {
    this.closeModal.emit();
  }
  isImgUrl(url: string): Promise<boolean> {
    return this.http.head(url, { observe: 'response' }).toPromise()
      .then(res => {
        const contentType = res?.headers.get('Content-Type');
        return contentType !== null && contentType !== undefined && contentType.startsWith('image');
      })
      .catch(() => false);
  }
  validateImageURL(): Promise<boolean> {
    return this.isImgUrl(this.commentLink).then(isValid => {
      if (isValid) {
        return true;
      } else {
        return false;
      }
    });
  }


  submitPostAndLinkToTask(idTask:string){
    
      // Send the request to the service
      this.postService.createPostInTask(idTask,this.commentText).subscribe(
        (response) => {
          // Handle the response if needed
          console.log('Comment posted successfully');
          // Reset the comment text after successful submission

          this.commentText = '';
          this.toastr.success("Message posted successfully.","",{
            timeOut: 1000,
          });
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        (error) => {
          // Handle the error if needed
          console.error('Error posting comment:', error);
          this.toastr.warning("Something went wrong");

        }
      );
  }

  submitComment() {
    // Check if the comment text is not empty

      // Send the request to the service
      this.postService.sendPost(this.commentText).subscribe(
        (response) => {
          // Handle the response if needed
          console.log('Comment posted successfully');
          // Reset the comment text after successful submission

          this.commentText = '';
          this.toastr.success("Message posted successfully.","",{
            timeOut: 1000,
          });
          setTimeout(() => {
            location.reload();
          }, 1000);
        },
        (error) => {
          // Handle the error if needed
          console.error('Error posting comment:', error);
          this.toastr.warning("Something went wrong");

        }
      );
  }

    sendForReview(){
      this.taskReview.todo_id=this.id;
      this.task.sendForReview(this.taskReview).subscribe( (response) => {
        // Handle the response if needed
        console.log('Sent for review successfully');
  
        this.toastr.success("Sent for review successfully.","",{
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

  submitForm(){
    if (this.commentText.trim() !== '') {
      // Validate the image URL
      this.validateImageURL().then(isValidImage => {
        if (isValidImage) {
         console.log("ok")
         this.submitPostAndLinkToTask(this.id);
         this.sendForReview();
          }else{
            this.toastr.error("Not an image! Comment not posted.");
          }
      });
        } else {
          // Handle case where the URL is not an image
          this.toastr.error("Post empty!");
        }
      };


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






