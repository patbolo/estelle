import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

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
    PlanetariumComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    AppRoutingModule
  ],
  providers: [
    SocketService,
    CoordinatesConverterService,
    PointingService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
