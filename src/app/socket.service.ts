import { Injectable } from '@angular/core';

import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NotificationComponent } from './notification/notification.component';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket: any;

  constructor(public appRouter: Router, public http: HttpClient, private toastr: ToastrService, private modalService: NgbModal) {
    this.socket = io("http://api.hermon.ga/");

  }

  toastSuccess(message) {
    this.toastr.success(message, "Success");
  }

  toastError(message) {
    this.toastr.error(message, "Error");
  }


  // Modal
  openModal(userId) {
    let closeReason;
    let reason;
    let now;
    let eventTime = 59999;

    this.socket.emit('minute-before', userId);

  }



  // Actions
  verifyUser(authToken) {
    return Observable.create((observer) => {
      this.socket.on('verify-user', (data) => {
        this.socket.emit('set-user', authToken);
        observer.next(data);
      });
    });
  }

  setUser(authToken) {
    this.socket.emit('set-user', authToken);
  }


  // Events
  eventAdded(userId) {
    this.socket.emit('event-added', userId);
  }

  eventUpdated(userId) {
    this.socket.emit('event-updated', userId);
  }

  eventRemoved(userId) {
    this.socket.emit('event-removed', userId);
  }


  // Notifications
  public allNotificationListener(userId) {
    return Observable.create((observer) => {
      this.socket.on(userId, (data) => {
        observer.next(data);
      });
    });
  }



}
