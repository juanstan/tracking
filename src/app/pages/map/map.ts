import {Component, AfterViewInit, ElementRef, ViewChild, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {VesselService} from '../../providers/vessel.service';
import {Vessel} from '../../model/vessel';
import {environment} from '../../../environments/environment';
import {IconOptions, Map} from 'leaflet';
import {take, map, mergeMap} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {Settings} from '../../model/settings';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class MapPage {
  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;
  vessels$: Observable<Vessel[]>;
  map: Map;
  mapBoxOptions: object = {
    attribution: 'Tracking Marine',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: environment.mapbox.accessToken,
  };
  readonly initialState = {
    lng: -1.807323,
    lat: 50.253132,
    zoom: 8
  };

  constructor(public vesselService: VesselService, public storage: Storage) {}

  ionViewWillEnter() {
    this.vessels$ = this.vesselService.getVesselsObservable();
    this.vessels$.subscribe(async (vessels) => {
      await this.initMap();
      this.drawMap();
      this.map?.invalidateSize(true);
      vessels.map(vessel => {
        this.addVesselsMark(vessel);
      });
    });
  }

  async getDefaultMapValues(): Promise<void> {
    await this.storage.get('settings').then( (settings: Settings) => {
      const sourceMapBox = settings.mapBoxTemplate;
      let sourceMapSelected = {};
      switch (sourceMapBox) {
        case 'navigation':
          sourceMapSelected = {
            id: 'mapbox/navigation-day-v1',
          };
          break;
        case 'satellite':
        default: {
          sourceMapSelected = {
            id: 'mapbox/streets-v11',
          };
          break;
        }

      }
      this.mapBoxOptions = {...this.mapBoxOptions, ...sourceMapSelected};
    });
  }

  async initMap()  {
    await this.getDefaultMapValues();
    if (this.map) {
      this.map.remove();
    }
    this.map = new L.Map(this.mapContainer.nativeElement, {zoomControl: false}).setView(
      [this.initialState.lat, this.initialState.lng],
      this.initialState.zoom
    );
  }

  drawMap() {
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      this.mapBoxOptions
    ).addTo(this.map);
  }

  addVesselsMark(vessel) {
    const marker = L.marker([vessel.lat, vessel.lng], {
      icon: L.icon(environment.mapbox.icon as IconOptions)
    }).bindPopup(`This is <a href="app/tabs/vessels/vessel-details/${vessel.id}">${vessel.name}`);
    marker.addTo(this.map);
  }

}
