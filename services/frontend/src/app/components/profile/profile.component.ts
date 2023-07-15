import { Component, OnInit } from '@angular/core';
import { UserService,  } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email: string = "";
  address: string = "";
  tasks: string = "";
  skills: string[] = [];
  hobbies: string[] = [];
  roles: any[] = [];
  posts: string = "";
  job: string = "";
  aboutMe: string = "";
  joinDate: Date = new Date();
  birthday: Date = new Date();

  constructor(private userService: UserService,private route: ActivatedRoute) {}

  ngOnInit() {
    const userid = this.route.snapshot.queryParamMap.get('userid');

    if(userid){
      console.log("userid")
    }else{
      this.userService.getMe().subscribe(
        (response) => {
          this.email = response.login;
          this.address = response.adress;
          this.roles = response.roles;
          this.skills = response.skills;
          this.hobbies = response.hobbies;
          this.job = response.job;
          this.tasks = response.todoTask.length.toString();
          this.posts = response.posts.length.toString();
          this.aboutMe = response.aboutMe;
          this.joinDate = new Date(response.joinDate);
          this.birthday = new Date(response.dirthday);
          console.log(response);
        },
        (error) => {
          console.error(error);
        }
      );
    }
    }
    
}
