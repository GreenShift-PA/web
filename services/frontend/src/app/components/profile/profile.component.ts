import { Component, OnInit } from '@angular/core';
import { UserService,  } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  email: string = "";
  address: string = "";
  phone: string = "";
  tasks: string = "";
  skills: string[] = [];
  hobbies: string[] = [];
  roles: any[] = [];
  posts: string = "";
  job: string = "";
  aboutMe: string = "";
  workHistory: string[] = [];
  joinDate: Date = new Date();
  organization: string = "";
  birthday: Date = new Date();
  languages: string[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getMe().subscribe(
      (response) => {
        this.email = response.login;
        this.address = response.adress;
        this.phone = response.phone;
        this.roles = response.roles;
        this.skills = response.skills;
        this.hobbies = response.hobbies;
        this.job = response.job;
        this.tasks = response.todoTask.length.toString();
        this.posts = response.posts.length.toString();
        this.aboutMe = response.aboutMe;
        this.workHistory = response.workHistory;
        this.joinDate = new Date(response.joinDate);
        this.organization = response.organization;
        this.birthday = new Date(response.dirthday);
        this.languages = response.languages;
        console.log(response);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
