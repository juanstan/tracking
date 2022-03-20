import {Component, ElementRef, ViewChild} from '@angular/core';
import {MapService} from '../../providers/map.service';

@Component({
  selector: 'page-map',
  templateUrl: './map.html',
  styleUrls: ['./map.scss']
})
export class MapPage {
  @ViewChild('map')
  private mapContainer: ElementRef<HTMLElement>;

  constructor(private mapService: MapService) {}

  async ionViewWillEnter() {
    await this.mapService.initMap(this.mapContainer.nativeElement);
    this.mapService.drawMap();
    this.mapService.myMap?.invalidateSize(true);
  }

}
