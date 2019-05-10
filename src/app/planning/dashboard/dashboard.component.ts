import { Component, OnInit, OnDestroy, Directive, Input, Output, EventEmitter, ViewChild, QueryList } from '@angular/core';
import { UserService } from 'src/app/user/user.service';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/socket.service';
import { EventService } from '../event.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

  allAdminUsers = [];
  allAdminUpdatedSubs: Subscription;
  
  allNormalUsers = [];
  allNormalUpdatedSubs: Subscription;

  userFullName: string;

  //pagination
  page = 1;
  pageSize = 5;
  collectionSize;

  pageAdmin = 1;
  pageSizeAdmin = 5;
  collectionSizeAdmin;


  // tiles
  allEventsCount;
  allEventsByUserCount;
  allAdminCount;
  allNormalUserCount;

  allEventsCountSubs: Subscription;
  allEventsByUserCountSubs: Subscription;
  allAdminCountSubs: Subscription;
  allNormalUserCountSubs: Subscription;


  constructor(private userService: UserService, private eventService: EventService,private socketService :SocketService) { }

  ngOnInit() {
    this.userService.getAllAdminUsers();
    this.userService.getAllNormalUsers();

    this.allAdminUsers = this.userService.allAdminUsers;
    this.collectionSizeAdmin = this.allAdminUsers.length;
    this.allAdminUpdatedSubs = this.userService.allAdminUsersListener
    .subscribe((admins) => {
      this.allAdminUsers = admins;
      this.collectionSizeAdmin = this.allAdminUsers.length;
    });

    this.allNormalUsers = this.userService.allNormalUsers;
    this.collectionSize = this.allNormalUsers.length;
    this.allNormalUpdatedSubs = this.userService.allNormalUsersListener
    .subscribe((users) => {
      this.allNormalUsers = users;
      this.collectionSize = this.allNormalUsers.length;
    });

    this.allEventsCountSubs = this.eventService.getAllEventsCount()
    .subscribe((response) => {
      this.allEventsCount = response.data;
    }, (err) => {

    });

    this.allEventsByUserCountSubs = this.eventService.getAllEventsByUserCount()
    .subscribe((response) => {
      this.allEventsByUserCount = response.data;
    }, (err) =>{
      
    });

    this.allAdminCountSubs = this.userService.getAllAdminCount()
    .subscribe((response) => {
      this.allAdminCount = response.data;
    }, (err) => {

    });

    this.allNormalUserCountSubs = this.userService.getAllNormalUsersCount()
    .subscribe((response) => {
      this.allNormalUserCount = response.data;
    }, (err) => {});

    this.userFullName = this.userService.userFullName;
  
  }// end ngOnInit


  get allNormalUsersReformed() {
    return this.allNormalUsers.map((user, i) => ({...user}))
    .slice( (this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize );
  }

  get allAdminUsersReformed() {
    return this.allAdminUsers.map((user, i) => ({ ...user }))
      .slice((this.pageAdmin - 1) * this.pageSizeAdmin, (this.pageAdmin - 1) * this.pageSizeAdmin + this.pageSizeAdmin);
  }

  ngOnDestroy() {
    this.allAdminUpdatedSubs.unsubscribe();
    this.allNormalUpdatedSubs.unsubscribe();

    this.allAdminCountSubs.unsubscribe();
    this.allNormalUserCountSubs.unsubscribe();
    this.allEventsByUserCountSubs.unsubscribe();
    this.allEventsCountSubs.unsubscribe();
  }

}
