import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
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
  isOneWay: boolean = true;

  showOneWay: boolean = true;
   showTwoWays: boolean = false;
  




  getStopoverTime(stopoverSegment: any): string {
    if (stopoverSegment && stopoverSegment.departure && stopoverSegment.departure.at) {
      const date = new Date(stopoverSegment.departure.at);
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }
    return '';
  }


  
  
  
  

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.searchForm = this.fb.group({
      oneWay: ['true'],
      from: ['', Validators.required],
      to: ['', Validators.required],
      departureDate: ['', Validators.required],
      returnDate: [''],
      adults: ['', [Validators.required, Validators.min(1), Validators.max(9)]]
    });
  }
  
  onSubmit() {
    if (this.searchForm.get('oneWay')?.value === 'true') {
      this.showOneWay = true;
      this.showTwoWays = false;
  } else {
      this.showOneWay = false;
      this.showTwoWays = true;
  }

    const departureDate = this.searchForm.get('departureDate')?.value;
  const returnDate = this.searchForm.get('returnDate')?.value;

  if (departureDate && returnDate && returnDate < departureDate) {
    alert('Its a plane, not a time machine ;)');
    return; 
  }

  let regex = /^[a-zA-Z\s]+/

  if (!regex.test(this.searchForm.get('from')?.value) ) {
    alert('Departure city is not valid');
    return; 
  }

  if (!regex.test(this.searchForm.get('to')?.value) ) {
    alert('Arrival city is not valid');
    return; 
  }

  if (this.searchForm.get('adults')?.value>9)  {
    alert('Not too much passengers? ;)');
    return; 
  }else if(this.searchForm.get('adults')?.value<=0){
    alert('Do you wanna go or not? Please add passengers ;)');
    return;
  }


    if (this.searchForm.valid) {
      const formData = this.searchForm.value;

     
      const backendUrl = 'https://lot-task.netlify.app/.netlify/functions'; // adres URL

      const fullUrl = `${backendUrl}/searchFlights?originLocationCode=${formData.from.toLowerCase()}&destinationLocationCode=${formData.to.toLowerCase()}&departureDate=${formData.departureDate}&adults=${formData.adults}&returnDate=${formData.returnDate}`;

      this.http.get<any>(fullUrl).subscribe(
        data => {
          console.log(data);
          this.searchResultsData = data;
          this.searchError = ''; // Wyczyszczenie błędu po udanym pobraniu danych
          this.formData = formData;
        },
        error => {
          console.error('Błąd podczas wyszukiwania lotów:', error);
          this.searchError = error.message || 'Nieznany błąd';
        }
      );
      console.log(this.searchResultsData)
      this.showSearchComponent = false;
      this.searchForm.reset();

    }
  }


  
}
