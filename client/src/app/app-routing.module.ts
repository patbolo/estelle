import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PointingComponent} from './components/pointing.component';
import { ImagingComponent} from './components/imaging.component';

const routes: Routes = [
  { path: 'pointing', component: PointingComponent },
  { path: 'imaging', component: ImagingComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
