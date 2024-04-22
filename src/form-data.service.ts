import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {
  private formDataSubject = new BehaviorSubject<any>(null);
  formData$ = this.formDataSubject.asObservable();

  setFormData(formData: any): void {
    this.formDataSubject.next(formData);
  }
}
