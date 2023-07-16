import { Component,OnInit } from '@angular/core';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  commentText: string = 'sq';
  posts:any=[];

  constructor(private post: PostService) { }
  ngOnInit() {
    this.post.getAllPosts().subscribe(
      (response) => {
        this.posts=response;
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
      // Send the request to the service
      this.post.sendPost(this.commentText).subscribe(
        (response) => {
          // Handle the response if needed
          console.log('Comment posted successfully');
          // Reset the comment text after successful submission
          this.commentText = '';
        },
        (error) => {
          // Handle the error if needed
          console.error('Error posting comment:', error);
        }
      );
    }
  }
}