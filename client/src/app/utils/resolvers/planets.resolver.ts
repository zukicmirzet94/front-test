import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { PlanetsService } from '../../services/planets.service';
import { Planet } from '../common/interfaces';

@Injectable({
    providedIn: 'root'
})
export class PlanetsResolver implements Resolve<Planet[]> {

    constructor(private planetsService: PlanetsService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Planet[]> {
        return this.planetsService.getPlanets().pipe(
            catchError(error => {
                console.error('Error fetching planets in resolver', error);
                return of([]);
            })
        );
    }
}