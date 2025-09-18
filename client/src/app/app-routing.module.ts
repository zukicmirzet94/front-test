import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanetsResolver } from './utils/resolvers/planets.resolver';

const routes: Routes = [
    {
        path: 'planets',
        loadComponent: () => import('./planets/planets.component').then(m => m.PlanetsComponent),
        resolve: {
            planets: PlanetsResolver
        }
    },
    {
        path: 'planets/:id',
        loadComponent: () => import('./planet-details/planet-details.component').then(m => m.PlanetDetailsComponent)
    },
    { path: '', redirectTo: 'planets', pathMatch: 'full' },
    { path: '**', redirectTo: 'planets' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
