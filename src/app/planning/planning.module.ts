import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlannerComponent } from './planner/planner.component';
import { PlannerAdminComponent } from './planner-admin/planner-admin.component';
import { CalendarModule } from 'angular-calendar';
import { FormsModule } from '@angular/forms';

import { NgbDatepickerModule, NgbTimepickerModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { CreateEventComponent } from './create-event/create-event.component';
import { AppRoutingModule } from '../app-routing/app-routing.module';

@NgModule({
  imports: [
    CommonModule,
    CalendarModule,
    FormsModule,
    AppRoutingModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    NgbPaginationModule,
  ],
  declarations: [DashboardComponent, PlannerComponent, PlannerAdminComponent, CreateEventComponent]
})
export class PlanningModule { }
