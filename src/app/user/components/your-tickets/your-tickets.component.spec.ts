import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourTicketsComponent } from './your-tickets.component';

describe('YourTicketsComponent', () => {
  let component: YourTicketsComponent;
  let fixture: ComponentFixture<YourTicketsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourTicketsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
