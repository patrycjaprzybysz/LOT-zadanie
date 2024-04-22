

import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-air-connection',
templateUrl: './air-connection.component.html',
styleUrls: ['./air-connection.component.css']
})
export class AirConnectionComponent  {

  @Input() searchResults: any = null;



}
