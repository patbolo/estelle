import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { SocketService } from './services/socket.service';
import { CoordinatesConverterService } from './services/coordinates-converter.service';
import { PointingService } from './services/pointing.service';

import { FilterKeysPipe} from './pipes/filter.pipe';

import { PointingComponent} from './components/pointing.component';
import { CatalogSearchComponent} from './components/catalog-search.component';
import { RaDecFormComponent} from './components/radec-form.component';
import { PlanetariumComponent} from './components/planetarium.component';

import { ImagingComponent} from './components/imaging.component';

@NgModule({
  declarations: [
    AppComponent,
    FilterKeysPipe,
    PointingComponent,
    CatalogSearchComponent,
    RaDecFormComponent,
    ImagingComponent,
    PlanetariumComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [
    SocketService,
    CoordinatesConverterService,
    PointingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
