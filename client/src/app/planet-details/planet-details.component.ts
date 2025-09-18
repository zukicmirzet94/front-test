import { Component, EventEmitter, Output } from '@angular/core';
import { ActionType, Page, ViewType } from '../utils/common/enums';
import { HeaderComponent } from '../header/header.component';
import { PlanetsService } from '../services/planets.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Planet } from '../utils/common/interfaces';
import { PlanetActionsComponent } from '../planet-actions/planet-actions.component';
import { ConfirmationPopupComponent } from '../confirmation-popup/confirmation-popup.component';

@Component({
  selector: 'app-planet-details',
  templateUrl: './planet-details.component.html',
  styleUrl: './planet-details.component.scss',
  imports: [HeaderComponent, PlanetActionsComponent, ConfirmationPopupComponent],
  standalone: true
})
export class PlanetDetailsComponent {
  Page = Page;
  ActionType = ActionType;
  planet: Planet | null = null;
  isOpenedPlanetActions = false;
  isOpenedDeletingPlanet = false;

  constructor(private planetsService: PlanetsService, private router: Router, private route: ActivatedRoute) {
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.getPlanet(id)
  }

  getPlanet(id: string) {
    this.planetsService.getPlanet(id).subscribe(planet => {
      this.planet = planet;
    })
  }

  getPlanetAction(planetActionType: ActionType) {
    switch (planetActionType) {
      case ActionType.Edit:
        this.isOpenedPlanetActions = true;
        break;
      case ActionType.Delete:
        this.isOpenedDeletingPlanet = true;
        break;
      default:
        this.isOpenedPlanetActions = false;
        this.isOpenedDeletingPlanet = false;
        break;
    }
  }

  deletePlanet() {
    if (this.planet?.id) {
      this.planetsService.deletePlanet(this.planet.id).subscribe(deletedPlanets => {
        if (deletedPlanets && deletedPlanets.length > 0) {
          this.isOpenedDeletingPlanet = false;
          this.router.navigate(['planets']);
        }
      })
    }
  }

  closePopup(isConfirmed: boolean) {
    if (isConfirmed) {
      this.deletePlanet();
    } else {
      this.isOpenedDeletingPlanet = false;
    }
  }

  closeDialog(isSaved: boolean) {
    this.isOpenedPlanetActions = false;
    if (isSaved && this.planet?.id) {
      this.getPlanet(this.planet.id.toString() || '');
    }
  }
}
