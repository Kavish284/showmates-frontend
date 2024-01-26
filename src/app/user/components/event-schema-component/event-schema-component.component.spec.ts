import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSchemaComponent } from './event-schema-component.component';

describe('EventSchemaComponentComponent', () => {
  let component: EventSchemaComponent;
  let fixture: ComponentFixture<EventSchemaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventSchemaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventSchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
