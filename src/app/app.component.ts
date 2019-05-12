import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from './user/user.service';
import { EventService } from './planning/event.service';
import { SocketService } from './socket.service';
import { Subscription } from 'rxjs';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from './notification/notification.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  isAuthenticated: boolean;
  isAuthSubs: Subscription;

  userId: string;

  constructor(private userService: UserService, private eventService: EventService, private socketService: SocketService, private modalService: NgbModal) {}

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
        
        if (data == "minute-notification") {

          this.modalService.open(NotificationComponent).result
            .then((result) => {
              let closeReason;
              let reason;
              let now;
              let eventTime = 59999;

              closeReason = result;


              let timer = setInterval(() => {
                eventTime -= 5000;
                if (eventTime < 5000) {
                  clearInterval(timer);
                }

                if (closeReason == 'snooze') {
                  this.modalService.open(NotificationComponent).result
                    .then((res) => {
                      reason = res;
                      if (res == 'dismiss') {
                        clearInterval(timer);
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                } else {
                  clearInterval(timer);
                }

              }, 5000);

            })
            .catch((error) => {
              console.log(error);
            });

        }

        this.socketService.toastSuccess(data);

      });
    }

    // if(this.isAuthenticated && this.userId) {

    //   this.socketService.minuteNotification(this.userId)
    //   .subscribe((data) => {
    //     console.log("listeing on minute.userId");
    //     console.log(data);

        

    //   });
    // }

  }

  ngOnDestroy() {
    this.eventService.unSubNotification();
  }

}
