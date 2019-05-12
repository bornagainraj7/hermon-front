import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, take, mergeAll, combineAll, last, first, audit } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ResponseData } from '../responseData.model';
import { SocketService } from '../socket.service';
import { EventModel } from './eventModel';
import { UserService } from '../user/user.service';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private baseUrl = "http://api.hermon.ga/api/event";

  public allEvents = [];
  public allEventsUpdated = new Subject<any>();
  private allEventsListener: Subscription;

  public eventsForUser = [];
  public eventsUpdatedUser = new Subject<any>();
  private eventsForUserListener: Subscription;

  public isAdmin: boolean = false;


  public newEvents: EventModel[] = [];


  constructor(private socketService: SocketService, private http: HttpClient, private appRouter: Router, private userService: UserService) { }

  Notification(userId) {
    let eventTime;
    let minuteBefore; 
    let eventOn;
    let newEvents = [];
    
    this.getAllEventsForUser(userId);
    this.eventsForUserListener = this.eventsUpdatedUser
    .pipe(take(1))
    .subscribe((events) => {
      this.eventsForUser = events;
      if(this.eventsForUser) {
        newEvents = this.eventsForUser.filter((event) => {
          let start = new Date(event.start).getTime();
          let now = new Date().getTime();
          eventOn = start - now;

          if (eventOn > 60000) {
            return event;
          }
        });
      }
      


      for(let event of newEvents) {
        let start = new Date(event.start).getTime();
        let now = new Date().getTime();

        let remainingTime = start - now;

        if(remainingTime > 60001) {
          let minuteBefore = remainingTime - 60000;

          setTimeout(() => {
            this.socketService.openModal(userId);
          }, minuteBefore);
        }
      }

    });

  }



  unSubNotification() {
    this.allEventsListener.unsubscribe();
    this.eventsForUserListener.unsubscribe();
  }


  getAllEvents() {
    this.http.get<ResponseData>(`${this.baseUrl}/all`)
    .subscribe((response) => {
      if (response.data) {
        let event = response.data;

        this.allEvents = event.map((event) => {

          return {
            eventId: event.eventId,
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            startTime: event.startTime,
            endTime: event.endTime,
            creatorId: event.creatorId,
            creatorName: event.creatorName,
            userId: event.userId,
            color: {
              primary: event.color,
              secondary: event.color
            },
            createdOn: event.createdOn,
            modifiedOn: event.modifiedOn
          };
        });
        this.allEventsUpdated.next([...this.allEvents]);
      } else {
        this.allEvents = null;
        this.allEventsUpdated.next(null);
      }
    }, (error) => {
      console.log(error);
    });
  }

  getAllEventsForUser(userId) {
    this.http.get<ResponseData>(`${this.baseUrl}/all/${userId}`)
    .subscribe((response) => {
      if (response.data) {
        let event = response.data;

        this.eventsForUser = [...event.map((event) => {

          return {
            eventId: event.eventId,
            title: event.title,
            start: new Date(event.start),
            end: new Date(event.end),
            startTime: event.startTime,
            endTime: event.endTime,
            creatorId: event.creatorId,
            creatorName: event.creatorName,
            userId: event.userId,
            color: {
              primary: event.color,
              secondary: event.color
            },
            createdOn: event.createdOn,
            modifiedOn: event.modifiedOn
          };
        })]

        this.eventsUpdatedUser.next([...this.eventsForUser]);
      } else {
        this.eventsForUser = null;
        this.eventsUpdatedUser.next(null);
        if (response.status == 400 || response.status == 401) {
          this.userService.logout();
        }
      }
    }, (error) => {
      console.log(error);
    });
  }

  getSingleEvent(eventId) {
    return this.http.get<ResponseData>(`${this.baseUrl}/${eventId}`);
  }

  createEvent(data) {

    this.http.post<ResponseData>(`${this.baseUrl}/create`, data)
    .subscribe((response) => {
      if(response.status == 201) {
        // this.getAllEventsForUser(data.userId);
        this.socketService.eventAdded(data.userId);
        this.Notification(data.userId);
        this.socketService.toastSuccess('Event was created succesfully');
        this.appRouter.navigate(['/admin/planner/', data.userId]);
      } else {
        this.socketService.toastError(response.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  updateEvent(data, eventId, userId) {
    this.http.put<ResponseData>(`${this.baseUrl}/edit/${eventId}`, data)
    .subscribe((response) => {
      if(response.status == 201) {
        // this.getAllEventsForUser(userId);
        this.socketService.eventUpdated(userId);
        this.Notification(userId);
        this.socketService.toastSuccess('Event was updated succesfully');
        this.appRouter.navigate(['/admin/planner/', userId]);
      } else {
        this.socketService.toastError(response.message);
      }
    }, (error) => {
      console.log(error);
    });
  }

  deleteEvent(eventId, userId) {
    let data = null;
    
    this.http.post<ResponseData>(`${this.baseUrl}/delete/${eventId}`, data)
    .subscribe((response) => {
      if(!response.error) {
        this.socketService.eventRemoved(userId);
        this.Notification(userId);
        // this.getAllEventsForUser(userId);
        this.socketService.toastSuccess('Event was deleted succesfully');
      // this.appRouter.navigate(['/admin/planner/', userId]);

      } else {
        this.socketService.toastError(response.message);        
      }
    }, (error) => {
      console.log(error);
    });

  }


  getAllEventsCount() {
    return this.http.get<ResponseData>(`${this.baseUrl}/count/all`);
  }

  getAllEventsByUserCount() {
    return this.http.get<ResponseData>(`${this.baseUrl}/count/by-user`);
  }


}
