import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { PlanetWithFile } from '../utils/common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  selectedPlanetData: PlanetWithFile = {
    planetColor: '',
    planetRadiusKM: 0,
    planetName: '',
    description: '',
    distInMillionsKM: {
      fromEarth: 0,
      fromSun: 0
    }
  };
  searchingSubject = new Subject<string>();
  constructor() { }

  public handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error.error.message);
    return throwError(() => 'Something went wrong.');
  }

  public checkNestedValues(obj: any): any {
    const values = [];
    for (const key in obj) {
      const value = obj[key];
      if (typeof value === 'object' && value !== null) {
        values.push(...this.checkNestedValues(value));
      } else {
        values.push(value);
      }
    }
    return values;
  }

}
