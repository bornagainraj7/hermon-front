import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  currentTelCode: any;
  
  isValid: boolean;

  countriesArray: any[] = [];
  countryTelArray: any[] = [];
  countriesSorted: any[] = [];
  
  isAuthenticated;
  authSubs: Subscription;

  isAdmin;
  adminSubs: Subscription;

  userId;

  constructor(private userService: UserService, private http: HttpClient, private appRouter: Router) { }

  ngOnInit() {

    this.http.get('/assets/country.json').subscribe((data) => {
      for(let i in data) {
        let countriesData = {
          countryCode: i,
          countryName: data[i]
        }
        this.countriesArray.push(countriesData);
      }

      this.countriesSorted = this.countriesArray.sort((a, b) => (a.countryName > b.countryName ? 1: -1));
    });

    this.http.get('/assets/phones.json').subscribe((data) => {
      for(let i in data) {
        let telData = {
          countryCode: i,
          countryTel: data[i]
        }
        this.countryTelArray.push(telData);
      }
    });


    // checking auth status
    this.isAuthenticated = this.userService.isAuthenticated;
    this.authSubs = this.userService.authStatusListener
      .subscribe((isAuth) => {
        this.isAuthenticated = isAuth;
      });

    if (this.isAuthenticated) {
      this.userId = this.userService.userId;
    }

    this.isAdmin = this.userService.isAdmin;
    this.adminSubs = this.userService.adminStatusListener
      .subscribe((admin) => {
        this.isAdmin = admin;
      })

    if (this.isAuthenticated && this.isAdmin) {
      this.appRouter.navigate(['/dashboard']);
    } else if (this.isAuthenticated) {
      this.appRouter.navigate(['/planner/', this.userId]);
    }


  }

  onSignup(form: NgForm) {
    if(form.invalid) {
      return;
    }

    if(this.isValid == false) {
      return;
    }

    if (this.currentTelCode == null || undefined) {
      this.currentTelCode = 0;
    }

    let userData = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      email: form.value.email,
      password: form.value.password,
      username: form.value.username,
      country: form.value.country,
      telcode: this.currentTelCode,
      mobileNumber: form.value.mobileNumber,
      isAdmin: form.value.isAdmin
    };
    
    if(form.value.isAdmin == true) {
      userData.isAdmin = true;
    } else {
      userData.isAdmin = false;
    }

    this.userService.createUser(userData);
  }


  findTelCode(countryName) {
    let code = this.countriesArray.filter(country => country.countryName == countryName);
    let countryCode = code[0].countryCode;

    let telCode = this.countryTelArray.filter(tel => tel.countryCode == countryCode);
    this.currentTelCode = telCode[0].countryTel;

  }
  

  checkUsername(username) {
    if(username == null || username == undefined || username == " ") {
      this.isValid = false;
    }
    this.userService.findUserName(username)
    .subscribe((response) => {
      if(response.status == 200) {
        this.isValid = true;
      } else {
        this.isValid = false;
      }
    }, (error) => {
      console.log(error);
    });
  }

}
