import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchComponent } from './user_website/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ResultsFlightsComponent } from './flights/results-flights/results-flights.component';


import { AirConnectionComponent } from './flights/air-connection/air-connection.component';
import { AirConnectionReturnComponent } from './flights/air-connection-return/air-connection-return.component';




@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
    ResultsFlightsComponent,
    AirConnectionComponent,
    AirConnectionReturnComponent,
   
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule
    
  ],
  
  bootstrap: [AppComponent]
})
export class AppModule { }
