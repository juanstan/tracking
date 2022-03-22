import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {BehaviorSubject} from 'rxjs';
import { map } from 'rxjs/operators';
import {Vessel} from '../model/vessel';
import {Settings} from '../model/settings';
import * as L from 'leaflet';
import {IconOptions, Map as MyMap} from 'leaflet';
import { Storage } from '@ionic/storage';
import {Marker} from '../model/marker';

@Injectable({ providedIn: 'root' })
export class MapService {
  public vessels: Vessel[];
  public map$ = new BehaviorSubject<Vessel[]>(null);
  myMap: MyMap;
  markers: Marker[] = [];
  mapBoxOptions: object = {
    attribution: 'Tracking Marine',
    maxZoom: 18,
    tileSize: 512,
    zoomOffset: -1,
    accessToken: environment.mapbox.accessToken,
  };
  initialState  = {
    lng: -1.807323,
    lat: 50.253132,
    zoom: 8
  };

  constructor(
    private router: Router,
    private http: HttpClient,
    private storage: Storage,
  ) {

    this.map$.subscribe(vessels => {
      if (this.myMap) {
        vessels?.map(vessel => this.addVesselsMark(vessel));
      }
    });
  }

  async getDefaultMapValues(): Promise<void> {
    await this.storage.get('settings').then( (settings: Settings) => {
      const sourceMapBox = settings?.mapBoxTemplate || null;
      this.initialState.lat = settings?.initialLat || this.initialState.lat;
      this.initialState.lng = settings?.initialLng || this.initialState.lng;
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

  async initMap(container)  {
    await this.getDefaultMapValues();
    if (this.myMap) {
      this.myMap.remove();
    }
    this.myMap = new L.Map(container, {zoomControl: false}).setView(
      [this.initialState.lat, this.initialState.lng],
      this.initialState.zoom
    );
  }

  drawMap() {
    L.tileLayer(
      'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
      this.mapBoxOptions
    ).addTo(this.myMap);
  }

  addVesselsMark(vessel) {
    let marker = this.markers?.find(markerObj => markerObj.id === vessel.id);
    if (!marker) {
      marker = {
        id: vessel.id,
        marker: L.marker([vessel.lat, vessel.lng], {
          icon: L.icon(environment.mapbox.icon as IconOptions)
        }).bindPopup(`This is <a href="app/tabs/vessels/vessel-details/${vessel.id}">${vessel.name}`)
      };
      this.markers.push(marker);

    } else {
      marker.marker.setLatLng(new L.LatLng(vessel.lat, vessel.lng));
    }

    marker.marker.addTo(this.myMap);

  }


}
