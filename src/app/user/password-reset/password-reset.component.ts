import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UserService } from '../user.service';
import { Subject, Subscription } from 'rxjs';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit, OnDestroy {

  message: string;
  isValid: boolean = false;

  messageStatus = new Subject<any>();
  isValidStatus = new Subject<boolean>();

  messageListener: Subscription;
  isValidListener: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.messageListener = this.messageStatus
    .subscribe((message) => {
      this.message = message;
    });

    this.isValidListener = this.isValidStatus
    .subscribe((isValid) => {
      this.isValid = isValid;
    });
  }

  onResetPassword(form: NgForm) {
    if(form.invalid) {
      return;
    }
    this.userService.resetPasswordRequest(form.value.email)
    .subscribe((response) => {
      
      if(response.status == 201) {
        this.isValid = true;
        this.message = response.message;

        this.messageStatus.next(this.message);
        this.isValidStatus.next(this.isValid);
      } else {
        this.isValid = false;
        this.message = response.message;

        this.messageStatus.next(this.message);
        this.isValidStatus.next(this.isValid);
      }
    }, (error) => {
      this.isValid = false;
      this.message = error.message;

      this.messageStatus.next(this.message);
      this.isValidStatus.next(this.isValid);
    });
  }


  ngOnDestroy() {
    this.messageListener.unsubscribe();
    this.isValidListener.unsubscribe();
  }

}
