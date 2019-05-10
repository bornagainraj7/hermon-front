import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  isAuthenticated;
  authSubs: Subscription;

  isAdmin;
  adminSubs: Subscription;

  userId;

  constructor(private appRouter: Router, private userService: UserService) { }

  ngOnInit() {

    // checking auth status
    this.isAuthenticated = this.userService.isAuthenticated;
    this.authSubs = this.userService.authStatusListener
    .subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    if(this.isAuthenticated) {
      this.userId = this.userService.userId;
    }
 
    this.isAdmin = this.userService.isAdmin;
    this.adminSubs = this.userService.adminStatusListener
    .subscribe((admin) => {
      this.isAdmin = admin;
    })

    if(this.isAuthenticated && this.isAdmin) {
      this.appRouter.navigate(['/dashboard']);
    } else if(this.isAuthenticated) {
      this.appRouter.navigate(['/planner/', this.userId]);
    }


  }

  onLogin(form: NgForm) {
    if(form.invalid) {
      form.resetForm();
      return; 
    } 
      // console.log(form.value);
      this.userService.loginUser(form.value.email, form.value.password);
  }

  toReset() {
    this.appRouter.navigate(['/reset-password']);
  }

}
