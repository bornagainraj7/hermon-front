import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './user/user.service';
import { EventService } from './planning/event.service';
import { SocketService } from './socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean;
  isAuthSubs: Subscription;

  userId: string;

  constructor(private userService: UserService, private eventService: EventService, private socketService: SocketService) {}

  ngOnInit() {
    this.userService.autoAuth();
    this.userId = this.userService.userId;
    this.isAuthenticated = this.userService.isAuthenticated;
    this.isAuthSubs = this.userService.authStatusListener
    .subscribe((isAuth) => {
      this.isAuthenticated = isAuth;
      this.userId = this.userService.userId;
    });

    if (this.isAuthenticated) {
      this.eventService.Notification(this.userId);
      
    }

    if(this.isAuthenticated && this.userId) {
      this.socketService.allNotificationListener(this.userId)
      .subscribe((data) => {
        this.socketService.toastSuccess(data);
      });
    }

  }

  ngOnDestroy() {
    this.eventService.unSubNotification();
  }

}
