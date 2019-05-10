import { Component, OnInit, OnDestroy, DoCheck } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours } from 'date-fns';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Subscription } from 'rxjs';
import { EventService } from '../event.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'src/app/user/user.service';


export const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3'
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF'
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA'
  }
}

@Component({
  selector: 'app-planner-admin',
  templateUrl: './planner-admin.component.html',
  styleUrls: ['./planner-admin.component.css']
})
export class PlannerAdminComponent implements OnInit, OnDestroy {


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
  pagePlanner = 1;
  pageSizePlanner = 2;
  collectionSizePlanner;


  constructor(private eventService: EventService, private userService: UserService,private route: ActivatedRoute) { }

  ngOnInit() { 
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
        
        // retiriving user data
        this.userService.getSingleUser(this.userId)
        .subscribe((user) => {
          this.userFullName = user.data.fullName;
          this.title = user.data.title;
        })
      }
    });


    this.eventService.getAllEventsForUser(this.userId);
    this.allEventsListener = this.eventService.eventsUpdatedUser
    .subscribe((events) => {
      this.allEvents = events;
      if(this.allEvents){
        this.collectionSizePlanner = this.allEvents.length;
      }

    });


  }


  dayClicked({date, events}: {date: Date; events: CalendarEvent[]}): void {
    // console.log(date);
    // console.log(this.activeDayIsOpen);
    if(isSameMonth(date, this.viewDate)) {
      this.viewDate = date;
      if( (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) || events.length === 0 ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      // console.log(date);
      // console.log(this.activeDayIsOpen);
    }
  } // end of dayClicked()


  get allEventsReformed() {
    return this.allEvents.map((event, i) => ({...event}))
    .slice( (this.pagePlanner - 1) * this.pageSizePlanner, (this.pagePlanner - 1) * this.pageSizePlanner + this.pageSizePlanner );
  }

  deleteEvent(eventId, userId) {
    this.eventService.deleteEvent(eventId, userId);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

  ngOnDestroy() {
    this.allEventsListener.unsubscribe();
    // this.allEvents = null;
  }

}
