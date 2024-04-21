import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchComponent } from './user_website/search/search.component';
import { ResultsFlightsComponent } from './flights/results-flights/results-flights.component';
import { LoadingPageComponent } from './loading-page/loading-page/loading-page.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/search',
    pathMatch: 'full'
  },
  {
    path: 'search',
    component: SearchComponent
  },
  {
    path: 'results',
    component: ResultsFlightsComponent
  },
{
  path: 'loading-page',
  component: LoadingPageComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
