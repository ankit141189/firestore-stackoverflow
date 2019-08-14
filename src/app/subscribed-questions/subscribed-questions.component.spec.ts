import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribedQuestionsComponent } from './subscribed-questions.component';

describe('SubscribedQuestionsComponent', () => {
  let component: SubscribedQuestionsComponent;
  let fixture: ComponentFixture<SubscribedQuestionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribedQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribedQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
