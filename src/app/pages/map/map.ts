import {Component, ElementRef, ViewChild} from '@angular/core';
import {MapService} from '../../providers/map.service';
import {VesselService} from '../../providers/vessel.service';

@Component({
  selector: 'page-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class MapPage {
  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;

  constructor(
    private mapService: MapService,
    private vesselService: VesselService,
    ) {}

  async ionViewWillEnter() {
    await this.mapService.initMap(this.mapContainer.nativeElement);
    this.mapService.drawMap();
    this.mapService.myMap?.invalidateSize(true);

    this.mapService.map$.next({
      vessels: this.vesselService.allVessels,
      vesselSelected: this.vesselService.getVesselSelected()
    });

    this.mapService.myMap.on('moveend', (e) => {
      // this.mapService.mapSubscription.unsubscribe();
      console.log('moveend');
    });
    this.mapService.myMap.on('zoomend', (e) => {
      // this.mapService.mapSubscription.unsubscribe();
      console.log('zoomend');
    });

    this.mapService.myMap.on('dragend', (e) => {
      this.mapService.mapSubscription.unsubscribe();
    });

  }

  reset() {
    this.mapService.subscribeMap();
  }

}
