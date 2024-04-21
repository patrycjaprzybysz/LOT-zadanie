import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsFlightsComponent } from './results-flights.component';

describe('ResultsFlightsComponent', () => {
  let component: ResultsFlightsComponent;
  let fixture: ComponentFixture<ResultsFlightsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResultsFlightsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResultsFlightsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
