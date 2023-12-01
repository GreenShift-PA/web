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


  roles: any[] = [];

  constructor(private post: PostService,private user: UserService,private toastr:ToastrService,private http: HttpClient) {   
     this.loadUserRoles();}
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
        this.toastr.success("It's an image!");
        return true;
      } else {
        return false;
      }
    });
  }

  delete(idPost:string){
    console.log(idPost)
    this.post.deletePost(idPost).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success(`Post ${idPost} deleted successfully.`, "", {
          timeOut: 2000,
        });
        this.posts = this.posts.filter((post:any) => post._id !== idPost)
      },
      (error) => {
        console.error(error);
        this.toastr.error("Failed to delete post. Please try again.");
      }
    );
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
    if (this.commentText.trim() !== '') {
      // Validate the image URL
      this.validateImageURL().then(isValidImage => {
        if (isValidImage) {
          // Send the request to the service
          this.post.sendPost(this.commentText, this.commentLink).subscribe(
            (response) => {
              // Handle the response if needed
              console.log('Comment posted successfully');
              // Reset the comment text after successful submission
              this.commentText = '';
              this.toastr.success("Message posted successfully.", "", {
                timeOut: 1000,
              });
              this.posts.unshift(response);
              console.log(response)
            },
            (error) => {
              // Handle the error if needed
              console.error('Error posting comment:', error);
              this.toastr.warning("Something went wrong");
            }
          );
        } else {
          // Handle case where the URL is not an image
          this.toastr.error("Not an image! Comment not posted.");
        }
      });
    }
  }
}