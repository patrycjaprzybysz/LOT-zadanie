import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirConnectionComponent } from './air-connection.component';

describe('AirConnectionComponent', () => {
  let component: AirConnectionComponent;
  let fixture: ComponentFixture<AirConnectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AirConnectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
