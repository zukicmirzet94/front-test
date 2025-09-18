import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable } from 'rxjs';
import { SharedService } from './shared.service';
import { Planet, PlanetWithFile } from '../utils/common/interfaces';

@Injectable({
  providedIn: 'root'
})
export class PlanetsService {
  private readonly BASE_URL = 'http://localhost:3001';
  constructor(private sharedService: SharedService,
    private http: HttpClient) { }

  getPlanets(): Observable<Planet[]> {
    return this.http.get<Planet[]>(`${this.BASE_URL}/api/planets`).pipe(
      catchError(this.sharedService.handleError)
    );
  }

  getPlanet(id: string): Observable<Planet> {
    return this.http.get<Planet>(`${this.BASE_URL}/api/planets/${id}`).pipe(
      catchError(this.sharedService.handleError)
    );
  }

  deletePlanet(id: number): Observable<Planet[]> {
    return this.http.delete<Planet[]>(`${this.BASE_URL}/api/planets/${id}`).pipe(
      catchError(this.sharedService.handleError)
    );
  }

  createPlanet(planetData: Planet, file: File | null): Observable<Planet> {
    const formData = new FormData();
    const formValue = planetData;
    formData.append('planetName', formValue.planetName);
    formData.append('description', formValue.description);
    formData.append('planetRadiusKM', formValue.planetRadiusKM.toString());
    formData.append('planetColor', formValue.planetColor);
    formData.append('distInMillionsKM[fromSun]', formValue.distInMillionsKM.fromSun.toString());
    formData.append('distInMillionsKM[fromEarth]', formValue.distInMillionsKM.fromEarth.toString());
    if (file)
      formData.append('file', file);
    return this.http.post<Planet>(`${this.BASE_URL}/api/planets`, formData).pipe(
      catchError(this.sharedService.handleError)
    );
  }

  editPlanet(id: number, planetData: Planet, file: File | null): Observable<Planet> {
    const formData = new FormData();
    const formValue: any = planetData;
    formData.append('planetName', formValue.planetName);
    formData.append('description', formValue.description);
    formData.append('planetRadiusKM', formValue.planetRadiusKM.toString());
    formData.append('planetColor', formValue.planetColor);
    formData.append('distInMillionsKM[fromSun]', formValue.distInMillionsKM.fromSun.toString());
    formData.append('distInMillionsKM[fromEarth]', formValue.distInMillionsKM.fromEarth.toString());
    if (file)
      formData.append('file', file);
    return this.http.put<Planet>(`${this.BASE_URL}/api/planets/${id}`, formData).pipe(
      catchError(this.sharedService.handleError)
    );
  }

  public async urlToFile(url: string, filename: string): Promise<File | null> {
    const blob = await lastValueFrom(this.http.get(url, { responseType: 'blob' }));
    if (blob) {
      const contentType = blob.type || 'image/jpeg';
      return new File([blob], filename, { type: contentType });
    } else {
      return null;
    }
  }

}
