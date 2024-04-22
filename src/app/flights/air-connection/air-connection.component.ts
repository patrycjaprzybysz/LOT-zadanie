

import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-air-connection',
templateUrl: './air-connection.component.html',
styleUrls: ['./air-connection.component.css']
})
export class AirConnectionComponent  {

  @Input() searchResults: any = null;
  public showDetails: boolean = false;

  formatDuration(duration: string): string {
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
  
    const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
    const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  
    if (hours === 0) {
      return `${minutes}m`;
    } else if (minutes === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${minutes}m`;
    }
  }
  


}
