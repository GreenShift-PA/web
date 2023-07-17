import { Component, OnInit } from '@angular/core';
import { UserService, UserResponse } from 'src/app/services/user.service';

import { ToastrService } from "ngx-toastr";
import { TokenService } from 'src/app/services/token.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
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
    birthday: new Date(),
    password:""
  };

  password:any={
    password:""
  }

  sessions: any = []
 
  newPassword:string="";
  confirmPassword:string="";
  currentPassword:string="";
  city:string="";
  country:string="";
  firstname:string="";
  lastname:string="";
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
  image:string="";

  constructor(protected userService: UserService, private toastr:ToastrService, private tokenService: TokenService, private authService: AuthService, private router: Router) {}

  ngOnInit() {
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
        this.image=response.image;
      },
      (error) => {
        console.error(error);
      }
    );
    this.userService.getSessions().subscribe(
      (response) => {
        for (let rep of response){
          const slice = rep.platform.split(" ")
          let platform = slice[3]
          let version = slice[11]
          let id = rep._id

          if(!platform){platform = slice[1]}
          if(!version){version = slice[0]}
          this.sessions.push(
            [platform, version, id]
            )
        }
      },
      (error) => {
        console.error(error)
      }
    )
  }

  
  onSubmit(user: any) {
    console.log(user)
    this.userService.patchUser(user).subscribe(
      (response) => {
        // Handle success response
        console.log(response);
              // Refresh the page


              this.toastr.success("User information updated successfully.","",{
                timeOut: 1000,
              });
              setTimeout(() => {
                location.reload();
              }, 1000);

      },
      (error) => {
        // Handle error response
        this.toastr.warning("Something went wrong");
        console.error(error);
      }
    );
  }

  onSubmitPassword(password: any) {
    console.log(password)
    if (password.password !== password.confirmPassword) {
      // Passwords do not match, handle error
      this.toastr.warning("Passwords do not match");

      return;
    }
    this.userService.patchUser(password).subscribe(
      (response) => {
        // Handle success response
        console.log(response);
        this.toastr.success("User password updated successfully.","",{
          timeOut: 1000,
        });
        setTimeout(() => {
          location.reload();
        }, 1000);

      },
      (error) => {
        // Handle error response
        console.error(error);
        this.toastr.warning("Wrong current password");
      }
    );
  }

  deleteSession = (token:string) => {

    const current_token = this.tokenService.getItemWithExpiry("token")

    this.userService.deleteSession(token).subscribe(
      (response) => {
        this.toastr.success("The session id deleted")
        for (let i in this.sessions){
          if (this.sessions[i][2] == token){
            this.sessions.splice(i, 1);
          }
          if (token === current_token){
            // Logout 
            this.authService.logout()
            this.router.navigate(['/login']); // Redirect to login page if no token
          }
        }
      },
      (error) => {
        console.error(error)
        this.toastr.error("Error: " + error.message)
      }
    )
  }
}

