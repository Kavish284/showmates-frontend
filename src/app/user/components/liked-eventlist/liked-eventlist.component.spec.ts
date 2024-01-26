import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LikedEventlistComponent } from './liked-eventlist.component';

describe('LikedEventlistComponent', () => {
  let component: LikedEventlistComponent;
  let fixture: ComponentFixture<LikedEventlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LikedEventlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LikedEventlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
