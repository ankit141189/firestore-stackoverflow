import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayAnswerComponent } from './display-answer.component';

describe('DisplayAnswerComponent', () => {
  let component: DisplayAnswerComponent;
  let fixture: ComponentFixture<DisplayAnswerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisplayAnswerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayAnswerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
