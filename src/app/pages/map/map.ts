import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import {VesselService} from '../../providers/vessel.service';

@Component({
  selector: 'page-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class MapPage implements AfterViewInit {
  private map;

  constructor(public vesselService: VesselService) { }

  public initMap(): void {
    const markers = [];
    const vessels = this.vesselService.allVessels;
    debugger;
    vessels?.map(vessel => {
      markers.push(L.marker([vessel.lat, vessel.lng]).bindPopup(`This is ${vessel.name}.`));
    });

    const vesselsPosition = {
      positions: L.layerGroup(markers)
    };

    this.map = L.map('map', {
      center: [ 39.8282, -98.5795 ],
      zoom: 3
    });

    L.control.layers(vesselsPosition).addTo(this.map);

  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
