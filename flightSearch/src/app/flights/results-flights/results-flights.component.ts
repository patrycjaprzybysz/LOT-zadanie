import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-results-flights',
  templateUrl: './results-flights.component.html',
  styleUrl: './results-flights.component.css'
})
export class ResultsFlightsComponent {

  @Input() formData: any = null;
  
  ngOnInit(): void {
    console.log(this.formData);
  }

  ngOnChanges(): void {
    console.log(this.formData);
  }
}
