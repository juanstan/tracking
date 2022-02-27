import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';

@Component({
  selector: 'page-vessel-list',
  templateUrl: 'vessel-list.html',
  styleUrls: ['./vessel-list.scss'],
})
export class VesselListPage {
  vessels: any[] = [];

  constructor(public confData: ConferenceData) {}

  ionViewDidEnter() {
    this.confData.getVessels().subscribe((vessels: any[]) => {
      this.vessels = vessels;
    });
  }
}
