import { HttpClient } from '@angular/common/http';
import { Component,OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { PostService } from 'src/app/services/post.service';
import { UserService } from 'src/app/services/user.service';



@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  commentText: string = '';
  
  commentLink: string = '';
  
  posts:any=[];



  constructor(private post: PostService,private user: UserService,private toastr:ToastrService,private http: HttpClient) {}

  isImgUrl(url: string): Promise<boolean> {
    return this.http.head(url, { observe: 'response' }).toPromise()
      .then(res => {
        const contentType = res?.headers.get('Content-Type');
        return contentType !== null && contentType !== undefined && contentType.startsWith('image');
      })
      .catch(() => false);
  }
  validateImageURL() {
    this.isImgUrl(this.commentLink).then(isValid => {
      if (isValid) {
        this.toastr.success("its an image !")
        return
      } else {
 
        this.toastr.error("Not an image ! ");
        return
      }
    });
  }

  ngOnInit() {
    this.post.getAllPosts().subscribe(
      (response) => {
        this.posts=response;
        this.posts.sort((a:any, b:any) => {
          const dateA = new Date(a.creationDate).getTime();
          const dateB = new Date(b.creationDate).getTime();
          return dateB - dateA; // Sort in ascending order
        });
        for (const post of this.posts) {
          const userId = post.userId;
  
          this.user.getUser(userId).subscribe(
            (userResponse) => {
              console.log(userResponse);
              post.firstname = userResponse.firstname;
              post.lastname = userResponse.lastname;
              post.image= userResponse.image;
            }
            
            ,
            (error) => {
              console.error(error);
            }
          );
        }


        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }



  submitComment() {
    // Check if the comment text is not empty
    this.validateImageURL()
    // if (this.commentText.trim() !== '') {
    //   // Send the request to the service
    //   this.post.sendPost(this.commentText).subscribe(
    //     (response) => {
    //       // Handle the response if needed
    //       console.log('Comment posted successfully');
    //       // Reset the comment text after successful submission

    //       this.commentText = '';
    //       this.toastr.success("Message posted successfully.","",{
    //         timeOut: 1000,
    //       });
    //       setTimeout(() => {
    //         location.reload();
    //       }, 1000);
    //     },
    //     (error) => {
    //       // Handle the error if needed
    //       console.error('Error posting comment:', error);
    //       this.toastr.warning("Something went wrong");

    //     }
    //   );
    // }
  }
}