import { NgModule } from '@angular/core';
import { AppRoutingModule } from './../app-routing/app-routing.module';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { FormsModule } from '@angular/forms';
import { PasswordResetComponent } from './password-reset/password-reset.component';
import { AccountComponent } from './account/account.component';
import { ResetFormComponent } from './reset-form/reset-form.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule
  ],
  declarations: [LoginComponent, SignupComponent, PasswordResetComponent, AccountComponent, ResetFormComponent]
})
export class UserModule { }
