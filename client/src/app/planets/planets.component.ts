import { Component } from '@angular/core';
import { ActionType, Page, SortDirection, ViewType } from '../utils/common/enums';
import { Planet, TableColumn } from '../utils/common/interfaces';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, Subject, Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { PlanetActionsComponent } from '../planet-actions/planet-actions.component';
import { PlanetsService } from '../services/planets.service';
import { HeaderComponent } from '../header/header.component';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-planets',
  templateUrl: './planets.component.html',
  styleUrl: './planets.component.scss',
  imports: [CommonModule, FormsModule, HeaderComponent, PlanetActionsComponent],
  standalone: true
})
export class PlanetsComponent {
  ViewType = ViewType;
  Page = Page;
  selectedView: ViewType = ViewType.List;
  columns: TableColumn[] = [
    {
      field: 'planetName',
      display: 'Name'
    },
    {
      field: 'planetColor',
      display: 'Color'
    },
    {
      field: 'planetRadiusKM',
      display: 'Radius in km'
    },
    {
      field: 'distInMillionsKM',
      display: 'Dist Sun'
    },
    {
      field: 'distInMillionsKM',
      display: 'Dist Earth'
    }];
  planets: Planet[] = [];
  searchSubscription = new Subscription();
  allPlanets: Planet[] = [];
  isOpenedPlanetActions = false;
  sortColumn: string = '';
  sortDirection: SortDirection = SortDirection.ASC;

  constructor(private route: ActivatedRoute, private router: Router, private sharedService: SharedService, private planetsService: PlanetsService) {
    this.searchSubscription = this.sharedService.searchingSubject.pipe(
      debounceTime(500))
      .subscribe(searchValue => {
        this.planets = this.allPlanets.filter(planet => {
          const parsedForSearch = this.sharedService.checkNestedValues(planet);
          return parsedForSearch.some((value: any) =>
            value.toString().toLowerCase().includes(searchValue.toLowerCase())
          );
        })
      });
  }

  ngOnInit() {
    this.allPlanets = this.route.snapshot.data['planets'];
    this.planets = [...this.allPlanets];
  }

  getPlanetAction(planetActionType: ActionType) {
    switch (planetActionType) {
      case ActionType.Create:
        this.isOpenedPlanetActions = true;
        break;
      default:
        this.isOpenedPlanetActions = false;
        break;
    }
  }

  refreshPlanets() {
    this.planetsService.getPlanets().subscribe(planets => {
      if (planets) {
        this.allPlanets = planets;
        this.planets = [...this.allPlanets];
      }
    })
  }

  openPlanetDetails(planet: Planet) {
    this.router.navigate(['planets', planet.id]);
  }

  sortBy(field: string, displayValue: string): void {
    if (this.sortColumn === field) {
      this.sortDirection = this.sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    } else {
      this.sortColumn = field;
      this.sortDirection = SortDirection.ASC;
    }

    this.planets.sort((a: any, b: any) => {
      let valA = a[field];
      let valB = b[field];

      if (field === 'distInMillionsKM') {
        valA = displayValue === 'Dist Sun' ? a[field].fromSun : a[field].fromEarth;
        valB = displayValue === 'Dist Sun' ? b[field].fromSun : b[field].fromEarth;
      }

      if (typeof valA === 'string') {
        return this.sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
      }

      return this.sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }

    closeDialog(isSaved: boolean) {
      this.isOpenedPlanetActions = false;
      if (isSaved) {
        this.refreshPlanets();
      }
    }
  }
