import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-reset-form',
  templateUrl: './reset-form.component.html',
  styleUrls: ['./reset-form.component.css']
})
export class ResetFormComponent implements OnInit {

  message: string;
  userId: string;
  authToken: string;

  constructor(private route: ActivatedRoute, private userService: UserService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if(paramMap.has('authToken')) {
        this.authToken = paramMap.get('authToken');
      }
      if(paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
      }
    });

  }

  changePassword(form: NgForm) {
    if(form.invalid) {
      return;
    }
    // console.log(form.value.password);
    this.userService.changePassword(form.value.password, this.authToken);


  }

}
