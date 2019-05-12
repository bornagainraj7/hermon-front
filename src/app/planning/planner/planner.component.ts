import { Component, OnInit } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subject, Subscription } from 'rxjs';
import { EventService } from '../event.service';
import { UserService } from 'src/app/user/user.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';



@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();

  activeDayIsOpen: boolean = true;

  userId: string;
  userFullName: string;
  allEvents = [];
  allEventsListener: Subscription;
  title: string;

  // Datatable pagination
  page = 1;
  pageSize = 5;
  collectionSize;


  constructor(private eventService: EventService, private userService: UserService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('userId')) {
        this.userId = paramMap.get('userId');

        this.userService.getSingleUser(this.userId)
        .subscribe((user) => {
          this.userFullName = user.data.fullName;
          this.title = user.data.title;
        });
      }
    });
    this.eventService.getAllEventsForUser(this.userId);
    this.allEvents = this.eventService.eventsForUser;
    this.allEventsListener = this.eventService.eventsUpdatedUser
    .subscribe((events) => {
      this.allEvents = events;
      if (events) {
        this.collectionSize = this.allEvents.length;
      }
      
    });
  }


  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    // console.log(date);
    // console.log(this.activeDayIsOpen);
    if (isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if ((isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
    }
  } // end of dayClicked()


  get allEventsReformed() {
    return this.allEvents.map((event, i) => ({ ...event }))
      .slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }



}
