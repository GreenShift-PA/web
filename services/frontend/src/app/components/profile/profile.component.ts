import { Component, OnInit } from '@angular/core';
import { UserService,  } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {


  toastText: string = "Logged in successfully.";
  toastIcon: string =  "check_circle";
  
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
  newPassword:string="";
  confirmPassword:string="";
  currentPassword:string="";
  city:string="";
  country:string="";
  firstname:string="";
  lastname:string="";

  constructor(private userService: UserService,private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const idUser = this.route.snapshot.paramMap.get('iduser');
 
  
      if (idUser) {
        this.userService.getUser(idUser).subscribe(
          (response) => {
            console.log(response);
            this.city=response.city;
            this.country= response.country;
            this.firstname = response.firstname;
            this.lastname = response.lastname;
            this.email = response.login;
            this.address = response.address;
            this.roles = response.roles;
            this.skills = response.skills;
            this.hobbies = response.hobbies;
            this.job = response.job;
            this.tasks = response.todoTask.length.toString();
            this.posts = response.posts.length.toString();
            this.aboutMe = response.aboutMe;
            this.joinDate = new Date(response.joinDate);
            this.birthday = new Date(response.birthday);
          },(error)=>{
            this.router.navigate(['/not-found']);
            console.error(error);
          })

      }else{
        this.userService.getMe().subscribe(
          (response) => {
            this.city=response.city;
            this.country= response.country;
            this.firstname = response.firstname;
            this.lastname = response.lastname;
            this.email = response.login;
            this.address = response.address;
            this.roles = response.roles;
            this.skills = response.skills;
            this.hobbies = response.hobbies;
            this.job = response.job;
            this.tasks = response.todoTask.length.toString();
            this.posts = response.posts.length.toString();
            this.aboutMe = response.aboutMe;
            this.joinDate = new Date(response.joinDate);
            this.birthday = new Date(response.birthday);
            
          },
    
          (error) => {
           
            console.error(error);
          }
        );
      }
    });


  }




}
