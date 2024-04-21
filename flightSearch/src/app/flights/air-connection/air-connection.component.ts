// import { Component, Input } from '@angular/core';
// // import { AmadeusService } from './amadeus.service'; // Import serwisu Amadeus

// @Component({
//   selector: 'app-air-connection',
//   templateUrl: './air-connection.component.html',
//   styleUrls: ['./air-connection.component.css']
// })
// export class AirConnectionComponent {
//   @Input() departureAirportCode!: string;
//   @Input() departureAirportName!: string;
//   @Input() departureTime!: string;
//   @Input() arrivalAirportCode!: string;
//   @Input() arrivalAirportName!: string;
//   @Input() arrivalTime!: string;
//   @Input() airlineName!: string;
//   @Input() baggageInfo!: string;
//   @Input() duration!: string;
//   @Input() durationLabel!: string;
//   @Input() stops!: string;
//   @Input() priceLabel!: string;
//   @Input() priceLabelGrey!: string;
//   @Input() price!: string;

//   // constructor(private amadeusService: AmadeusService) { }

//   selectFlight() {
//     // Implement your flight selection logic here
//   }
// }




import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-air-connection',
templateUrl: './air-connection.component.html',
styleUrls: ['./air-connection.component.css']
})
export class AirConnectionComponent  {

  @Input() searchResults: any = null;



}
