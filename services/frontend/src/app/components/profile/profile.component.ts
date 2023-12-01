import { Component, OnInit } from '@angular/core';
import { UserService,  } from 'src/app/services/user.service';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  isMyProfile:boolean=false;
  isFollowedByMe:boolean=false;
  myUserId:string=""
  toastText: string = "Logged in successfully.";
  toastIcon: string =  "check_circle";
  idUser:any="";
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
  myFollows:any=[];
image:string="";
  constructor(private userService: UserService,private route: ActivatedRoute, private router: Router, private toastr:ToastrService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const idUser = this.route.snapshot.paramMap.get('iduser');
      this.idUser=idUser;
  
      if (idUser) {
        this.userService.getMe().subscribe(
          (response) => {
            console.log(response._id); // prints 64b45ec4f0dcbb15fbad23ab
            this.myUserId = response._id;
            this.myFollows=response.follow;
            console.log(idUser);
            console.log(this.myUserId); // prints 64b45ec4f0dcbb15fbad23ab
            
            if (idUser === this.myUserId) {
              this.isMyProfile = true;
            }
          },
          (error) => {
            console.error(error);
          }
        );
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
            this.image=response.image;
            this.isFollowedByMe=this.myFollows.includes(idUser);
            console.log(this.myFollows.includes(this.idUser));
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
            this.image=response.image;
            
            this.myFollows= response.follow;
            this.isMyProfile=true;
          },
    
          (error) => {
           
            console.error(error);
          }
        );
      }
    });


  }
  follow(){
    this.isFollowedByMe=true;
    this.userService.followUser(this.idUser).subscribe((response) => {


      this.toastr.success("Followed user !","",{
        timeOut: 1000,
      });
      // setTimeout(() => {
      //   location.reload();
      // }, 1000);
    },(error) => {
      this.toastr.success("Followed user !","",{
        timeOut: 1000,
      });
      // setTimeout(() => {
      //   location.reload();
      // }, 2000);
      console.error(error);
    }
  );

  }
  unfollow(){
    this.isFollowedByMe=false;
    this.userService.unfollowUser(this.idUser).subscribe((response) => {
      
      this.toastr.success("Unfollowed user !","",{
        timeOut: 1000,
      });
      // setTimeout(() => {
      //   location.reload();
      // }, 1000);
    },(error) => {
      this.toastr.error("Unfollowed user !","",{
        timeOut: 1000,
      });


    }
  );

  }

}
