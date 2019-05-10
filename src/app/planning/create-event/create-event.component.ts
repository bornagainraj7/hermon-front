import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgbDatepickerConfig, NgbDateAdapter, NgbDateNativeAdapter } from '@ng-bootstrap/ng-bootstrap';
import { config, Subscription, throwError } from 'rxjs';
import { EventService } from '../event.service';
import { Location } from '@angular/common';
import { SocketService } from 'src/app/socket.service';


@Component({
  selector: 'app-create-event',
  templateUrl: './create-event.component.html',
  styleUrls: ['./create-event.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    NgbDatepickerConfig
  ]
})
export class CreateEventComponent implements OnInit, OnDestroy {


  mode = "create";
  eventId: string;

  startDate: Date;
  endDate: Date;
  title: string;
  startTime;
  endTime;
  color = "#000";

  userId: string;

  constructor(private eventService: EventService, private socketService: SocketService,private route: ActivatedRoute, private appRouter: Router, private location: Location,private config: NgbDatepickerConfig) { 
    //configuring Datepicker
    const currentDate = new Date();

    config.minDate = {year: currentDate.getFullYear(), month: currentDate.getMonth()+1, day: currentDate.getDate() };
    config.maxDate = {year: currentDate.getFullYear(), month: 12, day: 31};
    config.outsideDays = 'hidden';
  }

  ngOnInit() {

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('eventId')) {
        this.mode = 'edit';
        this.eventId = paramMap.get('eventId');

        // retriving single event
        this.eventService.getSingleEvent(this.eventId)
          .subscribe((response) => {
            if (response.status == 200) {

              this.title = response.data.title;
              this.startDate = new Date(response.data.start);
              this.startTime = response.data.startTime;
              this.endDate = new Date(response.data.end);
              this.endTime = response.data.endTime;
              this.color = response.data.color;
              this.userId = response.data.userId;

            } else {
              console.log(response.message);
            }
          }, (error) => {
            console.log(error);
          });

        
      }
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
      }
    });
    
  }


  onSubmit(form: NgForm) {
    if(form.invalid) {
      return;
    }

    this.startDate.setHours(this.startTime.hour, this.startTime.minute);
    this.endDate.setHours(this.endTime.hour, this.endTime.minute);
    let eventData;

    let starting = this.startDate.getTime();
    let ending = this.endDate.getTime();


    if(starting >= ending) {
      this.socketService.toastError("The end date and time has to be in future than the start date and time");
      return;
    }

    if(this.userId) {
      eventData = {
        start: this.startDate,
        end: this.endDate,
        startTime: this.startTime,
        endTime: this.endTime,
        title: this.title,
        color: this.color,
        userId: this.userId
      };
    } else {
      eventData = {
        start: this.startDate,
        end: this.endDate,
        startTime: this.startTime,
        endTime: this.endTime,
        title: this.title,
        color: this.color
      };
    }
    
    
    if(this.mode === 'edit') {
      this.eventService.updateEvent(eventData, this.eventId, this.userId);
    } else {
      this.eventService.createEvent(eventData);
    }

  }

  checkColor() {

  }


  ngOnDestroy() {
  }
}
