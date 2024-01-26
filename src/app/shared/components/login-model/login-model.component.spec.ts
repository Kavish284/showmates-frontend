import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginModelComponent } from './login-model.component';

describe('LoginModelComponent', () => {
  let component: LoginModelComponent;
  let fixture: ComponentFixture<LoginModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
