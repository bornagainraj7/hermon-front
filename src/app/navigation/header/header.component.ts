import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isCollapsed = true;

  isAuthenticated: boolean = false;
  authListener: Subscription;

  isAdmin: boolean = false;
  adminListener: Subscription;

  fullName: string;
  fullNameListener: Subscription;

  userId: string;
  userIdListener: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.isAuthenticated = this.userService.isAuthenticated;
    this.authListener = this.userService.authStatusListener
    .subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
    });

    this.isAdmin = this.userService.isAdmin;
    this.adminListener = this.userService.adminStatusListener
    .subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });

    this.fullName = this.userService.userFullName;
    this.fullNameListener = this.userService.fullNameListener
    .subscribe((fullName) => {
      this.fullName = fullName;
    });

    this.userId = this.userService.userId;
    this.userIdListener = this.userService.userIdListener
    .subscribe((userId) => {
      this.userId = userId;
    });

  } 


  onLogout() {
    this.userService.logout();
  }

  ngOnDestroy() {
    this.authListener.unsubscribe();
    this.adminListener.unsubscribe();
    this.fullNameListener.unsubscribe();
    this.userIdListener.unsubscribe();
  }
   
}
