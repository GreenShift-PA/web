import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';


const randomPeopleImages = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
const randomStreetAddresses = ['123 Main Street', '456 Elm Avenue', '789 Oak Lane'];
const randomWords = ['apple', 'banana', 'orange'];
const randomAdjectives = ['happy', 'sad', 'excited'];
const randomJobTitles = ['developer', 'designer', 'manager'];
const randomLoremParagraphs = ['Lorem ipsum dolor sit amet.', 'Consectetur adipiscing elit.', 'Sed do eiusmod tempor incididunt.'];
const randomDatesPast = ['2022-01-01', '2022-02-01', '2022-03-01'];
const randomCities = ['New York', 'London', 'Paris'];

const randomImage = randomPeopleImages[Math.floor(Math.random() * randomPeopleImages.length)];
const randomAddress = randomStreetAddresses[Math.floor(Math.random() * randomStreetAddresses.length)];
const randomSkill = randomWords[Math.floor(Math.random() * randomWords.length)];
const randomHobby = randomAdjectives[Math.floor(Math.random() * randomAdjectives.length)];
const randomJob = randomJobTitles[Math.floor(Math.random() * randomJobTitles.length)];
const randomLorem = randomLoremParagraphs[Math.floor(Math.random() * randomLoremParagraphs.length)];
const randomJoinDate = randomDatesPast[Math.floor(Math.random() * randomDatesPast.length)];
const randomBirthday = randomDatesPast[Math.floor(Math.random() * randomDatesPast.length)];
const randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})

export class SignupComponent {


  
  email = '';
  password = '';
  user: any = {
    login: '',
    password: '',
    firstname: '',
    lastname: '',
    tree_name: '',
    country:'',
    image : randomImage,
    address : randomAddress,
    skills : ["Veteran", "Fast Learner"],
    hobbies : ["Swimming", "Programming", "Reading"],
    job : randomJob,
    aboutMe : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    joinDate: new Date().toISOString().split('T')[0],
    birthday : randomBirthday,
    city:randomCity,

  };



  constructor(private userService: UserService,private toastr:ToastrService) {}

  signup(user:any): void {
    for (const key in user) {
      if (user.hasOwnProperty(key) && user[key] === '') {
        console.error('Error: Empty property detected');
        this.toastr.warning('You\'re missing a field ! Try again');

        return;
      }
    }
    console.log(this.user)
    this.userService.createUser(this.user).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success("You're now registered !")
      },
      (error) => {
        console.error(error);
        this.toastr.error("Error: " + error.message);
      }
    );

  }
}