import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from '../user/login/login.component';
import { SignupComponent } from '../user/signup/signup.component';
import { PasswordResetComponent } from '../user/password-reset/password-reset.component';
import { DashboardComponent } from '../planning/dashboard/dashboard.component';
import { PlannerComponent } from '../planning/planner/planner.component';
import { PlannerAdminComponent } from '../planning/planner-admin/planner-admin.component';
import { CreateEventComponent } from '../planning/create-event/create-event.component';
import { ResetFormComponent } from '../user/reset-form/reset-form.component';
import { RouteGuard } from '../user/route.guard';
import { AdminGuard } from '../user/admin.guard';


const route: Routes = ([
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'reset/form/:userId/:authToken', component: ResetFormComponent},
  { path: 'reset-password', component: PasswordResetComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [RouteGuard, AdminGuard] },
  { path: 'admin/planner/:userId', component: PlannerAdminComponent, canActivate:[RouteGuard, AdminGuard] },
  { path: 'planner/:userId', component: PlannerComponent, canActivate: [RouteGuard] },
  { path: 'edit-event/:eventId', component: CreateEventComponent, canActivate: [RouteGuard, AdminGuard] },
  { path: 'create-event/:userId', component: CreateEventComponent, canActivate: [RouteGuard, AdminGuard] },
  { path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
]);


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(route)
  ],
  exports: [
    RouterModule
  ],
  declarations: [],
  providers: [RouteGuard, AdminGuard]
})
export class AppRoutingModule { }
