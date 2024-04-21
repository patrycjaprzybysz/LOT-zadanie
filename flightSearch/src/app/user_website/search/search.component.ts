import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-form',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css', ],
})
export class SearchComponent {

  searchForm: FormGroup;
  searchResultsData: any = null;
  formData: any = null;
  
  searchError: string = '';
  showSearchComponent: boolean = true;

  getStopoverTime(stopoverSegment: any): string {
    if (stopoverSegment && stopoverSegment.departure && stopoverSegment.departure.at) {
      const date = new Date(stopoverSegment.departure.at);
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
    return '';
  }
  

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.searchForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      departureDate: ['', Validators.required],
      adults: ['', [Validators.required, Validators.min(1)]]
    });
  }
  
  onSubmit() {
    if (this.searchForm.valid) {
      const formData = this.searchForm.value;

     
      const backendUrl = 'http://localhost:3000'; // adres URL twojego backendu
      const apiUrl = `https://test.api.amadeus.com/v2/shopping/flight-offers`;

      const fullUrl = `${backendUrl}/searchFlights?originLocationCode=${formData.from}&destinationLocationCode=${formData.to}&departureDate=${formData.departureDate}&adults=${formData.adults}&returnDate=${formData.returnDate}`;

      this.http.get<any>(fullUrl).subscribe(
        data => {
          console.log(data);
          this.searchResultsData = data;
          this.searchError = ''; // Wyczyść błąd po pomyślnym pobraniu danych
          this.formData = formData;
        },
        error => {
          console.error('Błąd podczas wyszukiwania lotów:', error);
          this.searchError = error.message || 'Nieznany błąd';
        }
      );

      this.showSearchComponent = false;
      this.searchForm.reset();

    }
  }


  
}