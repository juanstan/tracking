import { Component } from '@angular/core';
import {VesselService} from '../../providers/vessel.service';

@Component({
  selector: 'page-vessel-list',
  templateUrl: 'vessel-list.html',
  styleUrls: ['./vessel-list.scss'],
})
export class VesselListPage {
  vessels: any[] = [];

  constructor(private vesselService: VesselService) {}

  ionViewDidEnter() {
    this.vessels = this.vesselService.vessels;
  }
}
