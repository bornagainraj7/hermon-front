import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerAdminComponent } from './planner-admin.component';

describe('PlannerAdminComponent', () => {
  let component: PlannerAdminComponent;
  let fixture: ComponentFixture<PlannerAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlannerAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
