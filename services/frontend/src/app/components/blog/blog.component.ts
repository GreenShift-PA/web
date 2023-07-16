import { Component } from '@angular/core';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
commentText:boolean=true;
selectedLink: string = 'link1';

// Function to handle link selection
selectLink(link: string) {
  this.selectedLink = link;
}
}
