import { Component } from '@angular/core';
import { ConferenceData } from '../../providers/conference-data';
import {VesselService} from '../../providers/vessel.service';

@Component({
  selector: 'page-vessel-list',
  templateUrl: 'vessel-list.html',
  styleUrls: ['./vessel-list.scss'],
})
export class VesselListPage {
  vessels: any[] = [];

  constructor(
    /*public confData: ConferenceData*/
    private vesselService: VesselService
  ) {}

  ionViewDidEnter() {
    /*this.confData.getVessels().subscribe((vessels: any[]) => {
      this.vessels = vessels;
    });*/
    this.vessels = this.vesselService.vessels;
  }
}
