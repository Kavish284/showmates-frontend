import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListYoureventComponent } from './list-yourevent.component';

describe('ListYoureventComponent', () => {
  let component: ListYoureventComponent;
  let fixture: ComponentFixture<ListYoureventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListYoureventComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListYoureventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
