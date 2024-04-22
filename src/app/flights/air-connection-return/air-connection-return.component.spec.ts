import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AirConnectionReturnComponent } from './air-connection-return.component';

describe('AirConnectionReturnComponent', () => {
  let component: AirConnectionReturnComponent;
  let fixture: ComponentFixture<AirConnectionReturnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AirConnectionReturnComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AirConnectionReturnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
