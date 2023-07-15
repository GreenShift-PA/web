import { Component, OnInit } from '@angular/core';
import { UserService, UserResponse } from 'src/app/services/user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit{
  //a rajouter: nom, prénom, langues, hobbies ? country, city
   user: any = {
    address: '',
    job: '',
    aboutMe: '',
    organization: '',
    birthday: new Date(),
    languages: [],
    password:""
  };
 
 
  
 

  email: string = "";
  address: string = "";
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

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.userService.getMe().subscribe(
      (response) => {
        this.email = response.login;
        this.address = response.address;
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
        this.birthday = new Date(response.birthday);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  
  onSubmit(user: any) {
    console.log(user);
    this.userService.patchUser(user).subscribe(
      (response) => {
        // Handle success response
        console.log(response);
      },
      (error) => {
        // Handle error response
        console.error(error);
      }
    );
  }
}

