import {Component, AfterViewInit, ElementRef, ViewChild, OnInit} from '@angular/core';
import * as L from 'leaflet';
import {VesselService} from '../../providers/vessel.service';
import {Vessel} from '../../model/vessel';
import {environment} from '../../../environments/environment';
import {IconOptions, Map} from 'leaflet';
import {take, map, mergeMap} from 'rxjs/operators';
import {Observable, of} from "rxjs";

@Component({
  selector: 'page-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;
  vessels$: Observable<Vessel[]>;
  map: Map;
  readonly initialState = {
    lng: -1.807323,
    lat: 50.253132,
    zoom: 8
  };

  constructor(public vesselService: VesselService) {
    this.vessels$ = of(this.vesselService.allVessels);
  }

  public initMap(): void {
    this.map = new L.Map(this.mapContainer.nativeElement, null).setView(
      [this.initialState.lat, this.initialState.lng],
      this.initialState.zoom
    );
    this.vessels$.pipe(
      take(1),
      mergeMap(response => response),
      map(vessel => this.addVesselsMark(vessel))
    ).subscribe();
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.drawMap();
  }

  ngAfterViewChecked(): void {
    this.map.invalidateSize(true);
  }

  drawMap() {
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Tracking Marine',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: environment.mapbox.accessToken,
    }).addTo(this.map);
  }

  addVesselsMark(vessel) {
    const marker = L.marker([vessel.lat, vessel.lng], {
      icon: L.icon(environment.mapbox.icon as IconOptions)
    }).bindPopup(`This is <a href="app/tabs/vessels/vessel-details/${vessel.id}">${vessel.name}`);
    marker.addTo(this.map);
  }

}
