import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeTopicsComponent } from './subscribe-topics.component';

describe('SubscribeTopicsComponent', () => {
  let component: SubscribeTopicsComponent;
  let fixture: ComponentFixture<SubscribeTopicsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubscribeTopicsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubscribeTopicsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
